"use server";

import { Resend } from "resend";
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return {
      success: false,
      message: "Something went wrong. Please call us directly at " + BUSINESS.phone,
    };
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: `${BUSINESS.name} Website <noreply@${BUSINESS.domain}>`,
      to: BUSINESS.email,
      subject: `New Quote Request from ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email || "Not provided"}`,
        `Service: ${serviceType || "Not specified"}`,
        `Vehicle: ${vehicleInfo || "Not provided"}`,
        `Damage: ${damageDescription || "Not described"}`,
        `Preferred Contact: ${preferredContact || "Phone"}`,
      ].join("\n"),
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
