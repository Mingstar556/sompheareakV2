"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Sparkles, MessageCircle, Truck } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const { t } = useStore();

  return (
    <div className="bg-gradient-to-r from-toy-purple via-toy-pink to-toy-orange text-white py-1.5 px-4 text-xs font-bold overflow-hidden select-none border-b border-white/10 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-toy-yellow animate-pulse flex-shrink-0" />
          <span className="truncate">{t("announcement")}</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] font-black flex-shrink-0">
          <span className="bg-black/20 px-2.5 py-0.5 rounded-full border border-white/20">
            🇰🇭 Exchange: $1 USD = 4,100 KHR
          </span>
          <a
            href="https://t.me/sompheareak"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-toy-yellow transition-colors"
          >
            <MessageCircle className="w-3 h-3 fill-white" />
            <span>@sompheareak</span>
          </a>
        </div>
      </div>
    </div>
  );
};
