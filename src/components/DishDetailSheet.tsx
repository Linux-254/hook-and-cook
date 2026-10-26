import React, { useState, useEffect, useRef } from "react";
import { MenuItem } from "../config/menu";
import { useCart } from "../context/CartContext";

interface DishDetailSheetProps {
  item: MenuItem | null;
  onClose: () => void;
}

// Inner component keyed by item.id so state resets cleanly per dish
const InnerDishDetail: React.FC<{ item: MenuItem; onClose: () => void }> = ({ item, onClose }) => {
  const { addItem, tableLabel, diningMode } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [addedToast, setAddedToast] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isAskStaff = item.price === null || item.price === undefined;
  const unitPrice = isAskStaff ? 0 : (item.price as number);
  const totalPrice = unitPrice * quantity;

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleAdd = () => {
    addItem(item.id, quantity, notes);
    setAddedToast(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const modeText =
    diningMode === "dine_in"
      ? tableLabel
        ? `Dine-in · Table ${tableLabel}`
        : "Dine-in (Table will be requested)"
      : diningMode === "pickup"
      ? "Takeaway / Pickup"
      : "Delivery";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      className="bg-[#1F2022] border border-[#C5A059]/30 rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with thumbnail & price */}
      <div className="p-5 border-b border-white/5 flex items-start gap-4">
        {item.image ? (
          <img
            src={item.image}
            alt={item.imageAlt || item.name}
            className="w-20 h-20 rounded-lg object-cover border border-[#C5A059]/30 shrink-0 bg-[#141516]"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-[#18191A] border border-[#C5A059]/20 flex items-center justify-center shrink-0">
            {item.isVegetarian ? (
              <svg className="w-8 h-8 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            ) : (
              <span className="font-['Cinzel'] text-xs text-[#C5A059]">H&amp;C</span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h3 id="dish-modal-title" className="font-['Playfair_Display'] text-xl font-bold text-[#F5F1E8] truncate">
              {item.name}
            </h3>
            {item.isVegetarian && (
              <span className="shrink-0 text-[#C5A059]" title="Vegetarian item">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                </svg>
              </span>
            )}
          </div>

          <div className="text-sm font-semibold price-tag mt-1">
            {isAskStaff ? "Ask staff" : `KES ${unitPrice.toLocaleString()}`}
          </div>

          <div className="text-[11px] text-[#C5A059]/80 font-medium mt-0.5">
            {modeText}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A8A29E] hover:text-[#F5F1E8] rounded-full hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Close dish sheet"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body with description & notes */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1 font-['Inter']">
        {item.description && (
          <p className="text-sm text-[#A8A29E] leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Special Instructions / Notes */}
        <div>
          <label htmlFor="item-notes" className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
            Preparation Notes
          </label>
          <input
            id="item-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra spicy, mild chili, no onions, extra crispy..."
            maxLength={120}
            className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3.5 py-2.5 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* PINNED bottom action bar with quantity stepper and Add button */}
      <div className="p-4 bg-[#18191A] border-t border-[#C5A059]/25 flex items-center justify-between gap-4 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-[#C5A059]/30 rounded bg-[#1F2022] h-11 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-full flex items-center justify-center text-[#F5F1E8] hover:text-[#C5A059] active:bg-white/5 focus:outline-none"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="w-8 text-center text-xs font-mono font-bold text-[#F5F1E8]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-full flex items-center justify-center text-[#F5F1E8] hover:text-[#C5A059] active:bg-white/5 focus:outline-none"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to order CTA */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 h-11 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] rounded transition-all shadow-md focus:outline-none"
        >
          {addedToast ? (
            <span>Added to Order</span>
          ) : (
            <>
              <span>Add to Order</span>
              {!isAskStaff && (
                <span className="font-mono">· KES {totalPrice.toLocaleString()}</span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Unconditional wrapper satisfying "Never place an early return before hooks"
export const DishDetailSheet: React.FC<DishDetailSheetProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <InnerDishDetail key={item.id} item={item} onClose={onClose} />
    </div>
  );
};
