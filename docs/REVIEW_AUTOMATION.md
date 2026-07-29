# Automated Review Requests

When a lead in the queue dashboard is marked **Won**, the system asks the
customer for a Google review automatically — no taps required — and sends
one follow-up per channel about 3 days later. This is the single highest
leverage growth loop for the business: review volume drives local ranking.

## Channels

| Channel | Service | Active when |
|---------|---------|-------------|
| SMS (automated) | AWS End User Messaging (Pinpoint SMS v2) | `SMS_ORIGINATION_IDENTITY` is set to a verified toll-free number |
| Email | Amazon SES (same DKIM-verified domain as the contact form) | Lead has an email address |
| SMS (manual) | `sms:` deep link opens the owner's Messages app prefilled | Always available as fallback; dashboard skips it when the automated SMS went out |

All channels are no-ops unless `NEXT_PUBLIC_GOOGLE_REVIEW_URL` is set.

## How it works

- **Initial ask** — marking a job Won (status dropdown or Add Lead straight
  to Won) triggers `autoRequestReview()` server-side in the queue API
  (`PATCH /api/queue/[id]`, `POST /api/queue`). SMS goes out if configured;
  email goes out if the lead has one. The PATCH/POST response includes
  `autoTexted` so the dashboard only opens the manual Messages composer
  when the server did *not* text.
- **Follow-up** — one per channel, 3 days after the initial send. There is
  **no cron**: `processDueReviewFollowups()` runs piggyback on
  `GET /api/queue`, which the dashboard polls every 30s while open. If the
  dashboard is never opened, follow-ups simply wait.
- **Double-send safety** — every send is claimed first with a DynamoDB
  conditional write (`attribute_not_exists(field)`); only one concurrent
  caller wins. If the AWS send then fails, the claim is released so it
  retries on the next dashboard load. Tracking fields on the submission:
  `reviewSmsSentAt`, `reviewSmsFollowupAt`, `reviewEmailSentAt`,
  `reviewEmailFollowupAt` (the manual SMS flow keeps using
  `reviewRequestedAt` / `reviewFollowupAt`).
- **Opt-out** — the first automated text ends with "Reply STOP to opt out".
  AWS manages the opt-out list automatically (`SelfManagedOptOutsEnabled`
  is false), so STOP replies are honored without any code.

Key files: `src/lib/review-request.ts` (orchestration + copy),
`src/lib/sms.ts` (End User Messaging client), `src/lib/email.ts` (shared
SES sender + branded template), `src/app/api/queue/*` (triggers),
`src/app/queue/page.tsx` (dashboard UX + status chips).

## AWS resources (provisioned 2026-07-28, us-east-1)

- Toll-free number: **+1 (855) 939-4817** — $2.00/mo lease,
  `phone-eaae0338851a49c4b08d3f981ff5c6b9`, SMS-only, TRANSACTIONAL.
- Toll-free verification registration:
  `registration-67ea31aad02e4391b38aca7ab3d33ef4` — use case
  CUSTOMER_CARE, opt-in DIGITAL_FORM (the contact form's SMS consent
  disclosure), sample messages match the real copy in
  `review-request.ts`. The business address on the registration is on
  file in AWS only — it is private carrier paperwork and must never be
  copied into this (public) repo or onto the website; the business is
  100% mobile with no public address.
- Note: AWS rejects `https://` in the registration's website field despite
  its documented regex — use the bare domain.

## Activation checklist (in order)

1. Contact form must show the SMS consent disclosure (shipped alongside
   this doc) — the verification's opt-in evidence is a screenshot of it.
2. Submit the registration (`submit-registration-version`) once the
   opt-in screenshot is attached. Approval typically takes a few days to
   two weeks.
3. Exit the SMS sandbox: AWS Console → End User Messaging → SMS →
   **Request production access** (one-time; sandbox can only text verified
   numbers). Default spend limit is $1/mo (~150 texts) — request a raise
   in the same place if volume ever needs it.
4. Amplify env: set `SMS_ORIGINATION_IDENTITY=+18559394817`.
5. Amplify compute role: allow `sms-voice:SendTextMessage`.
6. Verify end-to-end: mark a test lead (your own number) Won and confirm
   the text arrives and the card shows "💬 auto-texted".

Until steps 2–5 are done, `smsEnabled()` is false and the system behaves
exactly as before automated SMS existed: automated email + manual
Messages deep link.
