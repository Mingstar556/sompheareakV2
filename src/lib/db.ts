import fs from "fs";
import path from "path";
import { Product, CustomerOrder, Voucher, OrderNotification, StorefrontConfig, OrderStatus } from "@/types/store";
import { PRODUCTS } from "@/data/products";
import { AVAILABLE_VOUCHERS } from "@/data/vouchers";

export interface DatabaseSchema {
  products: Product[];
  orders: CustomerOrder[];
  vouchers: Voucher[];
  notifications: OrderNotification[];
  storefrontConfig: StorefrontConfig;
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "testing_db.json");

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
    discountUsd: 0,
    deliveryFeeUsd: 1.5,
    totalUsd: 25.8,
    totalKhr: 105780,
    pointsEarned: 14,
    voucherCodeApplied: null,
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord-1002",
    orderRef: "SR-9204",
    customerName: "Chan Dara",
    customerPhone: "098 765 432",
    telegramHandle: "@dara_toylover",
    province: "Siem Reap",
    address: "National Road 6, Svay Dangkum",
    notes: "Leave package at reception if unavailable",
    paymentMethod: "cod",
    items: [
      {
        id: "item-3",
        quantity: 1,
        product: PRODUCTS[2],
      },
    ],
    subtotalUsd: 11.6,
    discountUsd: 1.16,
    deliveryFeeUsd: 1.5,
    totalUsd: 11.94,
    totalKhr: 48954,
    pointsEarned: 8,
    voucherCodeApplied: "WELCOME10",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: OrderNotification[] = [
  {
    id: "notif-1",
    orderRef: "SR-8491",
    title: "Order Confirmed: #SR-8491",
    message: "Customer Sokha Mean's order of $25.80 has been confirmed. KHQR payment verified.",
    type: "order_confirmed",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "notif-2",
    orderRef: "SR-9204",
    title: "New Order Placed: #SR-9204",
    message: "New COD order from Chan Dara in Siem Reap ($11.94). Awaiting admin confirmation.",
    type: "order_placed",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

// Initialize and Read Database
export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialDb: DatabaseSchema = {
        products: PRODUCTS,
        orders: INITIAL_DEMO_ORDERS,
        vouchers: AVAILABLE_VOUCHERS,
        notifications: INITIAL_NOTIFICATIONS,
        storefrontConfig: DEFAULT_STOREFRONT_CONFIG,
      };
      saveDb(initialDb);
      return initialDb;
    }

    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products || PRODUCTS,
      orders: parsed.orders || INITIAL_DEMO_ORDERS,
      vouchers: parsed.vouchers || AVAILABLE_VOUCHERS,
      notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
      storefrontConfig: parsed.storefrontConfig || DEFAULT_STOREFRONT_CONFIG,
    };
  } catch (err) {
    console.error("Error reading test DB, falling back to defaults", err);
    return {
      products: PRODUCTS,
      orders: INITIAL_DEMO_ORDERS,
      vouchers: AVAILABLE_VOUCHERS,
      notifications: INITIAL_NOTIFICATIONS,
      storefrontConfig: DEFAULT_STOREFRONT_CONFIG,
    };
  }
}

// Save Database to Disk
export function saveDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving test DB to disk", err);
  }
}

// ==========================================
// PRODUCTS OPERATIONS
// ==========================================
export function getProducts(): Product[] {
  return getDb().products;
}

export function getProductById(id: string): Product | undefined {
  return getDb().products.find((p) => p.id === id);
}

export function addProduct(newProduct: Omit<Product, "id">): Product {
  const db = getDb();
  const id = `toy-${Date.now()}`;
  const product: Product = { ...newProduct, id };
  db.products.unshift(product);
  saveDb(db);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = getDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.products[idx] = { ...db.products[idx], ...updates };
  saveDb(db);
  return db.products[idx];
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function resetProducts(): Product[] {
  const db = getDb();
  db.products = PRODUCTS;
  saveDb(db);
  return PRODUCTS;
}

// ==========================================
// ORDERS & NOTIFICATIONS OPERATIONS
// ==========================================
export function getOrders(): CustomerOrder[] {
  return getDb().orders;
}

export function createOrder(order: CustomerOrder): { order: CustomerOrder; notification: OrderNotification } {
  const db = getDb();
  db.orders.unshift(order);

  // Generate automated order confirmation notification
  const notification: OrderNotification = {
    id: `notif-${Date.now()}`,
    orderRef: order.orderRef,
    title: `New Order Placed: #${order.orderRef}`,
    message: `${order.customerName} placed order #${order.orderRef} (${formatCurrencySimple(order.totalUsd)}) via ${order.paymentMethod.toUpperCase()}. Deliver to ${order.province}.`,
    type: "order_placed",
    read: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(notification);
  saveDb(db);

  return { order, notification };
}

export function updateOrderStatus(orderId: string, status: OrderStatus): CustomerOrder | null {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;

  // Generate status update notification
  let notifTitle = `Order Status: #${order.orderRef}`;
  let notifMessage = `Order #${order.orderRef} status updated to ${status.toUpperCase()}.`;
  let notifType: OrderNotification["type"] = "system";

  if (status === "confirmed") {
    notifTitle = `Order Confirmed: #${order.orderRef}`;
    notifMessage = `Order #${order.orderRef} for ${order.customerName} has been confirmed. Ready for packing!`;
    notifType = "order_confirmed";
  } else if (status === "packaging") {
    notifTitle = `Packaging Order: #${order.orderRef}`;
    notifMessage = `Warehouse is packaging items for order #${order.orderRef}.`;
  } else if (status === "shipped") {
    notifTitle = `Order Dispatched: #${order.orderRef}`;
    notifMessage = `Order #${order.orderRef} is on delivery route to ${order.address}, ${order.province}.`;
    notifType = "order_shipped";
  } else if (status === "delivered") {
    notifTitle = `Order Delivered: #${order.orderRef}`;
    notifMessage = `Order #${order.orderRef} delivered successfully! +${order.pointsEarned} VIP points active.`;
    notifType = "order_delivered";
  }

  const notification: OrderNotification = {
    id: `notif-${Date.now()}`,
    orderRef: order.orderRef,
    title: notifTitle,
    message: notifMessage,
    type: notifType,
    read: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(notification);
  saveDb(db);
  return order;
}

export function deleteOrder(orderId: string): boolean {
  const db = getDb();
  const initialLen = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== orderId);
  if (db.orders.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ==========================================
// NOTIFICATIONS OPERATIONS
// ==========================================
export function getNotifications(): OrderNotification[] {
  return getDb().notifications;
}

export function markNotificationAsRead(id: string): boolean {
  const db = getDb();
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
    saveDb(db);
    return true;
  }
  return false;
}

export function clearNotifications(): void {
  const db = getDb();
  db.notifications = [];
  saveDb(db);
}

// ==========================================
// VOUCHERS OPERATIONS
// ==========================================
export function getVouchers(): Voucher[] {
  return getDb().vouchers;
}

export function addVoucher(voucher: Voucher): Voucher {
  const db = getDb();
  db.vouchers = [voucher, ...db.vouchers.filter((v) => v.code !== voucher.code)];
  saveDb(db);
  return voucher;
}

export function deleteVoucher(code: string): boolean {
  const db = getDb();
  const initialLen = db.vouchers.length;
  db.vouchers = db.vouchers.filter((v) => v.code !== code);
  if (db.vouchers.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ==========================================
// STOREFRONT CONFIG (FOR LIVE STORE DIRECT EDIT)
// ==========================================
export function getStorefrontConfig(): StorefrontConfig {
  return getDb().storefrontConfig;
}

export function updateStorefrontConfig(updates: Partial<StorefrontConfig>): StorefrontConfig {
  const db = getDb();
  db.storefrontConfig = { ...db.storefrontConfig, ...updates };
  saveDb(db);
  return db.storefrontConfig;
}

// Reset Entire DB
export function resetDb(): DatabaseSchema {
  const initialDb: DatabaseSchema = {
    products: PRODUCTS,
    orders: INITIAL_DEMO_ORDERS,
    vouchers: AVAILABLE_VOUCHERS,
    notifications: INITIAL_NOTIFICATIONS,
    storefrontConfig: DEFAULT_STOREFRONT_CONFIG,
  };
  saveDb(initialDb);
  return initialDb;
}

function formatCurrencySimple(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
