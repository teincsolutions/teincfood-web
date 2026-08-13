"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
          <AlertTriangle size={48} className="text-orange" aria-hidden />
          <h1 className="text-2xl font-extrabold text-navy">
            Something went wrong
          </h1>
          <p className="text-navy/70">
            We could not load this application. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[48px] items-center rounded-full bg-orange px-6 font-bold text-white hover:bg-orange-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}