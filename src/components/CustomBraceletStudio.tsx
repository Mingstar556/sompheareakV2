"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, Zap, ShoppingCart, Plus, Check, ShieldCheck } from "lucide-react";
import { CHARMS } from "@/data/charms";
import { Charm, CustomBraceletItem } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice } from "@/utils/currency";
import Image from "next/image";

export const CustomBraceletStudio: React.FC = () => {
  const { addCustomBraceletToCart, currency, t } = useStore();

  const [finish, setFinish] = useState<"silver" | "gold" | "rose" | "black">("silver");
  const [sizeLinks, setSizeLinks] = useState<number>(17);
  const [slots, setSlots] = useState<(Charm | null)[]>(Array(17).fill(null));
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

  // Add charm to first available empty slot
  const handleAddCharm = (charm: Charm) => {
    sounds.playCharmSnap();
    setSlots((prev) => {
      const copy = [...prev];
      const emptyIdx = copy.findIndex((c) => c === null);
      if (emptyIdx > -1) {
        copy[emptyIdx] = charm;
      } else {
        // replace last slot if full
        copy[copy.length - 1] = charm;
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

  // Fill remaining slots with plain links
  const handleFillRemaining = () => {
    sounds.playChime();
    // In Somphea Reak, plain links have null charm (clean stainless link)
    // We already have null representation for plain link, so this fills empty slots as confirmed plain links
  };

  const handleClearAll = () => {
    sounds.playPop();
    setSlots(Array(sizeLinks).fill(null));
  };

  // Calculate pricing
  const activeCharmsCount = slots.filter(Boolean).length;
  const totalPriceUsd = basePrice + activeCharmsCount * charmPrice + (packaging === "premium" ? premiumBoxPrice : 0);
  const rewardPoints = 6 + activeCharmsCount;

  // Filter charms
  const filteredCharms = selectedCategory === "all" 
    ? CHARMS 
    : CHARMS.filter((c) => c.category === selectedCategory);

  const handleAddToCart = () => {
    const charmsData = slots
      .map((c, idx) => (c ? { slot: idx, charm: c } : null))
      .filter(Boolean) as { slot: number; charm: Charm }[];

    const styleId = `SR-${finish.toUpperCase()}-${sizeLinks}-${activeCharmsCount}CH`;

    const customItem: CustomBraceletItem = {
      id: `custom-bracelet-${Date.now()}`,
      styleId,
      finish,
      sizeLinks,
      charms: charmsData,
      packaging,
      unitPrice: totalPriceUsd,
      quantity: 1,
      points: rewardPoints,
    };

    addCustomBraceletToCart(customItem);
  };

  const finishColorStyles = {
    silver: "from-slate-200 to-slate-400 text-slate-800 border-slate-300",
    gold: "from-amber-300 to-yellow-500 text-amber-950 border-amber-300",
    rose: "from-rose-300 to-pink-400 text-rose-950 border-rose-300",
    black: "from-slate-700 to-slate-900 text-white border-slate-600",
  };

  return (
    <section id="custom-bracelet-studio" className="py-16 px-4 max-w-6xl mx-auto my-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toy-green/15 border border-toy-green/30 text-toy-green text-xs font-black tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Interactive DIY Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-fredoka">
          {t("braceletBuilderTitle")}
        </h2>
        <p className="text-sm text-slate-300 mt-2 font-medium">
          {t("braceletBuilderSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Visual Bracelet Track & Controls */}
        <div className="lg:col-span-7 bg-slate-900 border-2 border-toy-purple/40 rounded-3xl p-6 shadow-2xl">
          {/* Finish & Size Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2">{t("finishSelect")}</span>
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
                        ? "bg-toy-purple text-white border-toy-purple shadow-toy-glow scale-105"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {f} Inox
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2">{t("sizeSelect")}</span>
              <div className="flex gap-2">
                {[16, 17, 18].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSizeChange(s)}
                    className={`w-10 h-8 rounded-xl text-xs font-black transition-all border ${
                      sizeLinks === s
                        ? "bg-toy-cyan text-slate-950 border-toy-cyan shadow-md scale-105"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Bracelet Track (Horizontal Scrollable Links) */}
          <div className="my-8">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-slate-300 font-bold">
                Assembled Bracelet Track ({activeCharmsCount} charms attached / {sizeLinks} links)
              </span>
              <button
                onClick={handleClearAll}
                className="text-toy-pink hover:underline font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("clearAllLinks")}</span>
              </button>
            </div>

            {/* Visual Link Chain */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 overflow-x-auto scrollbar-thin">
              <div className="flex items-center gap-2 min-w-max py-2">
                {slots.map((charm, idx) => (
                  <motion.div
                    key={`slot-${idx}`}
                    whileHover={{ scale: 1.08, y: -4 }}
                    className={`relative w-14 h-20 rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all border-2 ${
                      charm
                        ? "bg-gradient-to-b from-slate-800 to-slate-900 border-toy-yellow shadow-md"
                        : "bg-slate-850/80 border-dashed border-slate-700 hover:border-slate-500"
                    }`}
                    onClick={() => charm && handleRemoveSlot(idx)}
                    title={charm ? `Click to remove ${charm.name}` : `Slot ${idx + 1}: Plain stainless link`}
                  >
                    {/* Link Slot Number */}
                    <span className="absolute top-1 text-[9px] font-bold text-slate-500">
                      #{idx + 1}
                    </span>

                    {charm ? (
                      <div className="relative w-10 h-10 mt-2">
                        <Image
                          src={charm.plateImage || charm.image}
                          alt={charm.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded bg-slate-800/80 flex items-center justify-center text-slate-600 mt-2">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <span className="text-[8px] font-bold mt-1 text-slate-400 truncate max-w-full px-1">
                      {charm ? charm.name.split(" ")[0] : "Plain"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              💡 Tap any attached charm to detach it, or click charms below to snap them onto your bracelet!
            </p>
          </div>

          {/* Packaging Box Selection */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-2.5">{t("boxPackaging")}</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  setPackaging("basic");
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  packaging === "basic"
                    ? "bg-toy-purple/20 border-toy-purple text-white shadow-md"
                    : "bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <div className="text-xs font-bold">{t("boxBasic")}</div>
                <div className="text-[11px] text-toy-green font-semibold mt-0.5">$0.00 Included</div>
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setPackaging("premium");
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  packaging === "premium"
                    ? "bg-toy-pink/20 border-toy-pink text-white shadow-md"
                    : "bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <div className="text-xs font-bold">{t("boxPremium")}</div>
                <div className="text-[11px] text-toy-pink font-semibold mt-0.5">+$0.50 (Royal Velvet Box)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Charm Picker & Add to Cart Card */}
        <div className="lg:col-span-5 bg-slate-900 border-2 border-toy-pink/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white font-fredoka">Select Charms to Snap</h3>
              <span className="text-xs text-toy-pink font-bold">$1.50 - $1.75 / charm</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
              {["all", "emblem", "cute", "stone", "anime"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCategory(c);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    selectedCategory === c
                      ? "bg-toy-pink text-white shadow-sm"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Charms Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredCharms.map((charm) => (
                <motion.div
                  key={charm.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddCharm(charm)}
                  className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-toy-cyan cursor-pointer text-center group flex flex-col items-center justify-between"
                >
                  <div className="relative w-12 h-12 my-1">
                    <Image
                      src={charm.plateImage || charm.image}
                      alt={charm.name}
                      fill
                      className="object-contain group-hover:rotate-6 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                    {charm.name}
                  </span>
                  <span className="text-[10px] font-black text-toy-yellow mt-0.5">
                    {formatPrice(charm.price, currency)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Breakdown & Add to Cart Button */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Stainless Band ({sizeLinks} Links):</span>
                <span className="font-bold">{formatPrice(basePrice, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Charms Attached ({activeCharmsCount}):</span>
                <span className="font-bold">{formatPrice(activeCharmsCount * charmPrice, currency)}</span>
              </div>
              {packaging === "premium" && (
                <div className="flex justify-between text-toy-pink">
                  <span>Velvet Gift Box:</span>
                  <span className="font-bold">+{formatPrice(premiumBoxPrice, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-black text-white">
                <span className="font-fredoka">Total Custom Price:</span>
                <span className="text-toy-yellow font-fredoka text-xl">
                  {formatPrice(totalPriceUsd, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-5 w-full py-3.5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-toy-green to-toy-cyan shadow-toy-glow font-fredoka text-base tracking-wide flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
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
