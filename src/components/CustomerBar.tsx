"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/utils/audio";
import { motion } from "framer-motion";
import {
  Home,
  Receipt,
  User,
  ShoppingBag,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const CustomerBar: React.FC = () => {
  const {
    cartCount,
    setCartDrawerOpen,
    customerUser,
    isCustomerLoggedIn,
    setAccountModalOpen,
    setOrderHistoryModalOpen,
    orders,
  } = useStore();

  const [isRotating, setIsRotating] = useState(false);

  // Calculate order count for user
  const userOrdersCount = customerUser
    ? orders.filter(
        (o) =>
          (customerUser.phone && o.customerPhone === customerUser.phone) ||
          (customerUser.name && o.customerName.toLowerCase().includes(customerUser.name.toLowerCase()))
      ).length
    : orders.length;

  const handleRefresh = () => {
    sounds.playFanfare();
    setIsRotating(true);
    setTimeout(() => {
      window.location.reload();
    }, 450);
  };

  const handleHome = () => {
    sounds.playBounce();
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-3 sm:px-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="pointer-events-auto w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/50 rounded-full px-4 py-2 shadow-2xl flex items-center justify-between text-slate-700 dark:text-slate-300 select-none"
      >
        {/* 1. Home Button */}
        <button
          onClick={handleHome}
          className="flex flex-col items-center gap-0.5 hover:text-emerald-500 transition-colors py-1 px-2 group"
          title="Return to Home"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
          <span className="text-[10px] font-black font-fredoka uppercase tracking-wider">Home</span>
        </button>

        {/* 2. Order History & Receipts Button */}
        <button
          onClick={() => {
            sounds.playPop();
            setOrderHistoryModalOpen(true);
          }}
          className="relative flex flex-col items-center gap-0.5 hover:text-emerald-500 transition-colors py-1 px-2 group"
          title="Check Order History & Receipts"
        >
          <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
          <span className="text-[10px] font-black font-fredoka uppercase tracking-wider">History</span>
          {userOrdersCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center shadow">
              {userOrdersCount > 9 ? "9+" : userOrdersCount}
            </span>
          )}
        </button>

        {/* 3. Center Logo (Click to Refresh the page!) */}
        <button
          onClick={handleRefresh}
          className="relative -top-3.5 flex flex-col items-center group focus:outline-none"
          title="Click Logo to Refresh Storefront"
        >
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-600 shadow-toy-green-glow border-2 border-white dark:border-slate-900 group-hover:scale-110 active:scale-95 transition-all cursor-pointer relative overflow-hidden ${
              isRotating ? "animate-spin" : ""
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-950">
              <Image
                src="/assets/logo.jpg"
                alt="Somphea Reak Mascot Logo"
                fill
                className="object-cover"
              />
            </div>
            {/* Spinning refresh hint badge */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
          <span className="text-[9px] font-black font-fredoka uppercase text-emerald-600 dark:text-emerald-400 tracking-wider mt-0.5 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-700/40 shadow-sm">
            Refresh 🔄
          </span>
        </button>

        {/* 4. Customer Account / Profile Button */}
        <button
          onClick={() => {
            sounds.playPop();
            setAccountModalOpen(true);
          }}
          className="relative flex flex-col items-center gap-0.5 hover:text-emerald-500 transition-colors py-1 px-2 group"
          title="Customer Profile & Login"
        >
          <div className="relative">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
            {isCustomerLoggedIn && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          <span className="text-[10px] font-black font-fredoka uppercase tracking-wider truncate max-w-[50px]">
            {isCustomerLoggedIn && customerUser ? customerUser.name.split(" ")[0] : "Account"}
          </span>
        </button>

        {/* 5. Cart Button with Bouncy Badge */}
        <button
          onClick={() => {
            sounds.playPop();
            setCartDrawerOpen(true);
          }}
          className="relative flex flex-col items-center gap-0.5 hover:text-emerald-500 transition-colors py-1 px-2 group"
          title="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-4 h-4 rounded-full bg-toy-pink text-white font-black text-[9px] flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black font-fredoka uppercase tracking-wider">Cart</span>
        </button>
      </motion.div>
    </div>
  );
};
