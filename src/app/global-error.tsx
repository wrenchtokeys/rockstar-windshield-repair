"use client";

// Last-resort boundary for errors thrown in the root layout itself, where
// error.tsx can't catch. Must render its own <html>/<body>. Kept
// dependency-free (inline styles, no Tailwind) because the layout — and
// therefore the stylesheet — may be what failed.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 16px" }}>
          <h1 style={{ color: "#ffffff", fontSize: 20 }}>
            Something went sideways
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.6 }}>
            Sorry about that — a quick reload usually fixes it.
          </p>
          <button
            onClick={() => (reset(), window.location.reload())}
            style={{
              marginTop: 16,
              padding: "12px 28px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
