"use client";

import Link from "next/link";
import { GoHome, GoHeart, GoStack } from "react-icons/go";
import Search from "./Search";

export default function Navigation() {
  return (
    <div
      className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 rounded-t-lg border border-inherit bottom-0 left-1/2 bg-black/60 backdrop-blur-lg overflow-hidden transition-transform duration-300"
    >
      <div className="grid grid-cols-4 items-center w-full h-full justify-center">
        
        {/* Home */}
        <Link href="/reactflix" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoHome size={25} />
            <span className="text-xs text-slate-400">Home</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
          <Search size={25} />
          <span className="text-xs text-slate-400">Search</span>
        </div>

        {/* Discover */}
        <Link href="/reactflix/discover" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoStack size={25} />
            <span className="text-xs text-slate-400">Discover</span>
          </div>
        </Link>

        {/* Favorite */}
        <Link href="/reactflix/watchlist" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoHeart size={25} />
            <span className="text-xs text-slate-400">Favorite</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
