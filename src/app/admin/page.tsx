"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { Product, CustomerOrder, OrderStatus, Voucher, ToyRarity } from "@/types/store";
import { formatPrice } from "@/utils/currency";
import { sounds } from "@/utils/audio";
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Package,
  ShoppingBag,
  DollarSign,
  Ticket,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  ExternalLink,
  Sun,
  Moon,
  MessageCircle,
  Phone,
  MapPin,
  X,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpRight,
  LogOut,
  RefreshCw,
} from "lucide-react";

const ADMIN_PASSWORD = "Sompheareakshop1234";

const PRESET_TOY_IMAGES = [
  { label: "Cyber Mecha", url: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80" },
  { label: "Pop Bear Mystery", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" },
  { label: "Wall Climber RC", url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80" },
  { label: "Galaxy Plushie", url: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=800&q=80" },
  { label: "Magna-Builder Blocks", url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80" },
  { label: "Crystal DIY Science", url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80" },
  { label: "Solar System Hologram", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
  { label: "Astronaut Minifigure", url: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=80" },
];

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    vouchers,
    addVoucher,
    deleteVoucher,
    currency,
    themeMode,
    toggleTheme,
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [shakeLogin, setShakeLogin] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "vouchers">("products");

  // Product Filters & Modal State
  const [productSearch, setProductSearch] = useState<string>("");
  const [productCatFilter, setProductCatFilter] = useState<string>("all");
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [pName, setPName] = useState("");
  const [pNameKh, setPNameKh] = useState("");
  const [pCat, setPCat] = useState("minifigure");
  const [pPrice, setPPrice] = useState("9.50");
  const [pDiscount, setPDiscount] = useState("0");
  const [pStock, setPStock] = useState("20");
  const [pPt, setPPt] = useState("5");
  const [pImage, setPImage] = useState(PRESET_TOY_IMAGES[0].url);
  const [pBio, setPBio] = useState("");
  const [pBioKh, setPBioKh] = useState("");
  const [pRarity, setPRarity] = useState<ToyRarity>("Rare");

  // Orders Filter State
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Voucher Form State
  const [voucherModalOpen, setVoucherModalOpen] = useState<boolean>(false);
  const [vCode, setVCode] = useState("");
  const [vDiscountPct, setVDiscountPct] = useState("15");
  const [vPointsCost, setVPointsCost] = useState("35");
  const [vMinSpend, setVMinSpend] = useState("0");
  const [vDescription, setVDescription] = useState("");
  const [vDescriptionKh, setVDescriptionKh] = useState("");
  const [vBadge, setVBadge] = useState("HOT PROMO");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("somphea_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sounds.playFanfare();
      sessionStorage.setItem("somphea_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      sounds.playPop();
      setAuthError("Incorrect password. Access denied.");
      setShakeLogin(true);
      setTimeout(() => setShakeLogin(false), 500);
    }
  };

  const handleLogout = () => {
    sounds.playPop();
    sessionStorage.removeItem("somphea_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Open Modal for New Product
  const handleOpenAddProduct = () => {
    sounds.playPop();
    setEditingProduct(null);
    setPName("");
    setPNameKh("");
    setPCat("minifigure");
    setPPrice("9.50");
    setPDiscount("0");
    setPStock("25");
    setPPt("5");
    setPImage(PRESET_TOY_IMAGES[0].url);
    setPBio("Fun & collectible toy crafted with high durable kid-safe ABS material.");
    setPBioKh("តុក្កតាប្រដាប់ក្មេងលេងគុណភាពខ្ពស់ សុវត្ថិភាពសម្រាប់កុមារ។");
    setPRarity("Rare");
    setProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    sounds.playPop();
    setEditingProduct(prod);
    setPName(prod.name);
    setPNameKh(prod.nameKh || prod.name);
    setPCat(prod.cat);
    setPPrice(prod.price.toString());
    setPDiscount(prod.discount.toString());
    setPStock(prod.stock.toString());
    setPPt(prod.pt.toString());
    setPImage(prod.image);
    setPBio(prod.bio);
    setPBioKh(prod.bioKh || prod.bio);
    setPRarity(prod.rarity || "Rare");
    setProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      alert("Please enter a toy name.");
      return;
    }

    const priceNum = parseFloat(pPrice) || 5.0;
    const discountNum = parseInt(pDiscount, 10) || 0;
    const stockNum = parseInt(pStock, 10) || 10;
    const ptNum = parseInt(pPt, 10) || 4;

    if (editingProduct) {
      // Update existing
      updateProduct(editingProduct.id, {
        name: pName.trim(),
        nameKh: pNameKh.trim() || pName.trim(),
        cat: pCat,
        price: priceNum,
        discount: discountNum,
        stock: stockNum,
        pt: ptNum,
        image: pImage,
        bio: pBio.trim(),
        bioKh: pBioKh.trim() || pBio.trim(),
        rarity: pRarity,
      });
      sounds.playChime();
      showToast(`Updated "${pName}" successfully!`);
    } else {
      // Add new
      addProduct({
        name: pName.trim(),
        nameKh: pNameKh.trim() || pName.trim(),
        cat: pCat,
        price: priceNum,
        discount: discountNum,
        stock: stockNum,
        pt: ptNum,
        image: pImage,
        bio: pBio.trim(),
        bioKh: pBioKh.trim() || pBio.trim(),
        rarity: pRarity,
        rating: 5.0,
        reviewsCount: 1,
        featured: true,
        isNew: true,
        free_delivery: true,
        ageRecommendation: "Ages 4+",
        dimensions: "10cm x 8cm",
      });
      sounds.playFanfare();
      showToast(`Added new toy "${pName}" to storefront!`);
    }

    setProductModalOpen(false);
  };

  // Save Voucher
  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim()) return;

    const newV: Voucher = {
      code: vCode.trim().toUpperCase(),
      discountPct: parseInt(vDiscountPct, 10) || 10,
      discountType: "percentage",
      pointsCost: parseInt(vPointsCost, 10) || 25,
      minSpend: parseFloat(vMinSpend) || 0,
      description: vDescription.trim() || `${vDiscountPct}% OFF Special Voucher`,
      descriptionKh: vDescriptionKh.trim() || `ប័ណ្ណបញ្ចុះតម្លៃ ${vDiscountPct}%`,
      badge: vBadge.trim().toUpperCase(),
      colorGrad: "from-emerald-500 to-teal-700",
    };

    addVoucher(newV);
    sounds.playFanfare();
    showToast(`Voucher "${newV.code}" created!`);
    setVoucherModalOpen(false);
    setVCode("");
    setVDescription("");
    setVDescriptionKh("");
  };

  // Metrics Calculation
  const totalRevenueUsd = orders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const inStockProductsCount = products.filter((p) => p.stock > 0).length;
  const totalPointsCirculation = orders.reduce((sum, o) => sum + (o.pointsEarned || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.nameKh && p.nameKh.toLowerCase().includes(productSearch.toLowerCase())) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === "all" || p.cat === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderRef.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch) ||
      o.telegramHandle.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // 1. PASSWORD GATE IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        <motion.div
          animate={shakeLogin ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-toy-green-glow">
              <Lock className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black font-fredoka text-white">
              Somphea Reak Owner Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Administrative Gateway &middot; Enter authorized passcode to manage toys, pricing, and live customer orders.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Owner Passcode</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter store password"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 outline-none pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-base tracking-wide flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all mt-2"
              >
                <Unlock className="w-5 h-5" />
                <span>Unlock Control Center</span>
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Somphea Reak Architecture v2.0 Secured</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5">
              <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg font-fredoka text-slate-900 dark:text-white">
                  SOMPHEA REAK
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Connected to Live Storefront</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                sounds.playPop();
                toggleTheme();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
              title="Toggle Light / Dark mode"
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-rose-300 dark:border-rose-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Quick Analytics Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block leading-tight">Total Volume</span>
              <span className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                {formatPrice(totalRevenueUsd, currency)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                ≈ {Math.round(totalRevenueUsd * 4100).toLocaleString()} KHR
              </span>
            </div>
          </div>

          {/* Orders */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block leading-tight">Total Orders</span>
              <span className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                {orders.length}
              </span>
              {pendingOrdersCount > 0 ? (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                  {pendingOrdersCount} pending fulfillment!
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">All caught up</span>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block leading-tight">Active Catalog</span>
              <span className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                {products.length}
              </span>
              <span className="text-[10px] text-slate-400 block">{inStockProductsCount} items in stock</span>
            </div>
          </div>

          {/* Points */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block leading-tight">Loyalty Points</span>
              <span className="text-2xl font-black font-fredoka text-amber-600 dark:text-amber-400">
                {totalPointsCirculation} pt
              </span>
              <span className="text-[10px] text-slate-400 block">Issued on customer orders</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab("products");
              }}
              className={`px-5 py-2.5 rounded-2xl font-black font-fredoka text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-emerald-600 text-white shadow-toy-green-glow"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab("orders");
              }}
              className={`px-5 py-2.5 rounded-2xl font-black font-fredoka text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-emerald-600 text-white shadow-toy-green-glow"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab("vouchers");
              }}
              className={`px-5 py-2.5 rounded-2xl font-black font-fredoka text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === "vouchers"
                  ? "bg-emerald-600 text-white shadow-toy-green-glow"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Vouchers ({vouchers.length})</span>
            </button>
          </div>

          {activeTab === "products" && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (confirm("Reset catalog back to starter default products?")) {
                    sounds.playPop();
                    resetProducts();
                    showToast("Restored factory catalog!");
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Reset to default toys"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 text-white font-black font-fredoka text-xs sm:text-sm shadow-toy-green-glow flex items-center gap-2 hover:scale-102 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Toy</span>
              </button>
            </div>
          )}

          {activeTab === "vouchers" && (
            <button
              onClick={() => {
                sounds.playPop();
                setVoucherModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 text-white font-black font-fredoka text-xs sm:text-sm shadow-toy-green-glow flex items-center gap-2 hover:scale-102 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Voucher</span>
            </button>
          )}
        </div>

        {/* ==================================================== */}
        {/* TAB 1: PRODUCT CATALOG MANAGEMENT                    */}
        {/* ==================================================== */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search toys by name or ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {["all", "minifigure", "blind-box", "toy-universe", "custom-bracelet"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playPop();
                      setProductCatFilter(cat);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      productCatFilter === cat
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {cat.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => {
                const discountedPrice = prod.discount > 0 ? prod.price * (1 - prod.discount / 100) : prod.price;

                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        {prod.discount > 0 && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[10px] font-black uppercase">
                            -{prod.discount}% OFF
                          </span>
                        )}
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-bold">
                          +{prod.pt} VIP pt
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {prod.cat}
                        </span>
                        <h4 className="font-black text-sm font-fredoka text-slate-900 dark:text-white line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                          {prod.nameKh || prod.bio}
                        </p>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-base font-black text-amber-600 dark:text-toy-yellow font-fredoka">
                            {formatPrice(discountedPrice, currency)}
                          </span>
                          {prod.discount > 0 && (
                            <span className="text-xs line-through text-slate-400">
                              {formatPrice(prod.price, currency)}
                            </span>
                          )}
                          <span className="ml-auto text-[10px] font-bold text-slate-500">
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                            sounds.playPop();
                            deleteProduct(prod.id);
                            showToast(`Deleted ${prod.name}`);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-all border border-rose-200 dark:border-rose-900/40"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT                    */}
        {/* ==================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Search and Status Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ref, customer, phone..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {["all", "pending", "confirmed", "packaging", "shipped", "delivered", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      sounds.playPop();
                      setOrderStatusFilter(st);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      orderStatusFilter === st
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-4xl block mb-2">📦</span>
                <h3 className="text-base font-black font-fredoka text-slate-700 dark:text-slate-300">
                  No orders found
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Orders submitted through the storefront or cart checkout will automatically arrive here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const statusColors: Record<OrderStatus, string> = {
                    pending: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50",
                    confirmed: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700/50",
                    packaging: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700/50",
                    shipped: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50",
                    delivered: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50",
                    cancelled: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700/50",
                  };

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      {/* Top Bar: Order Ref, Status Dropdown, Time */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-black text-emerald-700 dark:text-toy-cyan bg-emerald-50 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-slate-800">
                            {ord.orderRef}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(ord.createdAt).toLocaleDateString()} at{" "}
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Live Status Selector */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-500">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                sounds.playChime();
                                updateOrderStatus(ord.id, e.target.value as OrderStatus);
                                showToast(`Order ${ord.orderRef} set to ${e.target.value.toUpperCase()}`);
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-black capitalize border outline-none cursor-pointer ${
                                statusColors[ord.status] || "bg-slate-200 text-slate-800"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="packaging">Packaging</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Delete Order */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete order ${ord.orderRef}?`)) {
                                sounds.playPop();
                                deleteOrder(ord.id);
                                showToast(`Deleted order ${ord.orderRef}`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info & Shipping Address */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Customer */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{ord.customerName}</div>
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{ord.customerPhone}</span>
                          </a>
                          {ord.telegramHandle && (
                            <a
                              href={`https://t.me/${ord.telegramHandle.replace("@", "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#229ED9] font-bold flex items-center gap-1 hover:underline"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{ord.telegramHandle} (Open Chat)</span>
                            </a>
                          )}
                        </div>

                        {/* Delivery Location */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Destination</span>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{ord.province}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {ord.address}
                          </p>
                          {ord.notes && (
                            <p className="text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                              Note: {ord.notes}
                            </p>
                          )}
                        </div>

                        {/* Payment & Totals */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment & Total</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-black text-[10px] uppercase">
                              {ord.paymentMethod.toUpperCase()}
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                              +{ord.pointsEarned} pt
                            </span>
                          </div>
                          <div className="text-lg font-black text-amber-600 dark:text-toy-yellow font-fredoka pt-1">
                            {formatPrice(ord.totalUsd, currency)}{" "}
                            <span className="text-xs text-slate-400 font-medium font-sans">
                              ({ord.totalKhr.toLocaleString()} KHR)
                            </span>
                          </div>
                          {ord.voucherCodeApplied && (
                            <span className="text-[10px] text-teal-600 font-bold block">
                              Voucher: {ord.voucherCodeApplied}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-500 block mb-2">
                          Items in Order ({ord.items.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs"
                            >
                              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                                <Image
                                  src={
                                    item.product
                                      ? item.product.image
                                      : item.customBracelet?.charms[0]?.charm.image || "/assets/charm_clean.png"
                                  }
                                  alt="Item thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-900 dark:text-white truncate">
                                  {item.product
                                    ? item.product.name
                                    : `Custom Bracelet (${item.customBracelet?.sizeLinks} Links)`}
                                </h5>
                                <div className="text-slate-500 text-[11px]">
                                  Qty: {item.quantity} &middot;{" "}
                                  <span className="font-bold text-amber-600 dark:text-toy-yellow">
                                    {formatPrice(
                                      (item.product ? item.product.price : item.customBracelet?.unitPrice || 0) *
                                        item.quantity,
                                      currency
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: VOUCHER MANAGEMENT                            */}
        {/* ==================================================== */}
        {activeTab === "vouchers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map((vouch) => (
                <div
                  key={vouch.code}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase">
                        {vouch.badge || "PROMO"}
                      </span>
                      <span className="text-xs font-black text-amber-600 dark:text-toy-yellow font-fredoka">
                        {vouch.pointsCost} pt
                      </span>
                    </div>

                    <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                      {vouch.discountType === "fixed"
                        ? `$${vouch.fixedDiscountUsd?.toFixed(2)} OFF`
                        : `${vouch.discountPct}% OFF`}
                    </div>

                    <div className="font-mono text-xs font-black text-emerald-700 dark:text-toy-cyan bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                      {vouch.code}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {vouch.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Min spend: ${vouch.minSpend}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete voucher ${vouch.code}?`)) {
                          sounds.playPop();
                          deleteVoucher(vouch.code);
                          showToast(`Deleted voucher ${vouch.code}`);
                        }
                      }}
                      className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT                            */}
      {/* ==================================================== */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setProductModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl font-black font-fredoka text-slate-900 dark:text-white mb-1">
                {editingProduct ? `Edit Toy: ${editingProduct.name}` : "Add New Toy to Storefront"}
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Fill in toy details. Updates will immediately reflect on the live customer website.
              </p>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Name EN & KH */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Toy Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="e.g. Cyber Mech Titan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Toy Name (Khmer)
                    </label>
                    <input
                      type="text"
                      value={pNameKh}
                      onChange={(e) => setPNameKh(e.target.value)}
                      placeholder="ឈ្មោះប្រដាប់ក្មេងលេង"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Category & Rarity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={pCat}
                      onChange={(e) => setPCat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="minifigure">Minifigure Heroes</option>
                      <option value="blind-box">Mystery Blind Box</option>
                      <option value="toy-universe">Tech & RC Toys</option>
                      <option value="custom-bracelet">Italian Charm Link</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Rarity Badge
                    </label>
                    <select
                      value={pRarity}
                      onChange={(e) => setPRarity(e.target.value as ToyRarity)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="Common">Common</option>
                      <option value="Rare">Rare</option>
                      <option value="Super Rare">Super Rare</option>
                      <option value="Legendary">Legendary</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </div>
                </div>

                {/* Price, Discount, Stock, Points */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={pDiscount}
                      onChange={(e) => setPDiscount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      VIP Points (pt)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pPt}
                      onChange={(e) => setPPt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Preset Image Chooser or Custom URL */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Image URL or Preset Gallery
                  </label>
                  <input
                    type="url"
                    required
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none mb-2"
                  />
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_TOY_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPImage(img.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border transition-all ${
                          pImage === img.url
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={pBio}
                    onChange={(e) => setPBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                {/* Save CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-sm flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProduct ? "Save Changes to Store" : "Add Toy to Storefront"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: ADD VOUCHER                                   */}
      {/* ==================================================== */}
      <AnimatePresence>
        {voucherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setVoucherModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl font-black font-fredoka text-slate-900 dark:text-white mb-1">
                Create Loyalty Voucher
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Customers can exchange their earned points for this voucher on the storefront.
              </p>

              <form onSubmit={handleSaveVoucher} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Promo Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={vCode}
                    onChange={(e) => setVCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TOY25OFF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={vDiscountPct}
                      onChange={(e) => setVDiscountPct(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Points Cost (pt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={vPointsCost}
                      onChange={(e) => setVPointsCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Voucher Description (English)
                  </label>
                  <input
                    type="text"
                    value={vDescription}
                    onChange={(e) => setVDescription(e.target.value)}
                    placeholder="e.g. 15% OFF Any Order"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-800 shadow-toy-green-glow border-b-4 border-emerald-950 font-fredoka text-sm flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deploy Voucher to Store</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
