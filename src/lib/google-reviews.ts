// Live Google reviews via the Places API (New). No manual copy-paste: set
// GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (server-only, no NEXT_PUBLIC_
// prefix — the key never reaches the browser) and reviews stay in sync with
// the Google Business Profile automatically.
//
//   GOOGLE_PLACES_API_KEY  → API key from a Google Cloud project with
//                            "Places API (New)" enabled and billing on.
//   GOOGLE_PLACE_ID        → this business's Place ID (see ROADMAP.md for
//                            the one-time lookup command).
//
// Note: Place Details only returns up to 5 reviews, chosen by Google as
// "most relevant" — there's no pagination. That's a Places API limit, not a
// bug here.

export interface GoogleReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface PlaceDetailsResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: Array<{
    rating: number;
    text?: { text: string };
    authorAttribution?: { displayName: string };
    relativePublishTimeDescription?: string;
  }>;
}

async function fetchPlaceDetails(): Promise<PlaceDetailsResponse | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        // NOTE: this revalidate does NOT refresh the live site. Amplify never
        // reports a prerendered page stale (x-nextjs-cache is HIT forever), so
        // the background regeneration that would re-run this fetch never fires
        // — /reviews served a 13-day-old count until 2026-08-18. What actually
        // refreshes reviews is the nightly rebuild (EventBridge schedule
        // `rswr-daily-review-refresh`); see "Three Amplify gotchas" in
        // docs/DEPLOYMENT.md. Lowering this number will not help.
        // It still bounds the build-time fetch cache Amplify restores between
        // builds, and keeps us inside the Places Enterprise SKU free tier.
        next: { revalidate: 60 * 60 },
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as PlaceDetailsResponse;
  } catch {
    return null;
  }
}

// Only reviews with written text are worth displaying as testimonials.
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const data = await fetchPlaceDetails();
  if (!data?.reviews) return [];

  return data.reviews
    .filter((review) => review.text?.text)
    .map((review) => ({
      name: review.authorAttribution?.displayName || "Google User",
      rating: review.rating,
      text: review.text!.text,
      date: review.relativePublishTimeDescription || "",
    }));
}

export async function getGoogleRatingSummary(): Promise<{
  rating: number;
  count: number;
} | null> {
  const data = await fetchPlaceDetails();
  if (!data?.rating || !data?.userRatingCount) return null;
  return { rating: data.rating, count: data.userRatingCount };
}
