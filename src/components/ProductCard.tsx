"use client";

import React from "react";
import { Product } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice, formatDiscountPrice } from "@/utils/currency";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Box, Sparkles, Star, Edit3 } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setQuickViewProduct,
    setViewer3DProduct,
    currency,
    t,
    language,
    isLiveEditMode,
    setEditingDirectProduct,
  } = useStore();

  const prices = formatDiscountPrice(product.price, product.discount, currency);

  const rarityColors = {
    Common: "bg-slate-700/80 text-slate-200 border-slate-600",
    Rare: "bg-blue-600/90 text-blue-100 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    "Super Rare": "bg-purple-600/90 text-purple-100 border-purple-400 shadow-toy-glow",
    Legendary: "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
    "Limited Edition": "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
  };

  const rarityHoverBorders = {
    Common: "hover:border-slate-300 dark:hover:border-slate-700",
    Rare: "hover:border-cyan-400 dark:hover:border-toy-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    "Super Rare": "hover:border-purple-400 dark:hover:border-toy-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]",
    Legendary: "hover:border-amber-400 dark:hover:border-toy-yellow hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]",
    "Limited Edition": "hover:border-rose-400 dark:hover:border-toy-pink hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-toy-card transition-all flex flex-col justify-between overflow-hidden ${
        product.rarity ? rarityHoverBorders[product.rarity] : "hover:border-emerald-500"
      }`}
    >
      {/* Top Badges (Responsive for 2-column mobile layout) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1 pointer-events-none">
        {product.discount > 0 && (
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-toy-pink text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wider shadow-md">
            -{product.discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow animate-pulse">
            ⚡ VIRAL
          </span>
        )}
        {product.rarity && (
          <span
            className={`px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
              rarityColors[product.rarity] || "bg-slate-800 text-slate-200"
            }`}
          >
            {product.rarity}
          </span>
        )}
      </div>

      {/* 3D View / Spin Shortcut Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          sounds.playPop();
          setViewer3DProduct(product);
        }}
        className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-black/60 hover:bg-emerald-500 text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-md"
        title={product.cat === "bracelet" ? "View Empty Modular Inox Band (3D)" : "Interactive 3D Spin"}
      >
        <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
      </button>

      {/* Admin Direct Live Edit Button */}
      {isLiveEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playPop();
            setEditingDirectProduct(product);
          }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] sm:text-xs shadow-2xl flex items-center gap-1 border-2 border-slate-950 hover:scale-105 active:scale-95 transition-all select-none animate-bounce"
          title="Direct Edit Product Live on Storefront"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      )}

      {/* Product Image Thumbnail */}
      <div
        onClick={() => {
          sounds.playPop();
          setQuickViewProduct(product);
        }}
        className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/50 cursor-pointer mb-2 sm:mb-3 border border-slate-200/60 dark:border-transparent"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-lg">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            <span>{t("quickView")}</span>
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating & Points Tag */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 dark:text-toy-yellow font-bold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 dark:fill-toy-yellow" />
              <span>{product.rating || 4.9}</span>
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/40">
              +{product.pt} pt
            </span>
          </div>

          <h3
            onClick={() => {
              sounds.playPop();
              setQuickViewProduct(product);
            }}
            className="text-xs sm:text-base font-black text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-fredoka line-clamp-1 cursor-pointer"
          >
            {language === "km" ? product.nameKh : product.name}
          </h3>
          {isLiveEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                setEditingDirectProduct(product);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 hover:text-amber-400 underline decoration-dashed mt-0.5"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          )}
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
            {language === "km" ? product.bioKh : product.bio}
          </p>
        </div>

        {/* Pricing & Add to Cart (Fit perfectly on 2-col mobile) */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="text-sm sm:text-lg font-black text-amber-600 dark:text-toy-yellow font-fredoka leading-none truncate">
              {prices.discounted}
            </div>
            {product.discount > 0 && (
              <div className="text-[9px] sm:text-[11px] line-through text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                {prices.original}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* 3D view button */}
            <button
              onClick={() => {
                sounds.playPop();
                setViewer3DProduct(product);
              }}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-all active:scale-95"
              title={product.cat === "bracelet" ? "View Empty Band (3D)" : "3D Inspection"}
            >
              <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Add to Cart button */}
            <button
              onClick={() => addToCart(product, 1)}
              className="py-1.5 px-2 sm:py-2.5 sm:px-3.5 rounded-lg sm:rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all shadow-toy-green-glow border-b-2 border-emerald-900 flex items-center gap-1 sm:gap-1.5 font-fredoka text-[10px] sm:text-xs"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("addToCart")}</span>
              <span className="sm:hidden">+Cart</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
