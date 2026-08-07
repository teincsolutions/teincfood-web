"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <p className="text-6xl font-extrabold text-orange">404</p>
      <h1 className="text-2xl font-extrabold text-navy">Page not found</h1>
      <p className="text-navy/70">The page you are looking for does not exist.</p>
      <Link
        href="/en"
        className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-orange px-6 font-bold text-white hover:bg-orange-700"
      >
        Back to home
      </Link>
    </main>
  );
}