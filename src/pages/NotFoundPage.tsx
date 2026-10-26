import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.config";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#18191A] text-[#F5F1E8] px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6 bg-[#1F2022] border border-[#C5A059]/30 p-8 rounded-lg">
        <div className="p-2 w-16 h-16 mx-auto rounded-full border border-[#C5A059]/40 bg-[#18191A] flex items-center justify-center">
          <img
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="space-y-2">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Page Not Found · 404
          </span>
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
            This Table Doesn't Exist
          </h1>
          <p className="text-xs text-[#A8A29E] font-['Inter'] leading-relaxed">
            The page you are looking for may have been moved or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/menu"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded"
          >
            Go to Menu
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F5F1E8] bg-[#18191A] hover:bg-[#282A2D] border border-white/10 rounded"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};
