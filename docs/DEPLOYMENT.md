# Deployment — AWS Amplify Hosting

Live site: **[rockstarwindshield.repair](https://rockstarwindshield.repair)**

As of **2026-07-11** this site runs on **AWS Amplify Hosting** (Next.js SSR),
migrated off Elastic Beanstalk. This doc is the operational reference: how it's
wired, the two non-obvious Amplify gotchas that will bite you, and how to roll
back. For the dated migration story see `SESSION_NOTES.md` (2026-07-11 entry).

---

## Architecture at a glance

| Thing | Value |
|---|---|
| Host | AWS Amplify Hosting, platform `WEB_COMPUTE` (Next.js SSR on Lambda) |
| Amplify app ID | `d12me65ddm59c9` (region `us-east-1`) |
| Amplify default URL | `main.d12me65ddm59c9.amplifyapp.com` |
| Source | GitHub `wrenchtokeys/rockstar-windshield-repair`, branch `main` |
| Deploys | **Automatic on every push to `main`** (Amplify builds + deploys) |
| Custom domain | `rockstarwindshield.repair` + `www` → CloudFront `d12tb39mmpio0g.cloudfront.net` |
| TLS | ACM-managed wildcard cert (`*.rockstarwindshield.repair`), auto-renew |
| DNS | Route 53 hosted zone `Z00152269ZHHL7BWWEO5` |

### Data + integrations
- **DynamoDB** table `rockstar-contact-submissions` (partition key `id`) — contact submissions / queue dashboard.
- **S3** bucket `rockstar-wr-contact-submissions` — JSON backup of every submission.
- **SES** (`us-east-1`) — transactional email, sends from `notifications@rockstarwindshield.repair` (domain DKIM-verified). Replaced SendGrid on 2026-07-11.
- **Google Places API** — live reviews on `/reviews` and the home page.

### AWS credentials — no static keys
The SSR runtime gets AWS access from an **Amplify compute role**, not access keys:
- Role: `rockstar-amplify-compute-role` (trusted principal `amplify.amazonaws.com`)
- Set on the app **and** the `main` branch (`aws amplify update-app/update-branch --compute-role-arn ...`)
- Least-privilege policy: `dynamodb:{PutItem,GetItem,Query,Scan}` on the contact table, `s3:{PutObject,GetObject}` on the backup bucket, `ses:SendEmail` on the domain identity.

`AWS_REGION` is provided by the Lambda runtime (do **not** set it — Amplify rejects any env var starting with `AWS`).

---

## ⚠️ Two Amplify gotchas (read before you debug a "silently broken" form)

These are not bugs in this app — they're Amplify + Next.js behaviors that every
SSR app here must work around. Both fixes are in the repo.

### 1. Server Actions / API POSTs break on statically-cached pages
A statically-prerendered route (`○` in `next build` output) is cached by
CloudFront. A POST to it (a Server Action) gets served the cached page instead
of hitting the compute → the action never runs. Symptom: form shows "success"
but **nothing is written and no email sends**; logs show `Error: Connection
closed` or `x-nextjs-cache: HIT` on a POST.

**Fix:** force any route with a Server Action / mutating POST to be dynamic.
See `src/app/contact/page.tsx`:
```ts
export const dynamic = "force-dynamic";
```

### 2. Amplify does NOT pass console env vars to the SSR runtime
Environment variables set in the Amplify console are available **at build time
only**, not at request time. So `process.env.X` is `undefined` in Server
Actions / route handlers / server libs. Symptom: S3 backup skipped
(`CONTACT_S3_BUCKET not set`), `/api/queue` returns 401 (`QUEUE_PASSWORD`
undefined), reviews don't load.

**Fix:** inline the server-only vars at build time in `next.config.ts` (Amplify
*does* expose them during the build). See the `env` block there — it bakes each
`process.env.<KEY>` reference into the **server** bundle. Verified these never
land in the client bundle. NEXT_PUBLIC_* vars are handled by Next automatically.

If you add a new server-side env var, add its key to `SERVER_ENV_KEYS` in
`next.config.ts` **and** set the value in the Amplify console — both, or it
won't reach the runtime.

---

## Environment variables

Set these in the Amplify console (App settings → Environment variables). Server
vars are also listed in `next.config.ts` `SERVER_ENV_KEYS` so they inline at build.

**Server (inlined via `next.config.ts`):**
`CONTACT_S3_BUCKET`, `DYNAMODB_TABLE`, `CONTACT_FROM_EMAIL`, `QUEUE_PASSWORD`,
`GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`

**Client (handled by Next automatically):**
`NEXT_PUBLIC_BUSINESS_EMAIL`, `NEXT_PUBLIC_BUSINESS_PHONE`,
`NEXT_PUBLIC_GOOGLE_PROFILE_URL`, `NEXT_PUBLIC_GOOGLE_REVIEW_URL`

Do **not** set `AWS_*` (rejected by Amplify — credentials come from the compute
role, region from the runtime). `CONTACT_FROM_EMAIL` defaults to
`notifications@rockstarwindshield.repair` in code if unset.

---

## Email (SES)

- Region `us-east-1`, account has production sending access.
- Domain identity `rockstarwindshield.repair` verified via **Easy DKIM** — 3
  CNAMEs in Route 53 (`<token>._domainkey → <token>.dkim.amazonses.com`).
- SPF at the apex already includes `amazonses.com`.
- Code: `src/app/contact/actions.ts` uses `@aws-sdk/client-sesv2`
  (`SendEmailCommand`). Sends a notification to the business + a confirmation to
  the customer.
- Gotcha: if a domain's DKIM status is stuck `FAILED` even with correct records,
  re-trigger polling with `aws ses verify-domain-dkim --domain rockstarwindshield.repair`
  (returns the same tokens; flips to `SUCCESS` within minutes).

---

## Deploy / operate

- **Deploy:** push to `main`. Amplify auto-builds. Watch in the Amplify console
  or `aws amplify list-jobs --app-id d12me65ddm59c9 --branch-name main`.
- **Logs:** CloudWatch log group `/aws/amplify/d12me65ddm59c9` (SSR runtime,
  incl. `console.log` from Server Actions).
- **Force a rebuild** (e.g. after changing a compute role or env var):
  `aws amplify start-job --app-id d12me65ddm59c9 --branch-name main --job-type RELEASE`.
  A compute-role change needs a redeploy to take effect.

---

## Rollback

The Elastic Beanstalk config is still in the repo (`Procfile`, `.ebextensions/`,
`.platform/`, `.elasticbeanstalk/`), so the app can be redeployed to EB if ever
needed. The EB environment `rswr-production` was **terminated** on 2026-07-11 —
you'd recreate it with `eb create`. Note EB used `next start` on a t3.small
behind an ALB and read env vars at runtime (no build-time inlining needed there),
so the `next.config.ts` inlining is harmless but Amplify-specific.

Within Amplify, redeploy any prior commit from the console (Deployments → redeploy
this version) or push a revert to `main`.
