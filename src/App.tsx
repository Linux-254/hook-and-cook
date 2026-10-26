/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { siteConfig } from "./config/site.config";
import { Navbar } from "./components/Navbar";
import { StickyMobileBar } from "./components/StickyMobileBar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { OrderPage } from "./pages/OrderPage";
import { OrderConfirmedPage } from "./pages/OrderConfirmedPage";
import { AboutPage } from "./pages/AboutPage";
import { InfoPage } from "./pages/InfoPage";
import { EventsPage } from "./pages/EventsPage";
import { QrPage } from "./pages/QrPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  // Inject LocalBusiness JSON-LD structured data for search engine visibility
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "name": siteConfig.name,
    "alternateName": siteConfig.shortName,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}${siteConfig.logo.src}`,
    "image": `${siteConfig.url}/src/assets/images/hero_lounge_scene_1793027544373.jpg`,
    "description": siteConfig.tagline,
    "telephone": siteConfig.phoneTel,
    "priceRange": "KES 400 - 2200",
    "servesCuisine": ["Kenyan", "Indian", "Grill", "Seafood", "Bar"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nairobi",
      "addressCountry": "KE",
      "streetAddress": siteConfig.address,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        "opens": "11:00",
        "closes": "01:00",
      },
    ],
  };

  return (
    <BrowserRouter>
      <CartProvider>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* 4% Film Grain Texture Overlay */}
        <div className="film-grain" aria-hidden="true" />

        {/* Main Application Shell */}
        <div className="min-h-screen flex flex-col bg-[#18191A] text-[#F5F1E8]">
          <ScrollToTop />
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/confirmed" element={<OrderConfirmedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/qr" element={<QrPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
          <StickyMobileBar />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
