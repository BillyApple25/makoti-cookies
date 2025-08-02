'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './AuthProvider';
import { CartService } from '@/services/firebase/cartService';
import { Cart, CartItem } from '@/types/firebase';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuthContext();

  // Charger le panier depuis Firebase quand l'utilisateur est connecté
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !user) {
        // Utilisateur non connecté - garder le panier vide ou localStorage temporaire
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        }
        return;
      }

      try {
        setLoading(true);
        const cart = await CartService.getCartByUserId(user.uid);
        if (cart) {
          setItems(cart.items);
        } else {
          // Créer un panier vide pour l'utilisateur
          await CartService.createCart(user.uid);
          setItems([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, isAuthenticated]);

  // Synchroniser avec localStorage pour les utilisateurs non connectés
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    const newItems = [...items];
    const existingItem = newItems.find(item => item.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ ...product, quantity: 1 });
    }

    setItems(newItems);

    // Synchroniser avec Firebase si utilisateur connecté
    if (isAuthenticated && user) {
      try {
        await CartService.updateCart(user.uid, newItems);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        // Restaurer l'état précédent en cas d'erreur
        setItems(items);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const newItems = items.filter(item => item.productId !== productId);
    setItems(newItems);

    // Synchroniser avec Firebase si utilisateur connecté
    if (isAuthenticated && user) {
      try {
        await CartService.updateCart(user.uid, newItems);
      } catch (error) {
        console.error('Erreur lors de la suppression du panier:', error);
        // Restaurer l'état précédent en cas d'erreur
        setItems(items);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setItems(newItems);

    // Synchroniser avec Firebase si utilisateur connecté
    if (isAuthenticated && user) {
      try {
        await CartService.updateCart(user.uid, newItems);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        // Restaurer l'état précédent en cas d'erreur
        setItems(items);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);

    // Synchroniser avec Firebase si utilisateur connecté
    if (isAuthenticated && user) {
      try {
        await CartService.clearCart(user.uid);
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
      }
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}