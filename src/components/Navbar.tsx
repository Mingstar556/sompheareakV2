"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import {
  ShoppingBag,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Trophy,
  Gift,
  Sparkles,
  Menu,
  X,
  Languages,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const {
    currency,
    toggleCurrency,
    language,
    toggleLanguage,
    themeMode,
    toggleTheme,
    soundEnabled,
    toggleSound,
    cartCount,
    setCartDrawerOpen,
    setRewardsModalOpen,
    userPoints,
    t,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Toys", href: "/#toy-catalog", icon: "🧸" },
    { label: "Italy Charms", href: "/#custom-bracelet-studio", icon: "🔗" },
    { label: "Voucher Hub", href: "/#voucher-hub", icon: "🎟️" },
    { label: "Cart & Checkout", href: "/cart", icon: "🛒" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 dark:bg-slate-950/85 light:bg-white/85 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={() => sounds.playPop()}
          className="flex items-center gap-3 group select-none flex-shrink-0"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-toy-purple to-toy-pink p-0.5 shadow-toy-glow group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900">
              <Image
                src="/assets/logo.jpg"
                alt="Somphea Reak Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform"
                priority
              />
            </div>
            {/* Sparkle badge */}
            <span className="absolute -bottom-1 -right-1 text-xs animate-bounce">✨</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-fredoka tracking-tight text-white group-hover:text-toy-cyan transition-colors">
                SOMPHEA REAK
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-toy-pink text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                V2
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
              សម្ភារៈ • Toy & Charm Studio
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sounds.playPop()}
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-fredoka flex items-center gap-1.5"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Actions & Toolbars */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* VIP Rewards Club Pill */}
          <button
            onClick={() => {
              sounds.playPop();
              setRewardsModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-toy-yellow/20 to-amber-500/20 border border-toy-yellow/40 hover:border-toy-yellow text-toy-yellow text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-sm font-fredoka"
            title="VIP Rewards Club"
          >
            <Trophy className="w-3.5 h-3.5 fill-toy-yellow" />
            <span>{userPoints} pt</span>
          </button>

          {/* Currency Switcher ($ / ៛) */}
          <button
            onClick={toggleCurrency}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-toy-purple text-xs font-black text-slate-200 transition-all active:scale-95 flex items-center gap-1"
            title="Toggle Currency (USD / KHR)"
          >
            <span className="text-toy-yellow font-black">{currency === "USD" ? "$" : "៛"}</span>
            <span className="text-[11px] font-bold">{currency}</span>
          </button>

          {/* Language Switcher (EN / KM) */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-toy-cyan text-xs font-black text-slate-200 transition-all active:scale-95 flex items-center gap-1.5"
            title="Toggle Language (English / Khmer)"
          >
            <span className="text-sm">{language === "en" ? "🇬🇧" : "🇰🇭"}</span>
            <span className="text-[11px] font-bold uppercase">{language}</span>
          </button>

          {/* Sound FX Toggle (🔊 / 🔇) */}
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
              soundEnabled
                ? "bg-slate-900 border-slate-800 text-toy-green hover:border-toy-green"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
            title={soundEnabled ? "Sound Effects Enabled" : "Sound Effects Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (🌙 / ☀️) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-toy-yellow flex items-center justify-center text-slate-300 transition-all active:scale-95"
            title="Toggle Dark / Light Theme"
          >
            {themeMode === "dark" ? (
              <Moon className="w-4 h-4 text-toy-yellow" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Cart Button with Bouncy Badge */}
          <button
            onClick={() => {
              sounds.playPop();
              setCartDrawerOpen(true);
            }}
            className="relative px-3.5 py-2 rounded-2xl bg-gradient-to-r from-toy-pink to-toy-purple hover:opacity-95 text-white font-black text-xs font-fredoka flex items-center gap-2 shadow-toy-glow transition-all hover:scale-105 active:scale-95 select-none"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t("cartTitle")}</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: [1.3, 1] }}
                className="w-5 h-5 rounded-full bg-toy-yellow text-slate-950 font-black text-[11px] flex items-center justify-center shadow-md -mr-1"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sounds.playPop();
                  setMobileMenuOpen(false);
                }}
                className="block px-4 py-2.5 rounded-xl text-sm font-black text-slate-200 hover:bg-slate-900 font-fredoka flex items-center gap-2"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
            <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">VIP Points:</span>
              <button
                onClick={() => {
                  sounds.playPop();
                  setRewardsModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-xl bg-toy-yellow/20 text-toy-yellow font-black text-xs border border-toy-yellow/30 font-fredoka"
              >
                ⭐ {userPoints} pt (Claim Rewards)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
