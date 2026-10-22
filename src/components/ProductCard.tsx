"use client";

import React from "react";
import { Product } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice, formatDiscountPrice } from "@/utils/currency";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Box, Sparkles, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setQuickViewProduct, setViewer3DProduct, currency, t, language } = useStore();

  const prices = formatDiscountPrice(product.price, product.discount, currency);

  const rarityColors = {
    Common: "bg-slate-700/80 text-slate-200 border-slate-600",
    Rare: "bg-blue-600/80 text-blue-100 border-blue-400",
    "Super Rare": "bg-purple-600/80 text-purple-100 border-purple-400 shadow-toy-glow",
    Legendary: "bg-amber-500/90 text-amber-950 border-amber-300 shadow-toy-glow",
    "Limited Edition": "bg-rose-500/90 text-rose-100 border-rose-300 shadow-toy-glow",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-3xl p-4 shadow-toy-card transition-all flex flex-col justify-between overflow-hidden"
    >
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount > 0 && (
          <span className="px-2.5 py-1 rounded-xl bg-toy-pink text-white text-[11px] font-black uppercase tracking-wider shadow-md">
            -{product.discount}% OFF
          </span>
        )}
        {product.rarity && (
          <span
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
              rarityColors[product.rarity] || "bg-slate-800 text-slate-200"
            }`}
          >
            {product.rarity}
          </span>
        )}
      </div>

      {/* 3D Spin Shortcut Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          sounds.playPop();
          setViewer3DProduct(product);
        }}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-2xl bg-black/60 hover:bg-emerald-500 text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-md"
        title="Interactive 3D Spin"
      >
        <Box className="w-4 h-4 animate-pulse" />
      </button>

      {/* Product Image Thumbnail */}
      <div
        onClick={() => {
          sounds.playPop();
          setQuickViewProduct(product);
        }}
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/50 cursor-pointer mb-3 border border-slate-200/60 dark:border-transparent"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-black flex items-center gap-1 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>{t("quickView")}</span>
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating & Points Tag */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 dark:text-toy-yellow font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-toy-yellow" />
              <span>{product.rating || 4.9}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px]">({product.reviewsCount || 42})</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/40">
              +{product.pt} VIP pt
            </span>
          </div>

          <h3
            onClick={() => {
              sounds.playPop();
              setQuickViewProduct(product);
            }}
            className="text-base font-black text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-fredoka line-clamp-1 cursor-pointer"
          >
            {language === "km" ? product.nameKh : product.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {language === "km" ? product.bioKh : product.bio}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-black text-amber-600 dark:text-toy-yellow font-fredoka leading-none">
              {prices.discounted}
            </div>
            {product.discount > 0 && (
              <div className="text-[11px] line-through text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                {prices.original}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playPop();
                setViewer3DProduct(product);
              }}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-all"
              title="3D Inspection"
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              className="py-2.5 px-3.5 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all shadow-toy-green-glow border-b-2 border-emerald-900 flex items-center gap-1.5 font-fredoka text-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t("addToCart")}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
