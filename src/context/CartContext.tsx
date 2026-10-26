import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from "react";
import { computeOrderQuote, OrderQuote } from "../lib/pricing";

export type DiningMode = "dine_in" | "pickup" | "delivery";

export interface CartItem {
  id: string;
  quantity: number;
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string; // Starts empty: 07XX XXX XXX
  tableLabel?: string;
  pickupTime?: string; // "ASAP" or e.g. "19:30"
  deliveryAddress?: string;
  deliveryLandmark?: string;
}

export interface StoredOrderReceipt {
  orderId: string;
  createdAt: string;
  diningMode: DiningMode;
  customer: CustomerDetails;
  quote: OrderQuote;
  paymentMethod: "mpesa" | "pay_at_venue";
  paymentStatus: "PENDING" | "PAID_MPESA" | "PAY_AT_VENUE" | "DEMO_SANDBOX";
  mpesaReceiptNumber?: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; id: string; quantity?: number; notes?: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "UPDATE_NOTES"; id: string; notes: string }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const addQty = Math.max(1, action.quantity || 1);
      const existingIndex = state.items.findIndex((item) => item.id === action.id);
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
          notes: action.notes !== undefined ? action.notes : updated[existingIndex].notes,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { id: action.id, quantity: addQty, notes: action.notes }],
      };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case "UPDATE_NOTES": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, notes: action.notes } : item
        ),
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    }
    case "CLEAR_CART": {
      return { items: [] };
    }
    case "LOAD_CART": {
      return { items: action.items };
    }
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (id: string, quantity?: number, notes?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  diningMode: DiningMode;
  setDiningMode: (mode: DiningMode) => void;
  tableLabel: string;
  setTableLabel: (table: string) => void;
  quote: OrderQuote;
  totalQuantity: number;
  lastConfirmedOrder: StoredOrderReceipt | null;
  saveConfirmedOrder: (receipt: StoredOrderReceipt) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY_CART = "hook_cook_cart_v1";
const STORAGE_KEY_MODE = "hook_cook_dining_mode_v1";
const STORAGE_KEY_TABLE = "hook_cook_table_v1";
const STORAGE_KEY_RECEIPT = "hook_cook_last_receipt_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const [diningMode, setDiningModeState] = useState<DiningMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY_MODE);
        if (saved === "dine_in" || saved === "pickup" || saved === "delivery") {
          return saved;
        }
      } catch {
        // Ignore
      }
    }
    return "dine_in";
  });

  const [tableLabel, setTableLabelState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        // Read from query param first if available
        const urlParams = new URLSearchParams(window.location.search);
        const queryTable = urlParams.get("table");
        if (queryTable) {
          sessionStorage.setItem(STORAGE_KEY_TABLE, queryTable.trim());
          return queryTable.trim();
        }
        const saved = sessionStorage.getItem(STORAGE_KEY_TABLE);
        if (saved) return saved;
      } catch {
        // Ignore
      }
    }
    return "";
  });

  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<StoredOrderReceipt | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY_RECEIPT);
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return null;
  });

  // Listen to URL search parameter ?table= changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryTable = urlParams.get("table");
      if (queryTable && queryTable.trim() !== tableLabel) {
        setTableLabelState(queryTable.trim());
        sessionStorage.setItem(STORAGE_KEY_TABLE, queryTable.trim());
      }
    } catch {
      // Ignore
    }
  }, [tableLabel]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CART);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "LOAD_CART", items: parsed });
        }
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(state.items));
    } catch {
      // Storage quota or error
    }
  }, [state.items]);

  const setDiningMode = (mode: DiningMode) => {
    setDiningModeState(mode);
    try {
      sessionStorage.setItem(STORAGE_KEY_MODE, mode);
    } catch {
      // Ignore
    }
  };

  const setTableLabel = (table: string) => {
    const trimmed = table.trim();
    setTableLabelState(trimmed);
    try {
      sessionStorage.setItem(STORAGE_KEY_TABLE, trimmed);
    } catch {
      // Ignore
    }
  };

  const saveConfirmedOrder = (receipt: StoredOrderReceipt) => {
    setLastConfirmedOrder(receipt);
    try {
      sessionStorage.setItem(STORAGE_KEY_RECEIPT, JSON.stringify(receipt));
    } catch {
      // Ignore
    }
  };

  const addItem = (id: string, quantity = 1, notes?: string) => {
    dispatch({ type: "ADD_ITEM", id, quantity, notes });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  };

  const updateNotes = (id: string, notes: string) => {
    dispatch({ type: "UPDATE_NOTES", id, notes });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const quote = useMemo(() => {
    return computeOrderQuote(state.items, diningMode);
  }, [state.items, diningMode]);

  const totalQuantity = quote.totalQuantity;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateQuantity,
        updateNotes,
        removeItem,
        clearCart,
        diningMode,
        setDiningMode,
        tableLabel,
        setTableLabel,
        quote,
        totalQuantity,
        lastConfirmedOrder,
        saveConfirmedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
