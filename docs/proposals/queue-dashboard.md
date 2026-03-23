# Proposal: Queue Dashboard for Contact Form Submissions

**Author:** Amelia  
**Date:** 2026-03-23  
**Status:** Draft — awaiting Drake's review

---

## Problem

Contact form submissions go to email + S3 JSON files. There's no way to:
- See all pending requests at a glance
- Track which ones you've responded to vs. which are still waiting
- See response times or patterns (busy days, popular services)
- Quickly call/text back from one place

If you're busy on a job and 3 requests come in, it's easy to lose one in the inbox.

## Solution: Queue Dashboard

A simple protected page on rockstarwindshield.repair that shows all contact form submissions as a live queue.

### Core Features (Phase 1)
- **Queue view** — all submissions sorted by newest, with status badges (New / Contacted / Quoted / Won / Lost)
- **One-tap actions** — call, text, or email directly from each card
- **Status updates** — tap to mark as contacted, add a quick note
- **Filters** — by status, service type, date range
- **Auth** — simple password-protected page (no full user system needed)

### Data Source
Already have everything in S3 (`rockstar-wr-contact-submissions` bucket). Two options:
1. **S3-only** — read directly from S3, write status back as JSON metadata. Zero infrastructure cost, but slow for large lists.
2. **DynamoDB** — move submissions to DynamoDB on intake. Fast queries, pennies/month at this volume. Better for filtering/sorting.

**Recommendation:** DynamoDB. Drake already wanted this for the contact form. Submissions write to DynamoDB on form submit (keep S3 as backup). Dashboard reads from DynamoDB.

### Dashboard Design
- Mobile-first (Drake's on job sites, not a desktop)
- Dark theme matching the site
- Cards with: name, phone (tap to call), service type, time since submission, status
- Swipe or tap to update status
- Simple stats bar: X new today, avg response time, busiest day

### Phase 2 (later)
- **Auto-text** — send an automatic SMS when someone submits ("Got your request, we'll call you shortly")
- **Response time tracking** — measure time from submission to first contact
- **Weekly digest email** — summary of submissions, win rate, avg response time

---

## RS Systems Integration — Website Link for Shops

This is where it gets interesting for the SaaS.

### The Idea
RS Systems shops could connect their business website to get similar benefits:

1. **Embeddable contact widget** — RS Systems provides a JS snippet that shops put on their website. Submissions flow directly into their RS Systems dashboard (not just email).

2. **Customer auto-creation** — when someone submits a quote request, RS Systems auto-creates a Customer record (or matches to existing by phone/email). The shop owner sees it in their customer list immediately.

3. **Repair request pipeline** — submissions become "Pending" repair requests in the tech portal. Assign a tech, they see the details + vehicle info, drive out and do the work.

4. **Closed-loop tracking** — from website visit → quote request → repair record → invoice → payment. Full funnel visibility.

### Implementation Path
- **Phase 1 (Rockstar only):** Build the queue dashboard for rockstarwindshield.repair. Prove the UX works for Drake's own workflow.
- **Phase 2 (RS Systems feature):** Generalize as an RS Systems feature. Each tenant gets an embeddable form + dashboard. Ships as part of a "Website Integration" add-on or included in Pro plan.
- **Phase 3 (Premium):** Auto-text, response time SLAs, customer satisfaction follow-ups.

### Revenue Angle
- Website integration is a **sticky feature** — once a shop's website feeds into RS Systems, switching costs go up
- Could be a Pro/Enterprise plan differentiator
- Most glass shop websites are basic (WordPress, Wix) — an easy embed script is high value for them

---

## Scope & Risk

| Aspect | Assessment |
|--------|-----------|
| **Effort (Phase 1)** | ~2-3 days. DynamoDB table + dashboard page + auth |
| **Cost** | DynamoDB: ~$1-2/month at low volume. Zero additional infra. |
| **Risk** | Low. Standalone feature, doesn't touch RS Systems core |
| **Dependencies** | AWS DynamoDB (already have AWS account + credentials) |

## Decision Needed
1. Go ahead with Phase 1 for Rockstar? (DynamoDB + dashboard)
2. Is the RS Systems website integration angle worth exploring in a separate proposal?
