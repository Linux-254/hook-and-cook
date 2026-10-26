/**
 * @file site.config.ts
 * Source of truth for Hook & Cook Bar and Restaurant client details.
 * All phone numbers, hours, URLs, and owner-configurable text live here.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  taglinePlaceholder: string;
  address: string;
  addressNote: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  hours: string;
  hoursDetail: {
    days: string;
    openTime: string;
    closeTime: string;
    openHour24: number; // 11
    closeHour24: number; // 1 (1:00 AM next day)
    timezone: string; // "Africa/Nairobi"
  };
  googleRating: {
    score: number;
    reviewCount: number;
    verified: boolean;
    displayNote: string;
  };
  vibe: string;
  features: string[];
  logo: {
    src: string;
    alt: string;
  };
  url: string;
  mapUrl: string;
  wazeUrl: string;
  mapEmbedUrl: string;
  delivery: {
    defaultFee: number;
    feeNote: string;
    minOrderAmount: number;
  };
  tableCount: number;
  extraTableLabels: string[];
  disclaimers: {
    illustrativeImages: string;
    whatsappHandoff: string;
    paymentsNote: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Hook and Cook Bar and Restaurant",
  shortName: "Hook & Cook",
  tagline: "Good food. Cold drinks. Late nights.",
  taglinePlaceholder: "TODO: Owner to confirm tagline. Working line: Good food. Cold drinks. Late nights.",
  address: "P.O. Box 33951, Nairobi, Kenya",
  addressNote: "TODO: Confirm street address and exact Google Maps pin before launch.",
  phoneDisplay: "+254 727 098606",
  phoneTel: "+254727098606",
  // Override via VITE_WHATSAPP_NUMBER during pitch/testing so orders route to developer's phone
  whatsappNumber:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER) ||
    (typeof process !== "undefined" && process.env?.VITE_WHATSAPP_NUMBER) ||
    "254727098606",
  hours: "Monday to Sunday, 11:00 AM to 1:00 AM",
  hoursDetail: {
    days: "Monday – Sunday",
    openTime: "11:00 AM",
    closeTime: "1:00 AM",
    openHour24: 11,
    closeHour24: 1, // 01:00 after midnight
    timezone: "Africa/Nairobi",
  },
  googleRating: {
    score: 4.3,
    reviewCount: 138,
    verified: false, // Set to true after verified by owner
    displayNote: "Rated 4.3 on Google (Verified customer feedback)",
  },
  vibe: "Casual, trendy, relaxed and quiet. Good for groups, friends, sports viewing and late-night hangouts.",
  features: [
    "Late-night dining until 1:00 AM",
    "Championship pool table",
    "Karoga experience (private cooking & social lounge)",
    "Live sports viewing on multiple screens",
    "Spacious group seating & private booths",
    "Ample secure on-site parking",
    "Extensive craft & draught beer selection",
    "Signature cocktails & daily happy hour",
    "Hard liquor & curated wine list",
    "Specialty espresso & spiced masala teas",
    "Fresh desserts & sweets",
    "Extensive vegetarian-friendly starters",
  ],
  logo: {
    src: "/brand/logo-placeholder.svg", // Replace with owner's exported menu cover logo
    alt: "Hook & Cook Bar and Restaurant Logo",
  },
  // Production site URL (defaults to Vercel placeholder, overridable by VITE_SITE_URL)
  url:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    "https://hook-and-cook.vercel.app",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Hook+and+Cook+Bar+and+Restaurant+Nairobi",
  wazeUrl: "https://waze.com/ul?q=Hook%20and%20Cook%20Bar%20and%20Restaurant%20Nairobi",
  mapEmbedUrl: "https://maps.google.com/maps?q=Hook%20and%20Cook%20Bar%20and%20Restaurant%20Nairobi&t=&z=15&ie=UTF8&iwloc=&output=embed",
  delivery: {
    defaultFee: 0,
    feeNote: "Delivery fee confirmed on WhatsApp based on location.",
    minOrderAmount: 1000,
  },
  tableCount: 30,
  extraTableLabels: ["Pool-1", "Pool-2", "Lounge-A", "Lounge-B", "VIP-Booth", "Outdoor-1", "Outdoor-2"],
  disclaimers: {
    illustrativeImages: "Images are illustrative of our house recipes and signature plating.",
    whatsappHandoff: "Your order is dispatched directly to our kitchen via WhatsApp. Payment is made at the table, upon pickup, or via M-Pesa.",
    paymentsNote: "TODO: Owner to confirm final list of accepted payment methods before launch.",
  },
};
