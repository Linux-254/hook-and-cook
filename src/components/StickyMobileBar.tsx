import React from "react";
import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "../config/site.config";
import { useCart } from "../context/CartContext";

export const StickyMobileBar: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, quote, tableLabel } = useCart();

  // If already on checkout page, keep clean or render quiet call CTA
  const isOrderPage = location.pathname === "/order" || location.pathname === "/order/confirmed";
  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#18191A]/95 backdrop-blur-lg border-t border-[#C5A059]/25 px-4 py-2.5 shadow-2xl pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Direct Call Button */}
        <a
          href={`tel:${siteConfig.phoneTel}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-3 text-xs font-semibold text-[#F5F1E8] bg-[#1F2022] hover:bg-[#282A2D] active:scale-[0.98] border border-[#C5A059]/30 rounded transition-all focus:outline-none"
        >
          <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span>Call Us</span>
        </a>

        {/* Primary Order Action */}
        {!isOrderPage ? (
          <Link
            to={`/order${tableQuery}`}
            className="flex-2 flex items-center justify-between h-11 px-4 text-xs font-bold text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] rounded transition-all shadow-md focus:outline-none"
          >
            <span>{totalQuantity > 0 ? `Order (${totalQuantity})` : "Start Order"}</span>
            {quote.subtotal > 0 && (
              <span className="font-mono text-xs">KES {quote.subtotal.toLocaleString()}</span>
            )}
          </Link>
        ) : (
          <Link
            to={`/menu${tableQuery}`}
            className="flex-2 flex items-center justify-center h-11 px-4 text-xs font-bold text-[#F5F1E8] bg-[#1F2022] hover:bg-[#282A2D] active:scale-[0.98] border border-[#C5A059]/40 rounded transition-all focus:outline-none"
          >
            <span>+ Add More Items</span>
          </Link>
        )}
      </div>
    </aside>
  );
};
