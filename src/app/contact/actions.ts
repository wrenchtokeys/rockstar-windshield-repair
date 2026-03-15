"use server";

import sgMail from "@sendgrid/mail";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { BUSINESS } from "@/lib/constants";
import type { FormState } from "@/types";

// Save every submission to S3 for future marketing
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
    // Don't fail the form submission if S3 save fails
  }
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

  // Always save to S3 (even if email fails)
  await saveToS3(submission);

  // Send email notification via SendGrid
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not set");
    // Still return success — submission was saved to S3
    return {
      success: true,
      message: "Thank you! We've received your request and will be in touch soon.",
    };
  }

  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "notifications@rockstarwindshield.repair",
        name: BUSINESS.name + " Website",
      },
      to: BUSINESS.email,
      subject: `New Quote Request from ${name}`,
      text: [
        `New quote request from ${BUSINESS.domain}`,
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email || "Not provided"}`,
        `Service: ${serviceType || "Not specified"}`,
        `Vehicle: ${vehicleInfo || "Not provided"}`,
        `Damage: ${damageDescription || "Not described"}`,
        `Preferred Contact: ${preferredContact || "Phone"}`,
      ].join("\n"),
      html: `
        <h2>New Quote Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email || "Not provided"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${serviceType || "Not specified"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Vehicle</td><td style="padding:8px;border-bottom:1px solid #eee;">${vehicleInfo || "Not provided"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Damage</td><td style="padding:8px;border-bottom:1px solid #eee;">${damageDescription || "Not described"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Contact Via</td><td style="padding:8px;border-bottom:1px solid #eee;">${preferredContact || "Phone"}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Sent from ${BUSINESS.domain} contact form</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // Still return success — submission was saved to S3
  }

  return {
    success: true,
    message: "Thank you! We've received your request and will be in touch within 1 business hour.",
  };
}
