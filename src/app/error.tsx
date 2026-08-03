"use client";

// Route-level error boundary. The main real-world trigger: a tab loaded
// before a deploy submits a form after it — the old page references a
// server action ID that no longer exists, and without this boundary the
// customer sees Next's raw "Application error" text. A full reload always
// fixes that case (fresh bundle), which is why Reload is the primary
// action rather than reset().

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h1 className="text-xl font-bold text-white">
          Something went sideways
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Sorry about that — this usually happens right after we update the
          site and clears up with a quick reload.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-500"
          >
            Reload Page
          </button>
          <button
            onClick={() => reset()}
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            Try Again
          </button>
        </div>
        <p className="mt-6 text-xs text-zinc-600">
          Still stuck? Call us at{" "}
          <a href="tel:5012827129" className="text-blue-500 hover:underline">
            501-282-7129
          </a>{" "}
          — a person answers.
        </p>
      </div>
    </div>
  );
}
