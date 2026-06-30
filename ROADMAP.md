# Rockstar Windshield Repair — Roadmap & Improvement Plan

This document tracks completed work, near-term tasks, and longer-term ideas for
the website and the broader online presence (Google Business Profile, reviews,
local SEO). It's a living doc — update it as items ship.

---

## ✅ Recently shipped

- **Removed placeholder/fake testimonials.** Fabricated reviews (with invented
  customer names) were appearing on both the home page testimonials carousel
  and the `/reviews` page. These violate the FTC's rules on endorsements and
  Google's content policies. They've been removed.
- **Self-healing reviews system.** `src/lib/reviews-data.ts` is now an empty,
  typed list. The home page testimonials section and the `/reviews` grid only
  render when real reviews exist — add a real review to that file and both
  surfaces light up automatically. No fake content in the meantime.
- **Honest "first reviews" CTA.** The `/reviews` page now shows a genuine
  "Be one of our first reviews" message with a **Leave a Google Review** button
  (falls back to the Contact page until the Google review link is configured).
- **External-link support in `Button`.** Buttons pointing at `http(s)` URLs now
  render a real anchor with `target="_blank"` + `rel="noopener noreferrer"`.
- **Removed fabricated `aggregateRating` from structured data.** `JsonLd` was
  publishing `AggregateRating` with `reviewCount: "47"` at `5.0` stars despite
  having zero real reviews. Fake ratings violate Google's structured-data
  policy and can get the listing penalized — removed until real reviews exist.
- **Wired `sameAs`** in `JsonLd` to the Google Business Profile URL so Google
  links the site to the listing. (The richer `AutoRepair` type, `areaServed`,
  offer catalog, and FAQ schema were already in place.)
- **New config hooks** in `src/lib/constants.ts`:
  - `NEXT_PUBLIC_GOOGLE_REVIEW_URL` — the GBP "Get review link" URL.
  - `NEXT_PUBLIC_GOOGLE_PROFILE_URL` — the public Google Maps listing URL.

---

## 🔜 Action items (owner: Drake)

These require info only the business owner has:

- [ ] **Finish the Google Business Profile** as a *service-area business*
      (hide street address; add service-area cities: Little Rock, North Little
      Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle,
      Hot Springs).
- [ ] **Set GBP categories** — Primary: `Auto glass repair service`;
      Secondary: `Auto repair shop`.
- [ ] **Grab the two GBP URLs** and add them to the production environment:
      ```
      NEXT_PUBLIC_GOOGLE_REVIEW_URL=...    # GBP → Share → "Get review link"
      NEXT_PUBLIC_GOOGLE_PROFILE_URL=...   # public Google Maps listing URL
      ```
      Once set, the review buttons and `sameAs` schema activate automatically.
- [ ] **Collect real reviews.** Text customers the review link right after a job
      (template lives in the project notes). Add each one to `reviews-data.ts`.
- [ ] **Upload before/after photos + logo + van/on-the-job shots** to GBP.
- [ ] **Add GBP services** with descriptions + price ranges.
- [ ] **Post weekly Google Posts** (insurance $0 out-of-pocket, mobile service,
      "small chips don't stay small", fleet pricing).
- [ ] **Seed GBP Q&A** with common questions and self-answer them.

---

## 🛠️ Near-term website upgrades

- [ ] **Aggregate review schema.** Once there are real reviews, add
      `Review` / `AggregateRating` structured data so star ratings can show in
      search results. (Only with genuine reviews — never fabricated.)
- [ ] **Live Google reviews integration.** Pull reviews from the Google Places
      API and cache them (ISR / scheduled revalidate) so the site and GBP stay
      in sync without manual copy-paste into `reviews-data.ts`.
- [ ] **Per-city landing pages.** Dedicated, indexable pages for each service
      area (e.g. `/windshield-repair/conway`) with localized copy. Big local-SEO
      win for a service-area business — currently all cities share one page.
- [ ] **Service + city schema** on those pages (`Service`, `areaServed`).
- [ ] **Analytics + conversion tracking.** Add privacy-friendly analytics and
      track click-to-call + contact-form submits as conversions.
- [ ] **Image optimization audit.** Ensure gallery JPEGs are sized/compressed
      and served via `next/image` for Core Web Vitals.
- [ ] **Accessibility pass.** Color-contrast check on the dark theme, focus
      states, and alt text review.

---

## 🌱 Longer-term ideas

- [ ] **Online booking / scheduling** with time-slot selection and SMS confirms.
- [ ] **Instant quote tool** — upload a photo of the damage for a rough estimate.
- [ ] **Insurance claim intake flow** that captures policy info up front.
- [ ] **Fleet/commercial portal** for recurring B2B customers.
- [ ] **Automated review-request SMS** triggered when a job is marked complete.
- [ ] **Blog / education content** ("repair vs. replace", "is my chip fixable?")
      for top-of-funnel local search traffic.

---

## 🚀 Deployment reference

The live site runs on **AWS Elastic Beanstalk** in **us-east-1**:

- Application: `rockstar-windshield-repair`
- Environment: `rswr-production`
- Platform: Node.js 22 on 64bit Amazon Linux 2023
- Deploy artifacts staged in S3: `s3://elasticbeanstalk-us-east-1-973196283632/rswr/`

> Note: a local `eb` CLI config pointing at a `us_west-2` app (`rswr_website`)
> exists but has **no environment** and is not the live target. Deploy to the
> us-east-1 environment above (see README "Deployment" section for commands).
</content>
</invoke>
