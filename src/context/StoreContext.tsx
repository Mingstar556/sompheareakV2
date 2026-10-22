"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CartItem,
  Currency,
  Language,
  Product,
  CustomBraceletItem,
  Voucher,
  CustomerOrder,
  OrderStatus,
  OrderNotification,
  StorefrontConfig,
} from "@/types/store";
import { TRANSLATIONS } from "@/data/translations";
import { AVAILABLE_VOUCHERS } from "@/data/vouchers";
import { PRODUCTS } from "@/data/products";
import { sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

interface StoreContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  toggleLanguage: () => void;
  themeMode: "dark" | "light";
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addCustomBraceletToCart: (bracelet: CustomBraceletItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;

  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  viewer3DProduct: Product | null;
  setViewer3DProduct: (p: Product | null) => void;

  rewardsModalOpen: boolean;
  setRewardsModalOpen: (open: boolean) => void;

  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;

  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  sortBy: string;
  setSortBy: (s: string) => void;

  userPoints: number;
  addPoints: (pt: number) => void;
  redeemVoucherPoints: () => boolean;
  exchangePointsForVoucher: (voucher: Voucher) => boolean;
  claimedVouchers: string[];
  activeVoucher: Voucher | null;
  applyVoucherCode: (code: string) => boolean;
  removeVoucher: () => void;

  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  orders: CustomerOrder[];
  saveOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  deleteVoucher: (code: string) => void;

  // Real-Time Testing Notifications
  notifications: OrderNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  latestNotificationToast: OrderNotification | null;
  dismissNotificationToast: () => void;

  // Direct Live Storefront Editing
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  isLiveEditMode: boolean;
  setLiveEditMode: (val: boolean) => void;
  storefrontConfig: StorefrontConfig;
  updateStorefrontConfig: (updates: Partial<StorefrontConfig>) => void;
  editingDirectProduct: Product | null;
  setEditingDirectProduct: (p: Product | null) => void;
  copyModalOpen: boolean;
  setCopyModalOpen: (val: boolean) => void;

  t: (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>) => string;
}

const DEFAULT_STOREFRONT_CONFIG: StorefrontConfig = {
  announcementText: "🚀 VIRAL TOY DROP: FLASH SALE UP TO 30% OFF · FREE PHNOM PENH DELIVERY OVER $25! 🇰🇭",
  heroBadge: "🔥 TOP DROPS OF 2026",
  heroTitlePrefix: "THE ULTIMATE",
  heroTitleHighlight: "TOY & CHARM",
  heroTitleSuffix: "UNIVERSE",
  heroSubtitle: "Explore viral minifigures, anti-gravity RC racers, surprise blind boxes, and genuine Italian modular stainless steel charm bracelets.",
  freeDeliveryThreshold: 25.0,
};

const INITIAL_DEMO_ORDERS: CustomerOrder[] = [
  {
    id: "ord-1001",
    orderRef: "SR-8491",
    customerName: "Sokha Mean",
    customerPhone: "012 889 977",
    telegramHandle: "@sokha_m",
    province: "Phnom Penh",
    address: "Street 2004, Sangkat Teuk Thla, Khan Sen Sok",
    notes: "Please call 10 mins before arrival",
    paymentMethod: "khqr",
    items: [
      {
        id: "item-1",
        quantity: 1,
        product: PRODUCTS[0],
      },
      {
        id: "item-2",
        quantity: 2,
        product: PRODUCTS[1],
      },
    ],
    subtotalUsd: 24.3,
    discountUsd: 1.5,
    deliveryFeeUsd: 0,
    totalUsd: 22.8,
    totalKhr: 93480,
    pointsEarned: 14,
    voucherCodeApplied: "TOY15",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord-1002",
    orderRef: "SR-9214",
    customerName: "Dara Heng",
    customerPhone: "097 554 123",
    telegramHandle: "@dara_toylove",
    province: "Siem Reap",
    address: "Wat Bo Road, Krong Siem Reap",
    notes: "Deliver in the afternoon please",
    paymentMethod: "cod",
    items: [
      {
        id: "item-3",
        quantity: 1,
        product: PRODUCTS[2],
      },
    ],
    subtotalUsd: 16.5,
    discountUsd: 0,
    deliveryFeeUsd: 1.5,
    totalUsd: 18.0,
    totalKhr: 73800,
    pointsEarned: 10,
    voucherCodeApplied: null,
    status: "shipped",
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: OrderNotification[] = [
  {
    id: "notif-1",
    orderRef: "SR-8491",
    title: "Order Confirmed: #SR-8491",
    message: "Order for Sokha Mean confirmed ($22.80). KHQR payment verified.",
    type: "order_confirmed",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "notif-2",
    orderRef: "SR-9214",
    title: "Order Shipped: #SR-9214",
    message: "Dara Heng's order dispatched via express provincial carrier.",
    type: "order_shipped",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<"dark" | "light">("dark");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  const [products, setProductsState] = useState<Product[]>(PRODUCTS);
  const [orders, setOrdersState] = useState<CustomerOrder[]>(INITIAL_DEMO_ORDERS);
  const [vouchers, setVouchersState] = useState<Voucher[]>(AVAILABLE_VOUCHERS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewer3DProduct, setViewer3DProduct] = useState<Product | null>(null);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [userPoints, setUserPoints] = useState(25);
  const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<OrderNotification[]>(INITIAL_NOTIFICATIONS);
  const [latestNotificationToast, setLatestNotificationToast] = useState<OrderNotification | null>(null);

  // Live Storefront Direct Edit Mode
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLiveEditMode, setLiveEditMode] = useState(false);
  const [storefrontConfig, setStorefrontConfig] = useState<StorefrontConfig>(DEFAULT_STOREFRONT_CONFIG);
  const [editingDirectProduct, setEditingDirectProduct] = useState<Product | null>(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  // Load persisted settings and sync with testing backend DB
  useEffect(() => {
    try {
      const savedCurr = localStorage.getItem("somphea_currency") as Currency | null;
      if (savedCurr && (savedCurr === "USD" || savedCurr === "KHR")) setCurrencyState(savedCurr);

      const savedLang = localStorage.getItem("somphea_lang") as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "km")) setLanguageState(savedLang);

      const savedTheme = localStorage.getItem("somphea_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setThemeModeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        document.documentElement.classList.add("dark");
      }

      const savedSound = localStorage.getItem("somphea_sound");
      if (savedSound !== null) {
        const enabled = savedSound === "true";
        setSoundEnabledState(enabled);
        sounds.setEnabled(enabled);
      }

      const savedCart = localStorage.getItem("somphea_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedPts = localStorage.getItem("somphea_points");
      if (savedPts) {
        setUserPoints(parseInt(savedPts, 10));
      }

      // Check admin status & query param
      if (typeof window !== "undefined") {
        const isAuth = sessionStorage.getItem("somphea_admin_auth") === "true";
        const params = new URLSearchParams(window.location.search);
        if (params.get("admin_mode") === "true") {
          sessionStorage.setItem("somphea_admin_auth", "true");
          setIsAdminLoggedIn(true);
          setLiveEditMode(true);
        } else if (isAuth) {
          setIsAdminLoggedIn(true);
        }

        // Fetch fresh database state from Testing Server API
        fetch("/api/products")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.data) && d.data.length > 0) {
              setProductsState(d.data);
            }
          })
          .catch(() => {});

        fetch("/api/orders")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.data)) {
              setOrdersState(d.data);
            }
          })
          .catch(() => {});

        fetch("/api/vouchers")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.data)) {
              setVouchersState(d.data);
            }
          })
          .catch(() => {});

        fetch("/api/notifications")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.data)) {
              setNotifications(d.data);
            }
          })
          .catch(() => {});

        fetch("/api/store-config")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.data) {
              setStorefrontConfig(d.data);
            }
          })
          .catch(() => {});
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("somphea_currency", c);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "USD" ? "KHR" : "USD";
      localStorage.setItem("somphea_currency", next);
      sounds.playPop();
      return next;
    });
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
    localStorage.setItem("somphea_lang", l);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "km" : "en";
      localStorage.setItem("somphea_lang", next);
      sounds.playPop();
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("somphea_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      sounds.playPop();
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      sounds.setEnabled(next);
      localStorage.setItem("somphea_sound", String(next));
      if (next) sounds.playPop();
      return next;
    });
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    sounds.playCharmSnap();
    setCart((prev) => {
      const existing = prev.find((item) => item.product?.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product?.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { id: `cart-${product.id}-${Date.now()}`, product, quantity }];
      }
      localStorage.setItem("somphea_cart", JSON.stringify(updated));
      return updated;
    });
    setCartDrawerOpen(true);
  }, []);

  const addCustomBraceletToCart = useCallback((bracelet: CustomBraceletItem) => {
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#fbbf24", "#6366f1", "#ec4899"],
    });

    const cartItem: CartItem = {
      id: `cart-bracelet-${Date.now()}`,
      customBracelet: bracelet,
      quantity: 1,
      isCustom: true,
    };

    setCart((prev) => {
      const updated = [...prev, cartItem];
      localStorage.setItem("somphea_cart", JSON.stringify(updated));
      return updated;
    });
    setCartDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    sounds.playPop();
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      localStorage.setItem("somphea_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    sounds.playPop();
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === itemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
      localStorage.setItem("somphea_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("somphea_cart");
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Points & Vouchers
  const addPoints = useCallback((pt: number) => {
    setUserPoints((prev) => {
      const next = prev + pt;
      localStorage.setItem("somphea_points", String(next));
      return next;
    });
  }, []);

  const redeemVoucherPoints = useCallback((): boolean => {
    if (userPoints >= 25) {
      sounds.playFanfare();
      setUserPoints((prev) => {
        const next = prev - 25;
        localStorage.setItem("somphea_points", String(next));
        return next;
      });
      const voucher: Voucher = {
        code: "VIP10OFF",
        discountPct: 10,
        discountType: "percentage",
        pointsCost: 25,
        minSpend: 0,
        description: "10% OFF VIP Reward Voucher",
        descriptionKh: "ប័ណ្ណបញ្ចុះតម្លៃ 10% សម្រាប់សមាជិក VIP",
      };
      setClaimedVouchers((prev) => Array.from(new Set([...prev, "VIP10OFF"])));
      setActiveVoucher(voucher);
      return true;
    }
    return false;
  }, [userPoints]);

  const exchangePointsForVoucher = useCallback((voucher: Voucher): boolean => {
    if (userPoints >= voucher.pointsCost) {
      sounds.playFanfare();
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#6366f1", "#10b981"],
      });
      setUserPoints((prev) => prev - voucher.pointsCost);
      setClaimedVouchers((prev) => Array.from(new Set([...prev, voucher.code])));
      setActiveVoucher(voucher);
      return true;
    }
    sounds.playPop();
    return false;
  }, [userPoints]);

  const applyVoucherCode = useCallback((code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const matched = vouchers.find((v) => v.code === clean);
    if (matched) {
      sounds.playChime();
      setActiveVoucher(matched);
      return true;
    }
    if (clean === "WELCOME10" || clean === "KIDSTOY") {
      sounds.playChime();
      setActiveVoucher({
        code: clean,
        discountPct: 10,
        discountType: "percentage",
        pointsCost: 0,
        minSpend: 0,
        description: `10% OFF Voucher (${clean})`,
        descriptionKh: `ប័ណ្ណបញ្ចុះតម្លៃ 10% (${clean})`,
      });
      return true;
    } else if (clean === "SUPERKID20") {
      sounds.playChime();
      setActiveVoucher({
        code: clean,
        discountPct: 20,
        discountType: "percentage",
        pointsCost: 0,
        minSpend: 20,
        description: "20% OFF Super Kid Voucher (Orders > $20)",
        descriptionKh: "ប័ណ្ណបញ្ចុះតម្លៃ 20% (ការកុម្ម៉ង់លើសពី $20)",
      });
      return true;
    }
    return false;
  }, [vouchers]);

  const removeVoucher = useCallback(() => {
    sounds.playPop();
    setActiveVoucher(null);
  }, []);

  // Translation helper
  const t = useCallback(
    (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = (dict[key] || TRANSLATIONS.en[key] || key) as string;
      if (params) {
        Object.entries(params).forEach(([k, val]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(val));
        });
      }
      return text;
    },
    [language]
  );

  // Admin & Catalog Management with Testing Server DB Sync
  const addProduct = useCallback((newProd: Omit<Product, "id">): Product => {
    const id = `toy-${Date.now()}`;
    const product: Product = { ...newProd, id };

    setProductsState((prev) => {
      const updated = [product, ...prev];
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });

    // Sync to testing backend server
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }).catch(() => {});

    return product;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProductsState((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });

    // Sync to testing backend server
    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductsState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });

    fetch(`/api/products/${id}`, { method: "DELETE" }).catch(() => {});
  }, []);

  const resetProducts = useCallback(() => {
    setProductsState(PRODUCTS);
    localStorage.setItem("somphea_products", JSON.stringify(PRODUCTS));
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    }).catch(() => {});
  }, []);

  // Customer Orders Management with Testing Notifications
  const saveOrder = useCallback((order: CustomerOrder) => {
    setOrdersState((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });

    // Trigger confirmation notification immediately
    const notif: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderRef: order.orderRef,
      title: `🎉 Order Confirmed: #${order.orderRef}`,
      message: `Thank you ${order.customerName}! Your order of $${order.totalUsd.toFixed(2)} (${order.paymentMethod.toUpperCase()}) is confirmed. Express dispatch underway.`,
      type: "order_confirmed",
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [notif, ...prev]);
    setLatestNotificationToast(notif);

    // Sync to testing server DB
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).catch(() => {});
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    let orderRef = "SR-ORDER";
    setOrdersState((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          orderRef = o.orderRef;
          return { ...o, status };
        }
        return o;
      });
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });

    // Dispatch status alert notification
    const notif: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderRef,
      title: `Order #${orderRef} Updated: ${status.toUpperCase()}`,
      message: `Warehouse tracking updated status to ${status.toUpperCase()} for order #${orderRef}.`,
      type: status === "delivered" ? "order_delivered" : status === "shipped" ? "order_shipped" : "order_confirmed",
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [notif, ...prev]);
    setLatestNotificationToast(notif);

    // Sync to testing server DB
    fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrdersState((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });
    fetch(`/api/orders/${orderId}`, { method: "DELETE" }).catch(() => {});
  }, []);

  // Notifications helpers
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    fetch("/api/notifications", { method: "DELETE" }).catch(() => {});
  }, []);

  const dismissNotificationToast = useCallback(() => {
    setLatestNotificationToast(null);
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Voucher Management
  const addVoucher = useCallback((voucher: Voucher) => {
    setVouchersState((prev) => {
      const updated = [voucher, ...prev.filter((v) => v.code !== voucher.code)];
      localStorage.setItem("somphea_vouchers", JSON.stringify(updated));
      return updated;
    });
    fetch("/api/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voucher),
    }).catch(() => {});
  }, []);

  const deleteVoucher = useCallback((code: string) => {
    setVouchersState((prev) => {
      const updated = prev.filter((v) => v.code !== code);
      localStorage.setItem("somphea_vouchers", JSON.stringify(updated));
      return updated;
    });
    fetch(`/api/vouchers?code=${encodeURIComponent(code)}`, { method: "DELETE" }).catch(() => {});
  }, []);

  // Storefront Config Live Editing
  const updateStorefrontConfig = useCallback((updates: Partial<StorefrontConfig>) => {
    setStorefrontConfig((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("somphea_storefront_config", JSON.stringify(next));
      return next;
    });
    fetch("/api/store-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        language,
        setLanguage,
        toggleLanguage,
        themeMode,
        toggleTheme,
        soundEnabled,
        toggleSound,
        cart,
        addToCart,
        addCustomBraceletToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartDrawerOpen,
        setCartDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        viewer3DProduct,
        setViewer3DProduct,
        rewardsModalOpen,
        setRewardsModalOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        userPoints,
        addPoints,
        redeemVoucherPoints,
        exchangePointsForVoucher,
        claimedVouchers,
        activeVoucher,
        applyVoucherCode,
        removeVoucher,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        orders,
        saveOrder,
        updateOrderStatus,
        deleteOrder,
        vouchers,
        addVoucher,
        deleteVoucher,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearNotifications,
        latestNotificationToast,
        dismissNotificationToast,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isLiveEditMode,
        setLiveEditMode,
        storefrontConfig,
        updateStorefrontConfig,
        editingDirectProduct,
        setEditingDirectProduct,
        copyModalOpen,
        setCopyModalOpen,
        t,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
