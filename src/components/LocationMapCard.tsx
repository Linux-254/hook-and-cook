import React from "react";
import { siteConfig } from "../config/site.config";
import { useOpenNow } from "../hooks/useOpenNow";

export const LocationMapCard: React.FC = () => {
  const { statusText } = useOpenNow();

  return (
    <div className="bg-[#1F2022] border border-[#C5A059]/25 rounded-lg overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Google Maps Iframe */}
        <div className="lg:col-span-7 relative min-h-[320px] bg-[#141516]">
          <iframe
            title="Hook and Cook Bar and Restaurant Nairobi Location Map"
            src={siteConfig.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "340px", filter: "invert(90%) hue-rotate(180deg) contrast(95%)" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full opacity-90"
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 pointer-events-none border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 shadow-inner" />
        </div>

        {/* Location & Navigation Actions */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] text-xs font-bold tracking-widest text-[#C5A059] uppercase">
                Find Us in Nairobi
              </span>
              <span className="text-xs text-[#A8A29E]">·</span>
              <span className="text-xs text-[#D4AF37] font-medium">{statusText}</span>
            </div>

            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
              Hook &amp; Cook Lounge
            </h3>

            <div className="text-sm text-[#A8A29E] space-y-2 font-['Inter']">
              <p className="text-[#F5F1E8] font-medium">{siteConfig.address}</p>
              <p className="text-xs text-[#C5A059]/90 font-mono">[{siteConfig.addressNote}]</p>
              <p className="pt-1">
                <strong>Hours:</strong> {siteConfig.hours}
              </p>
              <p className="text-xs text-[#A8A29E]">
                <strong>Parking:</strong> Ample secure on-site parking with dedicated security staff.
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-11 px-3 text-xs font-semibold text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] rounded transition-all shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Google Maps</span>
              </a>

              <a
                href={siteConfig.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-11 px-3 text-xs font-semibold text-[#F5F1E8] bg-[#282A2D] hover:bg-[#323539] active:scale-[0.98] border border-[#C5A059]/30 rounded transition-all"
              >
                <span>Waze</span>
              </a>
            </div>

            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 text-xs font-semibold text-[#C5A059] hover:text-[#D4AF37] bg-[#18191A] hover:bg-[#141516] border border-[#C5A059]/30 rounded transition-all"
            >
              <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Call Us: {siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
