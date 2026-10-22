"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, Zap, ShoppingCart, Plus, Check, ShieldCheck, RefreshCw } from "lucide-react";
import { CHARMS } from "@/data/charms";
import { Charm, CustomBraceletItem } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice } from "@/utils/currency";
import { ConnectedCharmLink } from "./ConnectedCharmLink";
import Image from "next/image";

export const CustomBraceletStudio: React.FC = () => {
  const { addCustomBraceletToCart, currency, t, language } = useStore();

  const [finish, setFinish] = useState<"silver" | "gold" | "rose" | "black">("silver");
  const [sizeLinks, setSizeLinks] = useState<number>(17);
  const [slots, setSlots] = useState<(Charm | null)[]>(Array(17).fill(null));
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [packaging, setPackaging] = useState<"basic" | "premium">("basic");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const basePrice = 8.0;
  const charmPrice = 1.5;
  const premiumBoxPrice = 0.5;

  // Change size and adjust array length
  const handleSizeChange = (newSize: number) => {
    sounds.playPop();
    setSizeLinks(newSize);
    setSlots((prev) => {
      const copy = [...prev];
      if (newSize > copy.length) {
        return [...copy, ...Array(newSize - copy.length).fill(null)];
      }
      return copy.slice(0, newSize);
    });
  };

  // Add charm to first available empty slot or selected slot
  const handleAddCharm = (charm: Charm) => {
    sounds.playCharmSnap();
    setSlots((prev) => {
      const copy = [...prev];
      if (selectedSlotIndex !== null && selectedSlotIndex < copy.length) {
        copy[selectedSlotIndex] = charm;
        setSelectedSlotIndex(null);
      } else {
        const emptyIdx = copy.findIndex((c) => c === null);
        if (emptyIdx > -1) {
          copy[emptyIdx] = charm;
        } else {
          // If all filled, replace last link
          copy[copy.length - 1] = charm;
        }
      }
      return copy;
    });
  };

  // Remove charm from specific slot
  const handleRemoveSlot = (slotIdx: number) => {
    sounds.playPop();
    setSlots((prev) => {
      const copy = [...prev];
      copy[slotIdx] = null;
      return copy;
    });
  };

  // Fill remaining slots with plain stainless links
  const handleFillRemaining = () => {
    sounds.playChime();
  };

  const handleClearAll = () => {
    sounds.playPop();
    setSlots(Array(sizeLinks).fill(null));
  };

  const activeCharmsCount = slots.filter((c) => c !== null).length;
  const totalPriceUsd =
    basePrice +
    activeCharmsCount * charmPrice +
    (packaging === "premium" ? premiumBoxPrice : 0);

  const rewardPoints = 6 + activeCharmsCount * 2;

  const filteredCharms =
    selectedCategory === "all"
      ? CHARMS
      : CHARMS.filter((c) => c.category === selectedCategory);

  const handleAddToCart = () => {
    const charmsAttached: { slot: number; charm: Charm }[] = [];
    slots.forEach((c, idx) => {
      if (c) charmsAttached.push({ slot: idx, charm: c });
    });

    const customItem: CustomBraceletItem = {
      id: `custom-bracelet-${Date.now()}`,
      styleId: `italian-band-${finish}-${sizeLinks}`,
      finish,
      sizeLinks,
      charms: charmsAttached,
      packaging,
      unitPrice: totalPriceUsd,
      quantity: 1,
      points: rewardPoints,
    };

    addCustomBraceletToCart(customItem);
  };

  return (
    <section id="custom-bracelet-studio" className="py-16 px-4 max-w-7xl mx-auto my-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-toy-green/15 border border-emerald-300 dark:border-toy-green/30 text-emerald-800 dark:text-toy-green text-xs font-black tracking-wider uppercase mb-3 font-fredoka">
          <Sparkles className="w-4 h-4" />
          <span>{t("braceletConnectedTitle")}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-fredoka">
          {t("braceletBuilderTitle")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
          {t("braceletConnectedSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interconnected Ribbon Workbench */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 transition-colors duration-200">
          {/* Top Finish & Size Configuration */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">{t("finishSelect")}</span>
              <div className="flex gap-2">
                {(["silver", "gold", "rose", "black"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      sounds.playPop();
                      setFinish(f);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all border ${
                      finish === f
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-toy-green-glow scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {f} Inox
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">{t("sizeSelect")}</span>
              <div className="flex gap-1.5">
                {[15, 16, 17, 18, 19].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSizeChange(s)}
                    className={`w-9 h-8 rounded-xl text-xs font-black transition-all border ${
                      sizeLinks === s
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-toy-green-glow scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Ribbon Stage (Interconnected Edge-to-Edge Links) */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Connected Ribbon Band</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-toy-yellow/20 text-amber-800 dark:text-toy-yellow text-[10px] font-black border border-amber-300 dark:border-toy-yellow/30">
                  {activeCharmsCount} Charms + {sizeLinks - activeCharmsCount} Plain Links
                </span>
              </div>
              <button
                onClick={handleClearAll}
                className="text-rose-600 dark:text-toy-pink hover:underline font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("clearAllLinks")}</span>
              </button>
            </div>

            {/* Seamless Connected Interlocking Track */}
            <div className="relative rounded-2xl bg-slate-100 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-slate-300 dark:border-slate-800 p-4 sm:p-5 overflow-hidden shadow-inner">
              {/* Metallic Light Sheen Glint Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[marquee_5s_linear_infinite] pointer-events-none" />

              {/* Interlocking Link Strip (Connected side-by-side) */}
              <div className="flex items-center overflow-x-auto py-3 px-2 scrollbar-thin">
                <div className="flex items-center min-w-max mx-auto">
                  {slots.map((charm, idx) => (
                    <ConnectedCharmLink
                      key={`slot-${idx}`}
                      charm={charm}
                      slotIndex={idx}
                      finish={finish}
                      isSelected={selectedSlotIndex === idx}
                      onSelect={() => {
                        sounds.playPop();
                        setSelectedSlotIndex(selectedSlotIndex === idx ? null : idx);
                      }}
                      onRemove={() => handleRemoveSlot(idx)}
                      size="workbench"
                    />
                  ))}
                </div>
              </div>

              {/* Track Footnote */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>🔗 Interlocking 316L stainless steel links with spring-loaded hinges</span>
                <span className="text-emerald-700 dark:text-toy-green font-bold">✨ Connected seamlessly edge-to-edge</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Packaging Option */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Fill:</span>
              <button
                onClick={handleFillRemaining}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-amber-800 dark:text-toy-yellow text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t("fillPlain")}</span>
              </button>
            </div>

            {/* Packaging Box Selection */}
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">{t("boxPackaging")}</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setPackaging("basic");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    packaging === "basic"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-white shadow-toy-green-glow"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="text-xs font-bold">{t("boxBasic")}</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">$0.00 Included</div>
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setPackaging("premium");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    packaging === "premium"
                      ? "bg-rose-100 dark:bg-toy-pink/20 border-rose-400 dark:border-toy-pink text-rose-900 dark:text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="text-xs font-bold">{t("boxPremium")}</div>
                  <div className="text-[11px] text-rose-600 dark:text-toy-pink font-semibold mt-0.5">+$0.50 Velvet Box</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charms Catalog & Instant Snap */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white font-fredoka">Tap to Connect Charms</h3>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">$1.50 - $1.75 / link</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
              {["all", "emblem", "cute", "stone", "anime"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCategory(c);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    selectedCategory === c
                      ? "bg-emerald-600 text-white shadow-toy-green-glow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Charms Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredCharms.map((charm) => (
                <motion.div
                  key={charm.id}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleAddCharm(charm)}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 cursor-pointer text-center group flex flex-col items-center justify-between transition-all shadow-sm"
                >
                  <div className="relative w-14 h-12 my-1">
                    <Image
                      src={charm.plateImage || charm.image}
                      alt={charm.name}
                      fill
                      className="object-contain group-hover:rotate-3 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {language === "km" ? charm.nameKh : charm.name}
                  </span>
                  <span className="text-[10px] font-black text-amber-600 dark:text-toy-yellow mt-0.5 font-fredoka">
                    {formatPrice(charm.price, currency)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Summary & Add to Cart */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Base Inox Band ({sizeLinks} Links):</span>
                <span className="font-bold">{formatPrice(basePrice, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Attached Charms ({activeCharmsCount}):</span>
                <span className="font-bold">{formatPrice(activeCharmsCount * charmPrice, currency)}</span>
              </div>
              {packaging === "premium" && (
                <div className="flex justify-between text-rose-600 dark:text-toy-pink">
                  <span>Velvet Gift Box:</span>
                  <span className="font-bold">+{formatPrice(premiumBoxPrice, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white">
                <span className="font-fredoka">Total Bracelet:</span>
                <span className="text-amber-600 dark:text-toy-yellow font-fredoka text-xl">
                  {formatPrice(totalPriceUsd, currency)}
                </span>
              </div>
            </div>

            <div className="mt-2 text-right">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                +{rewardPoints} VIP Points will be earned!
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-4 w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-base tracking-wide flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{t("addCustomToCart")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
