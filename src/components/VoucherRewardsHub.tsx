"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Ticket, Trophy, Gift, Check, ArrowRight, Star, ShoppingBag, Coins } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AVAILABLE_VOUCHERS } from "@/data/vouchers";
import { Voucher } from "@/types/store";
import { sounds } from "@/utils/audio";

export const VoucherRewardsHub: React.FC = () => {
  const {
    userPoints,
    exchangePointsForVoucher,
    claimedVouchers,
    activeVoucher,
    applyVoucherCode,
    language,
    t,
  } = useStore();

  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);

  const handleExchange = (voucher: Voucher) => {
    const success = exchangePointsForVoucher(voucher);
    if (success) {
      setSelectedVoucherCode(voucher.code);
    }
  };

  return (
    <section id="voucher-hub" className="py-16 px-4 max-w-7xl mx-auto my-12">
      {/* Background radial glows */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-purple-950/40 to-slate-950 border-2 border-toy-yellow/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-toy-yellow/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-toy-pink/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toy-yellow/20 border border-toy-yellow/40 text-toy-yellow text-xs font-black tracking-wider uppercase mb-3 font-fredoka">
            <Coins className="w-4 h-4 text-toy-yellow animate-bounce" />
            <span>{t("voucherHubBadge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-fredoka">
            {t("voucherHubTitle")}
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
            {t("voucherHubSubtitle")}
          </p>

          {/* Live Points Counter Pill */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/90 border-2 border-toy-yellow shadow-toy-glow">
            <Trophy className="w-6 h-6 text-toy-yellow fill-toy-yellow" />
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-400 block leading-tight">
                {t("yourPoints")}
              </span>
              <span className="text-2xl font-black text-toy-yellow font-fredoka">
                {userPoints}{" "}
                <span className="text-sm text-toy-cyan font-bold">{t("pointsTag")}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {AVAILABLE_VOUCHERS.map((voucher) => {
            const isClaimed = claimedVouchers.includes(voucher.code);
            const isActive = activeVoucher?.code === voucher.code;
            const canAfford = userPoints >= voucher.pointsCost;
            const pointsNeeded = Math.max(0, voucher.pointsCost - userPoints);

            return (
              <motion.div
                key={voucher.code}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl p-5 border-2 flex flex-col justify-between transition-all overflow-hidden ${
                  isActive
                    ? "bg-slate-900 border-toy-yellow shadow-toy-glow"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Perforated Ticket Notches on Top Left & Top Right */}
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-950 border border-slate-850" />
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-950 border border-slate-850" />

                <div>
                  {/* Tier Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${voucher.colorGrad}`}
                    >
                      {voucher.badge}
                    </span>
                    <span className="text-xs font-black text-toy-yellow flex items-center gap-1 font-fredoka">
                      <Star className="w-3.5 h-3.5 fill-toy-yellow" />
                      <span>{voucher.pointsCost} pts</span>
                    </span>
                  </div>

                  {/* Discount Display */}
                  <div className="my-2">
                    <div className="text-3xl font-black text-white font-fredoka">
                      {voucher.discountType === "fixed"
                        ? `$${voucher.fixedDiscountUsd?.toFixed(2)} OFF`
                        : `${voucher.discountPct}% OFF`}
                    </div>
                    <p className="text-xs text-slate-300 font-semibold mt-1">
                      {language === "km" ? voucher.descriptionKh : voucher.description}
                    </p>
                  </div>

                  {/* Voucher Code Box */}
                  <div className="my-3 py-2 px-3 rounded-xl bg-slate-950/80 border border-dashed border-slate-700 flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-toy-cyan tracking-widest">
                      {voucher.code}
                    </span>
                    <Ticket className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  {isActive ? (
                    <div className="py-2.5 px-4 rounded-xl bg-toy-green/20 border border-toy-green/40 text-toy-green font-black text-xs text-center flex items-center justify-center gap-1.5 font-fredoka">
                      <Check className="w-4 h-4" />
                      <span>{t("claimed")}</span>
                    </div>
                  ) : isClaimed ? (
                    <button
                      onClick={() => applyVoucherCode(voucher.code)}
                      className="w-full py-2.5 px-4 rounded-xl bg-toy-purple text-white font-black text-xs font-fredoka hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>{t("applyNow")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : canAfford ? (
                    <button
                      onClick={() => handleExchange(voucher)}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-slate-950 bg-gradient-to-r from-toy-yellow to-amber-400 hover:from-amber-300 hover:to-toy-yellow font-fredoka text-xs transition-all shadow-toy-glow flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Coins className="w-4 h-4" />
                      <span>{t("exchangeBtn")} ({voucher.pointsCost} pt)</span>
                    </button>
                  ) : (
                    <div className="py-2 px-3 rounded-xl bg-slate-950 text-slate-500 font-bold text-[11px] text-center border border-slate-850">
                      {t("needMorePoints", { n: pointsNeeded })}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How to Earn Points Rules Strip */}
        <div className="relative z-10 mt-10 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-toy-cyan/20 text-toy-cyan flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">{t("howEarnTitle")}:</span>
              <span className="text-slate-400">
                {t("earnRule1")} • {t("earnRule2")}
              </span>
            </div>
          </div>

          <a
            href="#toy-catalog"
            onClick={() => sounds.playPop()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-toy-yellow font-bold text-xs font-fredoka flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <span>{t("exploreCatalog")}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
