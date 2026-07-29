// Shared SES email plumbing — used by the contact form (server action) and
// the queue API's automated review-request emails.

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { BUSINESS } from "@/lib/constants";

// SES client — credentials come from the Amplify compute role (no static keys),
// region is supplied by the runtime. Sends from the DKIM-verified rockstar domain.
const sesClient = new SESv2Client({ region: process.env.AWS_REGION || "us-east-1" });
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "notifications@rockstarwindshield.repair";

export async function sendEmail(opts: {
  to: string;
  fromName: string;
  subject: string;
  text: string;
  html: string;
}) {
  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: `${opts.fromName} <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [opts.to] },
      Content: {
        Simple: {
          Subject: { Data: opts.subject },
          Body: {
            Text: { Data: opts.text },
            Html: { Data: opts.html },
          },
        },
      },
    })
  );
}

export function buildBrandedEmail({
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
