"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Sparkles, MessageCircle, Truck, Edit3 } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const { t, storefrontConfig, isLiveEditMode, setCopyModalOpen } = useStore();
  const announcementText = storefrontConfig?.announcementText || t("announcement");

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white py-1.5 px-4 text-xs font-bold overflow-hidden select-none border-b border-emerald-500/20 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-toy-yellow animate-pulse flex-shrink-0" />
          <span className="truncate">{announcementText}</span>
          {isLiveEditMode && (
            <button
              onClick={() => setCopyModalOpen(true)}
              className="px-2 py-0.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 shadow flex-shrink-0"
              title="Edit Store Announcement Text"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Edit Announcement</span>
            </button>
          )}
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
