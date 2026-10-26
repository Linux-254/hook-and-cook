import React from "react";
import { MenuItem } from "../config/menu";

interface EditorialMenuRowProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const EditorialMenuRow: React.FC<EditorialMenuRowProps> = ({ item, onSelect }) => {
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
      className="group py-3.5 px-3 -mx-3 rounded hover:bg-[#1F2022]/70 cursor-pointer transition-colors flex flex-col gap-1 focus:outline-none focus:bg-[#1F2022]"
    >
      <div className="flex items-baseline justify-between gap-3 w-full">
        {/* Item Name + Leaf Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-['Playfair_Display'] text-base sm:text-lg font-medium text-[#F5F1E8] group-hover:text-[#D4AF37] transition-colors">
            {item.name}
          </span>
          {item.isVegetarian && (
            <span className="text-[#C5A059] shrink-0" title="Vegetarian">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </span>
          )}
        </div>

        {/* Dotted Gold Leader Line */}
        <div className="flex-1 border-b border-dotted border-[#C5A059]/30 mx-1 mb-1" />

        {/* Price & Order Action */}
        <div className="flex items-baseline gap-3 shrink-0">
          <span className="price-tag text-sm font-semibold">
            {isAskStaff ? "Ask staff" : `KES ${item.price?.toLocaleString()}`}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-['Cinzel'] tracking-wider uppercase text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
            + Add
          </span>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-[#A8A29E] font-['Inter'] line-clamp-1 max-w-xl pr-8">
          {item.description}
        </p>
      )}
    </div>
  );
};
