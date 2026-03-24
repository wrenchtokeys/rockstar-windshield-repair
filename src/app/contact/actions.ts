"use server";

import sgMail from "@sendgrid/mail";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { BUSINESS } from "@/lib/constants";
import type { FormState } from "@/types";
import type { Submission } from "@/types/submission";

// Save to DynamoDB for the queue dashboard
async function saveToDynamoDB(submission: Record<string, string>) {
  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: Submission = {
      id,
      name: submission.name || "",
      phone: submission.phone || "",
      email: submission.email || "",
      serviceType: submission.serviceType || "",
      vehicleInfo: submission.vehicleInfo || "",
      damageDescription: submission.damageDescription || "",
      preferredContact: submission.preferredContact || "phone",
      status: "new",
      notes: "",
      submittedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: item })
    );
    console.log(`Saved submission ${id} to DynamoDB`);
  } catch (error) {
    console.error("Failed to save to DynamoDB:", error);
    // Don't fail the form — S3 is the backup
  }
}

// Save every submission to S3 for backup
async function saveToS3(submission: Record<string, string>) {
  try {
    const bucketName = process.env.CONTACT_S3_BUCKET;
    if (!bucketName) {
      console.warn("CONTACT_S3_BUCKET not set — skipping S3 save");
      return;
    }

    const client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
    });

    const timestamp = new Date().toISOString();
    const key = `contact-submissions/${timestamp.slice(0, 10)}/${timestamp.replace(/[:.]/g, "-")}_${submission.phone?.replace(/\D/g, "") || "unknown"}.json`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify({ ...submission, submittedAt: timestamp }, null, 2),
        ContentType: "application/json",
      })
    );

    console.log(`Saved submission to s3://${bucketName}/${key}`);
  } catch (error) {
    console.error("Failed to save to S3:", error);
  }
}

function buildBrandedEmail({
  headline,
  paragraphs,
  detailRows,
  buttonText,
  buttonUrl,
  footerNote,
}: {
  headline: string;
  paragraphs: string[];
  detailRows?: { label: string; value: string }[];
  buttonText?: string;
  buttonUrl?: string;
  footerNote?: string;
}): string {
  const paragraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="font-size:15px;color:#374151;margin:0 0 16px;line-height:1.6;">${p}</p>`
    )
    .join("");

  const detailsHtml = detailRows
    ? `<div style="background-color:#f9fafb;border-radius:8px;padding:16px;margin-bottom:20px;">
        <table style="width:100%;font-size:14px;">
          ${detailRows
            .map(
              (r) =>
                `<tr><td style="padding:6px 0;color:#6b7280;">${r.label}</td><td style="text-align:right;font-weight:600;color:#111827;">${r.value}</td></tr>`
            )
            .join("")}
        </table>
      </div>`
    : "";

  const buttonHtml =
    buttonText && buttonUrl
      ? `<div style="text-align:center;margin:24px 0;">
          <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:6px;letter-spacing:0.5px;text-transform:uppercase;">
            ${buttonText}
          </a>
        </div>`
      : "";

  const footerHtml = footerNote
    ? `<p style="font-size:13px;color:#9ca3af;text-align:center;margin:20px 0 0;">${footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px;">

<!-- Header -->
<div style="background-color:#18181b;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;border-bottom:3px solid #2563eb;">
  <img src="https://rockstarwindshield.repair/images/logo-white.png" alt="${BUSINESS.name}" width="200" style="width:200px;max-width:100%;height:auto;display:block;margin:0 auto;" />
</div>

<!-- Body -->
<div style="background-color:#ffffff;padding:32px 40px;">
  <h2 style="font-size:22px;color:#111827;margin:0 0 20px;font-weight:700;">${headline}</h2>
  ${paragraphsHtml}
  ${detailsHtml}
  ${buttonHtml}
  ${footerHtml}
</div>

<!-- Footer -->
<div style="padding:20px 24px;text-align:center;border-radius:0 0 12px 12px;background-color:#18181b;">
  <p style="margin:0;font-size:13px;color:#a1a1aa;font-weight:600;">${BUSINESS.name}</p>
  <p style="margin:6px 0 0;font-size:12px;color:#71717a;">${BUSINESS.address.city}, ${BUSINESS.address.state}</p>
  <p style="margin:6px 0 0;font-size:12px;">
    <a href="tel:${BUSINESS.phone}" style="color:#2563eb;text-decoration:none;">${BUSINESS.phone}</a>
    ${BUSINESS.email ? ` &middot; <a href="mailto:${BUSINESS.email}" style="color:#2563eb;text-decoration:none;">${BUSINESS.email}</a>` : ""}
  </p>
</div>

</div>
</body>
</html>`;
}

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot check
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    return { success: true, message: "Thank you! We'll be in touch soon." };
  }

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const serviceType = (formData.get("serviceType") as string)?.trim();
  const vehicleInfo = (formData.get("vehicleInfo") as string)?.trim();
  const damageDescription = (formData.get("damageDescription") as string)?.trim();
  const preferredContact = (formData.get("preferredContact") as string)?.trim();

  if (!name || !phone) {
    return { success: false, message: "Please provide your name and phone number." };
  }

  const submission = {
    name,
    phone,
    email: email || "",
    serviceType: serviceType || "",
    vehicleInfo: vehicleInfo || "",
    damageDescription: damageDescription || "",
    preferredContact: preferredContact || "phone",
  };

  // Save to both DynamoDB (queue) and S3 (backup)
  await Promise.all([saveToDynamoDB(submission), saveToS3(submission)]);

  // Send emails via SendGrid
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not set");
    return {
      success: true,
      message: "Thank you! We've received your request and will get back to you as soon as possible.",
    };
  }

  sgMail.setApiKey(apiKey);
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "notifications@rockstarwindshield.repair";

  // 1. Send notification to Drake
  try {
    await sgMail.send({
      from: { email: fromEmail, name: BUSINESS.name + " Website" },
      to: BUSINESS.email,
      subject: `New Quote Request — ${name} (${serviceType || "General"})`,
      text: `New quote request from ${name}\nPhone: ${phone}\nEmail: ${email || "N/A"}\nService: ${serviceType || "N/A"}\nVehicle: ${vehicleInfo || "N/A"}\nDamage: ${damageDescription || "N/A"}\nPreferred Contact: ${preferredContact || "Phone"}`,
      html: buildBrandedEmail({
        headline: "New Quote Request!",
        paragraphs: [
          `<strong>${name}</strong> just submitted a quote request from the website.`,
        ],
        detailRows: [
          { label: "Name", value: name },
          { label: "Phone", value: `<a href="tel:${phone}" style="color:#dc2626;text-decoration:none;">${phone}</a>` },
          { label: "Email", value: email || "Not provided" },
          { label: "Service", value: serviceType || "Not specified" },
          { label: "Vehicle", value: vehicleInfo || "Not provided" },
          { label: "Damage", value: damageDescription || "Not described" },
          { label: "Contact Via", value: preferredContact || "Phone" },
        ],
        buttonText: `Call ${name}`,
        buttonUrl: `tel:${phone}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }

  // 2. Send confirmation to customer (if they provided email)
  if (email) {
    try {
      const detailRows = [];
      if (serviceType) detailRows.push({ label: "Service", value: serviceType });
      if (vehicleInfo) detailRows.push({ label: "Vehicle", value: vehicleInfo });
      if (damageDescription) detailRows.push({ label: "Details", value: damageDescription.length > 80 ? damageDescription.slice(0, 80) + "..." : damageDescription });

      await sgMail.send({
        from: { email: fromEmail, name: BUSINESS.name },
        to: email,
        subject: `We got your request, ${name}! — ${BUSINESS.name}`,
        text: `Hi ${name},\n\nThanks for reaching out to ${BUSINESS.name}! We received your windshield repair request and will get back to you as soon as possible.\n\nIf you need immediate assistance, give us a call at ${BUSINESS.phone}.\n\n— ${BUSINESS.name}`,
        html: buildBrandedEmail({
          headline: `Thanks for reaching out, ${name}!`,
          paragraphs: [
            `We've received your windshield repair request and a member of our team will get back to you <strong>as soon as possible</strong>.`,
            detailRows.length > 0 ? `Here's a summary of what you submitted:` : ``,
          ].filter(Boolean),
          detailRows: detailRows.length > 0 ? detailRows : undefined,
          buttonText: `Need Us Sooner? Call Now`,
          buttonUrl: BUSINESS.phoneHref,
          footerNote: "You're receiving this because you submitted a quote request on rockstarwindshield.repair",
        }),
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }
  }

  return {
    success: true,
    message: "Thank you! We've received your request and will get back to you as soon as possible.",
  };
}
