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
      Live in production since 2026-07-01 — review buttons and `sameAs`
      schema are active.
- [x] **Set up Places API access for live reviews** — ✅ **DONE, live in
      production since 2026-07-03** (version `live-reviews-260703`,
      commit `27cc834`). GCP project `rockstar-windshield-repair`, Places
      API (New) enabled, restricted API key. The Place ID —
      ```
      GOOGLE_PLACE_ID=ChIJgQui0ml6RmERnM1oVer_pdo
      ```
      — was recovered on 2026-07-03 by decoding the g.page review-link
      token to the listing's CID (`15755280253345910172`) and extracting
      the ID from the Google Maps preview payload (details in
      docs/SESSION_NOTES.md). Both `GOOGLE_PLACES_API_KEY` and
      `GOOGLE_PLACE_ID` are set on `rswr-production`. Reviews, the rating
      summary, and JSON-LD `aggregateRating` all update automatically
      (24h ISR cache) — no deploys needed for new reviews.
      Note: the listing still isn't in the Places *search* index (Text
      Search/Autocomplete return nothing); doesn't matter for us since we
      fetch by Place ID directly. **Reminder:** any future env-var change
      must go through a full app-version deploy — see the 2026-07-01
      incident in docs/SESSION_NOTES.md.
- [ ] **Finish the Google Business Profile** as a *service-area business*
      (hide street address; add service-area cities: Little Rock, North Little
      Rock, Conway, Benton, Bryant, Jacksonville, Cabot, Sherwood, Maumelle,
      Hot Springs).
- [ ] **Set GBP categories** — Primary: `Auto glass repair service`;
      Secondary: `Auto repair shop`.
- [ ] **Keep asking for reviews.** There are 2 real 5-star reviews so far
      (5.0 average) — see the **⭐ Getting more reviews** playbook below.
      No copy-pasting needed anymore; new reviews show up on the site
      automatically within a day.
- [ ] **Upload before/after photos + logo + van/on-the-job shots** to GBP.
      (Flagged on the GBP dashboard — no new photos added in 140+ days.)
- [ ] **Add GBP services** with descriptions + price ranges.
- [ ] **Post weekly Google Posts** (insurance $0 out-of-pocket, mobile service,
      "small chips don't stay small", fleet pricing).
- [ ] **Seed GBP Q&A** with common questions and self-answer them.

---

## ⭐ Getting more reviews — playbook

Review link (opens the rating dialog directly):
`https://g.page/r/CZzNaFXq_6XaEBl/review`

### At the job — the moment that converts

- [ ] **Ask in person at the moment of delight** — right after showing the
      finished repair, while they're impressed. Simple word track: *"If
      you're happy with how this turned out, a Google review is the single
      biggest thing that helps a one-man shop like mine. Can I text you the
      link? Takes about a minute."* An in-person ask + instant text is the
      highest-converting combo there is; most customers who say yes and
      get the link *while you're still there* actually follow through.
- [ ] **Save a text template** on the phone so it's two taps after every
      job: *"Thanks for choosing Rockstar Windshield Repair! If you have a
      minute, a quick Google review helps more than you know:
      https://g.page/r/CZzNaFXq_6XaEBl/review — Drake"*
- [ ] **Ask for a photo in the review.** Reviews with photos get more
      views and carry more weight with both readers and Google. Ask
      naturally: *"feel free to snap a pic of the repair for the review."*
      Before/after is a windshield repair's best sales pitch.
- [ ] **Let them mention where/what.** If a customer naturally writes
      "came out to Conway" or "fixed my rock chip", that text helps local
      ranking. Can't script it — but *"mention what we fixed if you don't
      mind"* is a fair nudge.

### Print & physical

- [ ] **QR-code leave-behind card** — business card / thank-you card with
      a QR pointing at the review link, left on the dash after every job.
      Catches the customers who weren't there during the repair (workplace
      and driveway jobs). The QR code can be generated from the review
      link and added to `public/` in this repo for print-ready use.
- [ ] **QR sticker on the van/window cling** — "Happy with your repair?
      Scan to review." Works passively at every job site.
- [ ] **Invoice/receipt footer** — if receipts are emailed or printed, add
      the review link and QR at the bottom.

### Follow-up

- [ ] **One next-day reminder text** if no review appeared — polite,
      single follow-up only: *"No pressure at all, but if you get a minute
      that review link is still live. Either way, thanks again!"* One
      reminder roughly doubles follow-through; more than one annoys.
- [ ] **Fleet/commercial jobs:** ask the fleet manager or dispatcher
      directly — one B2B contact can be good for a detailed review that
      mentions multiple vehicles.

### Make every review work twice

- [ ] **Reply to every review as the owner** (GBP dashboard → Reviews).
      Signals engagement to Google, shows prospective customers (and
      prospective *reviewers*) that reviews get read, and lets you
      naturally include service keywords in the reply ("glad the chip
      repair in North Little Rock worked out"). Reply to star-only
      reviews too (Madison's is currently unanswered).
- [ ] **Screenshot standout reviews** for Google Posts and social — a
      great review is content.

### Rules — don't get the listing penalized

- **Never incentivize.** No discounts, freebies, or entries-to-win for
  reviews — violates Google policy and FTC rules (same rules that forced
  removal of the fake testimonials).
- **No review gating.** Don't pre-filter with "how was your experience?"
  surveys that only route happy customers to Google. Ask everyone.
- **Customer's own phone, own account.** Never hand over a shop device to
  "help" someone leave a review — same-device/IP reviews get filtered and
  can flag the listing.
- **No friends/family padding.** Only real customers.
- **Steady beats bursts.** A review a week from real jobs looks (and is)
  organic; ten in one weekend looks bought. The ask-every-job habit
  produces exactly the right cadence naturally.

### Website/system tie-ins (already tracked elsewhere in this doc)

- Automated review-request SMS when a job is marked complete — see
  Longer-term ideas; the `/queue` system is the natural trigger point.
- New reviews appear on the site automatically within ~24h (ISR cache) —
  every review earned immediately markets on rockstarwindshield.repair
  and in the JSON-LD star data, not just on Google.

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
