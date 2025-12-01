
"use client";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-6 text-center">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
