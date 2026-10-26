import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, StoredOrderReceipt } from "../context/CartContext";
import { siteConfig } from "../config/site.config";
import { DiningModeSwitcher } from "../components/DiningModeSwitcher";

export const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    updateNotes,
    removeItem,
    clearCart,
    diningMode,
    tableLabel,
    setTableLabel,
    quote,
    saveConfirmedOrder,
  } = useCart();

  // Customer Details Form (Phone starts completely EMPTY per strict rule)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLandmark, setDeliveryLandmark] = useState("");

  // Payment Options
  const [paymentChoice, setPaymentChoice] = useState<"mpesa" | "pay_at_venue">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // M-Pesa Modal & Processing State
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<"initiating" | "waiting_pin" | "success" | "demo_success" | "failed" | "timeout">("initiating");
  const [mpesaTimer, setMpesaTimer] = useState(60);
  const [mpesaErrorMsg, setMpesaErrorMsg] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [simulatedReceiptNo, setSimulatedReceiptNo] = useState("");

  const tableQuery = tableLabel ? `?table=${encodeURIComponent(tableLabel)}` : "";

  // Normalize phone to Kenya format: 07XX... or +254... -> 254XXXXXXXXX
  const normalizeKenyaPhone = (phone: string): string | null => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
      if (cleaned.length === 10) return "254" + cleaned.slice(1);
    }
    if (cleaned.startsWith("254") && cleaned.length === 12) {
      return cleaned;
    }
    if (cleaned.length === 9) {
      return "254" + cleaned;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!customerPhone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!normalizeKenyaPhone(customerPhone)) {
      errors.phone = "Enter a valid Kenyan number (e.g. 0712 345 678).";
    }

    if (diningMode === "dine_in" && !tableLabel.trim()) {
      errors.table = "Table number or label is required for dine-in orders.";
    }

    if (diningMode === "delivery" && !deliveryAddress.trim()) {
      errors.deliveryAddress = "Delivery address is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentChoice === "mpesa" && quote.grandTotal > 0) {
      // Trigger M-Pesa STK flow
      setMpesaPhone(customerPhone);
      setMpesaModalOpen(true);
      setMpesaStatus("initiating");
      setMpesaTimer(60);
      setMpesaErrorMsg("");
      triggerMpesaPush(customerPhone);
    } else {
      // Direct Pay at Venue flow
      finalizeOrder("pay_at_venue", "PAY_AT_VENUE");
    }
  };

  const triggerMpesaPush = async (phone: string) => {
    const normalized = normalizeKenyaPhone(phone) || phone;
    const tempOrderId = "HC-" + Math.floor(1000 + Math.random() * 9000);

    try {
      setMpesaStatus("waiting_pin");

      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: normalized,
          amount: Math.max(1, quote.grandTotal),
          orderId: tempOrderId,
        }),
        signal: AbortSignal.timeout(8000), // 8-second timeout guard
      }).catch(() => null);

      if (!response || !response.ok) {
        // Fallback to honest sandbox DEMO mode
        setIsDemoMode(true);
        setCheckoutRequestId("DEMO-" + Date.now());
        return;
      }

      const data = await response.json();
      if (data.isDemo) {
        setIsDemoMode(true);
        setCheckoutRequestId(data.CheckoutRequestID || "DEMO-" + Date.now());
      } else if (data.CheckoutRequestID) {
        setCheckoutRequestId(data.CheckoutRequestID);
        // Start polling query endpoint
        pollMpesaStatus(data.CheckoutRequestID);
      } else {
        setIsDemoMode(true);
      }
    } catch {
      setIsDemoMode(true);
    }
  };

  const pollMpesaStatus = async (reqId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 18) {
        // 54s timeout
        clearInterval(interval);
        setMpesaStatus("timeout");
        return;
      }

      try {
        const res = await fetch("/api/mpesa/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CheckoutRequestID: reqId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ResultCode === "0") {
            clearInterval(interval);
            setMpesaStatus("success");
            setSimulatedReceiptNo(data.MpesaReceiptNumber || "QA" + Math.floor(100000 + Math.random() * 900000));
            setTimeout(() => {
              finalizeOrder("mpesa", "PAID_MPESA", data.MpesaReceiptNumber);
            }, 1200);
          } else if (data.ResultCode && data.ResultCode !== "1032") {
            // Failed
            clearInterval(interval);
            setMpesaStatus("failed");
            setMpesaErrorMsg(data.ResultDesc || "Payment was declined or cancelled.");
          }
        }
      } catch {
        // network blip during poll
      }
    }, 3000);
  };

  const handleSimulateDemoPin = () => {
    const demoRef = "DEMO-" + Math.floor(100000 + Math.random() * 900000);
    setSimulatedReceiptNo(demoRef);
    setMpesaStatus("demo_success");
    setTimeout(() => {
      finalizeOrder("mpesa", "DEMO_SANDBOX", demoRef);
    }, 1200);
  };

  const finalizeOrder = (
    method: "mpesa" | "pay_at_venue",
    status: "PENDING" | "PAID_MPESA" | "PAY_AT_VENUE" | "DEMO_SANDBOX",
    ref?: string
  ) => {
    const orderId = "HC-" + Math.floor(1000 + Math.random() * 9000);

    const receipt: StoredOrderReceipt = {
      orderId,
      createdAt: new Date().toISOString(),
      diningMode,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        tableLabel: diningMode === "dine_in" ? tableLabel.trim() : undefined,
        pickupTime: diningMode === "pickup" ? pickupTime : undefined,
        deliveryAddress: diningMode === "delivery" ? deliveryAddress.trim() : undefined,
        deliveryLandmark: diningMode === "delivery" ? deliveryLandmark.trim() : undefined,
      },
      quote,
      paymentMethod: method,
      paymentStatus: status,
      mpesaReceiptNumber: ref,
    };

    saveConfirmedOrder(receipt);
    clearCart();
    setMpesaModalOpen(false);
    navigate("/order/confirmed");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#18191A] px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6 bg-[#1F2022] border border-[#C5A059]/25 p-8 rounded-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#18191A] border border-[#C5A059]/30 flex items-center justify-center">
            <span className="font-['Cinzel'] text-xl font-bold text-[#C5A059]">H&amp;C</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
              Your Cart is Empty
            </h1>
            <p className="text-xs text-[#A8A29E] font-['Inter']">
              Explore our digital menu to select sizzling starters, simmered curries, and chilled cocktails.
            </p>
          </div>

          <Link
            to={`/menu${tableQuery}`}
            className="inline-flex items-center justify-center w-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded transition-all shadow"
          >
            Browse Menu Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18191A] text-[#F5F1E8] py-8 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Mode Switcher */}
        <div className="text-center space-y-3">
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Order Review &amp; Dispatch
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
            Your Table Order
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
          <DiningModeSwitcher />
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1F2022] border border-[#C5A059]/25 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Selected Dishes ({quote.totalQuantity})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-[#A8A29E] hover:text-[#EA2027] transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {quote.items.map((line) => (
                  <div key={line.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-['Playfair_Display'] text-base font-semibold text-[#F5F1E8]">
                            {line.name}
                          </span>
                          {line.isVegetarian && (
                            <span className="text-[#C5A059]" title="Vegetarian">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="price-tag text-xs font-semibold mt-0.5">
                          {line.isAskStaff
                            ? "Ask staff"
                            : `KES ${line.price?.toLocaleString()} each`}
                        </div>
                      </div>

                      {/* Quantity Stepper & Line Total */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#C5A059]/30 rounded bg-[#18191A] h-8">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-[#F5F1E8] hover:text-[#C5A059]"
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="w-7 text-center text-xs font-mono font-bold text-[#F5F1E8]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-[#F5F1E8] hover:text-[#C5A059]"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <span className="price-tag text-xs font-bold w-18 text-right">
                          {line.isAskStaff ? "TBC" : `KES ${line.lineTotal.toLocaleString()}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="text-[#A8A29E] hover:text-[#EA2027] text-xs p-1"
                          aria-label="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Inline note editing */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={line.notes || ""}
                        onChange={(e) => updateNotes(line.id, e.target.value)}
                        placeholder="Add preparation note (e.g. mild spice, extra lime)..."
                        maxLength={90}
                        className="w-full bg-[#18191A]/70 border border-[#C5A059]/20 rounded px-2.5 py-1 text-[11px] text-[#F5F1E8] placeholder-[#A8A29E]/40 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {quote.unpricedCount > 0 && (
                <div className="p-3 bg-[#18191A] border border-[#C5A059]/30 rounded text-xs text-[#C5A059]">
                  {quote.unpricedCount} item(s) are priced 'Ask staff' and excluded from the total. Staff will confirm exact prices upon WhatsApp dispatch.
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/menu${tableQuery}`}
                  className="text-xs font-['Cinzel'] tracking-wider text-[#C5A059] hover:text-[#D4AF37] uppercase"
                >
                  + Add more dishes from menu
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details & Payment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1F2022] border border-[#C5A059]/25 rounded-lg p-5 space-y-4">
              <h2 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059] pb-2 border-b border-white/5">
                Customer &amp; Dining Details
              </h2>

              <div className="space-y-3 font-['Inter'] text-xs">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customer-name" className="block text-[#A8A29E] font-medium mb-1">
                    Your Name *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Brian Otieno"
                    className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
                  />
                  {formErrors.name && <p className="text-[#EA2027] text-[11px] mt-1">{formErrors.name}</p>}
                </div>

                {/* Customer Phone: STARTS EMPTY per strict rule */}
                <div>
                  <label htmlFor="customer-phone" className="block text-[#A8A29E] font-medium mb-1">
                    Phone Number (for WhatsApp dispatch) *
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
                  />
                  {formErrors.phone && <p className="text-[#EA2027] text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                {/* Dining Mode Specific Fields */}
                {diningMode === "dine_in" && (
                  <div>
                    <label htmlFor="table-label" className="block text-[#A8A29E] font-medium mb-1">
                      Table Number / Label *
                    </label>
                    <input
                      id="table-label"
                      type="text"
                      required
                      value={tableLabel}
                      onChange={(e) => setTableLabel(e.target.value)}
                      placeholder="e.g. 5, Pool-1, Lounge-B"
                      className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
                    />
                    {formErrors.table && <p className="text-[#EA2027] text-[11px] mt-1">{formErrors.table}</p>}
                  </div>
                )}

                {diningMode === "pickup" && (
                  <div>
                    <label htmlFor="pickup-time" className="block text-[#A8A29E] font-medium mb-1">
                      Ready / Pickup Time
                    </label>
                    <select
                      id="pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="ASAP">ASAP (approx. 20–30 mins)</option>
                      <option value="In 45 minutes">In 45 minutes</option>
                      <option value="In 1 hour">In 1 hour</option>
                      <option value="Scheduled later tonight">Scheduled later tonight</option>
                    </select>
                  </div>
                )}

                {diningMode === "delivery" && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="delivery-address" className="block text-[#A8A29E] font-medium mb-1">
                        Delivery Street Address *
                      </label>
                      <input
                        id="delivery-address"
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. Apartment, Road, Estate"
                        className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
                      />
                      {formErrors.deliveryAddress && (
                        <p className="text-[#EA2027] text-[11px] mt-1">{formErrors.deliveryAddress}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="delivery-landmark" className="block text-[#A8A29E] font-medium mb-1">
                        Nearest Landmark
                      </label>
                      <input
                        id="delivery-landmark"
                        type="text"
                        value={deliveryLandmark}
                        onChange={(e) => setDeliveryLandmark(e.target.value)}
                        placeholder="e.g. Near Shell station, Gate 4"
                        className="w-full bg-[#18191A] border border-[#C5A059]/25 rounded px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="block font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Payment Method
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice("mpesa")}
                    className={`p-3 rounded border text-left flex flex-col justify-between focus:outline-none ${
                      paymentChoice === "mpesa"
                        ? "bg-[#18191A] border-[#D4AF37] text-[#D4AF37]"
                        : "bg-[#18191A]/50 border-white/10 text-[#A8A29E]"
                    }`}
                  >
                    <span className="font-bold">M-Pesa (STK Push)</span>
                    <span className="text-[10px] opacity-75 mt-1">Prompt sent to phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice("pay_at_venue")}
                    className={`p-3 rounded border text-left flex flex-col justify-between focus:outline-none ${
                      paymentChoice === "pay_at_venue"
                        ? "bg-[#18191A] border-[#D4AF37] text-[#D4AF37]"
                        : "bg-[#18191A]/50 border-white/10 text-[#A8A29E]"
                    }`}
                  >
                    <span className="font-bold">Pay at Venue</span>
                    <span className="text-[10px] opacity-75 mt-1">Cash or Card with staff</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Math */}
              <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-[#A8A29E]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#F5F1E8]">KES {quote.subtotal.toLocaleString()}</span>
                </div>
                {diningMode === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-mono text-[#F5F1E8]">
                      {quote.deliveryFee > 0 ? `KES ${quote.deliveryFee}` : "TBC on WhatsApp"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-[#D4AF37]">
                  <span>Grand Total:</span>
                  <span className="font-mono">KES {quote.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] rounded transition-all shadow-lg focus:outline-none"
              >
                <span>{paymentChoice === "mpesa" ? "Proceed to M-Pesa & Confirm" : "Confirm & Send on WhatsApp"}</span>
                <span>→</span>
              </button>

              <p className="text-[11px] text-center text-[#A8A29E]/80">
                {siteConfig.disclaimers.whatsappHandoff}
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* M-PESA STK DIALOG WITH DEMO FALLBACK */}
      {mpesaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="bg-[#1F2022] border border-[#C5A059]/40 rounded-xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl relative">
            {/* Header */}
            <div className="space-y-1">
              <span className="font-['Cinzel'] text-xs font-bold tracking-widest text-[#C5A059] uppercase">
                Safaricom Daraja · M-Pesa STK Push
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#F5F1E8]">
                KES {quote.grandTotal.toLocaleString()}
              </h3>
              <p className="text-xs text-[#A8A29E]">
                Payment for Hook &amp; Cook Bar and Restaurant
              </p>
            </div>

            {/* Honest Demo Mode Banner */}
            {isDemoMode && (
              <div className="p-3 bg-[#E58E26]/10 border border-[#E58E26]/30 rounded text-left space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                  <span>SANDBOX DEMO MODE</span>
                </div>
                <p className="text-[11px] text-[#A8A29E] leading-normal">
                  No real money moves. Simulates the customer PIN prompt and Daraja callback loop.
                </p>
              </div>
            )}

            {/* Status Visualizer */}
            {mpesaStatus === "waiting_pin" && (
              <div className="p-5 bg-[#18191A] border border-white/5 rounded-lg space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                <p className="text-xs text-[#F5F1E8] font-medium">
                  {isDemoMode
                    ? "Sandbox STK Push Ready"
                    : `Please check your phone (${customerPhone}) and enter your M-Pesa PIN.`}
                </p>
                <p className="text-[11px] text-[#A8A29E]">
                  Waiting for network confirmation...
                </p>
              </div>
            )}

            {mpesaStatus === "demo_success" && (
              <div className="p-5 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-lg space-y-2">
                <p className="text-xs text-[#2E7D32] font-bold">
                  DEMO (sandbox simulation accepted)
                </p>
                <p className="text-[11px] text-[#A8A29E]">Ref: {simulatedReceiptNo}</p>
              </div>
            )}

            {mpesaStatus === "success" && (
              <div className="p-5 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-lg space-y-2">
                <p className="text-xs text-[#2E7D32] font-bold">
                  PAID (M-PESA) VERIFIED
                </p>
                <p className="text-[11px] text-[#A8A29E]">Receipt: {simulatedReceiptNo}</p>
              </div>
            )}

            {mpesaStatus === "failed" && (
              <div className="p-4 bg-[#EA2027]/10 border border-[#EA2027]/30 rounded-lg text-xs text-[#EA2027] space-y-1">
                <p className="font-bold">Transaction Failed</p>
                <p>{mpesaErrorMsg || "The request was cancelled or timed out."}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {isDemoMode && mpesaStatus === "waiting_pin" && (
                <button
                  type="button"
                  onClick={handleSimulateDemoPin}
                  className="w-full h-11 px-4 text-xs font-bold text-[#18191A] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-[0.98] rounded transition-all"
                >
                  Simulate PIN Accepted (Sandbox Demo)
                </button>
              )}

              <button
                type="button"
                onClick={() => finalizeOrder("pay_at_venue", "PAY_AT_VENUE")}
                className="w-full h-10 px-4 text-xs font-medium text-[#F5F1E8] bg-[#18191A] hover:bg-[#282A2D] border border-[#C5A059]/30 rounded transition-all"
              >
                Switch to Pay at Table / Venue
              </button>

              <button
                type="button"
                onClick={() => setMpesaModalOpen(false)}
                className="w-full text-xs text-[#A8A29E] hover:text-[#F5F1E8] pt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
