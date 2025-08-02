import { collection, getDocs, doc, updateDoc, query, where, orderBy, CollectionReference, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { FirebaseProduct } from '@/types/firebase';

export class ProductService {
  private static collection: CollectionReference = collection(db, 'products');

  static async getAllProducts(): Promise<FirebaseProduct[]> {
    try {
      const querySnapshot = await getDocs(this.collection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProduct));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  static async getNewProducts(): Promise<FirebaseProduct[]> {
    try {
      const q = query(
        this.collection,
        where('isNew', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProduct));
    } catch (error) {
      console.error('Error fetching new products:', error);
      throw new Error('Failed to fetch new products');
    }
  }

  static async getBestsellerProducts(): Promise<FirebaseProduct[]> {
    try {
      const q = query(
        this.collection,
        where('isBestseller', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProduct));
    } catch (error) {
      console.error('Error fetching bestseller products:', error);
      throw new Error('Failed to fetch bestseller products');
    }
  }

  static async getProductsByCategory(category: string): Promise<FirebaseProduct[]> {
    try {
      const q = query(
        this.collection,
        where('category', '==', category)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseProduct));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  }

  static async getProductById(id: string): Promise<FirebaseProduct | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDocs(query(this.collection, where('__name__', '==', id)));
      
      if (!docSnap.empty) {
        const productDoc = docSnap.docs[0];
        return {
          id: productDoc.id,
          ...productDoc.data()
        } as FirebaseProduct;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // Set product as new (and remove bestseller status)
  static async setProductAsNew(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        isNew: true,
        isBestseller: false
      });
    } catch (error) {
      console.error('Error setting product as new:', error);
      throw new Error('Failed to update product status');
    }
  }

  // Set product as bestseller (and remove new status)
  static async setProductAsBestseller(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        isBestseller: true,
        isNew: false
      });
    } catch (error) {
      console.error('Error setting product as bestseller:', error);
      throw new Error('Failed to update product status');
    }
  }

  // Clear all new statuses
  static async clearAllNewStatuses(): Promise<void> {
    try {
      const q = query(this.collection, where('isNew', '==', true));
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(docSnapshot => {
        const docRef = doc(this.collection, docSnapshot.id);
        return updateDoc(docRef, { isNew: false });
      });
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error clearing new statuses:', error);
      throw new Error('Failed to clear new statuses');
    }
  }

  // Clear all bestseller statuses
  static async clearAllBestsellerStatuses(): Promise<void> {
    try {
      const q = query(this.collection, where('isBestseller', '==', true));
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(docSnapshot => {
        const docRef = doc(this.collection, docSnapshot.id);
        return updateDoc(docRef, { isBestseller: false });
      });
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error clearing bestseller statuses:', error);
      throw new Error('Failed to clear bestseller statuses');
    }
  }

  // Add new product
  static async addProduct(productData: Omit<FirebaseProduct, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collection, productData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  // Update product
  static async updateProduct(id: string, productData: Partial<Omit<FirebaseProduct, 'id'>>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, productData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
} 