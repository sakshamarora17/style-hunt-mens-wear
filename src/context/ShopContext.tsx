import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ShopSettings, UserProfile, SalesAnalytics } from '../types';
import { initialProducts, initialOrders, initialShopSettings } from '../data/initialData';

interface ShopContextType {
  products: Product[];
  settings: ShopSettings;
  orders: Order[];
  analytics: SalesAnalytics | null;
  cart: CartItem[];
  wishlist: string[];
  userProfile: UserProfile;
  activeCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isProfileOpen: boolean;
  isStoreLocationOpen: boolean;
  isLocationOpen?: boolean;
  isSizeChartOpen: boolean;
  currentView: 'store' | 'admin';
  isLoading: boolean;
  notification: string | null;
  
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
  setIsStoreLocationOpen: (open: boolean) => void;
  setIsLocationOpen?: (open: boolean) => void;
  setIsSizeChartOpen: (open: boolean) => void;
  setCurrentView: (view: 'store' | 'admin') => void;
  showNotification: (msg: string) => void;

  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (productId: string, size: string, change: number) => Promise<void>;
  
  updateSettings: (settings: Partial<ShopSettings>) => Promise<void>;
  uploadShopQr: (qrImageUrl: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settings, setSettings] = useState<ShopSettings>(initialShopSettings);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('stylehunt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stylehunt_wishlist');
      return saved ? JSON.parse(saved) : ['sh-jeans-01', 'sh-shirt-01'];
    } catch {
      return ['sh-jeans-01'];
    }
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
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
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreLocationOpen, setIsStoreLocationOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('stylehunt_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('stylehunt_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Initial fetch from backend API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [resProd, resSett, resOrd, resAnal, resProf] = await Promise.allSettled([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/user/profile').then(r => r.json()),
      ]);

      if (resProd.status === 'fulfilled' && Array.isArray(resProd.value) && resProd.value.length > 0) {
        setProducts(resProd.value);
      }
      if (resSett.status === 'fulfilled' && resSett.value?.shopName) {
        setSettings(resSett.value);
      }
      if (resOrd.status === 'fulfilled' && Array.isArray(resOrd.value)) {
        setOrders(resOrd.value);
      }
      if (resAnal.status === 'fulfilled' && resAnal.value) {
        setAnalytics(resAnal.value);
      }
      if (resProf.status === 'fulfilled' && resProf.value?.fullName) {
        setUserProfile(resProf.value);
      }
    } catch (err) {
      console.warn("Backend API sync notice (using local fallback store):", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedSize: size, quantity }];
      }
    });
    showNotification(`Added ${product.name} (Size: ${size}) to bag!`);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showNotification("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showNotification("Saved to your wishlist");
        return [...prev, productId];
      }
    });
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const newOrder: Order = await res.json();
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        refreshData();
        return newOrder;
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback in-memory order
    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customer: orderData.customer!,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'upi',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      trackingNumber: `SH-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      ...orderData
    };
    setOrders((prev) => [fallbackOrder, ...prev]);
    clearCart();
    return fallbackOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber })
      });
    } catch (e) {
      console.error(e);
    }
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, orderStatus: status, ...(trackingNumber ? { trackingNumber } : {}) }
          : ord
      )
    );
    showNotification(`Order #${orderId} status updated to ${status}`);
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
        showNotification(`Product "${created.name}" added successfully`);
        return created;
      }
    } catch (e) {
      console.error(e);
    }
    const localNew: Product = {
      ...productData,
      id: `sh-prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts((prev) => [localNew, ...prev]);
    showNotification(`Product "${localNew.name}" added successfully`);
    return localNew;
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const updated: Product = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showNotification("Product updated successfully");
        return updated;
      }
    } catch (e) {
      console.error(e);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? ({ ...p, ...productData } as Product) : p))
    );
    showNotification("Product updated successfully");
    const updated = products.find((p) => p.id === id)!;
    return updated;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification("Product removed from catalog");
  };

  const adjustStock = async (productId: string, size: string, change: number): Promise<void> => {
    try {
      await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size, change })
      });
    } catch (e) {
      console.error(e);
    }
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          sizes: prod.sizes.map((sz) =>
            sz.size === size ? { ...sz, stock: Math.max(0, sz.stock + change) } : sz
          )
        };
      })
    );
  };

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showNotification("Shop details updated successfully");
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showNotification("Shop details updated successfully");
  };

  const uploadShopQr = async (qrImageUrl: string) => {
    try {
      const res = await fetch('/api/upload-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrImageUrl })
      });
      if (res.ok) {
        setSettings((prev) => ({ ...prev, upiQrImageUrl: qrImageUrl }));
        showNotification("UPI QR Code uploaded and ready for customer checkout!");
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setSettings((prev) => ({ ...prev, upiQrImageUrl: qrImageUrl }));
    showNotification("UPI QR Code saved successfully");
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProfile(updated);
        showNotification("Profile and delivery addresses saved");
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setUserProfile((prev) => ({ ...prev, ...profileData }));
    showNotification("Profile saved");
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        settings,
        orders,
        analytics,
        cart,
        wishlist,
        userProfile,
        activeCategory,
        searchQuery,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        isProfileOpen,
        isStoreLocationOpen,
        isLocationOpen: isStoreLocationOpen,
        isSizeChartOpen,
        currentView,
        isLoading,
        notification,

        setActiveCategory,
        setSearchQuery,
        setSelectedProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsProfileOpen,
        setIsStoreLocationOpen,
        setIsLocationOpen: setIsStoreLocationOpen,
        setIsSizeChartOpen,
        setCurrentView,
        showNotification,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,

        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        updateSettings,
        uploadShopQr,
        updateUserProfile,
        refreshData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
