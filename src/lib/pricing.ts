/**
 * @file pricing.ts
 * Authoritative pricing calculation engine.
 * Recomputes totals directly from the catalog. Never trusts stale client state.
 * Items with null prices ('Ask staff') are excluded from numerical totals.
 */

import { MENU_ITEMS, MenuItem } from "../config/menu";
import { siteConfig } from "../config/site.config";

export interface QuoteRequestItem {
  id: string;
  quantity: number;
  notes?: string;
}

export interface QuoteLineItem {
  id: string;
  name: string;
  price: number | null;
  quantity: number;
  lineTotal: number;
  isAskStaff: boolean;
  notes?: string;
  isVegetarian?: boolean;
}

export interface OrderQuote {
  items: QuoteLineItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  currency: string;
  unpricedCount: number;
  totalQuantity: number;
}

export function computeOrderQuote(
  cartItems: QuoteRequestItem[],
  diningMode: "dine_in" | "pickup" | "delivery" = "dine_in"
): OrderQuote {
  const itemMap = new Map<string, MenuItem>();
  for (const item of MENU_ITEMS) {
    itemMap.set(item.id, item);
  }

  let subtotal = 0;
  let unpricedCount = 0;
  let totalQuantity = 0;

  const quoteLines: QuoteLineItem[] = [];

  for (const cartItem of cartItems) {
    const catalogItem = itemMap.get(cartItem.id);
    if (!catalogItem) continue;

    const qty = Math.max(1, Math.floor(cartItem.quantity || 1));
    totalQuantity += qty;

    const isAskStaff = catalogItem.price === null || catalogItem.price === undefined;
    const itemPrice = isAskStaff ? null : (catalogItem.price as number);
    const lineTotal = itemPrice !== null ? itemPrice * qty : 0;

    if (isAskStaff) {
      unpricedCount += qty;
    } else {
      subtotal += lineTotal;
    }

    quoteLines.push({
      id: catalogItem.id,
      name: catalogItem.name,
      price: itemPrice,
      quantity: qty,
      lineTotal,
      isAskStaff,
      notes: cartItem.notes?.trim() || undefined,
      isVegetarian: catalogItem.isVegetarian,
    });
  }

  const deliveryFee = diningMode === "delivery" ? siteConfig.delivery.defaultFee : 0;
  const grandTotal = subtotal + deliveryFee;

  return {
    items: quoteLines,
    subtotal,
    deliveryFee,
    grandTotal,
    currency: "KES",
    unpricedCount,
    totalQuantity,
  };
}
