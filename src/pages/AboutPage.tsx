import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { useCart } from "../context/CartContext";

export const AboutPage: React.FC = () => {
  const { tableLabel } = useCart();
  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-16 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Our Story &amp; Philosophy
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#F5F1E8]">
            Hook &amp; Cook Nairobi
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
          <p className="font-['Cormorant_Garamond'] italic text-lg sm:text-xl text-[#D4AF37]">
            "Good food. Cold drinks. Late nights."
          </p>
        </div>

        {/* Narrative & Owner Note Notice */}
        <div className="space-y-8 font-['Inter'] text-sm sm:text-base text-[#A8A29E] leading-relaxed">
          <div className="p-4 bg-[#1F2022] border border-[#C5A059]/30 rounded-lg text-xs space-y-2">
            <span className="font-['Cinzel'] font-bold text-[#C5A059] uppercase">
              Brand Integrity Notice
            </span>
            <p className="text-[#A8A29E]">
              TODO: Owner to supply exact founding story, founders' notes, and history details.
              In accordance with our strict factual standard, no awards, dates, or historical claims have been invented.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
            <div className="space-y-4">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
                A Gathering Spot for Nairobi
              </h2>
              <p>
                Hook &amp; Cook Bar and Restaurant was established in Nairobi as a haven for friends, colleagues, and late-night diners who appreciate great food in an unpretentious, warm environment.
              </p>
              <p>
                From lively sports viewing and championship pool table games to relaxed evening dinners, our space is designed for long conversations, communal sharing, and memorable nights.
              </p>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-[#C5A059]/30">
              <img
                src="/src/assets/images/pool_table_lounge_1793027565269.jpg"
                alt="Hook & Cook lounge with guests playing pool"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
              The Kitchen Heritage
            </h2>
            <p>
              Our culinary style centers on high-heat wok tossing, aromatic Indian vegetarian starters, rich simmered chicken curries, coastal fish fillets, and Karoga group cooking experiences.
            </p>
            <p>
              Whether you stop in for a quick plate of sizzling masala chips and an ice-cold draught beer or settle in for an evening of sharing platters, our kitchen prepares every order fresh to order until 1:00 AM.
            </p>
          </div>

          <div className="pt-8 text-center">
            <Link
              to={`/menu${tableQuery}`}
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded shadow-lg"
            >
              Explore Our Digital Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
