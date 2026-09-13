import React from 'react';
import { Tag, ArrowRight, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const PriceListSection: React.FC = () => {
  const { setActiveCategory, settings } = useShop();

  const priceItems: {
    id: Product['category'];
    name: string;
    price: string;
    startingNote: string;
    image: string;
    description: string;
    badge?: string;
  }[] = [
    {
      id: 'jeans',
      name: 'Jeans',
      price: '₹600',
      startingNote: 'Starts from',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
      description: 'Heavy denim, slim & straight fits, stretch fabric',
      badge: 'Bestseller'
    },
    {
      id: 'trousers',
      name: 'Trouser',
      price: '₹600',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop',
      description: 'Cotton formal & semi-formal chinos, clean finish'
    },
    {
      id: 'joggers',
      name: 'Jogger',
      price: '₹550',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop',
      description: 'Comfort cuffed cargo joggers with multi-pockets'
    },
    {
      id: 'lycra',
      name: 'Lycra Pant',
      price: '₹600',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      description: '4-way super stretch comfort formal & casual pants',
      badge: 'Popular'
    },
    {
      id: 'shirts',
      name: 'Shirt',
      price: '₹400',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
      description: 'Oxford cotton, checks, prints & solid casual shirts'
    },
    {
      id: 'tshirts',
      name: 'T-Shirt',
      price: '₹300',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      description: '100% bio-washed round neck & polo t-shirts'
    },
    {
      id: 'lowers',
      name: 'Lower',
      price: '₹350',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=600&auto=format&fit=crop',
      description: 'Daily gym, lounge & active comfort track lowers'
    },
    {
      id: 'shorts',
      name: 'Shorts',
      price: '₹350',
      startingNote: 'Fixed Rate',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
      description: 'Summer casual cotton shorts with drawstring waist'
    }
  ];

  const handleSelectCategory = (categoryId: Product['category']) => {
    setActiveCategory(categoryId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="price-list-section" className="bg-slate-900 text-white py-14 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Official Store Rate List</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Standard Price List
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Honest, direct showroom prices for men's clothing at <span className="text-amber-400 font-semibold">{settings.shopName}</span>.
            </p>
          </div>

          {/* Store Location & WhatsApp Quick Info */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-xs space-y-1.5 shrink-0 max-w-md">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">157/9 Shiv Puri, Opp. Parnami Bhawan, Gurgaon</span>
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-700/60">
              <a
                href="https://wa.me/919213346331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20the%20price%20list"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>9213346331</span>
              </a>
              <span className="text-slate-600">/</span>
              <a
                href="https://wa.me/919953216331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20the%20price%20list"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-mono font-bold"
              >
                9953216331
              </a>
            </div>
          </div>
        </div>

        {/* Price List Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {priceItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectCategory(item.id)}
              className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              {item.badge && (
                <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {item.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/80">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block">
                      {item.startingNote}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Rate</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono">
                    {item.price}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory(item.id);
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Assurance Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Showroom Walk-in Purchase • 157/9 Shiv Puri, Gurgaon</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free same-day in-store alteration & trial room</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Inquire & confirm stock on WhatsApp (9213346331)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
