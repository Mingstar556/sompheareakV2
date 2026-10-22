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
import { NotificationToast } from "@/components/NotificationToast";
import { AdminLiveStorefrontBar } from "@/components/admin/AdminLiveStorefrontBar";
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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white selection:bg-emerald-600 selection:text-white relative transition-colors duration-200">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Floating Header Navigation */}
      <Navbar />

      {/* 3. Hero Thumbnail & 3D Interactive Toy Canvas Stage */}
      <HeroSection />

      {/* 4. Playful Scrolling Marquee Ticker */}
      <div className="py-3 bg-gradient-to-r from-emerald-700 via-green-600 to-teal-800 overflow-hidden select-none shadow-md">
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
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-100 via-green-50 to-teal-100 dark:from-slate-900/95 dark:via-emerald-950/80 dark:to-slate-900/95 border-2 border-emerald-400 dark:border-emerald-500/50 shadow-toy-green-glow text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors duration-200">
          {/* Background sparkles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs font-fredoka uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Somphea Reak VIP Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-fredoka">
              Earn Rewards & Free Vouchers on Every Drop!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 max-w-md font-medium">
              Collect 25 points to redeem an instant 10% OFF voucher. Get +10 Welcome Points immediately on your first visit!
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playFanfare();
              setRewardsModalOpen(true);
            }}
            className="relative z-10 px-7 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-sm tracking-wide flex items-center gap-2 transition-all hover:scale-105 active:scale-95 flex-shrink-0 hover:from-emerald-400 hover:to-green-500"
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

      {/* Real-time Order Simulation Toast Banner */}
      <NotificationToast />

      {/* Admin Live Storefront Direct Edit Bar (Zero footprint for non-admins) */}
      <AdminLiveStorefrontBar />
    </main>
  );
}
