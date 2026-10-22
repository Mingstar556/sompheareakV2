"use client";

import React from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { VoucherRewardsHub } from "@/components/VoucherRewardsHub";
import { CustomBraceletStudio } from "@/components/CustomBraceletStudio";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { RewardsModal } from "@/components/RewardsModal";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { ThreeToyViewer } from "@/components/ThreeToyViewer";
import { useStore } from "@/context/StoreContext";
import { Sparkles, Trophy, Gift, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { sounds } from "@/utils/audio";
import styles from "@/styles/ToyEffects.module.css";

export default function HomePage() {
  const { viewer3DProduct, setViewer3DProduct, setRewardsModalOpen, t } = useStore();

  const marqueeKeywords = [
    "🔥 HOT DROP MINIFIGURES",
    "🎟️ EXCHANGE POINTS FOR VOUCHERS",
    "📿 CONNECTED ITALY MODULAR CHARM BAND",
    "🚀 WALL-CLIMBING ANTI-GRAVITY RACERS",
    "🦄 FLUFFY GALAXY PLUSHIES",
    "⭐ EARN VIP REWARDS ON EVERY ITEM",
    "🛒 MULTI-PRODUCT BULK CHECKOUT",
    "🇰🇭 FAST DELIVERY IN PHNOM PENH & PROVINCES",
    "📱 1-CLICK VERIFIED TELEGRAM ORDERS",
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] dark:bg-[#0b0f19] light:bg-[#f8fafc] text-white selection:bg-toy-pink selection:text-white relative">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Floating Header Navigation */}
      <Navbar />

      {/* 3. Hero Thumbnail & 3D Interactive Toy Canvas Stage */}
      <HeroSection />

      {/* 4. Playful Scrolling Marquee Ticker */}
      <div className="py-3 bg-gradient-to-r from-toy-purple via-toy-pink to-toy-cyan overflow-hidden select-none shadow-md">
        <div className="flex w-max animate-marquee gap-8 items-center text-xs sm:text-sm font-black font-fredoka tracking-wider uppercase text-white">
          {[...marqueeKeywords, ...marqueeKeywords].map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="text-toy-yellow text-base">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5. Main Toy Catalog & Category Arcade */}
      <ProductGrid />

      {/* 6. Interactive Connected Italian Modular Charm Bracelet Studio */}
      <CustomBraceletStudio />

      {/* 7. Interactive Points-to-Voucher Rewards Exchange Hub */}
      <div id="voucher-hub">
        <VoucherRewardsHub />
      </div>

      {/* 8. VIP Toy Club Rewards Callout Banner */}
      <section className="py-12 px-4 max-w-5xl mx-auto my-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 border-2 border-toy-yellow/50 shadow-toy-glow text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Background sparkles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-toy-yellow/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toy-yellow text-slate-950 font-black text-xs font-fredoka uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Somphea Reak VIP Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-fredoka">
              Earn Rewards & Free Vouchers on Every Drop!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-md font-medium">
              Collect 25 points to redeem an instant 10% OFF voucher. Get +10 Welcome Points immediately on your first visit!
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playFanfare();
              setRewardsModalOpen(true);
            }}
            className="relative z-10 px-7 py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-toy-yellow to-amber-400 hover:from-amber-300 hover:to-toy-yellow shadow-toy-glow font-fredoka text-sm tracking-wide flex items-center gap-2 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <Gift className="w-4 h-4" />
            <span>Open VIP Club ⭐</span>
          </button>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <ProductQuickViewModal />
      {viewer3DProduct && (
        <ThreeToyViewer
          product={viewer3DProduct}
          onClose={() => setViewer3DProduct(null)}
        />
      )}
      <CartDrawer />
      <CheckoutModal />
      <RewardsModal />
    </main>
  );
}
