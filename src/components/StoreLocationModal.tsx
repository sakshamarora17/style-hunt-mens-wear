import React from 'react';
import { X, MapPin, Phone, MessageCircle, Clock, Scissors, ShieldCheck, ExternalLink, Navigation } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface StoreLocationModalProps {
  onClose: () => void;
}

export const StoreLocationModal: React.FC<StoreLocationModalProps> = ({ onClose }) => {
  const { settings } = useShop();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              SH
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">{settings.shopName}</h2>
              <span className="text-xs text-amber-400 font-medium">Official Flagship Storefront</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-700 text-xs">
          {/* Address Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 text-sm block">Store Address</span>
                <p className="text-slate-800 font-bold text-xs mt-0.5">
                  {settings.address.shopNo}, {settings.address.building}
                </p>
                <p className="text-slate-700 text-xs font-medium">
                  {settings.address.street}
                </p>
                <p className="text-slate-600 text-xs">
                  Landmark: {settings.address.landmark}
                </p>
                <p className="text-slate-900 font-semibold text-xs mt-1">
                  {settings.address.city}, {settings.address.state} – {settings.address.pincode}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.shopName} 157/9 Shiv Puri Behind Aryan Hospital Opp Parnami Bhawan Gurgaon`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Get Driving Directions (Google Maps)</span>
              </a>
              <span className="text-[11px] text-slate-500 self-center">
                Behind Aryan Hospital • Opp. Parnami Bhawan
              </span>
            </div>
          </div>

          {/* Timings & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Opening Hours</span>
              </div>
              <p className="text-slate-700 font-medium">{settings.openingHours}</p>
              <p className="text-slate-400 text-[11px]">Open all 7 days of the week</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Phone & Queries</span>
              </div>
              <p className="text-slate-800 font-mono font-bold">{settings.contactPhone}</p>
              <p className="text-slate-600 text-xs font-mono font-medium">{settings.secondaryPhone}</p>
            </div>
          </div>

          {/* WhatsApp Direct Action (Both Numbers) */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-current" />
                <span>Style Hunt Official WhatsApp Support</span>
              </div>
              <p className="text-emerald-800 text-xs mt-0.5">
                Have questions about fit, latest arrivals, pricing, or custom alterations? Message the shop team directly on either WhatsApp number:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href="https://wa.me/919213346331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20your%20Gurgaon%20store%20collection"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <div>
                    <span className="block text-[10px] text-emerald-100 font-normal">Primary WhatsApp</span>
                    <span className="font-mono">9213346331</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-700/60 px-2 py-0.5 rounded">Chat →</span>
              </a>

              <a
                href="https://wa.me/919953216331?text=Hi%20Style%20Hunt,%20I'm%20inquiring%20about%20your%20Gurgaon%20store%20collection"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <div>
                    <span className="block text-[10px] text-emerald-100 font-normal">Alternate WhatsApp</span>
                    <span className="font-mono">9953216331</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-800/60 px-2 py-0.5 rounded">Chat →</span>
              </a>
            </div>
          </div>

          {/* In-Store Customer Privileges */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              In-Store Services & Amenities
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Scissors className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Jeans Hem Alteration</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fitting Trial Rooms</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>UPI / Cash / Card accepted</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Live Stock & Fit Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
