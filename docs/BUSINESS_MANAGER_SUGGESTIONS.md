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

### Owner clarification required before any copy change

**Exact question for Drake:** Do fleet (and after-hours retail) calls get answered nights/weekends **including Sunday**, or should “on call 24/7” mean priority / emergency fleet response **within the published Mon–Sat windows only**?

Until that answer is recorded here, do **not** implement hours or fleet-availability copy changes.

### Constraints for any future fix (when approved)

- Extended hours are a competitive advantage (“bread and butter”). **Do not propose shorter published hours** as the “fix.”
- **Do not assert that literal 24/7 is correct** without Drake’s confirmation.
- Prefer clarifying language that preserves real extended / fleet-priority availability once Drake defines it (e.g. distinguish retail published hours from fleet emergency / priority response — only after he confirms the truth).
- Keep contact CTAs (call / text-a-photo / form) intact unless a later check finds a real breakage.

### Proposed code touchpoints (NOT APPROVED — inventory only)

When (and only when) Drake confirms true retail vs fleet availability, a future implementation PR would likely need to align:

1. `src/lib/constants.ts` — `BUSINESS.hours` (and any consumer that renders those strings in footer / contact).
2. `src/lib/services-data.ts` — Fleet & Trucking feature bullet that currently says “On call 24/7…”.
3. Homepage / services / FAQ fleet prose and any “24/7 driver support” link text (locate exact files at edit time; verify with repo search for `24/7` and `on call`).
4. Any JSON-LD / schema opening hours if present and derived from the same constants (confirm before editing).

No executable files are changed by this documentation commit.

### Acceptance checks (for a future approved implementation PR)

- [ ] Drake’s retail vs fleet availability answer is written into this log entry.
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
