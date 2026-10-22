"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { PRODUCTS } from "@/data/products";
import { motion } from "framer-motion";

export const CategoryArcade: React.FC = () => {
  const { selectedCategory, setSelectedCategory, language, t } = useStore();

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.cat === catId).length;
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xl font-black text-white font-fredoka flex items-center gap-2">
          <span>🎮</span>
          <span>{t("categories")}</span>
        </h3>
        <span className="text-xs text-slate-400 font-bold">
          {PRODUCTS.length} toys in universe
        </span>
      </div>

      {/* Chunky Arcade Category Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playPop();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap border-2 select-none font-fredoka ${
                isSelected
                  ? `bg-gradient-to-r ${cat.grad} text-white border-white/40 shadow-toy-glow scale-102`
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{language === "km" ? cat.kh : cat.name}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? "bg-black/30 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
