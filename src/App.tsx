import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PriceListSection } from './components/PriceListSection';
import { ProductCatalog } from './components/ProductCatalog';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StoreLocationModal } from './components/StoreLocationModal';
import { SizeChartModal } from './components/SizeChartModal';
import { CheckCircle2, MessageCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    selectedProduct,
    setSelectedProduct,
    isStoreLocationOpen,
    setIsStoreLocationOpen,
    notification,
    settings
  } = useShop();

  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-slate-900/95 text-white border border-slate-700 shadow-2xl px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar onOpenSizeChart={() => setIsSizeChartOpen(true)} />

      {/* View Switch: Storefront vs Admin Portal */}
      {currentView === 'store' ? (
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroBanner onExploreClick={() => {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }} />

          {/* Dedicated Official Store Rate Card & Price List */}
          <PriceListSection />

          {/* Product Items Catalog */}
          <ProductCatalog onOpenSizeChart={() => setIsSizeChartOpen(true)} />

          {/* Footer */}
          <Footer />

          {/* Floating WhatsApp Quick Assistance */}
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Style%20Hunt,%20I'm%20shopping%20on%20stylehuntwears.com!`}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-xl hover:shadow-emerald-600/40 flex items-center justify-center transition-all hover:scale-105"
            title="Chat with Style Hunt on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </a>
        </main>
      ) : (
        <main className="flex-1">
          {/* Admin Dashboard */}
          <AdminDashboard />
        </main>
      )}

      {/* Modals and Information Views */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenSizeChart={() => setIsSizeChartOpen(true)}
        />
      )}

      {isStoreLocationOpen && (
        <StoreLocationModal onClose={() => setIsStoreLocationOpen(false)} />
      )}

      {isSizeChartOpen && (
        <SizeChartModal onClose={() => setIsSizeChartOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
