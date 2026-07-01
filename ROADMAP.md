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
- **Live Google reviews integration.** `src/lib/google-reviews.ts` pulls
  reviews straight from the Places API (New) at request time (cached/ISR,
  24h revalidate) — no more copy-pasting review text into a file. The home
  page carousel, `/reviews` page, and the JSON-LD `aggregateRating` all read
  from this live source. `reviews-data.ts` has been removed; it's obsolete.
  Requires `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` (see action items
  below) — until those are set, everything falls back to empty/no-rating,
  same as before.

---

## 🔜 Action items (owner: Drake)

These require info only the business owner has:

- [x] **Grab the two GBP URLs.** Found via the GBP dashboard → "Get more
      reviews" and "Share":
      ```
      NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://g.page/r/CZzNaFXq_6XaEBl/review
      NEXT_PUBLIC_GOOGLE_PROFILE_URL=https://share.google/8riILqqwuhuN7cyrQ
      ```
      Still need to be added to the production environment (AWS Elastic
      Beanstalk `rswr-production`) — once set, the review buttons and
      `sameAs` schema activate.
- [ ] **Set up Places API access for live reviews** (~10 min, no recurring
      cost at this volume):
      1. In [Google Cloud Console](https://console.cloud.google.com/), create
         or pick a project, enable billing (required even though usage here
         stays in the free tier).
      2. Enable the **Places API (New)**.
      3. Create an API key, then restrict it: API restrictions → "Places API
         (New)" only. (This key only runs server-side in Next.js, so no HTTP
         referrer restriction is needed — just the API restriction.)
      4. Look up this business's Place ID once, using that key:
         ```
         curl -s -X POST "https://places.googleapis.com/v1/places:searchText" \
           -H "Content-Type: application/json" \
           -H "X-Goog-Api-Key: YOUR_KEY" \
           -H "X-Goog-FieldMask: places.id,places.displayName" \
           -d '{"textQuery": "Rockstar Windshield Repair, Little Rock, AR"}'
         ```
         Copy the `places[0].id` value from the response.
      5. Set both in the production environment:
         ```
         GOOGLE_PLACES_API_KEY=...
         GOOGLE_PLACE_ID=...
         ```
      Reviews and the star rating on the site will start updating automatically
      (up to 5 of Google's "most relevant" reviews — that's a Places API limit,
      not configurable).
- [ ] **Finish the Google Business Profile** as a *service-area business*
      (hide street address; add service-area cities: Little Rock, North Little
      Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle,
      Hot Springs).
- [ ] **Set GBP categories** — Primary: `Auto glass repair service`;
      Secondary: `Auto repair shop`.
- [ ] **Keep asking for reviews.** There are 2 real 5-star reviews so far
      (5.0 average) — text customers the review link
      (`NEXT_PUBLIC_GOOGLE_REVIEW_URL` above) right after a job while the
      experience is fresh. No copy-pasting needed anymore; new reviews show
      up on the site automatically within a day.
- [ ] **Upload before/after photos + logo + van/on-the-job shots** to GBP.
      (Flagged on the GBP dashboard — no new photos added in 140+ days.)
- [ ] **Add GBP services** with descriptions + price ranges.
- [ ] **Post weekly Google Posts** (insurance $0 out-of-pocket, mobile service,
      "small chips don't stay small", fleet pricing).
- [ ] **Seed GBP Q&A** with common questions and self-answer them.

---

## 🛠️ Near-term website upgrades

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
