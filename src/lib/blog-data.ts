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
  {
    slug: "how-much-does-windshield-repair-cost-little-rock",
    title: "How Much Does Windshield Repair Cost in Little Rock?",
    description:
      "Real windshield repair prices in Little Rock: chips run $65–$85, cracks up to 18 inches are a flat $125, and with comprehensive insurance most repairs are $0.",
    excerpt:
      "No mystery pricing here. Chips are $65–$85, cracks are a flat $125, and with insurance most people pay nothing. Here's the full breakdown.",
    published: "2026-07-14",
    updated: "2026-07-14",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Search for windshield repair prices and you'll mostly find pages that dance around the number until you hand over your phone number. We'd rather just tell you. Here's exactly what windshield repair costs with us in Little Rock and Central Arkansas, what changes the price, and why the real answer for most drivers is zero dollars.",
      },
      {
        type: "h2",
        text: "Our actual prices",
      },
      {
        type: "ul",
        items: [
          "Rock chips and stone breaks: $65–$85, depending on the size and type of the break.",
          "Cracks from 4 inches up to 18 inches: a flat $125, no matter where the crack sits in that range.",
          "Additional chips repaired in the same visit: discounted, since we're already on-site.",
          "Mobile service anywhere in our Central Arkansas service area: included. We don't charge a trip fee.",
        ],
      },
      {
        type: "p",
        text: "That's the whole menu. We're a repair-only shop, so there's no replacement quote waiting in the wings and no technician incentivized to talk you into a bigger ticket. If your damage is beyond what a repair can honestly fix, we'll tell you so and point you to a replacement shop we trust — and if you had us repair it first, every dollar you paid gets deducted from the replacement price through our partner.",
      },
      {
        type: "h2",
        text: "Why most people actually pay $0",
      },
      {
        type: "p",
        text: "If you carry comprehensive coverage on your auto policy, your insurer almost certainly waives the deductible for windshield repair. From their perspective, paying $65 to stop a chip today beats paying $400 or more for a replacement next month, so they make repair free to encourage exactly that. We verify your coverage before we start and bill the insurer directly — most of our insured customers never pay a cent or touch a claim form.",
      },
      {
        type: "callout",
        text: "Want a firm answer for your specific chip or crack? Text us a photo and we'll quote it — and tell you whether your insurance makes it free.",
        cta: { label: "Get a Free Quote", href: "/contact" },
      },
      {
        type: "h2",
        text: "What a shop visit really costs you",
      },
      {
        type: "p",
        text: "One more number that belongs in any honest cost comparison: your time. A trip to a glass shop means driving across town, waiting your turn, and driving back — easily two or three hours, often in the middle of a workday. Our service is mobile, so the repair happens in your driveway or office parking lot in about 30 minutes while you go on with your day. The sticker price is the same either way; the afternoon you keep is not.",
      },
      {
        type: "h2",
        text: "The most expensive option is waiting",
      },
      {
        type: "p",
        text: "Every windshield replacement starts as a chip somebody meant to get around to. Arkansas heat, cold snaps, and rough pavement all work on that chip until it runs into a crack — and once a crack passes 18 inches or reaches the edge of the glass, repair is off the table. The price difference between acting this week and acting next month can be the difference between $0 and several hundred dollars. Every repair we do is backed by a 3-year warranty, so the small fix is also a durable one.",
      },
      {
        type: "callout",
        text: "Chips are cheapest the day you notice them. We offer same-day mobile service across Little Rock and Central Arkansas.",
        cta: { label: "Request Service", href: "/contact" },
      },
    ],
  },
  {
    slug: "what-to-do-right-after-a-rock-chip",
    title: "Just Got a Rock Chip? Do These 4 Things Before It Spreads",
    description:
      "A rock just chipped your windshield — what now? Four simple steps that keep a small chip from spreading into an unrepairable crack.",
    excerpt:
      "That fresh chip is at its most fixable right now. Four simple steps — starting with a piece of clear tape — keep it that way.",
    published: "2026-07-20",
    updated: "2026-07-20",
    readingTime: "4 min read",
    body: [
      {
        type: "p",
        text: "You hear the crack of a rock off the glass on I-30, glance up, and there it is: a fresh chip right in your windshield. Here's the thing most drivers don't realize — what you do in the next few days has more to do with whether that chip stays repairable than almost anything else. Fresh damage is clean, dry, and small. Your job is simply to keep it that way until it's sealed. Four steps.",
      },
      {
        type: "h2",
        text: "1. Cover it with clear tape",
      },
      {
        type: "p",
        text: "A chip is an open wound in the glass. Dirt, car-wash soap, and rainwater all work their way into the break, and once they're in there, even a perfect repair can't get them fully out — moisture and grime are what leave those faint scars in repaired glass. A small piece of clear packing tape over the chip keeps the break clean without blocking your view. It takes ten seconds and it's the single best thing you can do while you wait for the repair.",
      },
      {
        type: "h2",
        text: "2. Skip the car wash and go easy on the defroster",
      },
      {
        type: "p",
        text: "Sudden temperature swings are what turn chips into cracks. Glass expands and contracts as it heats and cools, and a chip is the weak point where that stress lets go. Until the chip is sealed, avoid high-pressure car washes, don't blast the defroster or the AC directly at the glass, and if you can, park in the shade or a garage. An Arkansas summer parking lot can push windshield glass well past 130 degrees — walking that hot glass straight into a cold blast of AC is exactly how a quarter-sized chip becomes a foot-long crack.",
      },
      {
        type: "h2",
        text: "3. Don't slam the doors",
      },
      {
        type: "p",
        text: "This one sounds like an old wives' tale, but it's real physics. Slamming a car door with the windows up sends a pressure pulse through the cabin, and the windshield flexes to absorb it. On healthy glass that's nothing; on a chipped windshield it's a tiny hammer tap on the weak spot, over and over. Close the doors gently — or crack a window — until the chip is fixed.",
      },
      {
        type: "h2",
        text: "4. Get it sealed this week, not this month",
      },
      {
        type: "p",
        text: "Every day a chip sits, two things happen: contamination creeps in, and stress cycles add up. The repairs that come out strongest and cleanest are the ones done within days of the damage. Wait a month and the odds start tilting toward a spread crack — and once a crack passes about 18 inches or reaches the edge of the glass, repair is no longer an option and you're shopping for a replacement instead.",
      },
      {
        type: "ul",
        items: [
          "Fresh chips repair cleaner and stronger than old ones — resin bonds best with uncontaminated glass.",
          "Repair takes about 30 minutes and we come to you, so there's no reason to put it off.",
          "With comprehensive insurance, the repair is usually $0. Without it, chips run $65–$85.",
          "Every repair is backed by our 3-year warranty.",
        ],
      },
      {
        type: "callout",
        text: "Got a fresh chip right now? Tape it, then text us a photo. Same-day mobile service across Little Rock and Central Arkansas — we'll seal it before it has a chance to run.",
        cta: { label: "Request Service", href: "/contact" },
      },
    ],
  },
  {
    slug: "fleet-windshield-repair-how-fleet-managers-cut-glass-costs",
    title: "Fleet Windshield Repair: How Fleet Managers Cut Glass Costs",
    description:
      "On-site fleet windshield repair keeps trucks on the road and glass budgets down. Volume pricing from $50 per repair, zero downtime, one visit for the whole yard.",
    excerpt:
      "Pulling trucks off routes for glass shops burns money twice. Here's how on-yard repair and volume pricing change the math for fleets.",
    published: "2026-07-24",
    updated: "2026-07-24",
    readingTime: "6 min read",
    body: [
      {
        type: "p",
        text: "If you manage trucks, windshield damage isn't an occasional annoyance — it's a line item. Highway miles mean rock strikes, and rock strikes mean a steady drip of chipped glass across the fleet. The usual way of handling it is quietly expensive: ignore chips until they crack, then pull the truck off its route, send a driver to sit at a glass shop, and eat both the replacement bill and the downtime. There's a better system, and it's the one we run for fleets across Central Arkansas.",
      },
      {
        type: "h2",
        text: "The real cost isn't the glass — it's the downtime",
      },
      {
        type: "p",
        text: "A windshield replacement has two prices. There's the invoice, and then there's the truck that spent half a day not earning. A revenue vehicle sitting at a glass shop costs you driver hours, missed stops, and scheduling headaches that ripple into tomorrow. Multiply that by a fleet's worth of windshields and the downtime often costs more than the glass ever did.",
      },
      {
        type: "p",
        text: "Mobile repair deletes that second price. We come to your yard — before routes go out, after they come back, or on whatever window works — and repair multiple vehicles in a single visit. Each repair takes about 30 minutes, the truck never leaves the lot, and drivers never sit in a waiting room. Your dispatch board doesn't even notice we were there.",
      },
      {
        type: "h2",
        text: "Volume pricing that rewards catching chips early",
      },
      {
        type: "p",
        text: "Fleet glass deserves fleet pricing, and ours is built to make the cheap fix the obvious one. Repairs on the same unit step down in price the more of them we do:",
      },
      {
        type: "ul",
        items: [
          "1st repair on a windshield: $50",
          "2nd repair: $40",
          "3rd repair: $35",
          "4th repair: $30",
          "5th repair: $25",
        ],
      },
      {
        type: "p",
        text: "That ladder exists because trucks live on the highway and windshields collect chips as a matter of course. After the fifth repair on a single windshield, we'll tell you straight that it's time to replace the glass rather than keep patching it — we're repair-only, so that recommendation costs us business, which is exactly why you can trust it.",
      },
      {
        type: "h2",
        text: "Chips are also a compliance problem",
      },
      {
        type: "p",
        text: "For DOT-regulated vehicles, windshield condition isn't just cosmetic. Federal rules limit cracks and damage in the driver's critical viewing area, and a spreading crack is the kind of thing that turns a routine roadside inspection into a violation. A sealed chip stops growing. Keeping the fleet's glass repaired as damage appears is one of the cheaper ways to keep inspection day boring — we cover the specifics in our guide to DOT windshield rules.",
      },
      {
        type: "callout",
        text: "Want windshield problems off your plate entirely? Set up a recurring walk-through — we check the yard, repair what needs it, and leave you a per-unit record for your files.",
        cta: { label: "Talk Fleet Service", href: "/contact" },
      },
      {
        type: "h2",
        text: "What working with us looks like",
      },
      {
        type: "p",
        text: "No contracts, no minimums, no phone tree. You text or call, we schedule a yard visit, and we handle every chipped windshield in one pass. We're owner-operated and fully insured with general liability coverage, so bringing us onto your lot is paperwork-free. Every repair carries the same 3-year warranty our retail customers get, and we serve yards across Little Rock, North Little Rock, Benton, Bryant, Jacksonville, Sheridan, and the rest of Central Arkansas.",
      },
      {
        type: "p",
        text: "Fleet windshield costs aren't fixed — they're a function of how early you catch the damage. Catch chips at $50 on your own lot, and the replacement line in your budget mostly stops growing.",
      },
      {
        type: "callout",
        text: "Managing 5 trucks or 50, the math works the same. Tell us about your fleet and we'll set up a first yard visit.",
        cta: { label: "Request Fleet Service", href: "/contact" },
      },
    ],
  },
  {
    slug: "dot-windshield-rules-what-truck-drivers-need-to-know",
    title: "DOT Windshield Rules: What Truck Drivers Need to Know",
    description:
      "What FMCSA rules actually say about windshield cracks and chips on commercial trucks, where the critical vision area is, and how to stay inspection-ready.",
    excerpt:
      "A cracked windshield can write up a CDL driver at inspection. Here's what the federal rules actually allow — and how to stay ahead of them.",
    published: "2026-07-27",
    updated: "2026-07-27",
    readingTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Ask ten drivers what the DOT rules say about windshield cracks and you'll get ten different answers, most of them some version of \"I think it's fine unless it's really bad.\" That guesswork works right up until an inspector decides it doesn't. The actual federal rule is specific, and once you know it, staying inspection-ready is straightforward. Here's the plain-English version.",
      },
      {
        type: "h2",
        text: "What the federal rule actually says",
      },
      {
        type: "p",
        text: "The governing rule for commercial vehicles is FMCSA regulation 49 CFR 393.60. It cares about a specific zone of your windshield — often called the critical vision area. Roughly speaking, that's the swept area of glass above the top of the steering wheel, minus a couple inches at the top edge and an inch at each side. Inside that zone, the windshield has to be free of discoloration and damage, with a few narrow exceptions:",
      },
      {
        type: "ul",
        items: [
          "A crack no wider than a quarter inch is allowed, as long as no other crack intersects it.",
          "A damaged area — like a stone chip — is allowed if it's smaller than about three-quarters of an inch across and at least three inches from any other damage.",
          "Legally required stickers and decals are fine in their designated spots.",
        ],
      },
      {
        type: "p",
        text: "Read that list again and notice how tight it is. One chip the size of a dime is legal. Two chips close together, a crack that forks, or a crack wide enough to catch a fingernail in your line of sight — those can all be written up. And a windshield violation isn't just a fix-it ticket: it's a mark on the carrier's inspection record, and in bad cases it can put the truck out of service until the glass is dealt with.",
      },
      {
        type: "h2",
        text: "Why chips are a ticking clock on a truck",
      },
      {
        type: "p",
        text: "Here's what makes this a bigger deal for trucks than for cars: a truck windshield lives a hard life. Hundreds of highway miles a day, constant vibration, engine heat below and sun above. A chip that might sit quietly on a commuter car for months can run into a long crack on a working truck in a week. The rule above doesn't care that the crack was small last Tuesday — it cares what the inspector sees today.",
      },
      {
        type: "callout",
        text: "Not sure if the damage on your glass would pass? Text us a photo of the chip or crack and we'll give you an honest read on it.",
        cta: { label: "Send Us a Photo", href: "/contact" },
      },
      {
        type: "h2",
        text: "Repair early, inspect boring",
      },
      {
        type: "p",
        text: "The cheapest compliance strategy is simple: seal chips while they're still chips. A resin repair stops the damage from spreading, restores the structural bond of the glass, and takes about 30 minutes — done at your yard or terminal, so the truck doesn't lose a route over it. Compare that to the alternative: a spreading crack, a roadside write-up, and an unplanned replacement with the truck parked while you wait on glass.",
      },
      {
        type: "p",
        text: "For owner-operators, that's your CSA score and your schedule you're protecting. For fleet managers, it's a yard's worth of windshields — which is exactly why we run recurring fleet visits with volume pricing that starts at $50 a repair and steps down from there. Either way, the playbook is the same: walk your glass regularly, tape fresh chips, and get them sealed before the highway finishes the job.",
      },
      {
        type: "callout",
        text: "We come to yards, terminals, and job sites across Little Rock and Central Arkansas. Keep your glass legal without parking a truck.",
        cta: { label: "Request Service", href: "/contact" },
      },
    ],
  },
  {
    slug: "arkansas-summer-heat-windshield-cracks",
    title: "Why Arkansas Summer Heat Turns Chips Into Cracks",
    description:
      "Arkansas summer heat is the number one reason small windshield chips suddenly split into long cracks. Here's the science — and how to protect your glass.",
    excerpt:
      "That chip survived all spring — then split across your windshield in one July afternoon. Here's what the heat is doing to your glass.",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Every July and August, the same story plays out across Central Arkansas: a driver has been living with a little rock chip for months, no problem — then one blazing afternoon they come back to their car and the chip has run into a crack halfway across the windshield. It feels random. It isn't. Summer is peak season for chip-to-crack failures, and once you understand why, the way to protect your glass becomes obvious.",
      },
      {
        type: "h2",
        text: "What heat actually does to a chipped windshield",
      },
      {
        type: "p",
        text: "Glass expands when it heats up and shrinks when it cools. On a healthy windshield, that expansion happens evenly and nothing notices. But a chip is a stress concentrator — a flaw where all that expansion force gathers at a few microscopic crack tips. Park your car in a July parking lot and the glass surface can climb past 130 degrees. The outer layer of glass is now expanded and under load, and the chip is the weakest point in the whole sheet.",
      },
      {
        type: "p",
        text: "Then comes the trigger: sudden cooling. You start the car and hit max AC. A pop-up afternoon thunderstorm — an Arkansas specialty — drops cool rain on baking glass. The surface shrinks fast while the layers beneath are still hot, the stress at the chip spikes, and the crack runs. That's why these failures so often happen in the first minute of a drive or during a summer storm.",
      },
      {
        type: "h2",
        text: "How to protect a chip you haven't fixed yet",
      },
      {
        type: "ul",
        items: [
          "Park in shade or a garage whenever you can — glass that never bakes never gets the stress spike.",
          "Cool the cabin gradually: start the AC low and aim vents away from the windshield for the first few minutes.",
          "Skip car washes until the chip is sealed — cold high-pressure water on hot glass is the exact trigger you're avoiding.",
          "Put a piece of clear tape over the chip to keep dirt and moisture out until it's repaired.",
        ],
      },
      {
        type: "p",
        text: "Those habits buy you time — but they're a holding pattern, not a fix. Every hot-cold cycle is another pull on the crack tips, and you only need one bad one.",
      },
      {
        type: "h2",
        text: "A sealed chip doesn't care how hot it gets",
      },
      {
        type: "p",
        text: "This is the whole point of resin repair: the injected resin fills the break, cures solid, and bonds the glass back into a single continuous layer. There's no longer a void concentrating stress, so the daily bake-and-cool cycle passes through the repaired spot the way it passes through the rest of the windshield — harmlessly. A 30-minute repair takes the chip off the summer's target list permanently, and ours are backed by a 3-year warranty.",
      },
      {
        type: "p",
        text: "The repair math in summer is unforgiving. A chip today is a $65–$85 fix, or free with most comprehensive insurance. The same chip after one hot afternoon can be an 18-inch-plus crack that no one can repair — only replace. In July, \"I'll deal with it next month\" is the most expensive sentence in Arkansas.",
      },
      {
        type: "callout",
        text: "Got a chip riding out this heat wave? We'll come seal it at your home or office, same day when we can — anywhere in Little Rock and Central Arkansas.",
        cta: { label: "Request Service", href: "/contact" },
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
