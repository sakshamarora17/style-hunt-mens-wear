import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Heart, 
  MapPin, 
  Store, 
  Clock,
  Phone, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  Scissors, 
  RotateCcw,
  MessageCircle,
  Share2,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenSizeChart?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onOpenSizeChart }) => {
  const { wishlist, toggleWishlist, setIsStoreLocationOpen, setIsSizeChartOpen, settings, showNotification } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find(s => s.stock > 0)?.size || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const selectedSizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0;
  const isSelectedSizeAvailable = selectedSizeStock > 0;

  const angleLabels = [
    'Front Angle',
    'Side Profile',
    'Back & Pockets',
    'Fabric Close-up'
  ];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleVisitStore = () => {
    onClose();
    setIsStoreLocationOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showNotification("Product link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `Hello Style Hunt Men's Wear! I want to check availability for:\n• ${product.name}\n• Price: ₹${product.price}\n• SKU: ${product.sku}\n• Size: ${selectedSize || 'Any'}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            {/* Left Column: Carousel Slider with Multiple Angles */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Carousel Stage */}
              <div className="relative aspect-4/5 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={`${product.name} - ${angleLabels[activeImageIndex] || 'View'}`}
                  className="w-full h-full object-cover select-none transition-all duration-300"
                />

                {/* Angle Tag Overlay */}
                <div className="absolute top-3.5 left-3.5 bg-slate-950/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{angleLabels[activeImageIndex] || `Angle ${activeImageIndex + 1}`}</span>
                </div>

                {/* Best Seller / Discount Pill */}
                <div className="absolute top-3.5 right-14 flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                    {product.discountPercent}% OFF
                  </span>
                </div>

                {/* Carousel Slider Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                      aria-label="Previous image angle"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                      aria-label="Next image angle"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter indicator */}
                <div className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-xs text-white text-xs font-mono px-2.5 py-1 rounded-md">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Multi-Angle Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-md scale-[1.02]'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[10px] py-0.5 text-center font-medium truncate px-1">
                      {angleLabels[idx] || `Angle ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Store Guarantee Cards */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <Scissors className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-900 block text-[11px]">Free Alteration</span>
                  <span className="text-slate-500 text-[10px]">At our local store</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-900 block text-[11px]">Heavyweight Fabric</span>
                  <span className="text-slate-500 text-[10px]">Pre-shrunk ring-spun</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <RotateCcw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-900 block text-[11px]">Easy Size Swap</span>
                  <span className="text-slate-500 text-[10px]">7-day hassle-free</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Sizes, Stock, Specs & Checkout CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              <div>
                {/* Brand & Category Breadcrumb */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold uppercase tracking-wider text-amber-700">
                    {product.categoryLabel}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">SKU: {product.sku}</span>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Wishlist Row */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-800 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Based on {product.reviewsCount} verified customer reviews
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleShare}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                      title="Share product link"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Prominent Price Breakdown */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-950 font-display">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2 py-0.5 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Inclusive of all taxes • Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} during current stock!
                  </p>
                </div>

                {/* Size Selection Section */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Select Size:
                      </span>
                      {selectedSize && (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {selectedSize}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5 text-amber-600" />
                      <span>Size Chart & Guide</span>
                    </button>
                  </div>

                  {/* Size Buttons Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.sizes.map((sz) => {
                      const isOutOfStock = sz.stock === 0;
                      const isSelected = selectedSize === sz.size;
                      return (
                        <button
                          key={sz.size}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(sz.size)}
                          className={`py-2.5 px-1 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/20'
                              : isOutOfStock
                              ? 'bg-slate-100 text-slate-300 border-slate-200 line-through cursor-not-allowed opacity-50'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span>{sz.size}</span>
                          <span className={`text-[9px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                            {isOutOfStock ? 'Sold' : `${sz.stock} left`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Live Stock Alert Status */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    {selectedSize ? (
                      selectedSizeStock <= 3 && selectedSizeStock > 0 ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Hurry! Only {selectedSizeStock} left in Size {selectedSize}.
                        </span>
                      ) : selectedSizeStock === 0 ? (
                        <span className="text-rose-600 font-bold">
                          Size {selectedSize} is currently out of stock.
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          In Stock ({selectedSizeStock} available in shop)
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">Please choose a size to proceed</span>
                    )}
                  </div>
                </div>

                {/* In-Store Showroom Notice */}
                <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Store className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>In-Store Showroom Trial & Purchase Only</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Abhi koi online delivery nahi hai. Aap hamare showroom par aakar trial le sakte hain, fit check kar sakte hain, aur same-day alteration karwa sakte hain.
                  </p>
                </div>

                {/* Showroom CTA Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleVisitStore}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Visit Showroom (Map & Address)</span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsAppMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Direct Store Contact Strip */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-medium">Open 7 Days: 10:30 AM – 09:30 PM</span>
                  </div>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 text-amber-800 hover:text-amber-900 font-bold text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Call: {settings.contactPhone}</span>
                  </a>
                </div>
              </div>

              {/* Product Specifications & Details Accordion/Section */}
              <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Product Fabric & Craftsmanship
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Fabric</span>
                    <span className="font-semibold text-slate-800">{product.fabric}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Fit Profile</span>
                    <span className="font-semibold text-slate-800">{product.fit}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Shade & Wash</span>
                    <span className="font-semibold text-slate-800">{product.color}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Care</span>
                    <span className="font-semibold text-slate-800">Machine wash cold inside out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
