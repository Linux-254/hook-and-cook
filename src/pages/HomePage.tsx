import React, { useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { MENU_ITEMS, MenuItem } from "../config/menu";
import { useOpenNow } from "../hooks/useOpenNow";
import { useCart } from "../context/CartContext";
import { KitchenFlameAnimation } from "../components/KitchenFlameAnimation";
import { LocationMapCard } from "../components/LocationMapCard";
import { FloatingDishCard } from "../components/FloatingDishCard";
import { DishDetailSheet } from "../components/DishDetailSheet";

export const HomePage: React.FC = () => {
  const { statusText } = useOpenNow();
  const { tableLabel } = useCart();
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";
  const signatureDishes = MENU_ITEMS.filter((item) => item.isFeatured).slice(0, 6);

  return (
    <div className="space-y-0">
      {/* 1. Full-Bleed Cinematic Hero */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#18191A]">
        {/* Background Ken Burns on generated lounge scene */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_lounge_scene_1793027544373.jpg"
            alt="Warm atmospheric lounge interior at Hook & Cook Nairobi"
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_14s_ease-in-out_infinite] opacity-45"
          />
          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18191A] via-[#18191A]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#18191A_95%]" />
        </div>

        {/* Hero Centerpiece */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Seal Frame */}
          <div className="mb-6 p-2 rounded-full border border-[#C5A059]/30 bg-[#18191A]/80 backdrop-blur-md">
            <img
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full"
            />
          </div>

          {/* Subtitle / Kicker */}
          <span className="font-['Cinzel'] text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#C5A059] uppercase mb-3">
            Nairobi · Bar &amp; Restaurant
          </span>

          {/* Main Headline */}
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F5F1E8] tracking-tight max-w-4xl leading-[1.1] mb-6">
            Good food. Cold drinks. <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#D4AF37]">Late nights.</span>
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-6" />

          {/* Sensory Intro */}
          <p className="font-['Inter'] text-sm sm:text-base text-[#A8A29E] max-w-xl mx-auto mb-8 leading-relaxed">
            From sizzling wok-tossed chili paneer and crisp bhajias to simmering copper-handi curries, draught beers, and midnight championship pool.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to={`/menu${tableQuery}`}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] transition-all rounded shadow-lg"
            >
              Explore Digital Menu
            </Link>
            <Link
              to={`/order${tableQuery}`}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#F5F1E8] bg-[#1F2022] hover:bg-[#282A2D] active:scale-[0.98] border border-[#C5A059]/40 transition-all rounded"
            >
              Order Online / Table
            </Link>
          </div>

          {/* Live Hours Status Line */}
          <div className="mt-10 flex items-center gap-2 text-xs text-[#A8A29E]">
            <span className="w-2 h-2 rounded-full bg-[#E58E26] animate-pulse" />
            <span className="text-[#C5A059] font-medium">{statusText}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.hours}</span>
          </div>
        </div>

        {/* Scroll indicator hairline */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-['Cinzel'] tracking-widest text-[#C5A059]/60">
          <span>SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#C5A059] to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2. Signature Dishes Story */}
      <section className="py-24 bg-[#18191A] relative border-t border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              Culinary Signatures
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F1E8]">
              Plated for the Night
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-[#C5A059] to-transparent mx-auto" />
            <p className="font-['Inter'] text-sm text-[#A8A29E]">
              Every dish is crafted fresh to order. Tap any plate to inspect recipe details, spice level, or send directly to the kitchen.
            </p>
          </div>

          {/* Floating Dishes Grid - 2 cols on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {signatureDishes.map((dish, idx) => (
              <FloatingDishCard
                key={dish.id}
                item={dish}
                index={idx}
                onSelect={(item) => setSelectedDish(item)}
              />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to={`/menu${tableQuery}`}
              className="inline-flex items-center gap-2 text-xs font-['Cinzel'] font-bold tracking-widest uppercase text-[#C5A059] hover:text-[#D4AF37] border-b border-[#C5A059]/40 hover:border-[#C5A059] pb-1 transition-all"
            >
              <span>View Full Menu &amp; Vegetarian Starters (25+ dishes)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Live Flame & Kitchen Animation */}
      <KitchenFlameAnimation />

      {/* 4. Cocktails & Bar Teaser */}
      <section className="py-24 bg-[#18191A] border-b border-[#C5A059]/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
                The Bar &amp; Cellar
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-semibold text-[#F5F1E8]">
                Craft Cocktails, Cold Draughts &amp; Late Pours
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#C5A059] to-transparent" />
              <p className="font-['Inter'] text-sm sm:text-base text-[#A8A29E] leading-relaxed">
                Whether you’re unwinding after work or celebrating with a group, our bartenders serve perfectly balanced cocktails, hand-cut ice, chilled draught beers, and a full spirit list.
              </p>
              <div className="space-y-2 text-xs text-[#A8A29E] font-['Inter']">
                <p>• <strong>Signature Classics:</strong> Whiskey Sour, Old Fashioned, Long Island, Cosmopolitan</p>
                <p>• <strong>Chilled Brews:</strong> Tusker, White Cap, Heineken, and seasonal draughts</p>
                <p>• <strong>Happy Hour:</strong> Daily specials and group buckets</p>
              </div>
              <div className="pt-2">
                <Link
                  to={`/menu${tableQuery}`}
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold tracking-wider uppercase text-[#18191A] bg-[#C5A059] hover:bg-[#D4AF37] transition-all rounded shadow"
                >
                  Inspect Drink List
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[#E58E26]/10 blur-3xl rounded-full" />
                <img
                  src="/src/assets/images/cocktail_whiskey_sour_1793027546581.jpg"
                  alt="Chilled Whiskey Sour cocktail with condensation droplets"
                  className="w-4/5 h-4/5 object-cover rounded-full shadow-2xl border border-[#C5A059]/40 dish-ground-shadow"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Games, Sports & Late-Night Strip */}
      <section className="py-24 bg-[#141516] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-lg overflow-hidden border border-[#C5A059]/30 shadow-2xl">
                <img
                  src="/src/assets/images/pool_table_lounge_1793027565269.jpg"
                  alt="Pool table lounge at Hook & Cook with friends enjoying evening games"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141516] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
                The Night Scene
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-semibold text-[#F5F1E8]">
                Pool, Sports &amp; Karoga Evenings
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#C5A059] to-transparent" />
              <p className="font-['Inter'] text-sm sm:text-base text-[#A8A29E] leading-relaxed">
                Stay for the game on our high-definition screens, challenge your friends on our tournament pool table, or book a Karoga private cooking social session with your group.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#1F2022] border border-[#C5A059]/20 rounded">
                  <div className="font-['Cinzel'] text-xs text-[#C5A059] font-bold">Open Late</div>
                  <div className="text-xs text-[#A8A29E] mt-1">Kitchen &amp; bar serving until 1:00 AM daily</div>
                </div>
                <div className="p-4 bg-[#1F2022] border border-[#C5A059]/20 rounded">
                  <div className="font-['Cinzel'] text-xs text-[#C5A059] font-bold">Groups &amp; Sports</div>
                  <div className="text-xs text-[#A8A29E] mt-1">Live match screenings and pool table nights</div>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to={`/events${tableQuery}`}
                  className="inline-flex items-center gap-2 text-xs font-['Cinzel'] font-bold tracking-widest uppercase text-[#C5A059] hover:text-[#D4AF37] border-b border-[#C5A059]/40 hover:border-[#C5A059] pb-1 transition-all"
                >
                  <span>Explore Lounge &amp; Entertainment Events</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Location & Hours Card */}
      <section className="py-24 bg-[#18191A] border-t border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              Visit Us Tonight
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#F5F1E8]">
              Location &amp; Table Reservations
            </h2>
          </div>

          <LocationMapCard />
        </div>
      </section>

      {/* Unconditional DishDetailSheet dialog */}
      <DishDetailSheet item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};
