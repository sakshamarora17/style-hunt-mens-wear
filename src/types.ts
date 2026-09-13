export interface ProductSize {
  size: string;
  stock: number;
}

export type ProductCategory = 
  | 'jeans' 
  | 'trousers' 
  | 'joggers' 
  | 'lycra' 
  | 'shirts' 
  | 'tshirts' 
  | 'lowers' 
  | 'shorts';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  costPrice: number;
  description: string;
  fabric: string;
  fit: string;
  color: string;
  images: string[]; // [front, angle, back, detail]
  sizes: ProductSize[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: CustomerAddress;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    transactionId?: string;
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
  };
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface ShopSettings {
  shopName: string;
  brandDomain: string;
  tagline: string;
  address: {
    shopNo: string;
    building: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
  };
  contactPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  openingHours: string;
  gstin: string;
  upiId: string;
  upiQrImageUrl: string;
  announcementText: string;
}

export interface SalesAnalytics {
  todaySales: number;
  todayOrders: number;
  weekSales: number;
  weekOrders: number;
  monthSales: number;
  monthOrders: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  revenueByDay: { date: string; day: string; sales: number; orders: number }[];
  categorySales: { name: string; sales: number; units: number }[];
  topSellingProducts: {
    id: string;
    name: string;
    category: string;
    unitsSold: number;
    revenue: number;
    currentStock: number;
  }[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  savedAddresses: CustomerAddress[];
}
