import { Timestamp } from 'firebase/firestore';

// Payment method type
export type PaymentMethod = 'paypal' | 'stripe' | 'cash';

// Address type
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  name?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  password?: string; // gehashed - optionnel car on ne récupère pas le password
  image?: string;
  createdAt: Timestamp;
}

// Product types
export interface FirebaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isNew: boolean;
  isBestseller: boolean;
  category?: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// OrderItem types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Cart types
export interface Cart {
  userId: string;
  items: CartItem[];
  lastUpdated: Timestamp;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
} 