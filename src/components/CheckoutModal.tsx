import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  MessageCircle, 
  Lock, 
  Copy, 
  Check, 
  AlertCircle,
  Truck,
  Store
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod, CustomerAddress, Order } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, settings, userProfile, createOrder, showNotification, setIsProfileOpen } = useShop();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: userProfile.fullName || '',
    phone: userProfile.phone || '',
    street: userProfile.savedAddresses[0]?.street || '',
    landmark: userProfile.savedAddresses[0]?.landmark || '',
    city: userProfile.savedAddresses[0]?.city || 'New Delhi',
    state: userProfile.savedAddresses[0]?.state || 'Delhi NCR',
    pincode: userProfile.savedAddresses[0]?.pincode || '110024'
  });
  const [email, setEmail] = useState(userProfile.email || '');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Gateway processing simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('482910');
  const [inputOtp, setInputOtp] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 1999 || deliveryType === 'pickup';
  const shippingCharge = isFreeShipping ? 0 : 99;
  const total = subtotal + shippingCharge;

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUpi(true);
      showNotification(`Copied UPI ID: ${settings.upiId}`);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const validateForm = () => {
    if (!address.fullName.trim() || !address.phone.trim()) {
      showNotification('Please provide your full name and phone number');
      return false;
    }
    if (deliveryType === 'delivery' && (!address.street.trim() || !address.pincode.trim())) {
      showNotification('Please provide complete street address and pincode');
      return false;
    }
    return true;
  };

  const handleInitiatePayment = async () => {
    if (!validateForm()) return;

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16 || !cardExpiry || cardCvv.length < 3) {
        showNotification('Please enter complete card credentials');
        return;
      }
      setShowOtpModal(true);
      return;
    }

    // Process payment directly for UPI, COD, NetBanking
    executeOrderPlacement();
  };

  const executeOrderPlacement = async () => {
    setIsProcessing(true);

    // Simulate secure payment gateway handshake
    setTimeout(async () => {
      try {
        const newOrder = await createOrder({
          customer: {
            fullName: address.fullName,
            email: email || 'customer@stylehuntwears.com',
            phone: address.phone,
            address: deliveryType === 'pickup' 
              ? {
                  ...address,
                  street: `[Store Counter Pickup] ${settings.address.shopNo}, ${settings.address.building}`,
                  landmark: settings.address.landmark
                }
              : address
          },
          items: cart.map(item => ({
            productId: item.product.id,
            sku: item.product.sku,
            name: item.product.name,
            image: item.product.images[0],
            price: item.product.price,
            size: item.selectedSize,
            quantity: item.quantity
          })),
          subtotal,
          shipping: shippingCharge,
          discount: 0,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          paymentDetails: {
            transactionId: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
            upiId: paymentMethod === 'upi' ? settings.upiId : undefined,
            cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : undefined,
            bankName: paymentMethod === 'netbanking' ? selectedBank : undefined
          },
          notes: deliveryType === 'pickup' ? 'Store Pickup at Shop' : 'Express Doorstep Delivery'
        });

        setCompletedOrder(newOrder);
      } catch (err) {
        console.error(err);
        showNotification('Payment processed successfully!');
      } finally {
        setIsProcessing(false);
        setShowOtpModal(false);
      }
    }, 1500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Background click */}
      {!completedOrder && <div className="fixed inset-0" onClick={onClose} />}

      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
              SH
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {completedOrder ? 'Order Confirmed' : 'Style Hunt Secure Checkout'}
              </h2>
              <p className="text-xs text-slate-500">
                {completedOrder ? 'Thank you for shopping with us!' : 'Encrypted 256-Bit SSL Payment Gateway'}
              </p>
            </div>
          </div>
          {!completedOrder && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {completedOrder ? (
            /* Order Placed Success Confirmation */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Payment Verified • Order Placed
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2 font-display">
                  Order #{completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  We've received your order! A confirmation SMS and WhatsApp message have been initiated.
                </p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-4">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tracking Number:</span>
                    <span className="font-mono font-bold text-slate-900">{completedOrder.trackingNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Payment Mode:</span>
                    <span className="font-bold text-slate-900 uppercase">{completedOrder.paymentMethod}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Ordered Items ({completedOrder.items.length})
                  </span>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded border" />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                          <span className="text-slate-500 text-[11px]">Size: {item.size} • Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{completedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping / Handling:</span>
                    <span>{completedOrder.shipping === 0 ? 'FREE' : `₹${completedOrder.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-1 border-t border-slate-200">
                    <span>Total Paid:</span>
                    <span>₹{completedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Delivery Address Details */}
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase">
                    Delivery To:
                  </span>
                  <p className="mt-0.5">
                    <strong>{completedOrder.customer.fullName}</strong> • {completedOrder.customer.phone}
                  </p>
                  <p className="text-slate-500">
                    {completedOrder.customer.address.street}, {completedOrder.customer.address.city}, {completedOrder.customer.address.pincode}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Receipt / Invoice</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Style%20Hunt,%20I%20just%20placed%20Order%20%23${completedOrder.orderNumber}%20for%20₹${completedOrder.total}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Shop on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    setIsProfileOpen(true);
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  View in My Orders
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Delivery Mode & Address */}
              <div className="md:col-span-7 space-y-4">
                {/* Delivery Options */}
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                    1. Fulfillment Method
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Truck className={`w-4 h-4 mt-0.5 ${deliveryType === 'delivery' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-xs block">Express Doorstep</span>
                        <span className={`text-[11px] ${deliveryType === 'delivery' ? 'text-slate-300' : 'text-slate-500'}`}>
                          {isFreeShipping ? 'FREE Delivery' : '₹99 (Free over ₹1999)'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Store className={`w-4 h-4 mt-0.5 ${deliveryType === 'pickup' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-xs block">Store Pickup</span>
                        <span className={`text-[11px] ${deliveryType === 'pickup' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Free • Ready in 2 hours
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    2. Customer & Contact Information
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="e.g. Rahul Verma"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="+91 98100 00000"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Email Address (for invoice)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  {deliveryType === 'delivery' ? (
                    <>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Delivery Address (Flat / House No / Street) *
                        </label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="House / Flat No., Colony / Apartment Name"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Landmark
                          </label>
                          <input
                            type="text"
                            value={address.landmark}
                            onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                            placeholder="Near Metro"
                            className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            placeholder="110024"
                            className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                      <span className="font-bold block">Pickup Location:</span>
                      <p>{settings.shopName}</p>
                      <p className="text-slate-600">{settings.address.shopNo}, {settings.address.building}, {settings.address.landmark}</p>
                      <p className="text-[11px] text-amber-800 mt-1">Timings: {settings.openingHours}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Payment Gateway Selection */}
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  3. Select Payment Gateway
                </span>

                {/* Gateway Options Tabs */}
                <div className="space-y-2">
                  {/* Option 1: UPI / QR Code */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-slate-900">UPI / QR Code</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Zero Fee
                      </span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-amber-200/50 space-y-3">
                        <p className="text-[11px] text-slate-600">
                          Scan the shop's UPI QR code using <strong>GPay, PhonePe, Paytm or BHIM</strong>:
                        </p>

                        {/* Interactive QR Code Display */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-xs">
                          {settings.upiQrImageUrl ? (
                            /* Shop owner uploaded custom QR code */
                            <img
                              src={settings.upiQrImageUrl}
                              alt="Style Hunt UPI QR Code"
                              className="w-36 h-36 object-contain rounded-lg border"
                            />
                          ) : (
                            /* Dynamic Styled Shop QR Code */
                            <div className="w-36 h-36 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-between text-white shadow-inner relative overflow-hidden">
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:8px_8px]" />
                              <div className="relative z-10 text-center pt-2">
                                <span className="font-mono text-[10px] tracking-widest text-amber-400 font-bold block">
                                  STYLE HUNT UPI
                                </span>
                                <span className="text-[9px] text-slate-300 block">Scan to Pay ₹{total}</span>
                              </div>
                              <div className="relative z-10 w-16 h-16 bg-white rounded-lg p-1 flex items-center justify-center">
                                <QrCode className="w-14 h-14 text-slate-950" />
                              </div>
                              <div className="relative z-10 text-[9px] font-mono text-slate-400 pb-1">
                                {settings.upiId}
                              </div>
                            </div>
                          )}

                          {/* UPI ID & Copy button */}
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-lg w-full justify-between">
                            <span className="font-mono text-[11px] text-slate-700 truncate">
                              {settings.upiId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="text-amber-700 hover:text-amber-800 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                            >
                              {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-center gap-2 pt-1 text-[10px] text-slate-400">
                          <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Credit / Debit Cards */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-700" />
                        <span className="font-bold text-xs text-slate-900">Credit / Debit Card</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Visa, Mastercard, RuPay
                      </span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 •••• •••• 8921"
                            className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              Expiry (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="12/28"
                              className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Rahul Verma"
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Net Banking */}
                  <div
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-700" />
                        <span className="font-bold text-xs text-slate-900">Net Banking</span>
                      </div>
                    </div>

                    {paymentMethod === 'netbanking' && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        <label className="text-[10px] font-semibold text-slate-600 block">
                          Select Your Bank:
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-white"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                          <option>Punjab National Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Option 4: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Order Price Breakdown */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total:</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery:</span>
                    <span className="font-semibold">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-1.5 border-t border-slate-200">
                    <span>Payable Total:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Final Pay Button */}
                <button
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md hover:shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Securing Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'cod' ? 'Confirm Cash Order' : `Pay ₹${total.toLocaleString('en-IN')}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulated 3D Secure / OTP Modal for Card Payment */}
      {showOtpModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Bank 3D-Secure Verification</span>
              <button onClick={() => setShowOtpModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                An OTP has been sent to your registered mobile number for payment of <strong>₹{total.toLocaleString('en-IN')}</strong> to <strong>Style Hunt Men's Wear</strong>.
              </p>
              <p className="font-mono text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                Demo OTP: <strong>{otpCode}</strong>
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Enter 6-digit OTP:
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                placeholder="482910"
                className="w-full text-center tracking-widest text-lg font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={executeOrderPlacement}
              disabled={isProcessing}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              {isProcessing ? 'Verifying OTP...' : 'Authorize & Pay'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
