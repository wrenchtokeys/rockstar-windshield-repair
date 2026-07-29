// Automated outbound SMS via AWS End User Messaging (Pinpoint SMS v2).
//
// Dormant until SMS_ORIGINATION_IDENTITY is set — US carriers block
// automated texts from unregistered numbers, so this activates only after
// a toll-free number is provisioned and its verification is approved.
// Until then sendSms() no-ops and the review flow falls back to email +
// the manual Messages deep link.
//
//   SMS_ORIGINATION_IDENTITY → the verified toll-free number in E.164
//                              form (+18005551234), or a pool/config ARN.
//
// The Amplify compute role also needs sms-voice:SendTextMessage.

import {
  PinpointSMSVoiceV2Client,
  SendTextMessageCommand,
} from "@aws-sdk/client-pinpoint-sms-voice-v2";

const smsClient = new PinpointSMSVoiceV2Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const ORIGINATION = process.env.SMS_ORIGINATION_IDENTITY || "";

export function smsEnabled(): boolean {
  return ORIGINATION.length > 0;
}

// Normalize a US number the way people type them into E.164.
export function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.startsWith("+") && digits.length >= 11) return `+${digits}`;
  return null;
}

// Returns true if the message was actually handed to AWS, false when the
// feature is off or the number is unusable — callers use this to decide
// whether the automated ask happened.
export async function sendSms(to: string, body: string): Promise<boolean> {
  if (!smsEnabled()) return false;

  const dest = toE164(to);
  if (!dest) {
    console.warn(`sendSms: unusable phone number "${to}"`);
    return false;
  }

  await smsClient.send(
    new SendTextMessageCommand({
      DestinationPhoneNumber: dest,
      OriginationIdentity: ORIGINATION,
      MessageBody: body,
      MessageType: "TRANSACTIONAL",
    })
  );
  return true;
}
