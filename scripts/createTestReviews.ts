import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

async function createTestReviews() {
  try {
    console.log('🔧 CRÉATION DE REVIEWS DE TEST AVEC VRAIS IDs\n');

    // 1. Récupérer tous les produits avec leurs vrais IDs
    console.log('📦 Récupération des produits...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    const products: Array<{id: string, name: string}> = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`✅ "${data.name}" → ID: "${doc.id}"`);
    });

    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé !');
      return;
    }

    // 2. Vérifier s'il y a déjà des reviews
    console.log('\n⭐ Vérification des reviews existantes...');
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log(`Reviews trouvées: ${reviewsSnapshot.docs.length}`);

    // 3. Créer des reviews de test avec les vrais IDs
    console.log('\n🎯 Création de reviews de test...');
    
    const testReviewsData = [
      { rating: 5, user: "Marie Schmidt", comment: "Absolument délicieux ! Ces cookies sont parfaits, texture incroyable." },
      { rating: 4, user: "Pierre Laurent", comment: "Très bon goût, texture parfaite. Je recommande vivement !" },
      { rating: 5, user: "Sophie Martin", comment: "Meilleurs cookies que j'ai jamais mangés ! Bravo pour la qualité." },
      { rating: 4, user: "Jean Robert", comment: "Excellent produit, livraison rapide. Très satisfait de mon achat." },
      { rating: 5, user: "Laura Klein", comment: "Une tuerie ! Toute la famille adore. Commande renouvelée !" },
      { rating: 4, user: "Thomas Weber", comment: "Cookies de qualité exceptionnelle. Service client au top." },
      { rating: 5, user: "Anna Müller", comment: "Fraîcheur garantie, goût authentique. Je suis conquise !" },
      { rating: 4, user: "Klaus Fischer", comment: "Très belle découverte, je recommande sans hésiter." }
    ];

    let reviewsCreated = 0;
    
    // Créer 1-3 reviews pour les premiers produits
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const reviewCount = Math.floor(Math.random() * 2) + 1; // 1-2 reviews par produit
      
      for (let j = 0; j < reviewCount && reviewsCreated < testReviewsData.length; j++) {
        const reviewData = testReviewsData[reviewsCreated];
        
        const review = {
          productId: product.id, // UTILISER LE VRAI ID
          userId: `test-user-${reviewsCreated}`,
          userName: reviewData.user,
          userEmail: `user${reviewsCreated}@test.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (${product.name})`,
          orderId: `test-order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée: "${product.name}" - ${review.rating}⭐ par ${review.userName}`);
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} reviews créées avec succès !`);

    // 4. Calculer et afficher les moyennes
    console.log('\n📊 MOYENNES PAR PRODUIT:');
    const productStats: Record<string, {ratings: number[], count: number, average: number}> = {};

    // Relire les reviews pour calculer les moyennes
    const allReviewsSnapshot = await getDocs(collection(db, 'reviews'));
    allReviewsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!productStats[data.productId]) {
        productStats[data.productId] = { ratings: [], count: 0, average: 0 };
      }
      productStats[data.productId].ratings.push(data.rating);
      productStats[data.productId].count++;
    });

    Object.entries(productStats).forEach(([productId, stats]) => {
      const total = stats.ratings.reduce((sum, rating) => sum + rating, 0);
      stats.average = total / stats.count;
      const product = products.find(p => p.id === productId);
      console.log(`🍪 "${product?.name}": ${stats.average.toFixed(1)}⭐ (${stats.count} avis)`);
    });

    console.log('\n✅ TERMINÉ ! Allez maintenant sur /produkt pour voir les ratings !');
    console.log('🔄 Actualisez la page pour voir les nouvelles notes moyennes.');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le script
createTestReviews(); 