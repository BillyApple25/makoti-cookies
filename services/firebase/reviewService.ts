import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  CollectionReference, 
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Review } from '@/types/firebase';
import { OrderService } from './orderService';

export interface ProductRating {
  rating: number;
  reviewCount: number;
}

export interface ReviewData {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  orderId: string;
}

export class ReviewService {
  private static collection: CollectionReference = collection(db, 'reviews');

  /**
   * ✅ Ajouter une nouvelle review
   */
  static async addReview(reviewData: ReviewData): Promise<string> {
    try {
      console.log('💾 ReviewService.addReview - Ajout de la review:', reviewData);
      
      const review = {
        ...reviewData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.collection, review);
      console.log('✅ Review ajoutée avec succès:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la review:', error);
      throw new Error('Impossible d\'ajouter la review');
    }
  }

  /**
   * ⭐ Calculer la note moyenne d'un produit
   */
  static async getProductRating(productId: string): Promise<ProductRating> {
    try {
      const q = query(
        this.collection, 
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { rating: 0, reviewCount: 0 };
      }

      const reviews = querySnapshot.docs.map(doc => doc.data());
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;

      return {
        rating: Math.round(avgRating * 10) / 10, // Arrondi à 1 décimale
        reviewCount: reviews.length
      };
    } catch (error) {
      console.error('❌ Erreur lors du calcul de la note:', error);
      return { rating: 0, reviewCount: 0 };
    }
  }

  /**
   * 📊 Calculer les notes pour plusieurs produits (optimisé)
   */
  static async getMultipleProductRatings(productIds: string[]): Promise<Record<string, ProductRating>> {
    try {
      const ratingsMap: Record<string, ProductRating> = {};
      
      // Initialiser avec des valeurs par défaut
      productIds.forEach(id => {
        ratingsMap[id] = { rating: 0, reviewCount: 0 };
      });

      if (productIds.length === 0) return ratingsMap;

      // Récupérer toutes les reviews d'un coup
      const q = query(
        this.collection,
        where('productId', 'in', productIds.slice(0, 10)) // Firestore limite à 10
      );
      
      const querySnapshot = await getDocs(q);
      
      // Grouper par productId
      const reviewsByProduct: Record<string, number[]> = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!reviewsByProduct[data.productId]) {
          reviewsByProduct[data.productId] = [];
        }
        reviewsByProduct[data.productId].push(data.rating);
      });

      // Calculer moyennes
      Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        ratingsMap[productId] = {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: ratings.length
        };
      });

      return ratingsMap;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des notes multiples:', error);
      return productIds.reduce((acc, id) => {
        acc[id] = { rating: 0, reviewCount: 0 };
        return acc;
      }, {} as Record<string, ProductRating>);
    }
  }

  /**
   * 📝 Récupérer toutes les reviews d'un produit
   */
  static async getReviewsByProductId(productId: string): Promise<Review[]> {
    try {
      const q = query(
        this.collection, 
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des reviews:', error);
      return [];
    }
  }

  /**
   * 👤 Récupérer les reviews d'un utilisateur
   */
  static async getReviewsByUserId(userId: string): Promise<Review[]> {
    try {
      const q = query(
        this.collection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des reviews utilisateur:', error);
      return [];
    }
  }

  /**
   * 🛒 Obtenir les produits qu'un utilisateur peut reviewer
   */
  static async getProductsUserCanReview(userId: string): Promise<string[]> {
    try {
      // Récupérer les commandes livrées
      const deliveredOrders = await OrderService.getOrdersReadyForReview(userId);
      
      // Extraire les productIds
      const purchasedProductIds = new Set<string>();
      deliveredOrders.forEach(order => {
        order.items.forEach(item => {
          purchasedProductIds.add(item.productId);
        });
      });
      
      // Récupérer les reviews déjà faites
      const userReviews = await this.getReviewsByUserId(userId);
      const reviewedProductIds = new Set(userReviews.map(review => review.productId));
      
      // Filtrer les produits non encore reviewés
      return Array.from(purchasedProductIds).filter(
        productId => !reviewedProductIds.has(productId)
      );
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des produits reviewables:', error);
      return [];
    }
  }

  /**
   * ✅ Vérifier si un utilisateur a déjà reviewé un produit
   */
  static async hasUserReviewedProduct(userId: string, productId: string): Promise<boolean> {
    try {
      const q = query(
        this.collection,
        where('userId', '==', userId),
        where('productId', '==', productId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de review:', error);
      return false;
    }
  }

  /**
   * 📡 Écouter les changements de reviews d'un produit en temps réel
   */
  static subscribeToProductReviews(
    productId: string, 
    callback: (reviews: Review[]) => void
  ): Unsubscribe {
    const q = query(
      this.collection,
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
      
      callback(reviews);
    });
  }

  /**
   * 🏆 Obtenir les produits les mieux notés
   */
  static async getTopRatedProducts(limitCount: number = 10): Promise<Array<{ productId: string; rating: number; reviewCount: number }>> {
    try {
      const querySnapshot = await getDocs(this.collection);
      
      // Grouper par produit
      const productReviews: Record<string, number[]> = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!productReviews[data.productId]) {
          productReviews[data.productId] = [];
        }
        productReviews[data.productId].push(data.rating);
      });

      // Calculer moyennes et trier
      return Object.entries(productReviews)
        .map(([productId, ratings]) => ({
          productId,
          rating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          reviewCount: ratings.length
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limitCount);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des top produits:', error);
      return [];
    }
  }
} 