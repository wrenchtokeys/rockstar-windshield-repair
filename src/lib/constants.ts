export const BUSINESS = {
  name: "Rockstar Windshield Repair",
  tagline: "Rock-Solid Windshield Repair",
  phone: "501-282-7129",
  phoneHref: "tel:+15012827129",
  email: "drake@rockstarwindshield.repair",
  domain: "rockstarwindshield.repair",
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
    name: "Conway",
    description:
      "We regularly serve Conway and the surrounding college-town community with mobile windshield repair services.",
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

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Service Area", href: "/service-area" },
  { label: "Contact", href: "/contact" },
] as const;
