"use client";

import React from "react";
import { Charm } from "@/types/store";
import Image from "next/image";
import { motion } from "framer-motion";

interface ConnectedCharmLinkProps {
  charm: Charm | null;
  slotIndex: number;
  finish: "silver" | "gold" | "rose" | "black";
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  size?: "workbench" | "preview" | "compact";
  engravedText?: string | null;
}

export const ConnectedCharmLink: React.FC<ConnectedCharmLinkProps> = ({
  charm,
  slotIndex,
  finish,
  isSelected = false,
  onSelect,
  onRemove,
  size = "workbench",
  engravedText,
}) => {
  // Dimensions based on authentic Italian modular charm ratio (184 x 158)
  const sizeMap = {
    workbench: {
      w: "w-[58px] sm:w-[68px]",
      h: "h-[50px] sm:h-[58px]",
      overlap: "-ml-[2px] sm:-ml-[3px]",
      fontSize: "text-[9px] sm:text-[10px]",
    },
    preview: {
      w: "w-[46px] sm:w-[54px]",
      h: "h-[39px] sm:h-[46px]",
      overlap: "-ml-[2px]",
      fontSize: "text-[8px]",
    },
    compact: {
      w: "w-[36px]",
      h: "h-[31px]",
      overlap: "-ml-[1.5px]",
      fontSize: "text-[7px]",
    },
  };

  const currentSize = sizeMap[size];

  const finishBevels = {
    silver: {
      border: "border-slate-300 dark:border-slate-400",
      plateBg: "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300",
      glow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.3)]",
      engraved: "text-slate-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]",
    },
    gold: {
      border: "border-amber-400 dark:border-amber-300",
      plateBg: "bg-gradient-to-b from-yellow-100 via-amber-200 to-amber-300",
      glow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(180,83,9,0.4)]",
      engraved: "text-amber-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]",
    },
    rose: {
      border: "border-rose-300 dark:border-rose-400",
      plateBg: "bg-gradient-to-b from-rose-100 via-rose-200 to-rose-300",
      glow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-1px_1px_rgba(190,24,93,0.35)]",
      engraved: "text-rose-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]",
    },
    black: {
      border: "border-slate-600 dark:border-slate-500",
      plateBg: "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900",
      glow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.6)]",
      engraved: "text-slate-200 drop-shadow-[0_1px_0_rgba(0,0,0,0.9)]",
    },
  };

  const bevel = finishBevels[finish];

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`relative ${currentSize.w} ${currentSize.h} ${
        slotIndex > 0 ? currentSize.overlap : ""
      } flex-shrink-0 cursor-pointer select-none transition-all duration-200 ${
        isSelected ? "z-20 scale-105" : "z-10"
      }`}
      title={charm ? `${charm.name} (Click to remove/edit)` : `Slot #${slotIndex + 1}: Stainless blank link`}
    >
      {/* Outer Interlocking Stainless Steel Plate with spring notches */}
      <div
        className={`w-full h-full rounded-[4px] border ${bevel.border} ${bevel.plateBg} ${bevel.glow} p-[2px] flex items-center justify-center relative overflow-hidden`}
      >
        {/* Left & Right Mechanical Spring Hinges (interlocking teeth) */}
        <div className="absolute left-0 inset-y-1 w-[2px] bg-black/20 rounded-r" />
        <div className="absolute right-0 inset-y-1 w-[2px] bg-black/20 rounded-l" />

        {/* Top & Bottom Precision Inox Bevel Lines */}
        <div className="absolute inset-x-1 top-0 h-[1.5px] bg-white/40" />
        <div className="absolute inset-x-1 bottom-0 h-[1.5px] bg-black/30" />

        {/* Center Artwork: Charm Plate or Blank Stainless Plate */}
        <div className="relative w-full h-full flex items-center justify-center">
          {charm ? (
            <div className="relative w-full h-full">
              <Image
                src={charm.plateImage || charm.image}
                alt={charm.name}
                fill
                className="object-contain"
                sizes="70px"
              />
            </div>
          ) : (
            /* Blank Stainless Link */
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Image
                src="/assets/charm_clean.png"
                alt="Stainless Link"
                fill
                className="object-contain opacity-85"
                sizes="70px"
              />
              {engravedText ? (
                <span
                  className={`relative z-10 font-serif font-black uppercase tracking-wider ${currentSize.fontSize} ${bevel.engraved}`}
                >
                  {engravedText}
                </span>
              ) : (
                <span className="relative z-10 text-[9px] font-mono font-bold text-slate-500 opacity-60">
                  #{slotIndex + 1}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Selection / Hover Indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-emerald-400 rounded-[4px] pointer-events-none shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        )}
      </div>

      {/* Delete tag on hover if charm exists */}
      {charm && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-toy-pink text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-125 transition-all shadow-md z-30"
          title="Remove charm"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
};
