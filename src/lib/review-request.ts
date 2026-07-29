// Automated Google-review requests over email (SES).
//
// The SMS deep-link flow in the queue dashboard stays the personal touch —
// a text from Drake's own number converts best. This module is the safety
// net that needs zero taps: when a job is marked Won and the lead has an
// email address, a branded review-request email goes out server-side, and
// a single follow-up goes out ~3 days later if the dashboard is opened.
//
// No cron anywhere: follow-ups are processed piggyback on the queue GET
// (the dashboard polls every 30s while open). A DynamoDB conditional write
// claims each send before the SES call, so concurrent refreshes can't
// double-email a customer.

import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { sendEmail, buildBrandedEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";
import type { Submission } from "@/types/submission";

const FOLLOWUP_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

// The review link is the same one the SMS flow uses. NEXT_PUBLIC_ vars are
// readable server-side too; without it the whole feature is a no-op.
const REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

function firstName(sub: Submission): string {
  return sub.name.trim().split(/\s+/)[0] || "";
}

// Claim the send by writing the timestamp first, conditioned on the field
// not existing. Exactly one caller wins; everyone else gets a quiet false.
async function claimSend(
  id: string,
  field: "reviewEmailSentAt" | "reviewEmailFollowupAt"
): Promise<boolean> {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${field} = :now`,
        ConditionExpression: `attribute_not_exists(${field})`,
        ExpressionAttributeValues: { ":now": new Date().toISOString() },
      })
    );
    return true;
  } catch (error) {
    if ((error as { name?: string }).name === "ConditionalCheckFailedException") {
      return false;
    }
    throw error;
  }
}

// If SES fails after we claimed, release the claim so the send retries on
// the next dashboard load instead of being silently lost forever.
async function releaseClaim(
  id: string,
  field: "reviewEmailSentAt" | "reviewEmailFollowupAt"
) {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `REMOVE ${field}`,
      })
    );
  } catch (error) {
    console.error(`Failed to release ${field} claim for ${id}:`, error);
  }
}

async function sendReviewEmail(sub: Submission, followup: boolean) {
  const first = firstName(sub);

  const subject = followup
    ? `One quick favor${first ? `, ${first}` : ""}? — ${BUSINESS.name}`
    : `How'd we do${first ? `, ${first}` : ""}? — ${BUSINESS.name}`;

  const paragraphs = followup
    ? [
        `No pressure at all — just a friendly nudge that the review link below is still live.`,
        `A quick Google review is the single biggest way to help a local one-man shop like Rockstar. It takes about 30 seconds, and it means the world.`,
        `Either way, thanks again for trusting us with your windshield!`,
      ]
    : [
        `Thanks for choosing ${BUSINESS.name}${first ? `, ${first}` : ""}! It was a pleasure getting your windshield taken care of.`,
        `If you have 30 seconds, a quick Google review helps a local one-man shop more than you know — it's how the next customer finds us.`,
      ];

  const text = followup
    ? `Hi${first ? ` ${first}` : ""},\n\nNo pressure at all — just a friendly nudge that the review link is still live if you get a minute:\n${REVIEW_URL}\n\nEither way, thanks again!\n— Drake, ${BUSINESS.name}`
    : `Hi${first ? ` ${first}` : ""},\n\nThanks for choosing ${BUSINESS.name}! If you have 30 seconds, a quick Google review helps a one-man shop more than you know:\n${REVIEW_URL}\n\nThanks again!\n— Drake, ${BUSINESS.name}`;

  await sendEmail({
    to: sub.email,
    fromName: BUSINESS.name,
    subject,
    text,
    html: buildBrandedEmail({
      headline: followup
        ? `Still hoping to hear from you${first ? `, ${first}` : ""}!`
        : `Thanks for choosing Rockstar${first ? `, ${first}` : ""}!`,
      paragraphs,
      buttonText: "★ Leave a Google Review",
      buttonUrl: REVIEW_URL,
      footerNote:
        "You're receiving this because we recently repaired your windshield. This is the last email about it — promise.",
    }),
  });
}

// Fire the initial review request for a job that was just marked Won.
// Safe to call unconditionally: it no-ops without an email address or
// review URL, and the conditional claim makes it idempotent.
export async function autoRequestReview(sub: Submission) {
  if (!REVIEW_URL || !sub.email) return;

  if (!(await claimSend(sub.id, "reviewEmailSentAt"))) return;

  try {
    await sendReviewEmail(sub, false);
    console.log(`Review request emailed to ${sub.email} (lead ${sub.id})`);
  } catch (error) {
    console.error(`Review request email failed for lead ${sub.id}:`, error);
    await releaseClaim(sub.id, "reviewEmailSentAt");
  }
}

// Send the one follow-up for any Won lead whose initial email went out more
// than three days ago. Called with whatever the dashboard just fetched —
// when nothing is due (the usual case) this costs nothing.
export async function processDueReviewFollowups(subs: Submission[]) {
  const now = Date.now();
  const due = subs.filter(
    (s) =>
      s.status === "won" &&
      s.email &&
      s.reviewEmailSentAt &&
      !s.reviewEmailFollowupAt &&
      now - new Date(s.reviewEmailSentAt).getTime() > FOLLOWUP_DELAY_MS
  );

  for (const sub of due) {
    if (!REVIEW_URL) return;
    if (!(await claimSend(sub.id, "reviewEmailFollowupAt"))) continue;
    try {
      await sendReviewEmail(sub, true);
      console.log(`Review follow-up emailed to ${sub.email} (lead ${sub.id})`);
    } catch (error) {
      console.error(`Review follow-up email failed for lead ${sub.id}:`, error);
      await releaseClaim(sub.id, "reviewEmailFollowupAt");
    }
  }
}
