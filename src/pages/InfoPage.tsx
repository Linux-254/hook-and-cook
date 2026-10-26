import React, { useState } from "react";
import { siteConfig } from "../config/site.config";
import { useOpenNow } from "../hooks/useOpenNow";
import { LocationMapCard } from "../components/LocationMapCard";

export const InfoPage: React.FC = () => {
  const { statusText } = useOpenNow();
  const [tableInquiryParty, setTableInquiryParty] = useState("4 people");
  const [tableInquiryDate, setTableInquiryDate] = useState("Tonight");
  const [tableInquiryName, setTableInquiryName] = useState("");

  const handleWhatsAppTableInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `*HOOK & COOK TABLE INQUIRY*`,
      `Hello! I'd like to ask about reserving a table or checking seating availability:`,
      `Name: ${tableInquiryName.trim() || "Guest"}`,
      `Party Size: ${tableInquiryParty}`,
      `Date/Time: ${tableInquiryDate}`,
      `Please let me know if a table or booth is available. Thank you!`,
    ].join("\n");

    const targetNumber = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-16 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Visitor Information
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#F5F1E8]">
            Hours &amp; Location
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
          <p className="text-xs text-[#C5A059] font-medium">{statusText}</p>
        </div>

        {/* Operating Hours & Essential Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg p-6 space-y-3">
            <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Operating Hours
            </h2>
            <div className="font-['Playfair_Display'] text-xl font-semibold text-[#F5F1E8]">
              11:00 AM – 1:00 AM
            </div>
            <p className="text-xs text-[#A8A29E] font-['Inter']">
              Open 7 days a week, Monday through Sunday. Kitchen and bar serve late until 1:00 AM.
            </p>
          </div>

          <div className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg p-6 space-y-3">
            <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Physical Address
            </h2>
            <div className="font-['Playfair_Display'] text-lg font-semibold text-[#F5F1E8]">
              {siteConfig.address}
            </div>
            <p className="text-xs text-[#C5A059]/80 font-mono">
              [{siteConfig.addressNote}]
            </p>
          </div>

          <div className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg p-6 space-y-3">
            <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Direct Contact
            </h2>
            <div>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="font-['Playfair_Display'] text-lg font-semibold text-[#D4AF37] hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
            <p className="text-xs text-[#A8A29E] font-['Inter']">
              WhatsApp orders and staff inquiries available daily during operating hours.
            </p>
          </div>
        </div>

        {/* Embedded Interactive Map Card */}
        <div className="space-y-4">
          <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            Directions &amp; Map Pin
          </h2>
          <LocationMapCard />
        </div>

        {/* Ask About a Table / Reservation Inquiry */}
        <div className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
              Ask About a Table or Group Seating
            </h2>
            <p className="text-xs text-[#A8A29E] font-['Inter']">
              Planning a group gathering, sports screening, or evening dinner? Send an inquiry directly to our team on WhatsApp.
              <span className="block text-[#C5A059] mt-1 font-mono text-[11px]">
                [TODO: Owner to confirm if formal table reservations are accepted or walk-ins only]
              </span>
            </p>
          </div>

          <form onSubmit={handleWhatsAppTableInquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="inquiry-name" className="block text-xs text-[#A8A29E] mb-1">
                Your Name
              </label>
              <input
                id="inquiry-name"
                type="text"
                required
                value={tableInquiryName}
                onChange={(e) => setTableInquiryName(e.target.value)}
                placeholder="e.g. Samuel K."
                className="w-full bg-[#18191A] border border-[#C5A059]/30 rounded px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label htmlFor="inquiry-party" className="block text-xs text-[#A8A29E] mb-1">
                Party Size
              </label>
              <select
                id="inquiry-party"
                value={tableInquiryParty}
                onChange={(e) => setTableInquiryParty(e.target.value)}
                className="w-full bg-[#18191A] border border-[#C5A059]/30 rounded px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="1-2 people">1 – 2 guests</option>
                <option value="3-4 people">3 – 4 guests</option>
                <option value="5-8 people">5 – 8 guests (Group)</option>
                <option value="9+ people">9+ guests (Large Party / Karoga)</option>
              </select>
            </div>

            <div>
              <label htmlFor="inquiry-time" className="block text-xs text-[#A8A29E] mb-1">
                Preferred Date / Time
              </label>
              <input
                id="inquiry-time"
                type="text"
                value={tableInquiryDate}
                onChange={(e) => setTableInquiryDate(e.target.value)}
                placeholder="e.g. Tonight at 8:00 PM"
                className="w-full bg-[#18191A] border border-[#C5A059]/30 rounded px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded shadow transition-all hover:brightness-110"
              >
                Inquire on WhatsApp →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
