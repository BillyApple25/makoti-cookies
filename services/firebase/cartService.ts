import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, CollectionReference, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Cart, CartItem } from '@/types/firebase';

export class CartService {
  private static collection: CollectionReference = collection(db, 'carts');

  static async getCartByUserId(userId: string): Promise<Cart | null> {
    try {
      const q = query(this.collection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        return {
          userId: cartDoc.data().userId,
          items: cartDoc.data().items,
          lastUpdated: cartDoc.data().lastUpdated
        } as Cart;
      }
      return null;
    } catch (error) {
      console.error('Error fetching cart by user ID:', error);
      throw new Error('Failed to fetch cart');
    }
  }

  static async createCart(userId: string, items: CartItem[] = []): Promise<void> {
    try {
      await addDoc(this.collection, {
        userId,
        items,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
  }

  static async updateCart(userId: string, items: CartItem[]): Promise<void> {
    try {
      const q = query(this.collection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const docRef = doc(this.collection, cartDoc.id);
        await updateDoc(docRef, {
          items,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Create new cart if doesn't exist
        await this.createCart(userId, items);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw new Error('Failed to update cart');
    }
  }

  static async addItemToCart(userId: string, item: CartItem): Promise<void> {
    try {
      const existingCart = await this.getCartByUserId(userId);
      
      if (existingCart) {
        const existingItemIndex = existingCart.items.findIndex(
          cartItem => cartItem.productId === item.productId
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          existingCart.items[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new item
          existingCart.items.push(item);
        }
        
        await this.updateCart(userId, existingCart.items);
      } else {
        // Create new cart with item
        await this.createCart(userId, [item]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  static async removeItemFromCart(userId: string, productId: string): Promise<void> {
    try {
      const existingCart = await this.getCartByUserId(userId);
      
      if (existingCart) {
        const updatedItems = existingCart.items.filter(
          item => item.productId !== productId
        );
        await this.updateCart(userId, updatedItems);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  static async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    try {
      const existingCart = await this.getCartByUserId(userId);
      
      if (existingCart) {
        const itemIndex = existingCart.items.findIndex(
          item => item.productId === productId
        );
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            existingCart.items.splice(itemIndex, 1);
          } else {
            // Update quantity
            existingCart.items[itemIndex].quantity = quantity;
          }
          
          await this.updateCart(userId, existingCart.items);
        }
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw new Error('Failed to update item quantity');
    }
  }

  static async clearCart(userId: string): Promise<void> {
    try {
      await this.updateCart(userId, []);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }

  static async deleteCart(userId: string): Promise<void> {
    try {
      const q = query(this.collection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const docRef = doc(this.collection, cartDoc.id);
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw new Error('Failed to delete cart');
    }
  }
} 