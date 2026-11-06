# Business Manager — Website Suggestions Log

**Status:** Documentation only. All items below are **NOT APPROVED FOR IMPLEMENTATION** until Drake explicitly approves a change and a normal code PR ships it.

**Purpose:** Consolidate Rockstar Business Manager findings that may later need website code or copy changes. Future website-related suggestions from Business Manager checks should be appended here (newest on top) rather than scattered across chats or one-off files. This is not a substitute for `ROADMAP.md` (product backlog) or `docs/SESSION_NOTES.md` (shipped-session log).

**Deploy safety note:** Amplify auto-deploys from `main` only (`docs/DEPLOYMENT.md`). Suggestion docs must land on a documentation branch / PR first — never push suggestion-only work straight to `main`, and never treat this file as authorization to edit executable code, config, workflows, or to deploy.

**Contact / privacy:** Do not put the business phone, email, private address, passwords, API keys, or other secrets in this file. Refer to `src/lib/constants.ts` and Amplify env vars for contact wiring.

---

## 2026-11-05 — Hours conflict: published schedule vs fleet “on call 24/7”

**Check type:** Read-only live + source review (homepage, contact, services, FAQ; `src/lib/constants.ts`; fleet copy).
**Domain checked:** https://rockstarwindshield.repair (Central Arkansas mobile shop). Not the unrelated Texas `rockstarwindshield.com`.
**Implementation status:** **NOT APPROVED FOR IMPLEMENTATION.** Docs suggestion only.

### Verified findings (live)

- Footer / contact “Business Hours” on the live site state roughly: Mon–Fri 7:00 AM – 6:00 PM, Sat 8:00 AM – 4:00 PM, Sun Closed.
  - https://rockstarwindshield.repair/
  - https://rockstarwindshield.repair/contact
  - https://rockstarwindshield.repair/faq
  - https://rockstarwindshield.repair/services (footer hours alongside fleet copy)
- Fleet-facing copy on the same site states the business is **“on call 24/7 for drivers and managers alike”**, including:
  - Homepage fleet blurb and a “Volume pricing & 24/7 driver support” link toward services
  - https://rockstarwindshield.repair/services (intro, Fleet feature list, fleet pricing bullets)
  - FAQ answer for fleet / commercial trucks
- This reconfirms an earlier stale observation; it is current as of the 2026-11-05 check.

### Verified findings (source)

- Published hours object: [`src/lib/constants.ts`](../src/lib/constants.ts) → `BUSINESS.hours` (weekdays / saturday / sunday strings matching the live footer).
- Fleet feature bullet including “On call 24/7…”: [`src/lib/services-data.ts`](../src/lib/services-data.ts) → Fleet & Trucking `features`.
- Additional “on call 24/7” prose also appears in live page bodies (homepage / services / FAQ). Exact JSX or data files for those prose blocks should be located at implementation time; do not assume `services-data.ts` is the only touchpoint.

### Contact paths (this pass)

- Call, Text-a-photo (`sms:` deep link with photo-quote prefill), email, and contact form were present and wiring looked healthy on the live homepage / contact surfaces.
- **No change recommended on call / text / photo contact paths in this pass.** Hours/copy consistency is the issue, not missing CTAs.

### Business impact (hypothesis — not measured)

Conflicting signals may:

- Cause after-hours retail visitors to assume the shop is closed when Drake would still take the job (hurts the extended-hours advantage).
- Cause fleet callers to expect true round-the-clock pickup when the published footer says Sunday closed / evenings end at a fixed time.
- Create distrust if a caller sees both messages on one visit (services page shows both fleet 24/7 language and the standard hours footer).

No call-volume or conversion loss was measured in this check. Treat impact as a **hypothesis**, not a reported revenue loss.

### Owner clarification

**Question asked (2026-11-05):** Do fleet (and after-hours retail) calls get answered nights/weekends including Sunday, or should “on call 24/7” mean priority / emergency fleet response within the published Mon–Sat windows only?

**Drake’s answer (2026-11-05, direct):** He will answer during whatever regular business hours are set, and can also do emergency calls — especially for established fleets.

**How to read that answer (do not over-infer):**

| Settled | Still pending |
| --- | --- |
| **Availability policy:** Regular answering happens during the (still-to-be-finalized) published business hours. After-hours **emergency** calls are also possible, especially for established fleets. | **Exact regular business hours** (days/times shown on the site) are **not** set by this answer. Do not invent, shorten, or replace them here. |
| Live “on call 24/7” / guaranteed round-the-clock wording is **not** confirmed as accurate. | Whether any particular after-hours call will be answered is **not** a guarantee from this note. |
| Emergency help is **not** described as exclusive to fleets — fleets are called out as an especially likely case. | No public website copy, hours, pricing, or config change is authorized by recording this answer. |

**Still unresolved before any implementation:** the exact regular business hours Drake wants published. Business Manager must **not** ask for or choose those hours in this log; wait for Drake to set them separately.

### Draft copy candidate (NOT APPROVED — separate approval required)

Possible clarifying line for a future, separately approved copy PR (does **not** replace published hours and does **not** claim 24/7 or guaranteed after-hours response):

> Call or text during business hours. After-hours emergency assistance may be available, especially for established fleet customers.

This draft is documentation only. It must not be pasted into production pages until Drake explicitly approves an implementation change.

### Constraints for any future fix (when approved)

- Extended hours are a competitive advantage (“bread and butter”). **Do not propose shorter published hours** as the “fix.”
- **Do not assert that literal 24/7 is correct**; Drake’s clarification supports regular hours plus possible after-hours emergency help, not a guaranteed 24/7 promise.
- Prefer clarifying language that distinguishes **regular answering hours** from **possible after-hours emergency assistance** (especially for established fleets), without promising response or limiting emergency help to fleets only.
- Keep contact CTAs (call / text-a-photo / form) intact unless a later check finds a real breakage.
- Recording Drake’s policy answer here is **not** authorization to change live site copy.

### Proposed code touchpoints (NOT APPROVED — inventory only)

When (and only when) Drake sets exact regular hours **and** separately approves a copy/code change, a future implementation PR would likely need to align:

1. `src/lib/constants.ts` — `BUSINESS.hours` (and any consumer that renders those strings in footer / contact).
2. `src/lib/services-data.ts` — Fleet & Trucking feature bullet that currently says “On call 24/7…”.
3. Homepage / services / FAQ fleet prose and any “24/7 driver support” link text (locate exact files at edit time; verify with repo search for `24/7` and `on call`).
4. Any JSON-LD / schema opening hours if present and derived from the same constants (confirm before editing).

No executable files are changed by this documentation commit.

### Acceptance checks (for a future approved implementation PR)

- [x] Drake’s availability-policy answer is written into this log entry (2026-11-05).
- [ ] Exact regular business hours Drake wants published are still pending (not chosen in this doc).
- [ ] Live homepage, contact, services, and FAQ no longer contradict each other on when someone can reach the shop.
- [ ] Extended / fleet-priority availability remains clearly marketed if Drake confirms it — not quietly shortened.
- [ ] Call and Text-a-photo CTAs still present and functional on homepage + contact.
- [ ] Diff is limited to intentional copy/constants (no deploy-config, workflow, or secrets changes).
- [ ] Change ships via normal review to `main` only after explicit implementation approval (this suggestions doc alone is not approval).

### Out of scope / explicitly not done

- No code edits, config edits, workflow edits, or Amplify deploys.
- No contact to other bots/teammates for implementation.
- No private lead / queue reads.
- No recommendation to shorten hours or to invent 24/7 coverage.
- No production code, deployed copy, hours, pricing, or config changes from this documentation update.
