import React, { useState } from 'react';
import { Heart, Star, Eye, MessageCircle, MapPin } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, setSelectedProduct, settings } = useShop();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuickSize, setSelectedQuickSize] = useState<string>(
    product.sizes.find(s => s.stock > 0)?.size || ''
  );

  const isSaved = wishlist.includes(product.id);
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);

  const whatsAppQuery = encodeURIComponent(
    `Hi Style Hunt, is ${product.name} (Size: ${selectedQuickSize || 'all'}, Price: ₹${product.price}) in stock at your 157/9 Shiv Puri, Gurgaon store?`
  );

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => setSelectedProduct(product)}
    >
      {/* Product Image Stage */}
      <div 
        className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setActiveImageIndex(1);
        }}
        onMouseLeave={() => setActiveImageIndex(0)}
      >
        <img
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              BEST SELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              NEW IN
            </span>
          )}
          <span className="bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs w-fit">
            {product.discountPercent}% OFF
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-rose-50 text-rose-600 shadow-sm scale-110'
              : 'bg-white/85 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Angle Indicator Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/40 backdrop-blur-xs px-2 py-1 rounded-full z-10">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeImageIndex === idx ? 'bg-amber-400 w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-3 bottom-3 hidden group-hover:flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full bg-slate-900/90 backdrop-blur-xs hover:bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View All Angles & Sizes</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Fit & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-700">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[12px]">{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {/* Fit note */}
          <p className="text-[11px] text-slate-500 mt-0.5">
            {product.fit} • <span className="text-slate-600">{product.color}</span>
          </p>
        </div>

        {/* Pricing Block */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-700">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Available Sizes Pills */}
          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Select Size:</span>
              {totalStock <= 5 && totalStock > 0 && (
                <span className="text-amber-600 font-bold">Only {totalStock} left!</span>
              )}
              {totalStock === 0 && (
                <span className="text-rose-600 font-bold">Sold Out</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.sizes.map((sz) => {
                const isOutOfStock = sz.stock === 0;
                const isSelected = selectedQuickSize === sz.size;
                return (
                  <button
                    key={sz.size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedQuickSize(sz.size)}
                    className={`text-[11px] px-2 py-1 rounded font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : isOutOfStock
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-60'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                    title={isOutOfStock ? 'Out of stock' : `${sz.stock} in stock`}
                  >
                    {sz.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Store Actions: View Angles & WhatsApp */}
          <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedProduct(product)}
              className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details & Angles</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsAppQuery}`}
              target="_blank"
              rel="noreferrer"
              title="Check in-store stock on WhatsApp"
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
