"use server";

import sgMail from "@sendgrid/mail";
import { BUSINESS } from "@/lib/constants";
import type { FormState } from "@/types";

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

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not set");
    return {
      success: false,
      message: "Something went wrong. Please call us directly at " + BUSINESS.phone,
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

    return {
      success: true,
      message: "Thank you! We'll be in touch within 1 business hour.",
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      message: "Something went wrong. Please call us directly at " + BUSINESS.phone,
    };
  }
}
