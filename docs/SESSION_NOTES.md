# AI Session Notes

Continuity log for AI coding sessions on this repo. Each entry covers one
work session: what shipped, what broke, what's still open. Newest entry on
top. Read this before starting new work — it has context that isn't in
`ROADMAP.md` (which is the forward-looking backlog) or git history alone
(commit messages don't capture the "why" behind incidents or dead ends).

---

## 2026-06-29 → 2026-07-01 — Real Google reviews end-to-end

**Starting point:** the site had fabricated testimonials (invented customer
names) on the home page and `/reviews`, plus a fake `AggregateRating`
(5.0★, "47 reviews") in JSON-LD. Both violate Google's and the FTC's rules
and risk the GBP listing getting penalized.

### What shipped

1. **Removed all fabricated review content** (commit `9023392`). Replaced
   with a self-healing system: reviews render only when real ones exist.
   Added `NEXT_PUBLIC_GOOGLE_REVIEW_URL` / `NEXT_PUBLIC_GOOGLE_PROFILE_URL`
   config hooks and an honest "be one of our first reviews" CTA.
2. **Found the real GBP data** by logging into the Google Business Profile
   dashboard (owner: Drake, account visible as "Drake Duncan" in the GBP
   UI). The business already had **2 real 5-star reviews** (5.0 average) —
   one full-text review from "D C", one star-only from Madison Burrow.
   Grabbed the real URLs:
   - Review link: `https://g.page/r/CZzNaFXq_6XaEBl/review`
   - Profile share link: `https://share.google/8riILqqwuhuN7cyrQ`
3. **Built live Google review fetching** (commit `268d941`) so reviews never
   need manual copy-pasting again:
   - `src/lib/google-reviews.ts` — fetches from Places API (New) Place
     Details, ISR-cached 24h, gracefully returns empty when unconfigured.
   - Home page, `/reviews`, and `JsonLd`'s `aggregateRating` all read from
     this live source now.
   - Deleted `src/lib/reviews-data.ts` (the old manual-entry file).
4. **GCP setup completed** (project `rockstar-windshield-repair`, billing
   linked, both Places API (New) and legacy Places API enabled, API key
   created and restricted to Places API only).
5. **Documented an indexing gap** (commit `b79d212`): the business's Place
   ID cannot be found via *any* lookup method — New Text Search (by name, by
   name+location bias), New Autocomplete, legacy Find-Place-by-phone, legacy
   Text Search, and even Google's own public Place ID Finder tool (which
   instead surfaces an unrelated same-named business in Temple, TX). The API
   key itself is confirmed working (a control query for "Googleplex"
   succeeds). Conclusion: Google's Places API dataset is separate from the
   consumer Search/Maps/GBP-dashboard index, and this listing — a newer,
   service-area business without a finalized public address — just isn't in
   it yet. This is **not** related to which Google account the GCP project
   was created under (Places API is a public data API with no ownership
   check); that was checked and ruled out explicitly.
6. **Set the two GBP env vars on production** (`rswr-production`, AWS
   Elastic Beanstalk, us-east-1) via `aws elasticbeanstalk update-environment`.

### 🔥 Incident: this env-var update took production down (~15 min)

**Root cause:** this app's `next build` only runs inside
`.platform/hooks/predeploy/01_build.sh`. AWS Elastic Beanstalk **skips
predeploy hooks for config-only updates** (env var changes with no new app
version) — it only runs them for full app-version deploys. The config-only
update flipped in raw, unbuilt source with no `.next` directory, so
`next start` failed on every instance with "Could not find a production
build in the '.next' directory." Confirmed via EB tail logs
(`RunConfigDeployPostDeployHooks` ran; no predeploy hook execution logged).

**This would happen again** from *any* env var change made through the EB
console too, not just the CLI — it's a structural gap in the deploy setup,
not something specific to these two vars.

**Fix applied:** packaged the current repo (`git archive` of commit
`b79d212`) as a new application version (`gbp-reviews-live-260701`) and
deployed it via `create-application-version` + `update-environment
--version-label`, forcing the full app-deploy path so the predeploy hook
reran. Verified: HTTP 200 on `/` and `/reviews`, instance health Green, no
causes, `sameAs` and review-link URLs confirmed live in page HTML. Total
downtime ~15 minutes. As a side effect, this also shipped the live-reviews
integration to production (it was going to be deployed anyway).

**⚠️ Not yet fixed — real follow-up item:** move the Next.js build out of
the predeploy hook (into a Dockerfile, a `postdeploy` hook, or a CI build
step before upload) so a future config-only change can't break the site
again. Flagged to the user, not yet actioned.

### What's still open

- [ ] **Fix the predeploy-hook fragility** described above (see the ⚠️
      above). This is the highest-value remaining item — it's a live
      landmine for any future config change.
- [ ] **Place ID still unresolved.** Re-check periodically with:
      ```
      curl -s -X POST "https://places.googleapis.com/v1/places:searchText" \
        -H "Content-Type: application/json" \
        -H "X-Goog-Api-Key: YOUR_KEY" \
        -H "X-Goog-FieldMask: places.id,places.displayName" \
        -d '{"textQuery": "Rockstar Windshield Repair, Little Rock, AR"}'
      ```
      Once `places[0].id` comes back non-empty, set `GOOGLE_PLACES_API_KEY`
      and `GOOGLE_PLACE_ID` in production (**but deploy them via a full
      app-version deploy, not a bare `update-environment` config change** —
      see the incident above) and live reviews activate automatically.
- [ ] Finish the GBP service-area setup, categories, photos — see
      `ROADMAP.md` action items, unchanged by this session.
- The GCP API key is currently only known to this session's conversation
  history and whatever the user has saved — it is **not** stored anywhere
  in this repo (by design, it's a secret). If continuing this work in a
  fresh session, the user will need to supply it again or pull it from GCP
  Console → APIs & Services → Credentials (project
  `rockstar-windshield-repair`).

### Mistakes made this session (for future reference)

- Ran `aws elasticbeanstalk update-environment` to set env vars without
  first checking whether this platform's deploy pipeline treats config-only
  updates differently from full deploys. It does, and it broke production.
  **Lesson:** on this repo specifically, always deploy env var changes via
  a full app-version deploy (see fix steps above), never a bare
  `update-environment --option-settings` call.
- Browser automation (Claude in Chrome extension) intermittently failed
  mid-session (screenshot errors, 0x0 viewport reports) while attempting
  GCP Console UI steps. Pivoted to walking the user through those steps
  manually rather than fighting the tooling — worked fine once shifted.
