import React from 'react';
import { Sparkles, ShieldCheck, Scissors, ArrowRight, Truck, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  const { setActiveCategory, setIsStoreLocationOpen, settings } = useShop();

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white">
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL SHOWROOM & DIGITAL CATALOG • {settings.brandDomain}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Heavyweight Denims & Tailored Menswear.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Welcome to <span className="text-white font-bold">{settings.shopName}</span>. Abhi koi online delivery nahi hai — hamari website par collection dekhein, standard factory rates check karein aur hamare Gurgaon showroom par aakar trial aur fitting lein.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsStoreLocationOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Visit Store (Address & Map)</span>
              </button>
              <button
                onClick={() => {
                  document.getElementById('price-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/15 px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>View Price List</span>
              </button>
              <button
                onClick={handleExplore}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Storefront Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Shiv Puri, Gurgaon</span>
                  <span className="text-slate-400 text-[11px]">Opp. Parnami Bhawan</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Free Alteration</span>
                  <span className="text-slate-400 text-[11px]">In-store master fitting</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Trial Room</span>
                  <span className="text-slate-400 text-[11px]">Try before you buy</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  🕒
                </span>
                <div>
                  <span className="font-semibold block text-white">Open All 7 Days</span>
                  <span className="text-slate-400 text-[11px]">10:30 AM – 09:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Trending This Season
                </span>
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                  Stock Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Visual Preview 1: Best-seller Jeans */}
                <div 
                  onClick={() => setActiveCategory('jeans')}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-700/40 bg-slate-900"
                >
                  <img
                    src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"
                    alt="Style Hunt Jeans"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Jeans</span>
                    <span className="text-xs font-semibold text-white truncate">Classic Whisker Slim</span>
                    <span className="text-xs text-slate-300 font-bold">₹600 <s className="text-slate-400 text-[10px] font-normal">₹1,199</s></span>
                  </div>
                </div>

                {/* Visual Preview 2: Heavyweight Tee */}
                <div 
                  onClick={() => setActiveCategory('tshirts')}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-700/40 bg-slate-900"
                >
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
                    alt="Style Hunt 240 GSM Tee"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">T-Shirts</span>
                    <span className="text-xs font-semibold text-white truncate">Bio-Washed Cotton Tee</span>
                    <span className="text-xs text-slate-300 font-bold">₹300 <s className="text-slate-400 text-[10px] font-normal">₹599</s></span>
                  </div>
                </div>
              </div>

              {/* Store Address Banner in Card */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Local Storefront Near You:</span>
                  <span className="font-semibold text-white">
                    {settings.address.shopNo}, {settings.address.landmark}
                  </span>
                </div>
                <button
                  onClick={() => setIsStoreLocationOpen(true)}
                  className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Map & Timings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
