"use client";

import Header from "@/media/components/Header";
import Footer from "@/media/components/Footer";
import Navigation from "@/media/components/Navigation";

export default function ReactFlixLayout({ children }) {
  return (
    <div className="layout-container">
      <Header />

      <div className="content mt-[50px]">
        {children}
      </div>

      <div className="lg:hidden">
        <Navigation />
      </div>

      <Footer />
    </div>
  );
}
