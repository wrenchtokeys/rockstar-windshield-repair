export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

// Real customer reviews only. Add an entry here once a customer leaves a
// review (e.g. copied from your Google Business Profile) and it will appear
// automatically on the home page and the /reviews page.
export const REVIEWS: Review[] = [];
