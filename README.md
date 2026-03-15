# Rockstar Windshield Repair

Business website for **Rockstar Windshield Repair**, a mobile windshield repair service in Little Rock, AR and surrounding Central Arkansas areas.

**Live:** [rockstarwindshield.repair](https://rockstarwindshield.repair)

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
| `/reviews` | Masonry grid of customer reviews with star ratings |
| `/service-area` | Cities served with descriptions + Google Maps embed |
| `/contact` | Contact form + business info + map (form submits via Resend) |

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
│   │   └── actions.ts          # Server action → Resend email
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
│   └── reviews-data.ts         # Testimonial data
└── types/
    └── index.ts                # ContactFormData, FormState
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

Create a `.env.local` file:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_BUSINESS_PHONE=555-555-5555
NEXT_PUBLIC_BUSINESS_EMAIL=contact@example.com
```

## Build

```bash
npm run build
npm run start
```

## Deployment (AWS Elastic Beanstalk)

The site deploys to Elastic Beanstalk with the following config:

- **Application:** `rockstar-windshield-repair`
- **Environment:** `rswr-production`
- **Platform:** Node.js 22 on 64bit Amazon Linux 2023
- **Instance:** t3.small
- **Load Balancer:** ALB with HTTPS (ACM certificate)

### Deploy a new version

```bash
# Build the deployment zip
zip -r deploy.zip . -x "node_modules/*" ".git/*" ".next/*"

# Upload to S3
aws s3 cp deploy.zip s3://elasticbeanstalk-us-east-1-973196283632/rswr/deploy.zip

# Create version and deploy
aws elasticbeanstalk create-application-version \
  --application-name rockstar-windshield-repair \
  --version-label vX \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-973196283632,S3Key=rswr/deploy.zip

aws elasticbeanstalk update-environment \
  --environment-name rswr-production \
  --version-label vX
```

### EB Configuration Files

- `.ebextensions/01-nodecommand.config` — Environment settings (instance type, proxy, env vars)
- `.platform/hooks/predeploy/01_build.sh` — Runs `npm run build` before deployment
- `Procfile` — Starts the app with `npm run start`

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
