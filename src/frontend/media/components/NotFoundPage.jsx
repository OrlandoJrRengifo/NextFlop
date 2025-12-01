"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-400">404</h1>
        <p className="mt-4 text-lg text-gray-200">
          Oops! The resource you are looking for doesn’t exist.
        </p>

        <Link
          href="/reactflix"
          className="mt-6 inline-block px-6 py-3 text-black bg-white hover:bg-zinc-200 rounded-md"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
