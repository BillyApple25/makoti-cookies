import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, CollectionReference } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/types/firebase';

export class UserService {
  private static collection: CollectionReference = collection(db, 'users');

  static async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(this.collection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(this.collection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user by email');
    }
  }

  static async addUser(userData: Omit<User, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collection, userData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error('Failed to add user');
    }
  }

  static async updateUser(id: string, userData: Partial<Omit<User, 'id'>>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }
} 