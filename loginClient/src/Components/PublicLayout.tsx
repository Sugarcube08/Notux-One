
import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar"
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add header scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 rounded-xl z-50 transition-all duration-300
          ${scrolled ? "bg-black/60 shadow-lg backdrop-blur-md" : "bg-black/30 backdrop-blur-sm"}`}
      >
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-md">
            <img src="/S.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <NavLink
            to="/"
            className="text-white md:text-4xl text-xl font-bold my-2 tracking-[0.25em]"
          >
            SUGARCODE-Z
          </NavLink>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <div className="max-w-lg">
            <Navbar />
          </div>
          <div className="flex gap-2">
            <LoginButton />
            <SignupButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden cursor-pointer text-white"
          onClick={toggleMenu}
          aria-label="Menu Toggle"
        >
          {isMenuOpen ? (
            // Close (X) icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden flex flex-col gap-4 bg-black/40 backdrop-blur-md px-6 py-6 absolute top-16 left-0 w-full z-40 shadow-lg rounded-b-xl transition-all duration-300 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <Navbar />
        <div className="flex justify-center gap-4 mt-4">
          <LoginButton />
          <SignupButton />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col ">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
