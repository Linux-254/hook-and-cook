import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { useCart } from "../context/CartContext";

export interface LoungeActivity {
  id: string;
  title: string;
  schedule: string;
  description: string;
  highlight: string;
}

const ACTIVITIES: LoungeActivity[] = [
  {
    id: "sports-viewing",
    title: "Live Sports & Match Screenings",
    schedule: "Matchdays & Weekends",
    description: "Catch Premier League, Champions League, Formula 1, and major rugby tournaments on multiple high-definition screens across the lounge.",
    highlight: "Cold beer buckets & match-day sharing platters",
  },
  {
    id: "pool-table",
    title: "Championship Pool Table",
    schedule: "Daily from 11:00 AM – 1:00 AM",
    description: "Challenge friends or participate in casual evening games on our full-size championship green-felt billiard table.",
    highlight: "Complimentary play with table food & beverage orders",
  },
  {
    id: "karoga-experience",
    title: "Karoga Group Experience",
    schedule: "By advance inquiry & weekend evenings",
    description: "Enjoy Nairobi's beloved Karoga tradition: communal cooking and social dining in our dedicated lounge area with fresh marinades and ingredients provided.",
    highlight: "[TODO: Owner to confirm exact Karoga booking requirements & packages]",
  },
  {
    id: "happy-hour",
    title: "Sunset Happy Hour",
    schedule: "Daily 4:00 PM – 7:00 PM",
    description: "Special pricing on signature cocktails including Whiskey Sour, Old Fashioned, Mojito, and select draught beers.",
    highlight: "Happy hour drink specials & complimentary bar crisps",
  },
];

export const EventsPage: React.FC = () => {
  const { tableLabel } = useCart();
  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-16 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Entertainment &amp; Social Lounge
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#F5F1E8]">
            Sports, Pool &amp; Karoga
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
          <p className="text-xs text-[#A8A29E] font-['Inter'] max-w-lg mx-auto">
            Hook &amp; Cook brings together great food, sports entertainment, and relaxing late-night vibes in Nairobi.
          </p>
        </div>

        {/* Lounge Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="bg-[#1F2022] border border-[#C5A059]/25 rounded-lg p-6 space-y-4 hover:border-[#C5A059]/50 transition-colors"
            >
              <div className="space-y-1">
                <span className="font-['Cinzel'] text-[11px] font-bold text-[#C5A059] tracking-wider uppercase">
                  {act.schedule}
                </span>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
                  {act.title}
                </h2>
              </div>

              <p className="text-xs text-[#A8A29E] font-['Inter'] leading-relaxed">
                {act.description}
              </p>

              <div className="p-3 bg-[#18191A] border border-[#C5A059]/20 rounded text-xs text-[#D4AF37] font-medium">
                {act.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Feature Strip */}
        <div className="relative rounded-xl overflow-hidden border border-[#C5A059]/30 shadow-2xl">
          <img
            src="/src/assets/images/pool_table_lounge_1793027565269.jpg"
            alt="Pool table and sports viewing area"
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18191A] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-['Cinzel'] text-xs font-bold text-[#C5A059] uppercase tracking-widest">
                Evenings at Hook &amp; Cook
              </p>
              <p className="font-['Playfair_Display'] text-xl font-bold text-[#F5F1E8]">
                Open every day until 1:00 AM
              </p>
            </div>
            <Link
              to={`/menu${tableQuery}`}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-[#C5A059] hover:bg-[#D4AF37] rounded"
            >
              Order for Your Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
