import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initialProducts, initialOrders, initialShopSettings } from "./src/data/initialData.ts";
import { Product, Order, ShopSettings, UserProfile } from "./src/types.ts";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

interface DataStore {
  settings: ShopSettings;
  products: Product[];
  orders: Order[];
  userProfile: UserProfile;
}

function loadStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading store file, initializing defaults", err);
  }

  const defaultStore: DataStore = {
    settings: initialShopSettings,
    products: initialProducts,
    orders: initialOrders,
    userProfile: {
      fullName: "Rahul Verma",
      email: "rahul.verma@example.com",
      phone: "+91 98112 34567",
      savedAddresses: [
        {
          fullName: "Rahul Verma",
          phone: "+91 98112 34567",
          street: "Flat 304, Palm Grove Apartments",
          landmark: "Near Metro Gate 1",
          city: "New Delhi",
          state: "Delhi NCR",
          pincode: "110024"
        }
      ]
    }
  };

  saveStore(defaultStore);
  return defaultStore;
}

function saveStore(store: DataStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save store to disk", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  let store = loadStore();

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Style Hunt Men's Wear API" });
  });

  // 2. Settings
  app.get("/api/settings", (_req, res) => {
    res.json(store.settings);
  });

  app.put("/api/settings", (req, res) => {
    store.settings = { ...store.settings, ...req.body };
    saveStore(store);
    res.json({ success: true, settings: store.settings });
  });

  // 3. Products
  app.get("/api/products", (req, res) => {
    const { category, search } = req.query;
    let filtered = [...store.products];

    if (category && category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.post("/api/products", (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `sh-prod-${Date.now()}`,
      rating: req.body.rating || 4.8,
      reviewsCount: req.body.reviewsCount || 1
    };
    store.products.unshift(newProduct);
    saveStore(store);
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const index = store.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    store.products[index] = { ...store.products[index], ...req.body };
    saveStore(store);
    res.json(store.products[index]);
  });

  app.delete("/api/products/:id", (req, res) => {
    store.products = store.products.filter(p => p.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 4. Inventory Quick Adjustment
  app.post("/api/inventory/adjust", (req, res) => {
    const { productId, size, change } = req.body;
    const product = store.products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const sizeObj = product.sizes.find(s => s.size === size);
    if (!sizeObj) {
      return res.status(404).json({ error: "Size not found" });
    }
    sizeObj.stock = Math.max(0, sizeObj.stock + Number(change));
    saveStore(store);
    res.json({ success: true, product });
  });

  // 5. Orders
  app.get("/api/orders", (_req, res) => {
    res.json(store.orders);
  });

  app.post("/api/orders", (req, res) => {
    const orderData = req.body;
    const orderNumber = `SHW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      orderStatus: "placed",
      trackingNumber: `SH-EXP-${Math.floor(100000 + Math.random() * 900000)}`
    };

    // Auto-decrement inventory stock
    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const prod = store.products.find(p => p.id === item.productId);
        if (prod) {
          const sz = prod.sizes.find(s => s.size === item.size);
          if (sz) {
            sz.stock = Math.max(0, sz.stock - item.quantity);
          }
        }
      });
    }

    store.orders.unshift(newOrder);
    saveStore(store);
    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const { status, trackingNumber } = req.body;
    const order = store.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (status) order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    saveStore(store);
    res.json(order);
  });

  // 6. Analytics
  app.get("/api/analytics", (_req, res) => {
    const totalOrders = store.orders.length;
    const totalRevenue = store.orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" || o.orderStatus !== "cancelled" ? o.total : 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalInventoryValue = 0;

    store.products.forEach(p => {
      p.sizes.forEach(s => {
        if (s.stock === 0) outOfStockCount++;
        else if (s.stock <= 3) lowStockCount++;
        totalInventoryValue += s.stock * p.price;
      });
    });

    // 7-day revenue trend
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const revenueByDay = days.map((day, idx) => {
      const base = idx === 5 || idx === 6 ? 9400 : 5600;
      return {
        date: `2026-09-${10 + idx}`,
        day,
        sales: base + (idx * 650) + (store.orders.length * 320),
        orders: 4 + idx + Math.floor(store.orders.length / 2)
      };
    });

    // Category Sales breakdown
    const categoryTotals: Record<string, { sales: number; units: number }> = {
      "Jeans & Denim": { sales: 28400, units: 19 },
      "Shirts": { sales: 18900, units: 15 },
      "T-Shirts & Polos": { sales: 14200, units: 18 },
      "Trousers": { sales: 11200, units: 8 },
      "Jackets & Outerwear": { sales: 15600, units: 6 },
      "Ethnic Wear": { sales: 7800, units: 6 }
    };

    store.orders.forEach(ord => {
      ord.items.forEach(item => {
        const prod = store.products.find(p => p.id === item.productId);
        const cat = prod?.categoryLabel || "Jeans & Denim";
        if (categoryTotals[cat]) {
          categoryTotals[cat].sales += item.price * item.quantity;
          categoryTotals[cat].units += item.quantity;
        }
      });
    });

    const categorySales = Object.entries(categoryTotals).map(([name, data]) => ({
      name,
      sales: data.sales,
      units: data.units
    }));

    const topSellingProducts = store.products.slice(0, 5).map((p, i) => {
      const unitsSold = 18 - i * 3;
      const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
      return {
        id: p.id,
        name: p.name,
        category: p.categoryLabel,
        unitsSold,
        revenue: unitsSold * p.price,
        currentStock: totalStock
      };
    });

    res.json({
      todaySales: 8490,
      todayOrders: 3,
      weekSales: 48950,
      weekOrders: 28,
      monthSales: 194500,
      monthOrders: 114,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue,
      revenueByDay,
      categorySales,
      topSellingProducts
    });
  });

  // 7. Customer Profile
  app.get("/api/user/profile", (_req, res) => {
    res.json(store.userProfile);
  });

  app.post("/api/user/profile", (req, res) => {
    store.userProfile = { ...store.userProfile, ...req.body };
    saveStore(store);
    res.json(store.userProfile);
  });

  // 8. Custom Shop QR Upload
  app.post("/api/upload-qr", (req, res) => {
    const { qrImageUrl } = req.body;
    if (!qrImageUrl) {
      return res.status(400).json({ error: "No image provided" });
    }
    store.settings.upiQrImageUrl = qrImageUrl;
    saveStore(store);
    res.json({ success: true, upiQrImageUrl: qrImageUrl });
  });

  // Vite middleware for dev / static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Style Hunt Men's Wear Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
