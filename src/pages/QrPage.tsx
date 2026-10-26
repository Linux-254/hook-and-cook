import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { siteConfig } from "../config/site.config";

interface TableTent {
  label: string;
  url: string;
}

export const QrPage: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState<string>(siteConfig.url);
  const [selectedTable, setSelectedTable] = useState<string>("1");
  const [generatedQrs, setGeneratedQrs] = useState<{ [key: string]: string }>({});
  const [isDevHost, setIsDevHost] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Check if current browser host is a preview or local dev URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (
        hostname.includes("localhost") ||
        hostname.includes("127.0.0.1") ||
        hostname.includes("ais-dev") ||
        hostname.includes("ais-pre")
      ) {
        setIsDevHost(true);
      }
    }
  }, []);

  // Build table list: 1 to 30 + extra labels
  const tables: string[] = [
    "Root Site",
    ...Array.from({ length: siteConfig.tableCount }, (_, i) => String(i + 1)),
    ...siteConfig.extraTableLabels,
  ];

  // Generate QR for table
  useEffect(() => {
    let isCancelled = false;

    async function generateAll() {
      const results: { [key: string]: string } = {};
      const targetLabel = selectedTable;
      const cleanBase = baseUrl.replace(/\/+$/, "");

      const url =
        targetLabel === "Root Site"
          ? `${cleanBase}/menu`
          : `${cleanBase}/menu?table=${encodeURIComponent(targetLabel)}`;

      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 1.5,
          color: {
            dark: "#18191A",
            light: "#FFFFFF",
          },
        });
        if (!isCancelled) {
          results[targetLabel] = dataUrl;
          setGeneratedQrs((prev) => ({ ...prev, [targetLabel]: dataUrl }));
        }
      } catch {
        // QR generation error
      }
    }

    generateAll();
    return () => {
      isCancelled = true;
    };
  }, [baseUrl, selectedTable]);

  const activeUrl =
    selectedTable === "Root Site"
      ? `${baseUrl.replace(/\/+$/, "")}/menu`
      : `${baseUrl.replace(/\/+$/, "")}/menu?table=${encodeURIComponent(selectedTable)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback("Copied to clipboard!");
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const downloadPng = () => {
    const dataUrl = generatedQrs[selectedTable];
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `hook-and-cook-qr-${selectedTable.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-8 pb-28">
      {/* Print Stylesheet injection for A5 page print */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
          }
          header, footer, aside, .no-print {
            display: none !important;
          }
          .qr-a5-print-tent {
            display: block !important;
            width: 148mm !important;
            height: 210mm !important;
            page-break-after: always;
            margin: auto !important;
            border: 2px solid #C5A059 !important;
            background: #18191A !important;
            color: #F5F1E8 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 no-print">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            In-Venue Table Experience
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
            Printable A5 QR Table Tents
          </h1>
          <p className="text-xs text-[#A8A29E] font-['Inter'] max-w-lg mx-auto">
            Generate and print branded A5 table tents for Tables 1 to {siteConfig.tableCount} and custom lounge spots.
          </p>
        </div>

        {/* Guard Warning for Local / Preview URL */}
        {isDevHost && (
          <div className="p-4 bg-[#B85D34]/20 border border-[#B85D34]/60 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <span>⚠️ PRODUCTION QR URL GUARD:</span>
            </div>
            <p className="text-xs text-[#F5F1E8] leading-relaxed">
              You are currently viewing from a development or preview host ({window.location.hostname}).
              QR codes must encode your production deployment URL (e.g. <code>https://hook-and-cook.vercel.app</code>) so diners can scan on physical phones.
            </p>
          </div>
        )}

        {/* Configuration Panel */}
        <div className="bg-[#1F2022] border border-[#C5A059]/30 rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Base URL Input */}
            <div className="md:col-span-8">
              <label htmlFor="qr-base-url" className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1">
                Production Base URL
              </label>
              <input
                id="qr-base-url"
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://hook-and-cook.vercel.app"
                className="w-full bg-[#18191A] border border-[#C5A059]/30 rounded px-3 py-2 text-xs text-[#F5F1E8] font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Table Selector */}
            <div className="md:col-span-4">
              <label htmlFor="qr-table-select" className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1">
                Select Table / Spot
              </label>
              <select
                id="qr-table-select"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full bg-[#18191A] border border-[#C5A059]/30 rounded px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C5A059]"
              >
                {tables.map((t) => (
                  <option key={t} value={t}>
                    {t === "Root Site" ? "All Venue / Root Site" : `Table ${t}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active URL & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
            <div className="font-mono text-[#A8A29E] truncate max-w-md">
              Target: <span className="text-[#C5A059]">{activeUrl}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(activeUrl)}
                className="px-3 py-1.5 rounded bg-[#18191A] hover:bg-[#282A2D] text-[#C5A059] border border-[#C5A059]/30"
              >
                {copyFeedback || "Copy Link"}
              </button>
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#18191A] hover:bg-[#282A2D] text-[#F5F1E8] border border-white/10"
              >
                Test Link
              </a>
              <button
                type="button"
                onClick={downloadPng}
                className="px-3 py-1.5 rounded bg-[#18191A] hover:bg-[#282A2D] text-[#D4AF37] border border-[#C5A059]/30"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#18191A] font-bold shadow"
              >
                Print A5 Tent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* A5 Printable Preview Card */}
      <div className="mt-8 flex justify-center px-4">
        <div className="qr-a5-print-tent w-full max-w-md aspect-[1/1.414] bg-[#18191A] border-2 border-[#C5A059] rounded-xl p-8 flex flex-col items-center justify-between text-center relative shadow-2xl">
          {/* Top Brand Seal */}
          <div className="space-y-2 flex flex-col items-center">
            <img
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              className="w-16 h-16 object-contain rounded-full border border-[#C5A059]/40"
            />
            <h2 className="font-['Cinzel'] text-xl font-bold tracking-[0.25em] text-[#D4AF37]">
              HOOK &amp; COOK
            </h2>
            <p className="font-['Cinzel'] text-[10px] tracking-[0.3em] text-[#C5A059]">
              BAR &amp; RESTAURANT · NAIROBI
            </p>
          </div>

          {/* Central QR Code on Crisp White Plinth */}
          <div className="p-3 bg-white rounded-lg shadow-xl border-2 border-[#C5A059]/40">
            {generatedQrs[selectedTable] ? (
              <img
                src={generatedQrs[selectedTable]}
                alt={`QR code for Table ${selectedTable}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-black text-xs font-mono">
                Generating QR...
              </div>
            )}
          </div>

          {/* Bottom Table Designation & Instructions */}
          <div className="space-y-2">
            <div className="inline-block px-4 py-1 bg-[#1F2022] border border-[#C5A059]/50 rounded text-sm font-['Cinzel'] font-bold text-[#D4AF37] tracking-widest uppercase">
              {selectedTable === "Root Site" ? "Digital Menu" : `Table ${selectedTable}`}
            </div>
            <p className="font-['Playfair_Display'] text-base font-semibold text-[#F5F1E8]">
              Scan to view the menu and order
            </p>
            <p className="text-[11px] text-[#A8A29E] font-['Inter']">
              Orders sent directly to the kitchen on WhatsApp · WiFi &amp; Sports Lounge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
