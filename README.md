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
│   │   ├── route.ts            # GET leads (auth: x-queue-auth header)
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
is a private dashboard for working those leads from a phone.

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
5. **Review-request automation:** marking a lead **Won** auto-opens
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
the `QUEUE_PASSWORD` environment variable on the production EB environment.
The login form sends it in an `x-queue-auth` header; the API routes
(`src/app/api/queue/*`) compare it server-side. It is never stored in the
browser — closing the tab logs you out.

Because of that design there is **no in-app "forgot password" flow** — the
password lives only in the EB environment config, so recovering or changing
it is an AWS operation:

### Forgot the password? (recover it — safe, read-only)

```bash
aws elasticbeanstalk describe-configuration-settings \
  --application-name rockstar-windshield-repair \
  --environment-name rswr-production \
  --region us-east-1 \
  --query "ConfigurationSettings[0].OptionSettings[?Namespace=='aws:elasticbeanstalk:application:environment' && OptionName=='QUEUE_PASSWORD'].Value" \
  --output text
```

This prints the current password. It changes nothing and cannot break the
site. (Console alternative: EB → `rswr-production` → Configuration →
Updates, monitoring, and logging → Environment properties.)

### Resetting the queue password (preferred: script)

```bash
scripts/reset-queue-password.sh            # generates a random password
scripts/reset-queue-password.sh --prompt   # or type your own (hidden input)
```

This does the full app-version deploy correctly every time (git archive →
S3 → new app version → `update-environment` with the password change in
the *same* call), waits for Ready/Green, and confirms the site responds
before printing the new password. It deploys whatever commit is currently
checked out, so commit or stash first if the tree is dirty. Never pass the
password as a plain argument — the script refuses that on purpose, since
it would leak into shell history and `ps` output.

### Changing production env vars (manual recipe / any other var)

> **⚠️ Never change env vars with a bare `update-environment
> --option-settings` call or via the EB console alone.** EB skips the
> predeploy build hook on config-only updates, which ships unbuilt source
> and **takes the site down** (this happened on 2026-07-01 — ~15 min
> outage; see `docs/SESSION_NOTES.md`). Env-var changes must ride a full
> app-version deploy: include `--option-settings` **in the same
> `update-environment` call as `--version-label`**.

```bash
cd /path/to/rswr_website

# 1. Package the current commit
git archive --format=zip -o deploy.zip HEAD

# 2. Upload to S3
aws s3 cp deploy.zip s3://elasticbeanstalk-us-east-1-973196283632/rswr/deploy.zip

# 3. Create an application version (label: what-changed-YYMMDD)
aws elasticbeanstalk create-application-version \
  --application-name rockstar-windshield-repair \
  --version-label queue-password-YYMMDD \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-973196283632,S3Key=rswr/deploy.zip \
  --region us-east-1

# 4. Deploy it AND set the new env var in ONE call
aws elasticbeanstalk update-environment \
  --environment-name rswr-production \
  --version-label queue-password-YYMMDD \
  --option-settings Namespace=aws:elasticbeanstalk:application:environment,OptionName=QUEUE_PASSWORD,Value=NEW_PASSWORD_HERE \
  --region us-east-1

# 5. Wait for Ready/Green, then verify
aws elasticbeanstalk describe-environments \
  --environment-names rswr-production --region us-east-1 \
  --query "Environments[0].[Status,Health]" --output text
curl -s -o /dev/null -w "%{http_code}\n" https://rockstarwindshield.repair/
```

The same recipe applies to any other env var — just swap the
`OptionName`/`Value`. Save the new password somewhere durable (password
manager) — the site never displays it.

## Deployment (AWS Elastic Beanstalk)

The site deploys to Elastic Beanstalk with the following config:

- **Application:** `rockstar-windshield-repair`
- **Environment:** `rswr-production`
- **Platform:** Node.js 22 on 64bit Amazon Linux 2023
- **Instance:** t3.small
- **Load Balancer:** ALB with HTTPS (ACM certificate)

### Deploy a new version

```bash
# Package the current commit (only tracked files — no local junk)
git archive --format=zip -o deploy.zip HEAD

# Upload to S3
aws s3 cp deploy.zip s3://elasticbeanstalk-us-east-1-973196283632/rswr/deploy.zip

# Create version and deploy (label convention: what-changed-YYMMDD)
aws elasticbeanstalk create-application-version \
  --application-name rockstar-windshield-repair \
  --version-label what-changed-YYMMDD \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-973196283632,S3Key=rswr/deploy.zip \
  --region us-east-1

aws elasticbeanstalk update-environment \
  --environment-name rswr-production \
  --version-label what-changed-YYMMDD \
  --region us-east-1
```

If the deploy also needs an env-var change, add `--option-settings` to
that same `update-environment` call — see
[Changing production env vars](#changing-production-env-vars-includes-queue-password-reset).

### EB Configuration Files

- `.ebextensions/01-nodecommand.config` — Environment settings (instance type, proxy, env vars)
- `.platform/hooks/predeploy/01_build.sh` — Runs `npm run build` before deployment.
  **⚠️ EB skips this hook on config-only updates** (e.g. changing env vars
  without deploying a new app version) — it only runs on full app-version
  deploys. A config-only update flips in unbuilt source with no `.next`
  directory and takes the site down. Always change env vars via a full
  app-version deploy, not a bare `update-environment --option-settings`
  call. See `docs/SESSION_NOTES.md` (2026-06-29 → 2026-07-01 entry) for the
  incident this caused.
- `Procfile` — Starts the app with `npm run start`

## Git Remotes

- `origin` — GitHub (`wrenchtokeys/rockstar-windshield-repair`)
- `codecommit-origin` — AWS CodeCommit (us-west-2). A plain `git push`
  here 403s because the macOS keychain helper interferes; push with:

  ```bash
  git -c credential.helper= \
      -c "credential.helper=!aws codecommit credential-helper \$@" \
      -c credential.UseHttpPath=true \
      push codecommit-origin main
  ```

## DNS (Route 53)

- **Hosted Zone:** `rockstarwindshield.repair` (Z00152269ZHHL7BWWEO5)
- **A Record:** Alias to EB ALB
- **www CNAME:** Points to EB environment
- **Email:** Google Workspace (MX, DKIM, SPF, DMARC) — do not modify

## Services Offered

- Chip & Stone Break Repair (star breaks, bullseye, dings)
- Crack Repair (up to 12 inches)
- Mobile Service (we come to you)
- Insurance Claims (direct billing, zero out-of-pocket)
- Fleet & Commercial (priority scheduling, volume pricing)
- Windshield Assessment (free damage evaluation)

## Service Area

Little Rock, North Little Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle, Hot Springs

## Contact

- **Domain:** rockstarwindshield.repair
- Phone and email are configured via environment variables (see above)
