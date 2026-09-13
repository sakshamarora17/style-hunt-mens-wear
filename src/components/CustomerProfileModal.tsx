import React, { useState } from 'react';
import { X, User, Package, Heart, MapPin, Phone, Mail, Clock, CheckCircle2, Truck, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CustomerProfileModalProps {
  onClose: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ onClose }) => {
  const { userProfile, updateUserProfile, orders, wishlist, products, setSelectedProduct, addToCart, showNotification } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [editingProfile, setEditingProfile] = useState(userProfile);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(editingProfile);
    showNotification("Profile updated successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Shipped</span>;
      case 'packed':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Packed</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">{userProfile.fullName || 'Customer Account'}</h2>
              <p className="text-xs text-slate-400">{userProfile.phone || userProfile.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wishlist' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-5 sm:p-6 text-xs">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p>No orders placed yet.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                        <span className="text-[11px] text-slate-500 block">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ord.orderStatus)}
                        <span className="font-extrabold text-slate-900 text-sm">₹{ord.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img src={it.image} alt={it.name} className="w-8 h-10 object-cover rounded border" />
                            <div>
                              <p className="font-medium text-slate-800 line-clamp-1">{it.name}</p>
                              <span className="text-slate-500 text-[11px]">Size: {it.size} • Qty: {it.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details */}
                    {ord.trackingNumber && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tracking: <strong>{ord.trackingNumber}</strong></span>
                        </div>
                        <span className="text-emerald-700 font-semibold uppercase">{ord.paymentMethod} Paid</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Heart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p>Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 bg-white">
                      <img src={p.images[0]} alt={p.name} className="w-14 h-18 object-cover rounded-lg border" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                          <span className="font-bold text-slate-900 text-xs">₹{p.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[11px] font-semibold w-fit"
                        >
                          View & Select Size
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingProfile.fullName}
                  onChange={(e) => setEditingProfile({ ...editingProfile, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={editingProfile.phone}
                    onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-700 block mb-1">Saved Street Address</label>
                <input
                  type="text"
                  value={editingProfile.savedAddresses[0]?.street || ''}
                  onChange={(e) => {
                    const addresses = [...editingProfile.savedAddresses];
                    if (!addresses[0]) {
                      addresses[0] = { fullName: editingProfile.fullName, phone: editingProfile.phone, street: '', landmark: '', city: 'New Delhi', state: 'Delhi NCR', pincode: '110024' };
                    }
                    addresses[0].street = e.target.value;
                    setEditingProfile({ ...editingProfile, savedAddresses: addresses });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Save Account Details
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
