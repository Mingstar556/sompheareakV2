"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, MessageCircle, ArrowRight, Gift } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ThreeHeroCanvas } from "./ThreeHeroCanvas";
import { sounds } from "@/utils/audio";

export const HeroSection: React.FC = () => {
  const { t } = useStore();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 px-4 max-w-7xl mx-auto">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-toy-purple/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-toy-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-toy-cyan/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Flashy Kid-Centric Copy & CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-6 xl:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Top Drop Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-toy-pink/20 via-toy-purple/20 to-toy-cyan/20 border border-toy-pink/40 shadow-toy-glow text-white text-xs font-black tracking-wider uppercase font-fredoka"
          >
            <Sparkles className="w-4 h-4 text-toy-yellow animate-spin" style={{ animationDuration: "6s" }} />
            <span>{t("heroBadge")}</span>
          </motion.div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white font-fredoka tracking-tight leading-[1.12]">
            {t("heroTitlePrefix")}{" "}
            <span className="bg-gradient-to-r from-toy-yellow via-toy-pink to-toy-cyan bg-clip-text text-transparent drop-shadow-sm">
              {t("heroTitleHighlight")}
            </span>{" "}
            {t("heroTitleSuffix")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Big Chunky CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <a
              href="#toy-catalog"
              onClick={() => sounds.playBounce()}
              className="px-7 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-toy-pink via-toy-purple to-toy-cyan shadow-toy-glow font-fredoka text-base tracking-wide flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all select-none border-2 border-white/20"
            >
              <span>{t("heroCtaShop")}</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#custom-bracelet-studio"
              onClick={() => sounds.playPop()}
              className="px-6 py-4 rounded-2xl font-black text-white bg-slate-900/90 hover:bg-slate-800 border-2 border-toy-yellow/60 hover:border-toy-yellow shadow-md font-fredoka text-base tracking-wide flex items-center gap-2 transition-all hover:scale-105 active:scale-95 select-none"
            >
              <span>{t("heroCtaCustom")}</span>
            </a>

            <a
              href="#mystery-box"
              onClick={() => sounds.playChime()}
              className="px-5 py-4 rounded-2xl font-bold text-toy-yellow bg-toy-yellow/10 hover:bg-toy-yellow/20 border border-toy-yellow/30 font-fredoka text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Gift className="w-4 h-4" />
              <span>{t("heroCtaMystery")}</span>
            </a>
          </div>

          {/* Trust & Certification Badges */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="w-5 h-5 text-toy-green flex-shrink-0" />
              <span className="text-xs font-bold text-slate-300 leading-tight">
                {t("safeCertified")}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <Truck className="w-5 h-5 text-toy-cyan flex-shrink-0" />
              <span className="text-xs font-bold text-slate-300 leading-tight">
                {t("freeDeliveryBadge")}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 col-span-2 sm:col-span-1">
              <MessageCircle className="w-5 h-5 text-toy-yellow flex-shrink-0" />
              <span className="text-xs font-bold text-slate-300 leading-tight">
                {t("telegramOrdersBadge")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Three.js Interactive 3D Toy Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center"
        >
          {/* Glassmorphic 3D Card Backdrop */}
          <div className="w-full relative rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-indigo-950/40 border-2 border-toy-purple/40 shadow-2xl p-2 overflow-hidden backdrop-blur-md">
            {/* Top Interactive Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-toy-green animate-ping" />
              <span>Three.js 3D Interactive Stage</span>
            </div>

            {/* Three.js Canvas */}
            <ThreeHeroCanvas />

            {/* Bottom Floating Interactive Floating Badges */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-toy-yellow flex items-center gap-1.5">
                <span>⭐</span>
                <span>Move cursor to tilt 3D Toys</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-toy-pink/80 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider">
                Kid-Approved
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
