"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { CustomerOrder, OrderStatus } from "@/types/store";
import { sounds } from "@/utils/audio";
import { formatPrice } from "@/utils/currency";
import {
  X,
  Printer,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Sparkles,
  XCircle,
  Receipt,
  ShieldCheck,
  Tag,
} from "lucide-react";

export const OrderReceiptModal: React.FC = () => {
  const { selectedReceiptOrder, setSelectedReceiptOrder, currency } = useStore();

  if (!selectedReceiptOrder) return null;

  const order = selectedReceiptOrder;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400 font-fredoka font-black text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Order Confirmed ✓</span>
          </span>
        );
      case "packaging":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-400 font-fredoka font-black text-xs uppercase tracking-wider">
            <Package className="w-4 h-4 text-indigo-600" />
            <span>Packaging Toys 📦</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-400 font-fredoka font-black text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4 text-teal-600" />
            <span>On Delivery Route 🚚</span>
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900/80 text-emerald-950 dark:text-white border border-emerald-500 font-fredoka font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Delivered 🎉</span>
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-400 font-fredoka font-black text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Order Rejected ✕</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-400 font-fredoka font-black text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Verification ⏳</span>
          </span>
        );
    }
  };

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  const telegramInquiryUrl = `https://t.me/sompheareak?text=${encodeURIComponent(
    `Hello Somphea Reak! I have an inquiry about my order #${order.orderRef} (${order.customerName}).`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              setSelectedReceiptOrder(null);
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Receipt Header Banner */}
          <div className="text-center pb-5 border-b-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden mx-auto mb-2 bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover rounded-2xl" />
            </div>

            <h2 className="text-xl font-black font-fredoka text-slate-900 dark:text-white uppercase tracking-tight">
              Somphea Reak Studio
            </h2>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              Official Purchase Receipt & Tax Voucher
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Street 2004, Phnom Penh, Cambodia · Telegram: @sompheareak
            </p>

            {/* Reference & Status */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white">
                #{order.orderRef}
              </span>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Customer & Delivery Meta Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Billed & Shipped To</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                {order.customerName}
              </span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>{order.customerPhone}</span>
              </span>
              {order.telegramHandle && (
                <span className="text-[#229ED9] flex items-center gap-1 font-semibold mt-0.5">
                  <MessageCircle className="w-3 h-3" />
                  <span>{order.telegramHandle}</span>
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Order Meta</span>
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate">{order.province}</span>
              </span>
              <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 block mt-0.5">
                Payment: {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Full Delivery Address */}
          {order.address && (
            <div className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 my-3 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Exact Address:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{order.address}</span>
              {order.notes && (
                <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-1 font-semibold">
                  Delivery Note: {order.notes}
                </span>
              )}
            </div>
          )}

          {/* Itemized Products List */}
          <div className="py-3 space-y-2.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Purchased Items ({order.items.length})
            </span>

            <div className="space-y-2">
              {order.items.map((item, idx) => {
                const title = item.product?.name || (item.customBracelet ? `Custom Italian Charm Bracelet (${item.customBracelet.sizeLinks} links)` : "Item");
                const price = item.product ? item.product.price * (1 - (item.product.discount || 0) / 100) : item.customBracelet?.unitPrice || 0;
                const totalItem = price * item.quantity;
                const image = item.product?.image || "/assets/logo.jpg";

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                        <Image src={image} alt={title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate font-fredoka text-sm">
                          {title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Qty: {item.quantity} × ${price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-fredoka font-black text-sm text-slate-900 dark:text-white">
                      ${totalItem.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-bold">${order.subtotalUsd.toFixed(2)}</span>
            </div>

            {order.discountUsd > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Voucher Discount {order.voucherCodeApplied ? `(${order.voucherCodeApplied})` : ""}:</span>
                </span>
                <span>-${order.discountUsd.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Fee:</span>
              <span className="font-bold">
                {order.deliveryFeeUsd === 0 ? "FREE" : `$${order.deliveryFeeUsd.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800 font-fredoka">
              <span className="text-base font-black text-slate-900 dark:text-white">Total Amount:</span>
              <div className="text-right">
                <span className="text-xl font-black text-amber-600 dark:text-toy-yellow block">
                  ${order.totalUsd.toFixed(2)} USD
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  ≈ {order.totalKhr.toLocaleString()} KHR
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              <span>VIP Loyalty Points Earned:</span>
              <span>+{order.pointsEarned} VIP pt</span>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={telegramInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-2xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-black text-xs font-fredoka flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Inquire on Telegram</span>
            </a>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs font-fredoka flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
