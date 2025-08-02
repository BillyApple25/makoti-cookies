import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, CollectionReference, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order } from '@/types/firebase';

export class OrderService {
  private static ordersCollection: CollectionReference = collection(db, 'orders');

  // Orders
  static async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  static async getOrderById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(this.ordersCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      console.log('📞 Recherche des commandes pour userId:', userId);
      
      // Requête simple : récupérer toutes les commandes avec ce userId
      const q = query(
        this.ordersCollection, 
        where('userId', '==', userId)
      );
      
      console.log('🔍 Exécution de la requête Firestore...');
      const querySnapshot = await getDocs(q);
      
      console.log('📊 Nombre de documents trouvés:', querySnapshot.docs.length);
      
      const orders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Document trouvé:', doc.id, data);
        return {
          id: doc.id,
          ...data
        } as Order;
      });
      
      // Trier par date de création (plus récent en premier)
      orders.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      
      console.log('✅ Commandes récupérées et triées:', orders.length);
      return orders;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des commandes:', error);
      console.error('UserId utilisé:', userId);
      throw new Error('Failed to fetch user orders');
    }
  }

  static async addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    try {
      console.log('📝 Ajout d\'une nouvelle commande pour userId:', orderData.userId);
      const docRef = await addDoc(this.ordersCollection, {
        ...orderData,
        createdAt: serverTimestamp()
      });
      console.log('✅ Commande ajoutée avec ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding order:', error);
      throw new Error('Failed to add order');
    }
  }

  static async getOrdersReadyForReview(userId: string): Promise<Order[]> {
    try {
      console.log('🔍 Recherche des commandes prêtes pour review, userId:', userId);
      
      // Récupérer toutes les commandes de l'utilisateur
      const allOrders = await this.getOrdersByUserId(userId);
      
      // Filtrer seulement celles qui sont livrées
      const deliveredOrders = allOrders.filter(order => order.status === 'delivered');
      
      console.log('✅ Commandes livrées trouvées:', deliveredOrders.length);
      return deliveredOrders;
      
    } catch (error) {
      console.error('❌ Error fetching orders ready for review:', error);
      throw new Error('Failed to fetch orders ready for review');
    }
  }
} 