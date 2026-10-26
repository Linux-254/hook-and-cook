import React, { useState, useMemo } from "react";
import { MENU_CATEGORIES, MENU_ITEMS, TODAY_SPECIALS, MenuItem } from "../config/menu";
import { useCart } from "../context/CartContext";
import { FloatingDishCard } from "../components/FloatingDishCard";
import { EditorialMenuRow } from "../components/EditorialMenuRow";
import { DishDetailSheet } from "../components/DishDetailSheet";
import { DiningModeSwitcher } from "../components/DiningModeSwitcher";

export const MenuPage: React.FC = () => {
  const { tableLabel } = useCart();
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);

  // Filter items based on category, search query, and vegetarian filter
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !vegetarianOnly || item.isVegetarian;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [activeCategory, searchQuery, vegetarianOnly]);

  // Separate featured items with imagery from editorial list items
  const featuredDishes = useMemo(() => {
    return filteredItems.filter((i) => i.isFeatured && i.image);
  }, [filteredItems]);

  const regularDishes = useMemo(() => {
    return filteredItems.filter((i) => !i.isFeatured || !i.image);
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] pb-28 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Dining Mode Switcher */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              Hook &amp; Cook Kitchen &amp; Bar
            </span>
            {tableLabel && (
              <span className="text-xs px-2 py-0.5 rounded bg-[#1F2022] text-[#D4AF37] border border-[#C5A059]/40 font-semibold">
                Table {tableLabel}
              </span>
            )}
          </div>

          <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold text-[#F5F1E8]">
            Digital Dining Menu
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />

          {/* Dining Mode Switcher */}
          <DiningModeSwitcher />

          {/* Vegetarian Legend & Price Confidence Notice */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#A8A29E] pt-2">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
              <span>Leaf icon indicates vegetarian selection</span>
            </div>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Unpriced dishes show 'Ask staff' and are confirmed upon dispatch</span>
          </div>
        </div>

        {/* Today's Specials Banner (Only if populated) */}
        {TODAY_SPECIALS.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-[#B85D34]/20 via-[#E58E26]/20 to-transparent border border-[#C5A059]/40 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Today's Specials:
              </span>
              <span className="text-xs text-[#F5F1E8]">
                {TODAY_SPECIALS.map((s) => s.name).join(", ")}
              </span>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="sticky top-18 z-30 bg-[#18191A]/95 backdrop-blur-md py-3 border-y border-[#C5A059]/20 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Live Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chips, paneer, curry, cocktails..."
                className="w-full bg-[#1F2022] border border-[#C5A059]/30 rounded px-3.5 py-2 pl-9 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/60 focus:outline-none focus:border-[#C5A059]"
              />
              <svg
                className="w-4 h-4 text-[#C5A059] absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-[#A8A29E] hover:text-[#F5F1E8]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Nav with Horizontal Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full py-1">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 focus:outline-none ${
                  activeCategory === "all"
                    ? "bg-[#C5A059] text-[#18191A]"
                    : "text-[#A8A29E] hover:text-[#F5F1E8] bg-[#1F2022]"
                }`}
              >
                All Items ({MENU_ITEMS.length})
              </button>

              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 focus:outline-none ${
                    activeCategory === cat.id
                      ? "bg-[#C5A059] text-[#18191A]"
                      : "text-[#A8A29E] hover:text-[#F5F1E8] bg-[#1F2022]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              {/* Vegetarian Toggle Button */}
              <button
                type="button"
                onClick={() => setVegetarianOnly(!vegetarianOnly)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 focus:outline-none ${
                  vegetarianOnly
                    ? "bg-[#2E7D32] text-white"
                    : "text-[#C5A059] bg-[#1F2022] border border-[#C5A059]/30"
                }`}
              >
                <span>Veg Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <p className="font-['Playfair_Display'] text-xl text-[#F5F1E8]">No dishes found</p>
            <p className="text-xs text-[#A8A29E]">Try adjusting your search query or category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setVegetarianOnly(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#18191A] bg-[#C5A059] rounded"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* SECTION 1: Featured Dishes with Floating Plating (Exactly 2 items per row on mobile 360/390px, 3 on desktop) */}
        {featuredDishes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#C5A059]/20">
              <h2 className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                Featured Signatures
              </h2>
              <span className="text-xs text-[#A8A29E]">Floating Plating</span>
            </div>

            {/* Exactly two columns on mobile < 768px (gap 3.5 = 14px), 3 columns on 1024px+ */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-8">
              {featuredDishes.map((dish, idx) => (
                <FloatingDishCard
                  key={dish.id}
                  item={dish}
                  index={idx}
                  onSelect={(item) => setSelectedDish(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Refined Editorial Menu List (Dotted leader lines, item names, gold prices) */}
        {regularDishes.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#C5A059]/20">
              <h2 className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                {activeCategory === "all" ? "Complete Selection & Starters" : "Category Items"}
              </h2>
              <span className="text-xs text-[#A8A29E]">{regularDishes.length} items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {regularDishes.map((dish) => (
                <EditorialMenuRow
                  key={dish.id}
                  item={dish}
                  onSelect={(item) => setSelectedDish(item)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unconditional DishDetailSheet dialog */}
      <DishDetailSheet item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};
