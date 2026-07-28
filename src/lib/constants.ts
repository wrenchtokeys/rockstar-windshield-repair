export const BUSINESS = {
  name: "Rockstar Windshield Repair",
  tagline: "Little Rock's Mobile Windshield Repair Pros",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "",
  phoneHref: `tel:+1${(process.env.NEXT_PUBLIC_BUSINESS_PHONE || "").replace(/\D/g, "")}`,
  // "?&body=" (not "?body=") is the one separator both iOS and Android honor.
  smsHref: `sms:+1${(process.env.NEXT_PUBLIC_BUSINESS_PHONE || "").replace(/\D/g, "")}?&body=${encodeURIComponent("Hi Rockstar! I'd like a quote — here's a photo of my windshield damage:")}`,
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "",
  domain: "rockstarwindshield.repair",
  // Google Business Profile links. Set these once the profile is live:
  //   NEXT_PUBLIC_GOOGLE_REVIEW_URL  → the "Get review link" URL from your GBP
  //   NEXT_PUBLIC_GOOGLE_PROFILE_URL → your public Google Maps/Business listing URL
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "",
  googleProfileUrl: process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL || "",
  // Social profiles. Fill these in as the accounts go live; empty values are
  // filtered out of the JSON-LD `sameAs` array so nothing broken gets published.
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  },
  address: {
    city: "Little Rock",
    state: "AR",
    stateFullName: "Arkansas",
  },
  hours: {
    weekdays: "Mon–Fri: 7:00 AM – 6:00 PM",
    saturday: "Sat: 8:00 AM – 4:00 PM",
    sunday: "Sun: Closed",
  },
  serviceArea: "Little Rock, AR and surrounding areas",
} as const;

export const SERVICE_CITIES = [
  {
    name: "Little Rock",
    description:
      "Our home base. We provide fast, mobile windshield repair throughout Little Rock, from downtown to West Little Rock and everywhere in between.",
  },
  {
    name: "North Little Rock",
    description:
      "Just across the river, we serve all of North Little Rock including Park Hill, Lakewood, and the McCain Mall area.",
  },
  {
    name: "East End",
    description:
      "We regularly serve the East End community in Saline County with fast, mobile windshield chip and crack repair — right at your home or job site, just south of Little Rock.",
  },
  {
    name: "Sheridan",
    description:
      "Grant County drivers count on Rockstar for same-day mobile windshield repair throughout Sheridan and the surrounding area — no trip into the city required.",
  },
  {
    name: "Benton",
    description:
      "Saline County residents can count on Rockstar for same-day mobile windshield repair in Benton and surrounding areas.",
  },
  {
    name: "Bryant",
    description:
      "We proudly serve Bryant and the rapidly growing communities along the I-30 corridor south of Little Rock.",
  },
  {
    name: "Jacksonville",
    description:
      "From the air force base to downtown Jacksonville, we bring professional windshield repair right to your location.",
  },
  {
    name: "Cabot",
    description:
      "Cabot and Lonoke County residents enjoy the same fast, mobile service we're known for across Central Arkansas.",
  },
  {
    name: "Sherwood",
    description:
      "Sherwood residents are just minutes from our service hub. We offer quick response times throughout the area.",
  },
  {
    name: "Maumelle",
    description:
      "We serve the Maumelle community with convenient mobile windshield repair — at your home, office, or wherever you are.",
  },
  {
    name: "Hot Springs",
    description:
      "We extend our mobile service to Hot Springs and Garland County for windshield repair and replacement needs.",
  },
] as const;

export const PRICING = {
  chipMin: 65,
  chipMax: 85,
  crack: 125,
  crackMinInches: 4,
  crackMaxInches: 18,
  // Fleet volume ladder: price per repair on the same unit, 1st through 5th.
  // After 5 repairs on one windshield we recommend replacement.
  fleetLadder: [50, 40, 35, 30, 25],
  fleetMaxRepairsPerUnit: 5,
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Service Area", href: "/service-area" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
] as const;
