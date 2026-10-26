import { siteConfig } from "../config/site.config";
import { StoredOrderReceipt } from "../context/CartContext";

export function formatWhatsAppOrderMessage(receipt: StoredOrderReceipt): string {
  const { orderId, diningMode, customer, quote, paymentStatus, mpesaReceiptNumber } = receipt;

  let modeHeader = "";
  if (diningMode === "dine_in") {
    modeHeader = `📍 DINE-IN: Table ${customer.tableLabel || "Not specified"}`;
  } else if (diningMode === "pickup") {
    modeHeader = `🛍️ PICKUP: Time ${customer.pickupTime || "ASAP"}`;
  } else {
    modeHeader = `🛵 DELIVERY:\nAddress: ${customer.deliveryAddress || "N/A"}\nLandmark: ${customer.deliveryLandmark || "None"}`;
  }

  let paymentLine = "";
  if (paymentStatus === "PAID_MPESA") {
    paymentLine = `💳 PAYMENT: PAID (M-PESA) — Ref: ${mpesaReceiptNumber || "Verified"}`;
  } else if (paymentStatus === "DEMO_SANDBOX") {
    paymentLine = `💳 PAYMENT: DEMO (sandbox simulation — pay at venue)`;
  } else {
    paymentLine = `💳 PAYMENT: Pay at ${diningMode === "dine_in" ? "table" : diningMode === "pickup" ? "pickup counter" : "delivery"}`;
  }

  const itemsList = quote.items
    .map((item) => {
      const priceText = item.isAskStaff ? "Ask staff" : `KES ${item.lineTotal.toLocaleString()}`;
      const notesText = item.notes ? `\n   Note: "${item.notes}"` : "";
      return `• ${item.quantity}x ${item.name} — ${priceText}${notesText}`;
    })
    .join("\n");

  const unpricedNote =
    quote.unpricedCount > 0
      ? `\n\n*Note: ${quote.unpricedCount} item(s) are listed as 'Ask staff'. Staff will confirm exact price upon receipt.*`
      : "";

  const deliveryNote =
    diningMode === "delivery"
      ? `\nDelivery Fee: ${quote.deliveryFee > 0 ? `KES ${quote.deliveryFee}` : "To be confirmed on WhatsApp"}`
      : "";

  const message = [
    `*HOOK & COOK BAR & RESTAURANT*`,
    `*Order #${orderId}*`,
    `--------------------------------`,
    modeHeader,
    `Customer: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `--------------------------------`,
    `*ORDER ITEMS:*`,
    itemsList,
    unpricedNote,
    `--------------------------------`,
    `Subtotal: KES ${quote.subtotal.toLocaleString()}`,
    deliveryNote,
    `*Grand Total: KES ${quote.grandTotal.toLocaleString()}*`,
    `--------------------------------`,
    paymentLine,
    `--------------------------------`,
    `Sent from Hook & Cook Digital Menu`,
  ]
    .filter(Boolean)
    .join("\n");

  return message;
}

export function getWhatsAppOrderUrl(receipt: StoredOrderReceipt): string {
  const message = formatWhatsAppOrderMessage(receipt);
  const targetNumber = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
