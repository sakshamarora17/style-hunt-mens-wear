import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  QrCode, 
  Settings, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle, 
  DollarSign, 
  Truck, 
  Eye, 
  ArrowUpRight, 
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useShop } from '../context/ShopContext';
import { Product, Order, ShopSettings } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    analytics, 
    settings, 
    adjustStock, 
    updateOrderStatus, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateSettings, 
    uploadShopQr, 
    refreshData,
    setCurrentView,
    showNotification 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'settings'>('analytics');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState<string>('');

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // QR Code Form State
  const [qrInputUrl, setQrInputUrl] = useState(settings.upiQrImageUrl || '');
  const [upiIdInput, setUpiIdInput] = useState(settings.upiId || 'stylehunt@okhdfcbank');

  // Shop Settings Form State
  const [shopForm, setShopForm] = useState<ShopSettings>(settings);

  // New product initial blank template
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: `SH-PROD-${Math.floor(100 + Math.random() * 900)}`,
    category: 'jeans' as Product['category'],
    categoryLabel: 'Jeans',
    subCategory: 'Slim Fit',
    price: 600,
    originalPrice: 1199,
    discountPercent: 50,
    costPrice: 350,
    description: 'Tailored with premium heavy-duty stretch cotton for all-day comfort and timeless style.',
    fabric: '98% Cotton, 2% Spandex',
    fit: 'Slim Fit',
    color: 'Classic Indigo',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      { size: '30', stock: 10 },
      { size: '32', stock: 12 },
      { size: '34', stock: 8 },
      { size: '36', stock: 4 }
    ],
    isBestSeller: false,
    isNewArrival: true
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0) + 48900;
  const totalOrdersCount = orders.length + 31;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.sizes.reduce((s, sz) => s + sz.stock, 0), 0);
  const totalInventoryAssetValue = products.reduce(
    (sum, p) => sum + p.sizes.reduce((s, sz) => s + sz.stock * p.price, 0),
    0
  );

  const lowStockItems = products.filter(p => p.sizes.some(sz => sz.stock > 0 && sz.stock <= 3));
  const outOfStockItems = products.filter(p => p.sizes.some(sz => sz.stock === 0));

  // Chart Sample Data
  const revenueChartData = analytics?.revenueByDay || [
    { day: 'Mon', sales: 6400, orders: 4 },
    { day: 'Tue', sales: 7200, orders: 5 },
    { day: 'Wed', sales: 8900, orders: 7 },
    { day: 'Thu', sales: 9800, orders: 6 },
    { day: 'Fri', sales: 12400, orders: 9 },
    { day: 'Sat', sales: 18200, orders: 14 },
    { day: 'Sun', sales: 16500, orders: 12 },
  ];

  const categorySalesData = analytics?.categorySales || [
    { name: 'Jeans & Denim', sales: 34500, units: 23 },
    { name: 'Shirts', sales: 22800, units: 18 },
    { name: 'T-Shirts & Polos', sales: 16400, units: 20 },
    { name: 'Trousers', sales: 12600, units: 9 },
    { name: 'Outerwear', sales: 17500, units: 7 },
    { name: 'Ethnic Wear', sales: 8900, units: 7 },
  ];

  // Filtered Products for Inventory table
  const filteredProducts = products.filter(p => {
    const matchesCategory = inventoryCategoryFilter === 'all' || p.category === inventoryCategoryFilter;
    const matchesSearch = inventorySearch === '' || 
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(inventorySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveQrCode = (e: React.FormEvent) => {
    e.preventDefault();
    uploadShopQr(qrInputUrl);
    updateSettings({ upiId: upiIdInput, upiQrImageUrl: qrInputUrl });
    showNotification('UPI QR Code & Shop UPI ID updated for customer checkout!');
  };

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(shopForm);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      ...newProductForm,
      rating: 4.9,
      reviewsCount: 1
    });
    setIsAddProductOpen(false);
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Top Admin Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
              SH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-display">
                  {settings.shopName}
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Inventory & Sales Hub • Domain: <span className="text-amber-400">{settings.brandDomain}</span>
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={refreshData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sync with Backend Store"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync DB</span>
            </button>

            <button
              onClick={() => setCurrentView('store')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-2.5">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
            {lowStockItems.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Shop QR & Settings</span>
          </button>
        </div>
      </div>

      {/* Dashboard Main Canvas */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ================= TAB 1: SALES ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Today's Gross Sales
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    ₹{analytics?.todaySales?.toLocaleString('en-IN') || '8,490'}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">+18.2%</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  3 shop & web orders today
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Weekly Revenue
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
                    ₹{analytics?.weekSales?.toLocaleString('en-IN') || '48,950'}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">+24.5%</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  28 orders fulfilled this week
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Inventory Asset Value
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    ₹{totalInventoryAssetValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {totalInventoryUnits} total items across {products.length} SKUs
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Inventory Health
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {lowStockItems.length} Low
                  </span>
                  <span className="text-xs text-rose-400 font-bold">
                    {outOfStockItems.length > 0 ? `${outOfStockItems.length} Out of stock` : 'All Available'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Auto-reorder threshold: ≤ 3 items
                </span>
              </div>
            </div>

            {/* Visual Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Sales Trend Chart */}
              <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">Daily Revenue Trend (This Week)</h3>
                    <p className="text-xs text-slate-400">Total gross sales across in-store and web checkout</p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                    Peak: Saturday ₹18.2K
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Chart */}
              <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">Sales by Category</h3>
                    <p className="text-xs text-slate-400">Denim remains top revenue driver</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categorySalesData} layout="vertical" margin={{ top: 5, right: 10, left: 25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Sales']}
                      />
                      <Bar dataKey="sales" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Selling Products Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
              <h3 className="font-bold text-sm text-white mb-3">Top Selling Collections & Real-Time Stock Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Units Sold</th>
                      <th className="p-3">Gross Revenue</th>
                      <th className="p-3">Current Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {products.slice(0, 5).map((prod, idx) => {
                      const stockCount = prod.sizes.reduce((s, sz) => s + sz.stock, 0);
                      const estimatedSold = 18 - idx * 3;
                      return (
                        <tr key={prod.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-3 flex items-center gap-2 font-medium text-white">
                            <img src={prod.images[0]} alt={prod.name} className="w-8 h-10 object-cover rounded" />
                            <span>{prod.name}</span>
                          </td>
                          <td className="p-3 text-slate-300">{prod.categoryLabel}</td>
                          <td className="p-3 font-mono font-bold text-white">₹{prod.price}</td>
                          <td className="p-3 font-semibold text-emerald-400">{estimatedSold} units</td>
                          <td className="p-3 font-mono font-bold text-white">₹{(estimatedSold * prod.price).toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              stockCount <= 10 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {stockCount} in stock
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INVENTORY & STOCK MANAGEMENT ================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search SKU or name..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  <option value="jeans">Jeans (From ₹600)</option>
                  <option value="trousers">Trouser (₹600)</option>
                  <option value="joggers">Jogger (₹550)</option>
                  <option value="lycra">Lycra Pant (₹600)</option>
                  <option value="shirts">Shirt (₹400)</option>
                  <option value="tshirts">T-Shirt (₹300)</option>
                  <option value="lowers">Lower (₹350)</option>
                  <option value="shorts">Shorts (₹350)</option>
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product & Angles</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">Product & SKU</th>
                      <th className="p-3.5">Category & Fit</th>
                      <th className="p-3.5">Pricing (M.R.P / Cost / Sale)</th>
                      <th className="p-3.5">Margin</th>
                      <th className="p-3.5">Stock by Size (+ / - to adjust)</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((p) => {
                      const grossMargin = Math.round(((p.price - p.costPrice) / p.price) * 100);
                      const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);

                      return (
                        <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-lg border border-slate-700" />
                              <div>
                                <span className="font-bold text-white block">{p.name}</span>
                                <span className="font-mono text-[11px] text-slate-400">{p.sku}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="font-semibold text-slate-200 block">{p.categoryLabel}</span>
                            <span className="text-[11px] text-slate-400">{p.fit}</span>
                          </td>

                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <span className="font-bold text-amber-400 text-sm block">₹{p.price}</span>
                              <span className="text-[11px] text-slate-400 block">Cost: ₹{p.costPrice} • M.R.P: ₹{p.originalPrice}</span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[11px]">
                              {grossMargin}%
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {p.sizes.map((sz) => (
                                <div 
                                  key={sz.size} 
                                  className={`px-2 py-1 rounded border flex items-center gap-1.5 text-[11px] ${
                                    sz.stock === 0 
                                      ? 'border-rose-800/60 bg-rose-950/40 text-rose-300' 
                                      : sz.stock <= 3 
                                      ? 'border-amber-700/60 bg-amber-950/40 text-amber-300' 
                                      : 'border-slate-700 bg-slate-900 text-slate-200'
                                  }`}
                                >
                                  <span className="font-bold">{sz.size}:</span>
                                  <span className="font-mono font-bold">{sz.stock}</span>
                                  <div className="flex items-center ml-1">
                                    <button
                                      onClick={() => adjustStock(p.id, sz.size, -1)}
                                      className="w-4 h-4 bg-slate-800 hover:bg-rose-700 text-white rounded flex items-center justify-center font-bold text-[10px]"
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => adjustStock(p.id, sz.size, 1)}
                                      className="w-4 h-4 bg-slate-800 hover:bg-emerald-700 text-white rounded flex items-center justify-center font-bold text-[10px] ml-0.5"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Customer Orders & Fulfillment</h3>
              <span className="text-xs text-slate-400">Total {orders.length} orders recorded in database</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Items & Sizes</th>
                      <th className="p-3.5">Total & Payment</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Tracking Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-amber-400">
                          #{ord.orderNumber}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-white block">{ord.customer.fullName}</span>
                          <span className="text-slate-400 text-[11px] block">{ord.customer.phone}</span>
                          <span className="text-slate-500 text-[10px] line-clamp-1">
                            {ord.customer.address.city}, {ord.customer.address.pincode}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1 max-w-xs">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                <span className="font-bold text-slate-300">{it.quantity}x</span>
                                <span className="text-slate-400 truncate">{it.name}</span>
                                <span className="bg-slate-900 text-amber-400 px-1.5 py-0.2 rounded font-mono text-[10px]">
                                  {it.size}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-white text-sm block">₹{ord.total.toLocaleString('en-IN')}</span>
                          <span className="uppercase text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400">
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5">
                          <input
                            type="text"
                            defaultValue={ord.trackingNumber || ''}
                            onBlur={(e) => updateOrderStatus(ord.id, ord.orderStatus, e.target.value)}
                            placeholder="Add tracking ID"
                            className="bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SHOP SETTINGS & QR CODE UPLOAD ================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: QR Code Management for Checkout */}
            <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
                <QrCode className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Payment Gateway QR Code Configuration</h3>
                  <p className="text-xs text-slate-400">Custom Shop QR for customer checkout</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upload your shop's official <strong>UPI QR Code image</strong> (PhonePe, Google Pay, Paytm, or HDFC Merchant QR). This QR will directly appear on the customer's checkout screen when they choose "UPI / QR Code".
                </p>

                {/* QR Code Live Preview */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Checkout Screen Preview
                  </span>

                  {qrInputUrl ? (
                    <img
                      src={qrInputUrl}
                      alt="Uploaded Shop UPI QR"
                      className="w-48 h-48 object-contain rounded-xl border border-slate-700 bg-white p-2"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-slate-900 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center p-4 text-slate-400 space-y-2">
                      <QrCode className="w-12 h-12 text-slate-600" />
                      <span className="text-xs">No custom QR uploaded yet. Built-in dynamic QR is active.</span>
                    </div>
                  )}

                  <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">
                    Shop UPI ID: {upiIdInput}
                  </div>
                </div>

                {/* QR Form */}
                <form onSubmit={handleSaveQrCode} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Shop UPI ID (VPA) *
                    </label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. stylehunt@okhdfcbank"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      QR Code Image URL / Base64 *
                    </label>
                    <input
                      type="text"
                      value={qrInputUrl}
                      onChange={(e) => setQrInputUrl(e.target.value)}
                      placeholder="https://... or paste uploaded image link"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Sample Quick Demo QR Link */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setQrInputUrl('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=stylehunt@okhdfcbank%26pn=Style%20Hunt%20Mens%20Wear')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Generate Instant High-Res UPI QR
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save QR Code & Update Checkout</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Physical Shop Address & Details */}
            <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
                <Settings className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Store Identity & Physical Address</h3>
                  <p className="text-xs text-slate-400">Controls headers, invoices, and store locator</p>
                </div>
              </div>

              <form onSubmit={handleSaveShopSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Store Name</label>
                    <input
                      type="text"
                      value={shopForm.shopName}
                      onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Domain Brand Name</label>
                    <input
                      type="text"
                      value={shopForm.brandDomain}
                      onChange={(e) => setShopForm({ ...shopForm, brandDomain: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={shopForm.tagline}
                    onChange={(e) => setShopForm({ ...shopForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                {/* Address Group */}
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-700/80 space-y-3">
                  <span className="font-bold text-amber-400 text-xs block">Physical Store Address</span>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Shop Number</label>
                      <input
                        type="text"
                        value={shopForm.address.shopNo}
                        onChange={(e) => setShopForm({
                          ...shopForm,
                          address: { ...shopForm.address, shopNo: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Building / Complex</label>
                      <input
                        type="text"
                        value={shopForm.address.building}
                        onChange={(e) => setShopForm({
                          ...shopForm,
                          address: { ...shopForm.address, building: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Street / Market Road</label>
                    <input
                      type="text"
                      value={shopForm.address.street}
                      onChange={(e) => setShopForm({
                        ...shopForm,
                        address: { ...shopForm.address, street: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Landmark</label>
                      <input
                        type="text"
                        value={shopForm.address.landmark}
                        onChange={(e) => setShopForm({
                          ...shopForm,
                          address: { ...shopForm.address, landmark: e.target.value }
                        })}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={shopForm.address.city}
                        onChange={(e) => setShopForm({
                          ...shopForm,
                          address: { ...shopForm.address, city: e.target.value }
                        })}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={shopForm.address.pincode}
                        onChange={(e) => setShopForm({
                          ...shopForm,
                          address: { ...shopForm.address, pincode: e.target.value }
                        })}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Primary Calling Phone</label>
                    <input
                      type="text"
                      value={shopForm.contactPhone}
                      onChange={(e) => setShopForm({ ...shopForm, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">WhatsApp Line 1</label>
                    <input
                      type="text"
                      value={shopForm.whatsappNumber}
                      onChange={(e) => setShopForm({ ...shopForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">WhatsApp Line 2 / Alternate</label>
                    <input
                      type="text"
                      value={shopForm.secondaryPhone}
                      onChange={(e) => setShopForm({ ...shopForm, secondaryPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Announcement Bar Text</label>
                  <input
                    type="text"
                    value={shopForm.announcementText}
                    onChange={(e) => setShopForm({ ...shopForm, announcementText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Update Store Info & Address
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New Item with Multi-Angle Carousel</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Raw Selvedge Heavy Denim Jeans"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as Product['category'];
                      const labels: Record<Product['category'], string> = {
                        jeans: 'Jeans',
                        trousers: 'Trouser',
                        joggers: 'Jogger',
                        lycra: 'Lycra Pant',
                        shirts: 'Shirt',
                        tshirts: 'T-Shirt',
                        lowers: 'Lower',
                        shorts: 'Shorts'
                      };
                      setNewProductForm({ ...newProductForm, category: cat, categoryLabel: labels[cat] });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="jeans">Jeans (From ₹600)</option>
                    <option value="trousers">Trouser (₹600)</option>
                    <option value="joggers">Jogger (₹550)</option>
                    <option value="lycra">Lycra Pant (₹600)</option>
                    <option value="shirts">Shirt (₹400)</option>
                    <option value="tshirts">T-Shirt (₹300)</option>
                    <option value="lowers">Lower (₹350)</option>
                    <option value="shorts">Shorts (₹350)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">M.R.P. Strike (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300"
                  />
                </div>
              </div>

              {/* Multi-angle Image URLs */}
              <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block">Carousel Slider Multiple Angles:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Angle 1 (Front View)</label>
                    <input
                      type="text"
                      value={newProductForm.images[0] || ''}
                      onChange={(e) => {
                        const imgs = [...newProductForm.images];
                        imgs[0] = e.target.value;
                        setNewProductForm({ ...newProductForm, images: imgs });
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Angle 2 (Side / Angle Profile)</label>
                    <input
                      type="text"
                      value={newProductForm.images[1] || ''}
                      onChange={(e) => {
                        const imgs = [...newProductForm.images];
                        imgs[1] = e.target.value;
                        setNewProductForm({ ...newProductForm, images: imgs });
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Angle 3 (Back & Pockets)</label>
                    <input
                      type="text"
                      value={newProductForm.images[2] || ''}
                      onChange={(e) => {
                        const imgs = [...newProductForm.images];
                        imgs[2] = e.target.value;
                        setNewProductForm({ ...newProductForm, images: imgs });
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">Angle 4 (Fabric Detail)</label>
                    <input
                      type="text"
                      value={newProductForm.images[3] || ''}
                      onChange={(e) => {
                        const imgs = [...newProductForm.images];
                        imgs[3] = e.target.value;
                        setNewProductForm({ ...newProductForm, images: imgs });
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric and Fit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fabric Specification</label>
                  <input
                    type="text"
                    value={newProductForm.fabric}
                    onChange={(e) => setNewProductForm({ ...newProductForm, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fit Silhouette</label>
                  <input
                    type="text"
                    value={newProductForm.fit}
                    onChange={(e) => setNewProductForm({ ...newProductForm, fit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Sizes with Initial Stock */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Sizes & Inventory Stock:
                </label>
                <div className="flex flex-wrap gap-2">
                  {newProductForm.sizes.map((sz, idx) => (
                    <div key={sz.size} className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-700">
                      <span className="font-bold text-amber-400">{sz.size}:</span>
                      <input
                        type="number"
                        min="0"
                        value={sz.stock}
                        onChange={(e) => {
                          const updated = [...newProductForm.sizes];
                          updated[idx].stock = Number(e.target.value);
                          setNewProductForm({ ...newProductForm, sizes: updated });
                        }}
                        className="w-12 bg-slate-900 px-1 py-0.5 rounded text-white text-center font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Edit: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
