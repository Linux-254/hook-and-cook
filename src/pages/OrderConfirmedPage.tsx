import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { siteConfig } from "../config/site.config";
import { getWhatsAppOrderUrl, formatWhatsAppOrderMessage } from "../hooks/useWhatsAppOrder";

export const OrderConfirmedPage: React.FC = () => {
  const { lastConfirmedOrder, tableLabel } = useCart();
  const [waOpened, setWaOpened] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  // Automatic attempt on arrival (safe timeout so navigate tick is completely finished)
  useEffect(() => {
    if (!lastConfirmedOrder) return;

    const timer = setTimeout(() => {
      try {
        const url = getWhatsAppOrderUrl(lastConfirmedOrder);
        // Prompt user or trigger window opening
        setWaOpened(true);
      } catch {
        // Handled via manual button
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [lastConfirmedOrder]);

  if (!lastConfirmedOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#18191A] px-4 py-16 text-center">
        <div className="max-w-md w-full space-y-4 bg-[#1F2022] border border-[#C5A059]/30 p-8 rounded-lg">
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
            No Active Order Found
          </h1>
          <p className="text-xs text-[#A8A29E] font-['Inter']">
            Your cart is currently empty or your session was completed.
          </p>
          <Link
            to={`/menu${tableQuery}`}
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-[#C5A059] rounded"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  const { orderId, customer, quote, diningMode, paymentStatus, mpesaReceiptNumber } = lastConfirmedOrder;
  const whatsappUrl = getWhatsAppOrderUrl(lastConfirmedOrder);
  const rawMessageText = formatWhatsAppOrderMessage(lastConfirmedOrder);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMessageText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-12 pb-28">
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/40 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Order Prepared For Dispatch
          </span>

          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
            Order #{orderId}
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
        </div>

        {/* PRIMARY CALL TO ACTION: Send to Kitchen on WhatsApp */}
        <div className="bg-[#1F2022] border-2 border-[#C5A059] rounded-xl p-6 text-center space-y-4 shadow-2xl">
          <div className="space-y-1">
            <h2 className="font-['Cinzel'] text-base font-bold text-[#D4AF37]">
              Step 2: Dispatch to Kitchen
            </h2>
            <p className="text-xs text-[#A8A29E] font-['Inter']">
              Tap the button below to send this order directly to Hook &amp; Cook kitchen staff on WhatsApp.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-14 px-6 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] rounded-lg transition-all shadow-xl"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.106 8.106 0 01-1.25-4.29c0-4.48 3.65-8.13 8.14-8.13 2.17 0 4.21.85 5.75 2.38a8.093 8.093 0 012.38 5.75c0 4.49-3.66 8.15-8.13 8.15zm4.46-6.11c-.24-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.69 4.26 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.45-.59 1.66-1.17.2-.57.2-1.07.14-1.17-.06-.1-.23-.16-.48-.28z"/>
            </svg>
            <span>Send to Kitchen on WhatsApp</span>
          </a>

          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-[#A8A29E]">
            <button
              type="button"
              onClick={handleCopy}
              className="hover:text-[#F5F1E8] underline underline-offset-4"
            >
              {copySuccess ? "Order Text Copied!" : "Copy Order Text"}
            </button>
            <span aria-hidden="true">·</span>
            <span>Phone: {siteConfig.phoneDisplay}</span>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-[#1F2022] border border-[#C5A059]/25 rounded-lg p-6 space-y-4 font-['Inter'] text-xs text-[#A8A29E]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="font-['Cinzel'] font-bold uppercase text-[#C5A059]">Receipt Details</span>
            <span className="font-mono text-white">Order #{orderId}</span>
          </div>

          <div className="space-y-1.5">
            <p><strong>Customer:</strong> {customer.name} ({customer.phone})</p>
            {diningMode === "dine_in" && (
              <p><strong>Dining Mode:</strong> Dine-in (Table {customer.tableLabel})</p>
            )}
            {diningMode === "pickup" && (
              <p><strong>Dining Mode:</strong> Pickup ({customer.pickupTime})</p>
            )}
            {diningMode === "delivery" && (
              <p><strong>Delivery Address:</strong> {customer.deliveryAddress} {customer.deliveryLandmark && `(${customer.deliveryLandmark})`}</p>
            )}
            <p>
              <strong>Payment Status:</strong>{" "}
              {paymentStatus === "PAID_MPESA" ? (
                <span className="text-[#2E7D32] font-bold">PAID (M-PESA: {mpesaReceiptNumber})</span>
              ) : paymentStatus === "DEMO_SANDBOX" ? (
                <span className="text-[#D4AF37] font-bold">DEMO (sandbox simulation)</span>
              ) : (
                <span className="text-[#C5A059] font-medium">Pay at venue with staff</span>
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="block font-semibold text-[#F5F1E8]">Ordered Items:</span>
            <div className="divide-y divide-white/5">
              {quote.items.map((it) => (
                <div key={it.id} className="py-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-white font-medium">{it.quantity}x {it.name}</span>
                    {it.notes && <p className="text-[11px] text-[#C5A059]">Note: "{it.notes}"</p>}
                  </div>
                  <span className="price-tag">
                    {it.isAskStaff ? "Ask staff" : `KES ${it.lineTotal.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1 text-sm font-bold text-[#F5F1E8]">
            <div className="flex justify-between">
              <span>Grand Total:</span>
              <span className="font-mono text-[#D4AF37]">KES {quote.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="text-center pt-4">
          <Link
            to={`/menu${tableQuery}`}
            className="text-xs font-['Cinzel'] tracking-wider uppercase text-[#C5A059] hover:text-[#D4AF37]"
          >
            ← Return to Digital Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
