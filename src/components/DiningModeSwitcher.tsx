import React from "react";
import { useCart, DiningMode } from "../context/CartContext";

export const DiningModeSwitcher: React.FC = () => {
  const { diningMode, setDiningMode, tableLabel } = useCart();

  const modes: { id: DiningMode; label: string; icon: string }[] = [
    { id: "dine_in", label: tableLabel ? `Dine-In (T-${tableLabel})` : "Dine-In", icon: "🍽️" },
    { id: "pickup", label: "Takeaway / Pickup", icon: "🛍️" },
    { id: "delivery", label: "Delivery", icon: "🛵" },
  ];

  return (
    <div className="flex items-center justify-center">
      <div
        role="tablist"
        aria-label="Dining order mode"
        className="inline-flex p-1 bg-[#1F2022] border border-[#C5A059]/25 rounded-lg max-w-full overflow-x-auto"
      >
        {modes.map((mode) => {
          const active = diningMode === mode.id;
          return (
            <button
              key={mode.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setDiningMode(mode.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 focus:outline-none ${
                active
                  ? "bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#18191A] shadow"
                  : "text-[#A8A29E] hover:text-[#F5F1E8]"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
