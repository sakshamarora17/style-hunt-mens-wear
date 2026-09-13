import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Ruler, Sparkles, Filter, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductCatalogProps {
  onOpenSizeChart: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenSizeChart }) => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSelectedProduct 
  } = useShop();

  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<number>(3999);

  const categories: { id: Product['category'] | 'all'; label: string }[] = [
    { id: 'all', label: 'All Menswear' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'joggers', label: 'Joggers' },
    { id: 'lycra', label: 'Lycra Pants' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'tshirts', label: 'T-Shirts' },
    { id: 'lowers', label: 'Lowers' },
    { id: 'shorts', label: 'Shorts' },
  ];

  const fits = ['all', 'Slim Fit', 'Regular Fit', 'Comfort Fit', 'Straight Fit', 'Cargo Fit'];

  // Filtered & Sorted Products
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchFit = selectedFit === 'all' || p.fit.toLowerCase().includes(selectedFit.toLowerCase());
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price <= priceRange;

      return matchCategory && matchFit && matchSearch && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, activeCategory, selectedFit, searchQuery, priceRange, sortBy]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated For The Modern Gentleman</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {activeCategory === 'all' ? 'Signature Menswear Collection' : categories.find(c => c.id === activeCategory)?.label}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {displayedProducts.length} articles available for trial & purchase at our Gurgaon showroom (157/9 Shiv Puri).
          </p>
        </div>

        {/* Action button: Size Chart & Price List shortcut */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              document.getElementById('price-list-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Store Price List</span>
          </button>
          <button
            onClick={onOpenSizeChart}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Ruler className="w-4 h-4 text-amber-600" />
            <span>Size & Fit Guide</span>
          </button>
        </div>
      </div>

      {/* In-Store Showroom Notice Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
            Showroom Notice
          </span>
          <span className="font-medium text-slate-800">
            Abhi online delivery available nahi hai — showroom par aakar trial aur fitting le sakte hain.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/919213346331?text=Hi%20Style%20Hunt,%20I'm%20checking%20item%20stock%20availability%20for%20store%20visit"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
          >
            <span>WhatsApp Stock Query</span>
          </a>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="py-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs">
        {/* Fit Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Fit:
          </span>
          {fits.map((fit) => (
            <button
              key={fit}
              onClick={() => setSelectedFit(fit)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedFit === fit
                  ? 'bg-amber-500/20 text-amber-900 border border-amber-500/40'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {fit === 'all' ? 'All Fits' : fit}
            </button>
          ))}
        </div>

        {/* Sort and Price Selector */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Price Range Slider */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600">
            <span>Max Price:</span>
            <span className="font-bold text-slate-900">₹{priceRange.toLocaleString('en-IN')}</span>
            <input
              type="range"
              min="500"
              max="3999"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-20 accent-amber-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="featured">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3 mt-4">
          <p className="text-sm font-semibold text-slate-700">No items match your active filter criteria.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedFit('all');
              setPriceRange(3999);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
