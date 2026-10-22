"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Box, Star, ShieldCheck, Plus, Minus, Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { formatPrice } from "@/utils/currency";
import Image from "next/image";

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setViewer3DProduct,
    addToCart,
    currency,
    language,
    t,
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleClose = () => {
    sounds.playPop();
    setQuickViewProduct(null);
    setQuantity(1);
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto flex flex-col md:flex-row gap-6"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Image & Badges */}
          <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-toy-pink text-white text-xs font-black uppercase tracking-wider shadow-md">
                -{product.discount}% OFF
              </span>
            )}
            {product.rarity && (
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-toy-yellow text-xs font-black">
                ✨ {product.rarity}
              </span>
            )}
          </div>

          {/* Right: Info & Purchase */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-toy-yellow font-bold mb-1">
                <Star className="w-4 h-4 fill-toy-yellow" />
                <span>{product.rating || 4.9}</span>
                <span className="text-slate-500">({product.reviewsCount || 42} reviews)</span>
              </div>

              <h2 className="text-2xl font-black text-white font-fredoka leading-tight">
                {language === "km" ? product.nameKh : product.name}
              </h2>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {language === "km" ? product.bioKh : product.bio}
              </p>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-toy-yellow font-fredoka">
                  {formatPrice(discountedPrice, currency)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm line-through text-slate-500 font-bold">
                    {formatPrice(product.price, currency)}
                  </span>
                )}
                <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
                  +{product.pt} Points
                </span>
              </div>

              {/* Specs Badge */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-slate-400 block font-medium">Recommended Age</span>
                  <span className="text-slate-200 font-bold">{product.ageRecommendation || "Ages 5+"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-slate-400 block font-medium">Dimensions</span>
                  <span className="text-slate-200 font-bold">{product.dimensions || "Standard Size"}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-white">{quantity}</span>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setQuantity(quantity + 1);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    setViewer3DProduct(product);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  title="View in 3D"
                >
                  <Box className="w-4 h-4" />
                  <span>3D View</span>
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-5 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-sm flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t("addToCart")}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
