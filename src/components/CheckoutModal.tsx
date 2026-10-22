"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, ShieldCheck, MapPin, Phone, User, MessageCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice } from "@/utils/currency";
import {
  CheckoutFormState,
  generateOrderReference,
  buildTelegramOrderMessage,
  getTelegramShareUrl,
} from "@/utils/telegram";
import confetti from "canvas-confetti";

export const CheckoutModal: React.FC = () => {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    cart,
    clearCart,
    currency,
    activeVoucher,
    addPoints,
    t,
  } = useStore();

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: "",
    phone: "",
    telegramHandle: "",
    province: "Phnom Penh",
    address: "",
    paymentMethod: "cod",
  });

  const [submittedOrder, setSubmittedOrder] = useState<{
    orderRef: string;
    telegramUrl: string;
    totalUsd: number;
    points: number;
  } | null>(null);

  const subtotalUsd = cart.reduce((sum, item) => {
    if (item.product) {
      const p = item.product.discount > 0 
        ? item.product.price * (1 - item.product.discount / 100) 
        : item.product.price;
      return sum + p * item.quantity;
    }
    if (item.customBracelet) {
      return sum + item.customBracelet.unitPrice * item.quantity;
    }
    return sum;
  }, 0);

  const discountUsd = activeVoucher ? subtotalUsd * (activeVoucher.discountPct / 100) : 0;
  const deliveryFeeUsd = subtotalUsd >= 25.0 || subtotalUsd === 0 ? 0.0 : 1.5;
  const totalUsd = Math.max(0, subtotalUsd - discountUsd + deliveryFeeUsd);

  const totalPoints = cart.reduce((sum, item) => {
    if (item.product) return sum + item.product.pt * item.quantity;
    if (item.customBracelet) return sum + item.customBracelet.points * item.quantity;
    return sum;
  }, 0);

  const cambodiaProvinces = [
    "Phnom Penh (រាជធានីភ្នំពេញ)",
    "Kandal (កណ្តាល)",
    "Siem Reap (សៀមរាប)",
    "Battambang (បាត់ដំបង)",
    "Preah Sihanouk / Kampong Som (ព្រះសីហនុ)",
    "Kampot (កំពត)",
    "Kampong Cham (កំពង់ចាម)",
    "Takeo (តាកែវ)",
    "Prey Veng (ព្រៃវែង)",
    "Svay Rieng (ស្វាយរៀង)",
    "Other Province (ខេត្តផ្សេងៗ)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      alert("Please fill in recipient name, phone, and delivery address.");
      return;
    }

    const orderRef = generateOrderReference();
    const telegramMsg = buildTelegramOrderMessage({
      orderRef,
      form,
      cartItems: cart,
      subtotalUsd,
      discountUsd,
      deliveryFeeUsd,
      totalUsd,
      totalPoints,
      currency,
    });

    const shareUrl = getTelegramShareUrl(telegramMsg, "sompheareak");

    sounds.playFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#10b981", "#fbbf24", "#f43f5e", "#6366f1"],
    });

    addPoints(totalPoints);
    setSubmittedOrder({
      orderRef,
      telegramUrl: shareUrl,
      totalUsd,
      points: totalPoints,
    });
    clearCart();
  };

  const handleClose = () => {
    sounds.playPop();
    setSubmittedOrder(null);
    setCheckoutModalOpen(false);
  };

  if (!checkoutModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {!submittedOrder ? (
            /* Checkout Form */
            <div>
              <div className="flex items-center gap-2 mb-2 text-toy-pink font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Fast & Secure Cambodia Checkout</span>
              </div>
              <h2 className="text-2xl font-black font-fredoka text-white">{t("checkoutTitle")}</h2>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                Verified Telegram order with Cash on Delivery or ABA KHQR Scan.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-toy-cyan" />
                    <span>{t("fullName")} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Chan Dara / Sokha"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-toy-purple outline-none"
                  />
                </div>

                {/* Contact Phone & Telegram Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-toy-green" />
                      <span>{t("phoneNumber")} *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="012 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-toy-purple outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-toy-cyan" />
                      <span>{t("telegramHandle")}</span>
                    </label>
                    <input
                      type="text"
                      value={form.telegramHandle}
                      onChange={(e) => setForm({ ...form, telegramHandle: e.target.value })}
                      placeholder="@username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-toy-purple outline-none"
                    />
                  </div>
                </div>

                {/* Province / City */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-toy-pink" />
                    <span>{t("province")}</span>
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-toy-purple outline-none cursor-pointer"
                  >
                    {cambodiaProvinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {t("streetAddress")} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House number, Street, Sangkat, Khan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-toy-purple outline-none resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">{t("paymentMethod")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setForm({ ...form, paymentMethod: "cod" });
                      }}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                        form.paymentMethod === "cod"
                          ? "bg-toy-yellow/20 border-toy-yellow text-white shadow-md"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      {t("cod")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setForm({ ...form, paymentMethod: "khqr" });
                      }}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                        form.paymentMethod === "khqr"
                          ? "bg-emerald-950/60 border-emerald-500 text-white shadow-toy-green-glow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      {t("khqr")}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="font-bold text-slate-300">{t("total")}:</span>
                    <span className="text-2xl font-black text-toy-yellow font-fredoka">
                      {formatPrice(totalUsd, currency)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-base tracking-wide flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                    <span>{t("confirmOrder")}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Order Submitted Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-toy-green/20 text-toy-green flex items-center justify-center mx-auto mb-4 border border-toy-green/40 shadow-toy-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-toy-yellow uppercase tracking-widest">
                Order Ref: {submittedOrder.orderRef}
              </span>
              <h3 className="text-2xl font-black font-fredoka text-white mt-1">
                {t("orderSuccessTitle")}
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                {t("orderSuccessNotice")}
              </p>

              <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Total Amount:</span>
                  <span className="font-bold text-toy-yellow">
                    {formatPrice(submittedOrder.totalUsd, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>VIP Points Earned:</span>
                  <span className="font-bold text-toy-green">+{submittedOrder.points} pt</span>
                </div>
              </div>

              {/* Telegram Confirmation Action Button */}
              <a
                href={submittedOrder.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playFanfare()}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-white bg-[#229ED9] hover:bg-[#1e8bc0] shadow-lg font-fredoka text-base tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{t("forwardTelegram")}</span>
              </a>

              <button
                onClick={handleClose}
                className="mt-3 text-xs text-slate-400 hover:text-white font-bold"
              >
                Close & Return to Toys
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
