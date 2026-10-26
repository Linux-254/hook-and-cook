import React from "react";
import { MenuItem } from "../config/menu";

interface FloatingDishCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  index?: number;
}

export const FloatingDishCard: React.FC<FloatingDishCardProps> = ({ item, onSelect, index = 0 }) => {
  const isAskStaff = item.price === null || item.price === undefined;

  return (
    <div
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className={`group relative flex flex-col items-center text-center p-3 cursor-pointer select-none transition-transform duration-300 focus:outline-none ${
        index % 2 === 1 ? "sm:translate-y-4" : ""
      }`}
    >
      {/* Floating Plate / Glass Container (NO BOXED CARD OR BACKGROUND BORDER) */}
      <div className="relative w-full max-w-[220px] aspect-square flex items-center justify-center mb-3">
        {/* Soft elliptical ground shadow beneath */}
        <div className="absolute -bottom-2 w-3/4 h-5 rounded-[100%] bg-black/85 blur-md pointer-events-none group-hover:scale-90 group-hover:blur-lg transition-all duration-300" />

        {/* Amber back-glow on hover */}
        <div className="absolute inset-0 rounded-full bg-[#E58E26]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating plate image with transform lift and rotation */}
        {item.image ? (
          <img
            src={item.image}
            alt={item.imageAlt || item.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-full shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-2 group-hover:scale-105 group-active:scale-95"
            style={{
              filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.85)) drop-shadow(0 0 16px rgba(184,93,52,0.12))",
            }}
          />
        ) : (
          <div
            className="w-full h-full rounded-full bg-gradient-to-tr from-[#141516] to-[#242629] border border-[#C5A059]/30 flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-2"
          >
            {item.isVegetarian ? (
              <svg className="w-10 h-10 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            ) : (
              <span className="font-['Cinzel'] text-xs font-bold text-[#C5A059] tracking-widest">
                H&amp;C
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dish Name */}
      <div className="flex items-center justify-center gap-1.5 w-full">
        <h4 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[#F5F1E8] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
          {item.name}
        </h4>
        {item.isVegetarian && (
          <span className="text-[#C5A059] shrink-0" title="Vegetarian">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
          </span>
        )}
      </div>

      {/* Description clamp */}
      {item.description && (
        <p className="font-['Inter'] text-xs text-[#A8A29E] line-clamp-2 mt-1 leading-snug max-w-xs">
          {item.description}
        </p>
      )}

      {/* Gold Price in Small Caps */}
      <div className="mt-2 text-sm font-semibold price-tag">
        {isAskStaff ? "Ask staff" : `KES ${item.price?.toLocaleString()}`}
      </div>

      {/* Quiet Action Text */}
      <span className="mt-2 text-[11px] font-['Cinzel'] tracking-wider uppercase text-[#C5A059] opacity-80 group-hover:opacity-100 group-hover:underline underline-offset-4 transition-all">
        Order this →
      </span>
    </div>
  );
};
