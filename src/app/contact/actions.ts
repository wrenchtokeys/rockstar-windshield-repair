"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { BUSINESS } from "@/lib/constants";
import { sendEmail, buildBrandedEmail } from "@/lib/email";
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
      source: "web",
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

// Verify the Turnstile captcha token with Cloudflare. Only enforced when
// TURNSTILE_SECRET_KEY is configured, so the form keeps working before
// the keys exist in the Amplify environment.
async function verifyTurnstile(formData: FormData): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const token = formData.get("cf-turnstile-response");
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    // Fail closed — a bot storm is exactly when siteverify hiccups.
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Bot gate #1 — honeypot. Bots fill every field; humans never see it.
  // Fake success so the bot doesn't learn it was caught.
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    return { success: true, message: "Thank you! We'll be in touch soon." };
  }

  // Bot gate #2 — time to submit. The form stamps when it rendered;
  // anything "filled out" in under 3 seconds is a script, not a person
  // with a cracked windshield. Missing stamp (JS disabled) passes.
  const startedAt = Number(formData.get("formStartedAt"));
  if (startedAt > 0 && Date.now() - startedAt < 3000) {
    return { success: true, message: "Thank you! We'll be in touch soon." };
  }

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const serviceType = (formData.get("serviceType") as string)?.trim();
  const vehicleInfo = (formData.get("vehicleInfo") as string)?.trim();
  const damageDescription = (formData.get("damageDescription") as string)?.trim();
  const preferredContact = (formData.get("preferredContact") as string)?.trim();

  if (!name || !phone || !email) {
    return {
      success: false,
      message: "Please provide your name, phone number, and email.",
    };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return {
      success: false,
      message: "Please provide a valid 10-digit phone number.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  // Bot gate #3 — the captcha, once keys are configured.
  if (!(await verifyTurnstile(formData))) {
    return {
      success: false,
      message:
        "We couldn't verify you're human — please complete the check and try again.",
    };
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

  // 1. Send notification to Drake (via SES)
  try {
    await sendEmail({
      fromName: BUSINESS.name + " Website",
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

      await sendEmail({
        fromName: BUSINESS.name,
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
