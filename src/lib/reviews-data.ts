export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Marcus T.",
    rating: 5,
    text: "Had a rock chip on I-40 and called Rockstar. They came to my office parking lot the same day and fixed it in under 30 minutes. Couldn't even tell where the chip was afterwards. Highly recommend!",
    date: "2 weeks ago",
    service: "Chip Repair",
  },
  {
    name: "Sarah J.",
    rating: 5,
    text: "My windshield had a long crack that I'd been putting off. Drake came out, assessed it, and had it repaired the next morning. Professional, fast, and the price was fair. Will use again.",
    date: "1 month ago",
    service: "Crack Repair",
  },
  {
    name: "David R.",
    rating: 5,
    text: "The mobile service is a game changer. They came to my house in West Little Rock and repaired two chips while I worked from home. Zero hassle. Five stars all day.",
    date: "3 weeks ago",
    service: "Mobile Service",
  },
  {
    name: "Jennifer M.",
    rating: 5,
    text: "Rockstar handled everything with my insurance — I didn't pay a dime out of pocket for my chip repair. They made the whole process completely painless.",
    date: "1 month ago",
    service: "Insurance Claims",
  },
  {
    name: "Carlos P.",
    rating: 5,
    text: "I manage a fleet of 20 delivery vans and Rockstar has been our go-to for windshield work. They're always quick, professional, and give us great rates. Reliable every time.",
    date: "2 months ago",
    service: "Fleet & Commercial",
  },
  {
    name: "Amanda K.",
    rating: 5,
    text: "Called on a Saturday morning with a cracked windshield and they fit me in that afternoon. The repair looks perfect and they were incredibly friendly. Best service in Little Rock!",
    date: "3 weeks ago",
    service: "Crack Repair",
  },
  {
    name: "Robert H.",
    rating: 5,
    text: "Was quoted double the price by another company. Rockstar gave me a fair, honest quote and did excellent work. They've earned a customer for life.",
    date: "1 month ago",
    service: "Chip Repair",
  },
  {
    name: "Lisa W.",
    rating: 5,
    text: "Quick, professional, and affordable. Drake really knows his stuff. He explained everything about the repair process and the result was flawless.",
    date: "2 weeks ago",
    service: "Chip Repair",
  },
];
