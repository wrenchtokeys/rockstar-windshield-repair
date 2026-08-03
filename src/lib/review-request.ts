// Automated Google-review requests — SMS first, email always.
//
// Two automated channels, both zero-tap once a job is marked Won:
//   SMS   — via AWS End User Messaging, active only when a verified
//           toll-free number is configured (see src/lib/sms.ts). Texts get
//           read; this is the primary ask once it's live.
//   Email — via SES, active whenever the lead has an email address.
//
// The manual Messages deep-link in the dashboard stays: a text from
// Drake's own number is still the most personal ask, and it's the only
// SMS path until the toll-free number is approved. The dashboard skips
// opening Messages when the server already texted automatically.
//
// No cron anywhere: follow-ups (one per channel, ~3 days later) are
// processed piggyback on the queue GET — the dashboard polls every 30s
// while open. A DynamoDB conditional write claims each send before the
// AWS call, so concurrent polls can't double-message a customer.

import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { sendEmail, buildBrandedEmail } from "@/lib/email";
import { sendSms, smsEnabled } from "@/lib/sms";
import { BUSINESS } from "@/lib/constants";
import type { Submission } from "@/types/submission";

const FOLLOWUP_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

// The review link is the same one the SMS flow uses. NEXT_PUBLIC_ vars are
// readable server-side too; without it the whole feature is a no-op.
const REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

type ClaimField =
  | "reviewEmailSentAt"
  | "reviewEmailFollowupAt"
  | "reviewSmsSentAt"
  | "reviewSmsFollowupAt";

function firstName(sub: Submission): string {
  return sub.name.trim().split(/\s+/)[0] || "";
}

// Claim the send by writing the timestamp first, conditioned on the field
// not existing. Exactly one caller wins; everyone else gets a quiet false.
async function claimSend(id: string, field: ClaimField): Promise<boolean> {
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

// If the send fails after we claimed, release the claim so it retries on
// the next dashboard load instead of being silently lost forever.
async function releaseClaim(id: string, field: ClaimField) {
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

// ---------------------------------------------------------------- SMS ----

function reviewSmsBody(sub: Submission, followup: boolean): string {
  const first = firstName(sub);
  // First automated text carries opt-out language — toll-free verification
  // expects it, and it only needs to appear once.
  return followup
    ? `No pressure at all${first ? `, ${first}` : ""} — but if you get a minute, that review link is still live: ${REVIEW_URL} Either way, thanks again! — Drake, ${BUSINESS.name}`
    : `Thanks for choosing ${BUSINESS.name}${first ? `, ${first}` : ""}! If you have a minute, a quick Google review helps a one-man shop more than you know: ${REVIEW_URL} — Drake. Reply STOP to opt out.`;
}

async function trySendReviewSms(
  sub: Submission,
  followup: boolean
): Promise<boolean> {
  // Never message someone who already left their review.
  if (sub.reviewLeftAt) return false;
  if (!REVIEW_URL || !smsEnabled() || !sub.phone) return false;

  const field: ClaimField = followup ? "reviewSmsFollowupAt" : "reviewSmsSentAt";
  if (!(await claimSend(sub.id, field))) return false;

  try {
    const sent = await sendSms(sub.phone, reviewSmsBody(sub, followup));
    if (!sent) {
      // Feature off or number unusable — undo the claim, report not-sent.
      await releaseClaim(sub.id, field);
      return false;
    }
    console.log(
      `Review ${followup ? "follow-up" : "request"} texted to ${sub.phone} (lead ${sub.id})`
    );
    return true;
  } catch (error) {
    console.error(`Review SMS failed for lead ${sub.id}:`, error);
    await releaseClaim(sub.id, field);
    return false;
  }
}

// -------------------------------------------------------------- Email ----

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

async function trySendReviewEmail(
  sub: Submission,
  followup: boolean
): Promise<boolean> {
  // Never message someone who already left their review.
  if (sub.reviewLeftAt) return false;
  if (!REVIEW_URL || !sub.email) return false;

  const field: ClaimField = followup
    ? "reviewEmailFollowupAt"
    : "reviewEmailSentAt";
  if (!(await claimSend(sub.id, field))) return false;

  try {
    await sendReviewEmail(sub, followup);
    console.log(
      `Review ${followup ? "follow-up" : "request"} emailed to ${sub.email} (lead ${sub.id})`
    );
    return true;
  } catch (error) {
    console.error(`Review email failed for lead ${sub.id}:`, error);
    await releaseClaim(sub.id, field);
    return false;
  }
}

// ----------------------------------------------------------- Entrypoints --

// Fire the initial review request for a job that was just marked Won, on
// every configured channel. Safe to call unconditionally: it no-ops without
// a review URL / reachable channel, and the claims make it idempotent.
// Returns whether an automated text went out so the dashboard can skip
// opening the manual Messages composer.
export async function autoRequestReview(
  sub: Submission
): Promise<{ texted: boolean; emailed: boolean }> {
  const [texted, emailed] = await Promise.all([
    trySendReviewSms(sub, false),
    trySendReviewEmail(sub, false),
  ]);
  return { texted, emailed };
}

// Send the one follow-up per channel for any Won lead whose initial send
// went out more than three days ago. Called with whatever the dashboard
// just fetched — when nothing is due (the usual case) this costs nothing.
export async function processDueReviewFollowups(subs: Submission[]) {
  if (!REVIEW_URL) return;
  const now = Date.now();

  const overdue = (sentAt?: string, followedUpAt?: string) =>
    !!sentAt && !followedUpAt && now - new Date(sentAt).getTime() > FOLLOWUP_DELAY_MS;

  for (const sub of subs) {
    if (sub.status !== "won") continue;
    // Already reviewed — the follow-up would be asking for something they
    // already did.
    if (sub.reviewLeftAt) continue;
    if (overdue(sub.reviewSmsSentAt, sub.reviewSmsFollowupAt)) {
      await trySendReviewSms(sub, true);
    }
    if (overdue(sub.reviewEmailSentAt, sub.reviewEmailFollowupAt)) {
      await trySendReviewEmail(sub, true);
    }
  }
}
