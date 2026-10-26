import React, { useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { useOpenNow } from "../hooks/useOpenNow";

export const Footer: React.FC = () => {
  const { statusText } = useOpenNow();
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <footer className="bg-[#141516] border-t border-[#C5A059]/20 text-[#F5F1E8] pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                className="w-10 h-10 object-contain rounded-full border border-[#C5A059]/40"
              />
              <div>
                <h3 className="font-['Cinzel'] text-xl font-bold tracking-[0.2em] text-[#F5F1E8]">
                  HOOK &amp; COOK
                </h3>
                <p className="font-['Cinzel'] text-xs tracking-[0.25em] text-[#C5A059]">
                  BAR &amp; RESTAURANT · NAIROBI
                </p>
              </div>
            </div>
            <p className="text-sm text-[#A8A29E] max-w-md font-['Inter'] leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5A059] font-medium pt-1">
              <span>{statusText}</span>
              <span aria-hidden="true">·</span>
              <span>{siteConfig.hours}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold tracking-widest text-[#C5A059] uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A29E]">
              <li>
                <Link to="/menu" className="hover:text-[#F5F1E8] transition-colors">
                  Digital Menu &amp; Prices
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-[#F5F1E8] transition-colors">
                  Online Ordering
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F5F1E8] transition-colors">
                  About Hook &amp; Cook
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#F5F1E8] transition-colors">
                  Pool Table &amp; Sports
                </Link>
              </li>
              <li>
                <Link to="/qr" className="hover:text-[#F5F1E8] transition-colors">
                  Print Table QR Tents
                </Link>
              </li>
              <li>
                <Link to="/info" className="hover:text-[#F5F1E8] transition-colors">
                  Hours &amp; Location Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold tracking-widest text-[#C5A059] uppercase">
              Location &amp; Inquiries
            </h4>
            <div className="text-sm text-[#A8A29E] space-y-1">
              <p>{siteConfig.address}</p>
              <p className="text-xs text-[#C5A059]/80 font-mono">[{siteConfig.addressNote}]</p>
              <p className="pt-2">
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="text-[#F5F1E8] hover:text-[#C5A059] font-semibold transition-colors"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#1F2022] hover:bg-[#282A2D] text-[#C5A059] border border-[#C5A059]/30 transition-colors"
              >
                Google Maps
              </a>
              <a
                href={siteConfig.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#1F2022] hover:bg-[#282A2D] text-[#C5A059] border border-[#C5A059]/30 transition-colors"
              >
                Waze
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Mandatory Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A29E]">
          <p>© {new Date().getFullYear()} Hook and Cook Bar and Restaurant. All rights reserved.</p>

          <p className="text-[11px] text-[#A8A29E]/80 tracking-wide">
            {siteConfig.disclaimers.illustrativeImages}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveModal("privacy")}
              className="hover:text-[#F5F1E8] transition-colors underline underline-offset-4"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModal("terms")}
              className="hover:text-[#F5F1E8] transition-colors underline underline-offset-4"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Modals for Privacy and Terms */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg max-w-lg w-full p-6 text-left relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-['Cinzel'] text-lg font-bold text-[#D4AF37]">
                {activeModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#A8A29E] hover:text-[#F5F1E8] p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-[#A8A29E] space-y-3 font-['Inter'] leading-relaxed">
              <div className="p-3 bg-[#18191A] border border-[#C5A059]/20 rounded text-xs text-[#C5A059]">
                <strong>Notice:</strong> This policy is currently staged for Hook &amp; Cook Bar &amp;
                Restaurant, Nairobi. Formal legal review is scheduled prior to final production release.
              </div>
              {activeModal === "privacy" ? (
                <>
                  <p>
                    Hook &amp; Cook respects your privacy. When using our digital ordering system or
                    scanning our table QR codes, we process only the information required to fulfill your order
                    (your name, phone number, and table number or delivery address).
                  </p>
                  <p>
                    Orders are transmitted securely directly to our WhatsApp service. We do not sell or share
                    personal customer data with third-party advertisers.
                  </p>
                  <p>
                    Contact us at {siteConfig.phoneDisplay} for any inquiries regarding your data.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All orders submitted via our digital menu are fulfilled by Hook &amp; Cook Bar and
                    Restaurant in Nairobi.
                  </p>
                  <p>
                    Prices listed reflect current in-venue menus. Items designated as 'Ask staff' will have
                    their exact pricing confirmed upon dispatch.
                  </p>
                  <p>
                    Alcoholic beverages are served strictly to guests aged 18 and above in accordance with the
                    laws of Kenya.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18191A] bg-[#C5A059] hover:bg-[#D4AF37] rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
