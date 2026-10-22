"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, Currency, Language, Product, CustomBraceletItem, Voucher, CustomerOrder, OrderStatus } from "@/types/store";
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
  addProduct: (product: Omit<Product, 'id'>) => Product;
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

  t: (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>) => string;
}

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

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<"dark" | "light">("dark");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  const [products, setProductsState] = useState<Product[]>(PRODUCTS);
  const [orders, setOrdersState] = useState<CustomerOrder[]>([]);
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

  // Load persisted settings from localStorage safely
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
        const en = savedSound === "true";
        setSoundEnabledState(en);
        sounds.setEnabled(en);
      }

      const savedCart = localStorage.getItem("somphea_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedPts = localStorage.getItem("somphea_points");
      if (savedPts) {
        setUserPoints(parseInt(savedPts, 10));
      }

      const savedProds = localStorage.getItem("somphea_products");
      if (savedProds) {
        try {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProductsState(parsed);
          }
        } catch {}
      }

      const savedOrders = localStorage.getItem("somphea_orders");
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrdersState(parsed);
          } else {
            setOrdersState(INITIAL_DEMO_ORDERS);
          }
        } catch {
          setOrdersState(INITIAL_DEMO_ORDERS);
        }
      } else {
        setOrdersState(INITIAL_DEMO_ORDERS);
        localStorage.setItem("somphea_orders", JSON.stringify(INITIAL_DEMO_ORDERS));
      }

      const savedVouchers = localStorage.getItem("somphea_vouchers");
      if (savedVouchers) {
        try {
          const parsed = JSON.parse(savedVouchers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVouchersState(parsed);
          }
        } catch {}
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

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("somphea_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync points to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("somphea_points", String(userPoints));
    } catch {
      // ignore
    }
  }, [userPoints]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    sounds.playChime();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f43f5e", "#6366f1", "#fbbf24", "#06b6d4"],
    });

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product?.id === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { id: `cart-${product.id}-${Date.now()}`, product, quantity }];
    });
  }, []);

  const addCustomBraceletToCart = useCallback((bracelet: CustomBraceletItem) => {
    sounds.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#fbbf24", "#6366f1", "#f43f5e"],
    });

    setCart((prev) => [
      ...prev,
      {
        id: `cart-bracelet-${Date.now()}`,
        customBracelet: bracelet,
        quantity: bracelet.quantity,
        isCustom: true,
      },
    ]);
    setCartDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    sounds.playPop();
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    sounds.playPop();
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addPoints = useCallback((pt: number) => {
    setUserPoints((prev) => prev + pt);
  }, []);

  const redeemVoucherPoints = useCallback(() => {
    if (userPoints >= 25) {
      sounds.playFanfare();
      setUserPoints((prev) => prev - 25);
      const voucher = AVAILABLE_VOUCHERS.find((v) => v.code === "VIP10OFF") || {
        code: "VIP10OFF",
        discountPct: 10,
        discountType: "percentage" as const,
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
    const matched = AVAILABLE_VOUCHERS.find((v) => v.code === clean);
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
  }, []);

  const removeVoucher = useCallback(() => {
    sounds.playPop();
    setActiveVoucher(null);
  }, []);

  // Translation helper with parametric placeholder replacement
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

  // Admin & Catalog Management
  const addProduct = useCallback((newProd: Omit<Product, "id">): Product => {
    const id = `toy-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProductsState((prev) => {
      const updated = [product, ...prev];
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });
    return product;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProductsState((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductsState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("somphea_products", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProducts = useCallback(() => {
    setProductsState(PRODUCTS);
    localStorage.setItem("somphea_products", JSON.stringify(PRODUCTS));
  }, []);

  // Customer Orders Management
  const saveOrder = useCallback((order: CustomerOrder) => {
    setOrdersState((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrdersState((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrdersState((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem("somphea_orders", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Voucher Management
  const addVoucher = useCallback((voucher: Voucher) => {
    setVouchersState((prev) => {
      const updated = [voucher, ...prev.filter((v) => v.code !== voucher.code)];
      localStorage.setItem("somphea_vouchers", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteVoucher = useCallback((code: string) => {
    setVouchersState((prev) => {
      const updated = prev.filter((v) => v.code !== code);
      localStorage.setItem("somphea_vouchers", JSON.stringify(updated));
      return updated;
    });
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
