// Blog content lives here as structured data so each post renders through one
// template (src/app/blog/[slug]/page.tsx) with consistent styling, metadata,
// and Article schema. Add a new post by appending an entry to POSTS.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string; cta: { label: string; href: string } };

export interface BlogPost {
  slug: string;
  title: string;
  // Short meta description (~150 chars) for search + social.
  description: string;
  // Human-facing one-liner shown on the blog index card.
  excerpt: string;
  // ISO dates. published drives sitemap lastmod + Article schema.
  published: string;
  updated: string;
  readingTime: string;
  body: Block[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "does-insurance-cover-windshield-repair-in-arkansas",
    title: "Does Insurance Cover Windshield Repair in Arkansas?",
    description:
      "Most Arkansas drivers with comprehensive coverage pay $0 for windshield repair — no deductible, no premium hike. Here's how it works and how to file.",
    excerpt:
      "If you carry comprehensive coverage, your chip repair is almost certainly free. Here's exactly how windshield glass claims work in Arkansas.",
    published: "2026-06-02",
    updated: "2026-07-28",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "It's the first question almost every customer asks us, and it's a fair one: is this coming out of my pocket, or will insurance cover it? The short answer for most Arkansas drivers is good news. If you carry comprehensive coverage, your windshield repair is very likely covered at no cost to you — no deductible, and no effect on your premium. Let me walk you through why.",
      },
      {
        type: "h2",
        text: "Comprehensive coverage is the key",
      },
      {
        type: "p",
        text: "Windshield damage from rocks, road debris, and weather falls under the comprehensive portion of your auto policy — not collision. If you have comprehensive (sometimes called \"comp\" or \"other than collision\") coverage, glass claims are part of the deal. The important detail most people don't know is that insurers treat repair very differently from replacement.",
      },
      {
        type: "p",
        text: "Because a repair is so much cheaper than a full windshield replacement, most insurance companies waive the deductible entirely for repairs. They would much rather pay us $65 to seal a chip today than pay $400 or more to replace the whole windshield after that chip spreads into a foot-long crack next month. So they make repair the easy, free choice — and that works out in your favor.",
      },
      {
        type: "h2",
        text: "Will a glass claim raise my rates?",
      },
      {
        type: "p",
        text: "This is the worry that keeps people from filing, so let's clear it up. A comprehensive glass claim for a rock chip is a no-fault claim — you didn't cause it, and the insurer knows that. In practice, a single windshield repair claim does not raise your premium. Insurers see these claims constantly and they price them in. Replacing a windshield repeatedly is a different story, but that's exactly why sealing a chip early is the smart move: it keeps a small, free claim from becoming a large one down the road.",
      },
      {
        type: "h2",
        text: "How the claim actually works",
      },
      {
        type: "p",
        text: "Here's the part people find surprisingly easy: you don't really have to do much. When you book with us, we ask for your insurance information and handle the paperwork directly with your carrier. In most cases you'll never touch a claim form. We verify your coverage before we start so there are no surprises — if for some reason a repair wouldn't be fully covered, you'll know the exact cost before we do any work.",
      },
      {
        type: "ul",
        items: [
          "Give us your insurance details when you book — we take it from there.",
          "We confirm your comprehensive coverage and the zero-deductible repair benefit before starting.",
          "We bill the insurer directly, so most customers pay nothing out of pocket.",
          "No comprehensive coverage? Repairs are still affordable — chips run $65–$85 and cracks are a flat $125.",
        ],
      },
      {
        type: "callout",
        text: "Not sure what your coverage includes? Send us a photo of the damage and your insurance carrier — we'll tell you whether it's a free repair before you commit to anything.",
        cta: { label: "Get a Free Quote", href: "/contact" },
      },
      {
        type: "h2",
        text: "The one thing not to do: wait",
      },
      {
        type: "p",
        text: "A chip that qualifies for a free repair today can spread into a crack that only a paid replacement will fix. Temperature swings, a bumpy road, or even slamming a door can be enough to set it off. The moment you notice a chip, cover it with a small piece of clear tape to keep dirt and moisture out, and get it looked at. When repair is free and replacement is not, waiting is the only expensive option.",
      },
      {
        type: "p",
        text: "We're a local, owner-operated mobile shop serving Little Rock, East End, Sheridan, and the surrounding Central Arkansas area, and we work with all major insurers. If you've got a chip and a question about coverage, just ask — we'll give you a straight answer.",
      },
    ],
  },
  {
    slug: "can-a-windshield-chip-be-repaired-repair-vs-replace",
    title: "Can a Windshield Chip Be Repaired? When to Repair vs. Replace",
    description:
      "Not every windshield chip needs a full replacement. Learn which chips and cracks can be repaired, when replacement is the honest call, and why repairing first always pays off.",
    excerpt:
      "Most chips and cracks up to 18 inches can be repaired — saving you time and money. Here's how to tell repair from replacement.",
    published: "2026-06-18",
    updated: "2026-07-28",
    readingTime: "6 min read",
    body: [
      {
        type: "p",
        text: "A rock kicks up off the highway, cracks against your windshield, and now there's a little star-shaped mark staring back at you. The big question: can this be fixed, or are you about to buy a whole new windshield? Most of the time, the answer is that it can absolutely be repaired — and repair is faster, cheaper, and better for your car than replacement. But not always. Here's how we decide, and how you can size it up yourself.",
      },
      {
        type: "h2",
        text: "What can be repaired",
      },
      {
        type: "p",
        text: "Modern resin-injection repair is remarkably capable. We inject a specialized resin into the damage, draw out the air, and cure it so it bonds with the glass — restoring strength and clarity and stopping the damage from spreading. As a general rule, we can repair:",
      },
      {
        type: "ul",
        items: [
          "Chips and stone breaks roughly the size of a quarter or smaller.",
          "Star breaks and bullseye chips, where cracks radiate from a central impact point.",
          "Cracks from about 4 inches up to 18 inches long.",
          "Damage in the glass layers that hasn't penetrated all the way through both panes.",
        ],
      },
      {
        type: "p",
        text: "If your damage fits in those categories, there's a very good chance we can seal it in about 30 minutes, right where your car is parked. A repaired chip won't be perfectly invisible — you may see a faint mark if you look for it — but it will be structurally sound and it won't keep growing.",
      },
      {
        type: "h2",
        text: "When replacement is the honest call",
      },
      {
        type: "p",
        text: "We're a repair-only shop, which means we have no replacement to upsell you. That's exactly why you can trust us when we say a repair won't hold. There are a few situations where replacement is genuinely the right move:",
      },
      {
        type: "ul",
        items: [
          "Cracks longer than about 18 inches, or ones that reach the edge of the windshield where they compromise structural integrity.",
          "Damage directly in the driver's line of sight, where even a faint repair mark could distract or distort your view.",
          "Deep damage that has penetrated both layers of glass.",
          "Multiple large cracks, or a windshield that's already been repaired several times in the same area.",
        ],
      },
      {
        type: "p",
        text: "If we come out and find your damage falls into one of these buckets, we'll tell you straight and point you to a family-owned glass shop we trust for replacement. We'd rather send you to the right fix than take your money for a repair that won't last.",
      },
      {
        type: "callout",
        text: "Not sure which camp your damage falls into? Text us a clear photo and we'll tell you whether it's a repair or a replacement — before you book anything.",
        cta: { label: "See Our Repair Work", href: "/gallery" },
      },
      {
        type: "h2",
        text: "Why repairing first almost always wins",
      },
      {
        type: "p",
        text: "Even in borderline cases, trying a repair first rarely costs you anything. A repair keeps your car's original factory windshield seal intact — and that factory seal is something no aftermarket installation can perfectly recreate. It's dramatically cheaper, it's usually covered by insurance at no cost to you, and it takes a fraction of the time.",
      },
      {
        type: "p",
        text: "And here's how we take the risk out of the decision entirely: if you have us repair a chip and the windshield later needs replacing anyway, we deduct every dollar you paid for the repair from the price of a new windshield through our replacement partner. Every repair is also backed by our 3-year warranty. You never lose what you paid for trying the smaller fix first.",
      },
      {
        type: "callout",
        text: "Got a chip or crack you want looked at? We come to your home, office, or job site anywhere in Central Arkansas.",
        cta: { label: "Request Service", href: "/contact" },
      },
      {
        type: "p",
        text: "The single biggest factor in whether a chip can be repaired is how long you wait. Fresh damage is clean damage — the sooner we get resin into it, the stronger and cleaner the repair. If you've got a chip today, don't let it become a crack next week.",
      },
    ],
  },
  {
    slug: "why-mobile-windshield-repair-saves-time-and-money",
    title: "Why Mobile Windshield Repair Saves You Time and Money",
    description:
      "Mobile windshield repair comes to your home, office, or job site — no shop waiting room, no lost work hours. Here's why it saves Central Arkansas drivers both time and money.",
    excerpt:
      "No shop, no waiting room, no wasted afternoon. Here's why having the repair come to you beats driving across town.",
    published: "2026-07-08",
    updated: "2026-07-28",
    readingTime: "4 min read",
    body: [
      {
        type: "p",
        text: "When most people picture getting a windshield fixed, they imagine driving to a shop, sitting in a waiting room with a lukewarm coffee, and killing half a day. Mobile repair flips that whole picture around: we come to you. And it turns out that's not just more convenient — it genuinely saves you time and money. Here's how.",
      },
      {
        type: "h2",
        text: "Your time is worth something",
      },
      {
        type: "p",
        text: "Think about what a shop visit actually costs you. There's the drive across town, the wait while they get to your car, the repair itself, and the drive back. Add it up and a \"quick\" chip repair can eat two or three hours of your day — often during work hours, which can mean lost wages or burned vacation time.",
      },
      {
        type: "p",
        text: "With mobile repair, that overhead disappears. We show up wherever your car already is — your driveway, your office parking lot, your fleet yard — and do the repair on-site in about 30 minutes. You keep working, keep parenting, keep doing whatever you were doing. The only thing that changes is that your windshield gets fixed while you do it.",
      },
      {
        type: "h2",
        text: "Fixing it early is the real savings",
      },
      {
        type: "p",
        text: "Here's the money part, and it's bigger than most people realize. The main reason a small chip turns into a full windshield replacement is simple: people put off the repair because getting to a shop is a hassle. The chip sits there through a few hot afternoons and cold nights, the glass expands and contracts, and one day it spreads into a crack too long to repair.",
      },
      {
        type: "p",
        text: "Mobile service removes the excuse to wait. When the fix comes to you, there's no reason to let a $65 chip repair grow into a $400 replacement. Convenience isn't just nice — it's what keeps the cheap fix cheap.",
      },
      {
        type: "ul",
        items: [
          "No driving to a shop and no waiting room — we come to your location.",
          "Most repairs take about 30 minutes, done while you work or relax.",
          "Fixing a chip early prevents the far pricier replacement later.",
          "With comprehensive insurance, most repairs are $0 out of pocket.",
        ],
      },
      {
        type: "callout",
        text: "We cover Little Rock, North Little Rock, East End, Sheridan, Benton, Bryant, and the surrounding Central Arkansas area. Check whether we come to you.",
        cta: { label: "See Our Service Area", href: "/service-area" },
      },
      {
        type: "h2",
        text: "Built for busy people and busy fleets",
      },
      {
        type: "p",
        text: "Mobile repair is a lifesaver for fleet managers especially. Instead of pulling trucks off the road one at a time to sit at a shop, we come to your yard and knock out multiple vehicles in a single visit — zero downtime, drivers back on the road the same day. For everyday drivers, it means never rearranging your life around a windshield.",
      },
      {
        type: "p",
        text: "We're a local, owner-operated shop, and mobile service is the whole idea behind what we do. Fast, honest windshield repair that fits into your day instead of taking it over. If you've got a chip or crack, we'll come to you.",
      },
      {
        type: "callout",
        text: "Ready to get that chip handled without leaving home? Tell us where you are and when works.",
        cta: { label: "Request Service", href: "/contact" },
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
