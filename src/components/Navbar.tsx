import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  MapPin, 
  Phone, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  Store, 
  LayoutDashboard,
  MessageCircle,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    settings,
    cart,
    wishlist,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsProfileOpen,
    setIsStoreLocationOpen,
    currentView,
    setCurrentView
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { id: 'all', label: 'All Menswear' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'joggers', label: 'Joggers' },
    { id: 'lycra', label: 'Lycra Pants' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'tshirts', label: 'T-Shirts' },
    { id: 'lowers', label: 'Lowers' },
    { id: 'shorts', label: 'Shorts' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
            <span className="bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              {settings.brandDomain}
            </span>
            <span className="truncate text-slate-300 font-medium">
              {settings.announcementText}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 shrink-0 text-[12px]">
            <button
              onClick={() => setIsStoreLocationOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="View Store Address & Map"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium hidden md:inline">Visit Store:</span>
              <span className="underline underline-offset-2">157/9 Shiv Puri, Gurgaon</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919213346331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20your%20collection"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                title="Primary WhatsApp: 9213346331"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono">9213346331</span>
              </a>
              <span className="text-slate-600 text-[10px]">/</span>
              <a
                href="https://wa.me/919953216331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20your%20collection"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-mono transition-colors hidden sm:inline"
                title="Alternate WhatsApp: 9953216331"
              >
                9953216331
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => { setCurrentView('store'); setActiveCategory('all'); }}
            className="cursor-pointer group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              SH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display">
                  STYLE HUNT
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300/60 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  MENS WEAR
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block">
                Flagship Store • <span className="text-amber-700 font-semibold">{settings.brandDomain}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jeans, slim fit, 240 GSM tees, linen shirts..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions & Portal Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon Toggle */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Official Price List Section Button */}
          <button
            onClick={() => {
              if (currentView !== 'store') setCurrentView('store');
              setTimeout(() => {
                document.getElementById('price-list-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-lg transition-colors cursor-pointer"
            title="Official Price List"
          >
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Price List</span>
          </button>

          {/* Store Location / Visit Showroom Button */}
          <button
            onClick={() => setIsStoreLocationOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Shop Address, Map & Timings"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Visit Showroom</span>
            <span className="sm:hidden">Store Info</span>
          </button>

          {/* Quick WhatsApp Inquiry */}
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20store%20items`}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
            title="Chat with Store on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Owner Dashboard Toggle */}
          <div className="border-l border-slate-200 pl-2 sm:pl-3 ml-1">
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
              title="Switch to Store Owner / Admin Portal"
            >
              {currentView === 'admin' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>Exit Dashboard</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Owner Portal</span>
                  <span className="sm:hidden">Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchVisible && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search denims, shirts, sizes..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Category Navigation Bar (Store View Only) */}
      {currentView === 'store' && (
        <nav className="bg-white border-t border-slate-100 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-4 py-2 whitespace-nowrap">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                  {cat.id === 'jeans' && (
                    <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Explore Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setIsMobileMenuOpen(false);
                  setCurrentView('store');
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                  activeCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsStoreLocationOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-slate-800 font-medium py-1.5"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>Store Address & Directions</span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20store%20items`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-emerald-800 font-medium py-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
              <span>WhatsApp Store: {settings.whatsappNumber}</span>
            </a>
            <button
              onClick={() => {
                setCurrentView(currentView === 'store' ? 'admin' : 'store');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-amber-700 font-semibold py-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-600" />
              <span>{currentView === 'admin' ? 'Back to Store' : 'Shop Owner Dashboard'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
