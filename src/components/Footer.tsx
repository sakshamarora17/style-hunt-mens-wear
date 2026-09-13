import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, RefreshCw, Scissors, Sparkles, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory, setIsStoreLocationOpen, setCurrentView } = useShop();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Value Propositions Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white">Free Hem Alteration</h4>
              <p className="text-slate-400 text-[11px]">Complimentary in-store fitting</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white">100% Genuine Fabrics</h4>
              <p className="text-slate-400 text-[11px]">Premium denim & combed cotton</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white">7-Day Easy Exchange</h4>
              <p className="text-slate-400 text-[11px]">Hassle-free size swaps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white">WhatsApp Store Inquiries</h4>
              <p className="text-slate-400 text-[11px]">Instant sizing & stock confirmation</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          {/* Brand & Address Column */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
                SH
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {settings.shopName}
              </h3>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your neighborhood destination for heavyweight selvedge jeans, premium tailored shirts, street tees, and festive wear. Handcrafted fits for every modern man.
            </p>

            {/* Address */}
            <div className="space-y-1.5 text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {settings.address.shopNo}, {settings.address.building}, {settings.address.street}, {settings.address.landmark}, {settings.address.city}, {settings.address.state} – {settings.address.pincode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono">{settings.contactPhone}</span>
              </div>
            </div>

            <button
              onClick={() => setIsStoreLocationOpen(true)}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer text-xs mt-1"
            >
              <span>View Interactive Map & Directions</span>
              <span>→</span>
            </button>
          </div>

          {/* Quick Shop Collections */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('jeans');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Jeans & Denim</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">From ₹600</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('trousers');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Cotton Trouser</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹600</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('joggers');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Cargo Jogger</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹550</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('lycra');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>4-Way Lycra Pant</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹600</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('shirts');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Casual / Formal Shirt</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹400</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('tshirts');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Bio-Washed T-Shirt</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹300</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('lowers');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Comfort Track Lower</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹350</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('shorts');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                >
                  <span>Summer Cotton Shorts</span>
                  <span className="font-mono text-amber-400 font-bold text-[11px]">₹350</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  document.getElementById('price-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[11px] transition-colors"
              >
                <span>→ View Full Price List Section</span>
              </button>
            </div>
          </div>

          {/* Contact & Owner Portal Link */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Need Instant Help?
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Connect with our master tailor and shop associates directly over WhatsApp for custom queries and stock verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://wa.me/919213346331?text=Hi%20Style%20Hunt,%20I%20have%20an%20inquiry%20regarding%20products"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 1: 9213346331</span>
              </a>
              <a
                href="https://wa.me/919953216331?text=Hi%20Style%20Hunt,%20I%20have%20an%20inquiry%20regarding%20products"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 2: 9953216331</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 block mb-1.5">For Shop Administration:</span>
              <button
                onClick={() => setCurrentView('admin')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Open Owner Inventory & Sales Portal
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.shopName} ({settings.brandDomain}). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Showroom: 157/9 Shiv Puri, Gurgaon</span>
            <span>•</span>
            <span>Walk-in Fitting & Purchase Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
