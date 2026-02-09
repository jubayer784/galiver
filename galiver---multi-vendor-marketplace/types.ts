
export type PortalType = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: string;
  category: string;
  vendorId: string;
  stock: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariant?: string;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  totalSales: number;
  status: 'active' | 'pending' | 'suspended';
}

export interface Order {
  id: string;
  customerId: string;
  items: { productId: string; quantity: number; price: number; color?: string; size?: string; variant?: string }[];
  total: number;
  status: 'pending' | 'accepted' | 'processing' | 'shipped' | 'delivered';
  date: string;
  customerPhone: string;
  courierTrackingCode?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image?: string;
  childCategories?: ChildCategory[];
}

export interface ChildCategory {
  id: string;
  name: string;
}
