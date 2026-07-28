# Rockstar Windshield Repair

Business website for **Rockstar Windshield Repair**, a mobile windshield repair service in Little Rock, AR and surrounding Central Arkansas areas.

**Live:** [rockstarwindshield.repair](https://rockstarwindshield.repair)

> **Continuing work on this repo (human or AI)?** Read
> [`docs/SESSION_NOTES.md`](docs/SESSION_NOTES.md) first — it's a dated log
> of what shipped, what broke, and what's still open across sessions, with
> context that isn't in `ROADMAP.md` or git history alone. Check
> `ROADMAP.md` for the forward-looking backlog. Deploying or operating the
> site? See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) (Amplify + SES).

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 (dark theme, royal blue accent)
- **Fonts:** Oswald (headings) + Inter (body) via `next/font/google`
- **Icons:** lucide-react
- **Email:** Resend SDK (contact form submissions)
- **Hosting:** AWS Elastic Beanstalk (Node.js 22, Amazon Linux 2023)
- **DNS:** AWS Route 53
- **SSL:** AWS ACM

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, value props, services preview, testimonials, CTA banner |
| `/services` | Service cards: chip/stone break repair, crack repair, mobile service, insurance claims, fleet & commercial, windshield assessment |
| `/about` | Company story, mission, "Why Choose Us" section |
| `/gallery` | Before/after photo grid (placeholder images) |
| `/reviews` | Live Google reviews (rating summary + review cards, pulled from the Places API, 24h cache) |
| `/service-area` | Cities served with descriptions + Google Maps embed |
| `/contact` | Contact form + business info + map (form emails via Resend **and** saves the lead to DynamoDB) |
| `/queue` | **Private** lead dashboard — password-protected; see [Lead Queue](#lead-queue-queue) below |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, Header, Footer, JsonLd)
│   ├── page.tsx                # Home
│   ├── globals.css             # Tailwind theme
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── gallery/page.tsx
│   ├── reviews/page.tsx
│   ├── contact/
│   │   ├── page.tsx
│   │   └── actions.ts          # Server action → Resend email + DynamoDB lead
│   ├── queue/page.tsx          # Lead dashboard (client, password login)
│   ├── api/queue/
│   │   ├── route.ts            # GET leads, POST manual lead (auth: x-queue-auth)
│   │   └── [id]/route.ts       # PATCH status/notes/review-tracking, DELETE
│   ├── service-area/page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky nav, logo, click-to-call
│   │   ├── Footer.tsx          # 3-column footer
│   │   └── MobileMenu.tsx      # Slide-out mobile nav
│   ├── ui/
│   │   ├── Button.tsx          # Primary/secondary/outline with angular clip-path
│   │   ├── SectionHeading.tsx  # h2 + blue accent bar
│   │   └── Card.tsx            # Dark card with blue glow hover
│   ├── home/
│   │   ├── Hero.tsx            # Full-viewport hero with noise texture
│   │   ├── ValueProps.tsx      # 4 icon cards
│   │   ├── ServicesPreview.tsx  # Top 3 services grid
│   │   └── CTABanner.tsx       # Full-width urgency CTA
│   ├── contact/
│   │   ├── ContactForm.tsx     # Client component with validation + honeypot
│   │   ├── ContactInfo.tsx     # Phone, email, hours, insurance
│   │   └── MapEmbed.tsx        # Google Maps iframe
│   └── common/
│       ├── ClickToCall.tsx     # Fixed bottom bar on mobile
│       └── JsonLd.tsx          # LocalBusiness structured data
├── lib/
│   ├── constants.ts            # Business info, service cities, nav links
│   ├── metadata.ts             # SEO metadata helpers
│   ├── services-data.ts        # Service definitions
│   ├── google-reviews.ts       # Live Google reviews via Places API (24h ISR)
│   └── dynamodb.ts             # DynamoDB doc client + table name
└── types/
    ├── index.ts                # ContactFormData, FormState
    └── submission.ts           # Submission, SubmissionStatus (queue leads)

scripts/
├── get-queue-password.sh          # print/copy the current /queue password
├── reset-queue-password.sh        # rotate it (Amplify + rebuild)
├── install-hooks.sh               # install the pre-commit secret guard
└── pre-commit-secret-guard.sh     # blocks committing secrets (public repo)
```

## Design

- **Theme:** Dark (zinc-950 bg, zinc-900 cards, zinc-800 borders)
- **Primary accent:** Royal Blue (`blue-600` / #2563EB)
- **Urgency accent:** Red (#DC2626) for CTA messaging
- **Rockstar touches:** Angular button clip-paths, diagonal section dividers, noise texture on hero, blue glow hover effects on cards
- **Mobile:** Hamburger menu, stacked layouts, fixed bottom click-to-call bar

## SEO

- Per-page metadata with title template `%s | Rockstar Windshield Repair`
- LocalBusiness JSON-LD structured data
- Dynamic `sitemap.xml` and `robots.txt`
- Semantic HTML with alt text on all images
- Canonical URLs

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key for Resend email service (contact form) |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Business phone number (e.g. `555-555-5555`) |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Business contact email |
| `QUEUE_PASSWORD` | Password for the `/queue` lead dashboard (server-side only — see [Lead Queue](#lead-queue-queue)) |
| `DYNAMODB_TABLE` | DynamoDB table for leads (defaults to `rockstar-contact-submissions`) |
| `GOOGLE_PLACES_API_KEY` | Places API (New) key — powers live reviews (GCP project `rockstar-windshield-repair`) |
| `GOOGLE_PLACE_ID` | The GBP listing's Place ID: `ChIJgQui0ml6RmERnM1oVer_pdo` |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | GBP "leave a review" link (`https://g.page/r/CZzNaFXq_6XaEBl/review`) |
| `NEXT_PUBLIC_GOOGLE_PROFILE_URL` | Public Google listing share URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). Unset = no analytics loaded |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console "HTML tag" verification token. Unset = no meta tag |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL — added to JSON-LD `sameAs`. Optional |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL — added to JSON-LD `sameAs`. Optional |

Create a `.env.local` file:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_BUSINESS_PHONE=555-555-5555
NEXT_PUBLIC_BUSINESS_EMAIL=contact@example.com
QUEUE_PASSWORD=pick-something
```

The Google-review and DynamoDB variables are optional locally — review
surfaces fall back to an empty state and the queue needs AWS credentials
with DynamoDB access to work at all.

> **⚠️ Changing any env var in production requires a full app-version
> deploy** — never a bare `update-environment --option-settings` call. See
> [Changing production env vars](#changing-production-env-vars-includes-queue-password-reset).

## Build

```bash
npm run build
npm run start
```

## Lead Queue (`/queue`)

Every contact-form submission is emailed (Resend) **and** saved as a lead
in DynamoDB (`rockstar-contact-submissions`, us-east-1). The `/queue` page
is a private dashboard for working those leads from a phone. Jobs that
never touch the contact form — phone calls, referrals, walk-ups — can be
typed in with **+ Add Lead** so they land in the same pipeline.

### Using it

1. Open [rockstarwindshield.repair/queue](https://rockstarwindshield.repair/queue)
   and enter the queue password (see below for what to do if it's lost).
2. Leads show as cards, newest first, auto-refreshing every 30 seconds.
   Filter by status with the chips at the top.
3. Each lead moves through statuses: **New → Contacted → Quoted →
   Scheduled → Won / Lost**. The first move off "New" stamps a
   `contactedAt` time automatically.
4. Cards have **Call** / **Text** buttons (tel:/sms: links) and a free-form
   **Notes** field per lead.
5. **+ Add Lead** (header) opens a short form — name and phone required,
   vehicle/notes optional, plus a starting status. Use it for any job that
   didn't come through the website. Manual leads are tagged "added
   manually" on the card (`source: "manual"`) and behave exactly like web
   leads from there on, including the review automation below. Adding one
   straight in as **Won** — the parking-lot case, repair done and the
   customer standing right there — opens the review text immediately.
6. **Review-request automation:** marking a lead **Won** auto-opens
   Messages prefilled with that customer's number and a personalized
   Google-review request — one tap to send, from your own phone number.
   Won cards then show:
   - **★ Ask for Review** — if the auto-open didn't happen (e.g. no phone).
   - **★ Send Reminder** — appears once 24h pass with no follow-up; sends
     the one (and only) polite reminder text.
   - An "asked Xh ago" chip tracking what's been sent
     (`reviewRequestedAt` / `reviewFollowupAt` in DynamoDB).

### How the password works

There are no user accounts. Auth is a **single shared password** stored in
the `QUEUE_PASSWORD` environment variable on the **Amplify app**
(`d12me65ddm59c9`). The login form sends it in an `x-queue-auth` header;
the API routes (`src/app/api/queue/*`) compare it server-side. It is never
stored in the browser — closing the tab logs you out.

> ### 🔒 The password is never written down in this repo
>
> **This is a public GitHub repository.** The password lives in exactly one
> place — Amplify's environment variables — and must never be committed to
> a file here, not even a gitignored one (one `git add -f` and it is public
> forever, and git history is not easily erased).
>
> That is not a hardship, because you can read it back any time with the
> command below. Treat Amplify as the source of truth and keep a copy in
> your password manager; don't put it in the repo, a note file, or a
> commit message.
>
> **Install the pre-commit guard once per clone:**
>
> ```bash
> scripts/install-hooks.sh
> ```
>
> It refuses any commit that stages a `.env`/key file or adds a line that
> hardcodes a password, API key, or token — printing the variable name and
> redacting the value. Git hooks aren't version-controlled, so a fresh
> clone needs this run again. It's a safety net, not a license.

### Forgot the password? (read it back — safe, read-only)

```bash
scripts/get-queue-password.sh          # prints it
scripts/get-queue-password.sh --copy   # copies to clipboard instead (better on a shared screen)
```

Changes nothing and cannot break the site. Under the hood:

```bash
aws amplify get-app --app-id d12me65ddm59c9 --region us-east-1 \
  --query 'app.environmentVariables.QUEUE_PASSWORD' --output text
```

(Console alternative: Amplify → the app → Hosting → Environment variables.)

### Resetting the queue password (preferred: script)

```bash
scripts/reset-queue-password.sh            # generates a random password
scripts/reset-queue-password.sh --prompt   # or type your own (hidden input)
```

The script merges the new value into Amplify's existing environment
variables, triggers a rebuild (required — see below), waits for it to
succeed, checks the site responds, then prints the new password once.
Never pass the password as a plain argument — the script refuses that on
purpose, since it would leak into shell history and `ps` output.

### Changing production env vars (any var)

> **⚠️ Two things to get right.**
>
> 1. **Amplify env vars are applied at build time**, and `next.config.ts`
>    inlines the server-only ones into the bundle. Changing a value does
>    nothing until you **rebuild** — start a job or push a commit.
> 2. **`update-app --environment-variables` replaces the entire map.**
>    Passing just the one variable you care about silently deletes all the
>    others. Always read the current map and merge into it.

```bash
APP_ID=d12me65ddm59c9

# 1. Read the current map
CURRENT=$(aws amplify get-app --app-id $APP_ID --region us-east-1 \
  --query 'app.environmentVariables' --output json)

# 2. Merge your change in (never hand-write the whole map)
MERGED=$(jq '. + {SOME_VAR: "new-value"}' <<<"$CURRENT")

# 3. Write it back
aws amplify update-app --app-id $APP_ID --region us-east-1 \
  --environment-variables "$MERGED"

# 4. Rebuild so the value actually reaches the runtime
aws amplify start-job --app-id $APP_ID --branch-name main \
  --job-type RELEASE --region us-east-1
```

If you add a **new server-side** var, also add its key to `SERVER_ENV_KEYS`
in `next.config.ts` — both, or it won't reach the runtime. See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Deployment (AWS Amplify)

Pushing to `main` on GitHub auto-deploys. Full reference — build settings,
the compute role and its IAM policy, SES, and the Amplify gotchas — lives
in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

- **App ID:** `d12me65ddm59c9` (`WEB_COMPUTE`), branch `main`
- **Compute role:** `rockstar-amplify-compute-role` (no static keys)

```bash
git push origin main                     # deploys

aws amplify list-jobs --app-id d12me65ddm59c9 --branch-name main \
  --max-results 1 --region us-east-1 \
  --query 'jobSummaries[0].{Status:status,Commit:commitId}'
```

> Elastic Beanstalk was retired in the 2026-07-11 migration. `.ebextensions/`,
> `.platform/`, and `Procfile` are dead weight kept only for reference — the
> EB environment, its ALB, and its t3.small no longer exist.

## Git Remotes

- `origin` — GitHub (`wrenchtokeys/rockstar-windshield-repair`), **public**,
  and the source Amplify deploys from. This is the only remote.

  The old `codecommit-origin` (AWS CodeCommit, us-west-2) was removed on
  2026-07-25 — it was a leftover from the EB era, five commits behind, and
  not in the deploy path.

## DNS (Route 53)

- **Hosted Zone:** `rockstarwindshield.repair` (Z00152269ZHHL7BWWEO5)
- **Apex + www:** Alias to the Amplify CloudFront distribution
  (`d12tb39mmpio0g.cloudfront.net`), ACM wildcard cert
- **Email:** Google Workspace (MX, DKIM, SPF, DMARC) — do not modify

## Services Offered

- Chip & Stone Break Repair (star breaks, bullseye, dings)
- Crack Repair (up to 12 inches)
- Mobile Service (we come to you)
- Insurance Claims (direct billing, zero out-of-pocket)
- Fleet & Commercial (priority scheduling, volume pricing)
- Windshield Assessment (free damage evaluation)

## Service Area

Little Rock, North Little Rock, East End, Sheridan, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle, Hot Springs

## Contact

- **Domain:** rockstarwindshield.repair
- Phone and email are configured via environment variables (see above)
