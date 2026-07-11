import type { NextConfig } from "next";

// Amplify Hosting does not pass console-defined environment variables to the
// Next.js SSR runtime — it only exposes them during the build. So inline the
// server-side config at build time; Next replaces every `process.env.<KEY>`
// reference with the literal value in the bundle. All keys below are used only
// in server code (route handlers, server actions, server libs), so none are
// exposed to the browser. NEXT_PUBLIC_* vars are handled by Next automatically.
const SERVER_ENV_KEYS = [
  "CONTACT_S3_BUCKET",
  "DYNAMODB_TABLE",
  "CONTACT_FROM_EMAIL",
  "QUEUE_PASSWORD",
  "GOOGLE_PLACES_API_KEY",
  "GOOGLE_PLACE_ID",
];

const env: Record<string, string> = {};
for (const key of SERVER_ENV_KEYS) {
  const value = process.env[key];
  if (value) env[key] = value;
}

const nextConfig: NextConfig = {
  env,
};

export default nextConfig;
