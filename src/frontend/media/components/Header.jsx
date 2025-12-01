"use client";

import React from "react";
import Search from "./Search";
import { GoHeart, GoStack } from "react-icons/go";
import Link from "next/link";
import logo from "../assets/logoflix.svg";

const Header = () => {
  return (
    <div className="border-b justify-normal lg:justify-between gap-4 fixed z-50 top-0 left-0 w-full bg-zinc-950/40 backdrop-blur-lg px-5 py-1 flex items-center h-[50px]">
      
      {/* LOGO */}
      <Link href="/reactflix">
        <div>
          <img className="h-8 py-1" src={logo} alt="Rflix Logo" />
        </div>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 justify-end w-full">

        {/* DISCOVER */}
        <Link href="/reactflix/discover">
          <div className="hidden lg:block cursor-pointer">
            <GoStack size={20} />
          </div>
        </Link>

        {/* SEARCH */}
        <Search size={20} />

        {/* WATCHLIST */}
        <Link href="/reactflix/watchlist">
          <div className="text-white transition-colors px-5 py-1 border border-zinc-500 rounded-full hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:border-none cursor-pointer">
            <GoHeart size={20} />
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Header;
