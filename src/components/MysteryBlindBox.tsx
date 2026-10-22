"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, ShoppingCart, RefreshCcw, Star, Trophy } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/store";
import { formatPrice } from "@/utils/currency";
import confetti from "canvas-confetti";
import Image from "next/image";

export const MysteryBlindBox: React.FC = () => {
  const { addToCart, currency, t } = useStore();
  const [isOpening, setIsOpening] = useState(false);
  const [revealedToy, setRevealedToy] = useState<Product | null>(null);

  // Blind box candidate toys
  const blindBoxCandidates = PRODUCTS.filter((p) => p.cat === "blind-box" || p.cat === "minifigure");

  const handleOpenCapsule = () => {
    if (isOpening) return;
    setIsOpening(true);
    sounds.playBounce();

    // Sound effects countdown
    setTimeout(() => sounds.playPop(), 400);
    setTimeout(() => sounds.playPop(), 700);

    setTimeout(() => {
      // Pick random toy
      const randomIdx = Math.floor(Math.random() * blindBoxCandidates.length);
      const chosen = blindBoxCandidates[randomIdx];
      setRevealedToy(chosen);
      setIsOpening(false);
      sounds.playFanfare();

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#6366f1", "#fbbf24", "#10b981", "#06b6d4"],
      });
    }, 1200);
  };

  const handleReset = () => {
    sounds.playPop();
    setRevealedToy(null);
  };

  return (
    <section className="py-14 px-4 relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-slate-950/60 rounded-3xl border border-toy-purple/30 my-10 max-w-6xl mx-auto shadow-2xl">
      {/* Background glowing orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-toy-pink/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-toy-cyan/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toy-yellow/20 border border-toy-yellow/40 text-toy-yellow text-xs font-black tracking-wider uppercase mb-3">
          <Trophy className="w-4 h-4 text-toy-yellow" />
          <span>Interactive Mini-Game</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-fredoka leading-tight">
          {t("mysteryDropTitle")}
        </h2>
        <p className="text-sm text-slate-300 mt-2 font-medium">
          {t("mysteryDropSubtitle")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!revealedToy ? (
            /* Unopened Capsule State */
            <motion.div
              key="box-closed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={
                  isOpening
                    ? {
                        rotate: [-8, 8, -12, 12, -15, 15, 0],
                        scale: [1, 1.1, 0.95, 1.15, 1.2],
                        transition: { duration: 1.2, ease: "easeInOut" },
                      }
                    : {
                        y: [0, -12, 0],
                        rotate: [0, 2, -2, 0],
                        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                      }
                }
                onClick={handleOpenCapsule}
                className="w-48 h-48 sm:w-56 sm:h-56 relative cursor-pointer group select-none"
              >
                {/* 3D Capsule Graphics with CSS and SVG */}
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-1 shadow-toy-glow border-4 border-toy-yellow/80 flex items-center justify-center relative overflow-hidden group-hover:scale-105 active:scale-95 transition-transform duration-300">
                  {/* Gloss sheen highlight */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/30 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Ribbon cross */}
                  <div className="absolute inset-y-0 w-8 bg-toy-yellow shadow-md" />
                  <div className="absolute inset-x-0 h-8 bg-toy-yellow shadow-md" />

                  {/* Golden Question Mark in Center */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 border-toy-yellow">
                    <Gift className="w-10 h-10 text-toy-pink animate-pulse" />
                  </div>

                  {/* Shimmer star particles */}
                  <Sparkles className="absolute top-4 right-4 w-6 h-6 text-toy-yellow animate-spin" style={{ animationDuration: "5s" }} />
                  <Star className="absolute bottom-4 left-4 w-5 h-5 text-toy-cyan animate-bounce" />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenCapsule}
                disabled={isOpening}
                className="mt-6 px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-toy-yellow via-toy-orange to-toy-pink shadow-toy-glow font-fredoka text-base tracking-wide flex items-center gap-2 border-2 border-white/30"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isOpening ? "UNBOXING IN PROGRESS..." : t("tapToOpen")}</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Revealed Toy Card */
            <motion.div
              key="box-revealed"
              initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border-2 border-toy-yellow rounded-3xl p-6 shadow-toy-glow text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-toy-yellow/20 rounded-full blur-2xl" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-toy-pink text-white text-xs font-black uppercase mb-3">
                <Trophy className="w-3.5 h-3.5" />
                <span>{t("congratsHit")}</span>
              </div>

              {/* Toy Picture */}
              <div className="relative w-44 h-44 mx-auto my-2 rounded-2xl overflow-hidden bg-slate-800 border border-white/20 shadow-lg">
                <Image
                  src={revealedToy.image}
                  alt={revealedToy.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                {revealedToy.rarity && (
                  <div className="absolute bottom-2 left-2 right-2 py-1 rounded-xl bg-black/70 backdrop-blur-md text-toy-yellow text-xs font-bold border border-toy-yellow/40">
                    ⭐ {revealedToy.rarity}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-white font-fredoka mt-2">{revealedToy.name}</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{revealedToy.bio}</p>

              <div className="my-4 flex items-center justify-center gap-3">
                <span className="text-2xl font-black text-toy-yellow font-fredoka">
                  {formatPrice(revealedToy.price, currency)}
                </span>
                <span className="text-xs font-bold text-toy-green bg-toy-green/10 px-2.5 py-1 rounded-full border border-toy-green/30">
                  +{revealedToy.pt} Reward Points
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(revealedToy, 1)}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-toy-pink to-toy-purple shadow-md font-fredoka text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t("addToCart")}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-fredoka text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <RefreshCcw className="w-4 h-4 text-toy-cyan" />
                  <span>Retry</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
