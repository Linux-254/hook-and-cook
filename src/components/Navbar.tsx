import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { useCart } from "../context/CartContext";
import { useOpenNow } from "../hooks/useOpenNow";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, tableLabel } = useCart();
  const { statusText } = useOpenNow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Append ?table= if present
  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  return (
    <header className="sticky top-0 z-50 bg-[#18191A]/95 backdrop-blur-md border-b border-[#C5A059]/20 transition-all duration-200">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Single Element Wordmark & Logo */}
        <Link
          to={`/${tableQuery}`}
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059]"
        >
          <img
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            className="w-9 h-9 object-contain rounded-full border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-colors"
          />
          <div className="flex flex-col">
            <span className="font-['Cinzel'] text-lg font-bold tracking-[0.2em] text-[#F5F1E8] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              HOOK &amp; COOK
            </span>
            <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] text-[#C5A059] -mt-0.5">
              BAR &amp; RESTAURANT
            </span>
          </div>
        </Link>

        {/* Zone 2: 4-5 Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to={`/menu${tableQuery}`}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
              isActive("/menu") ? "text-[#C5A059] font-semibold" : "text-[#F5F1E8]/80"
            }`}
          >
            Digital Menu
          </Link>
          <Link
            to={`/about${tableQuery}`}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
              isActive("/about") ? "text-[#C5A059] font-semibold" : "text-[#F5F1E8]/80"
            }`}
          >
            Our Story
          </Link>
          <Link
            to={`/events${tableQuery}`}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
              isActive("/events") ? "text-[#C5A059] font-semibold" : "text-[#F5F1E8]/80"
            }`}
          >
            Sports &amp; Lounge
          </Link>
          <Link
            to={`/info${tableQuery}`}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
              isActive("/info") ? "text-[#C5A059] font-semibold" : "text-[#F5F1E8]/80"
            }`}
          >
            Hours &amp; Location
          </Link>
          <Link
            to={`/qr${tableQuery}`}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
              isActive("/qr") ? "text-[#C5A059] font-semibold" : "text-[#F5F1E8]/80"
            }`}
          >
            Table QR
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action + Table and Cart indicators */}
        <div className="flex items-center gap-4 shrink-0">
          {tableLabel && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#D4AF37] bg-[#1F2022] border border-[#C5A059]/40 rounded whitespace-nowrap">
              Table {tableLabel}
            </span>
          )}

          <Link
            to={`/order${tableQuery}`}
            className="flex items-center gap-2 text-sm font-medium text-[#F5F1E8] hover:text-[#D4AF37] transition-colors py-2 px-3 rounded hover:bg-[#1F2022]"
            aria-label={`View order cart with ${totalQuantity} items`}
          >
            <span className="font-['Cinzel'] tracking-wide">Cart</span>
            {totalQuantity > 0 ? (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#C5A059] text-[#18191A]">
                {totalQuantity}
              </span>
            ) : (
              <span className="text-xs text-[#A8A29E]">(0)</span>
            )}
          </Link>

          <Link
            to={`/order${tableQuery}`}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] transition-all rounded"
          >
            Order Now
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F5F1E8] hover:text-[#C5A059] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.75"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1F2022] border-b border-[#C5A059]/20 px-6 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs text-[#C5A059]">{statusText}</span>
            {tableLabel && (
              <span className="text-xs text-[#D4AF37] font-semibold">Active: Table {tableLabel}</span>
            )}
          </div>
          <Link
            to={`/menu${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Digital Menu
          </Link>
          <Link
            to={`/order${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Order &amp; Checkout {totalQuantity > 0 && `(${totalQuantity})`}
          </Link>
          <Link
            to={`/about${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Our Story
          </Link>
          <Link
            to={`/events${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Sports &amp; Lounge
          </Link>
          <Link
            to={`/info${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Hours &amp; Location
          </Link>
          <Link
            to={`/qr${tableQuery}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#F5F1E8] hover:text-[#C5A059]"
          >
            Table QR Generator
          </Link>
        </div>
      )}
    </header>
  );
};
