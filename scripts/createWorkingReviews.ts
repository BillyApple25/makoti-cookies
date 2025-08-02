import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

async function createWorkingReviews() {
  try {
    console.log('🔧 CRÉATION DE REVIEWS QUI FONCTIONNENT\n');

    // 1. Supprimer TOUTES les anciennes reviews
    console.log('🗑️ Nettoyage des anciennes reviews...');
    const oldReviewsSnapshot = await getDocs(collection(db, 'reviews'));
    for (const doc of oldReviewsSnapshot.docs) {
      await deleteDoc(doc.ref);
      console.log(`❌ Review supprimée: ${doc.id}`);
    }
    console.log(`✅ ${oldReviewsSnapshot.docs.length} anciennes reviews supprimées`);

    // 2. Récupérer TOUS les produits avec leurs VRAIS IDs Firestore
    console.log('\n📦 Récupération des produits...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    const products: Array<{id: string, name: string}> = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`✅ Produit: "${data.name}" → ID Firestore: "${doc.id}"`);
    });

    if (products.length === 0) {
      console.log('❌ AUCUN PRODUIT TROUVÉ !');
      return;
    }

    // 3. Créer des reviews avec les VRAIS IDs Firestore
    console.log('\n🎯 Création de reviews avec les BONS IDs...');
    
    const reviewsData = [
      { rating: 5, userName: "Marie Dubois", comment: "Absolutely delicious! Perfect texture and taste." },
      { rating: 4, userName: "Pierre Martin", comment: "Very good cookies, I recommend them!" },
      { rating: 5, userName: "Sophie Laurent", comment: "Best cookies I've ever had! Will order again." },
      { rating: 4, userName: "Jean Moreau", comment: "Excellent quality, fast delivery. Very satisfied." },
      { rating: 5, userName: "Anna Weber", comment: "Amazing taste! My whole family loves them." },
      { rating: 4, userName: "Thomas Klein", comment: "Fresh and authentic. Great customer service too." }
    ];

    let reviewsCreated = 0;
    
    // Créer 1-2 reviews pour chaque produit
    for (let i = 0; i < Math.min(products.length, 4); i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 2) + 1; // 1-2 reviews par produit
      
      console.log(`\n🍪 Création de reviews pour: "${product.name}" (ID: ${product.id})`);
      
      for (let j = 0; j < numReviews && reviewsCreated < reviewsData.length; j++) {
        const reviewData = reviewsData[reviewsCreated];
        
        const review = {
          productId: product.id, // ⚠️ CRUCIAL: Utiliser l'ID FIRESTORE réel
          userId: `test-user-${reviewsCreated}`,
          userName: reviewData.userName,
          userEmail: `user${reviewsCreated}@test.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (${product.name})`,
          orderId: `test-order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };
        
        console.log(`💾 Sauvegarde review: ProductID="${review.productId}" Rating=${review.rating} User="${review.userName}"`);
        
        const docRef = await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée avec succès! Doc ID: ${docRef.id}`);
        
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} reviews créées avec les BONS IDs Firestore !`);

    // 4. Vérification finale - Lire les reviews créées
    console.log('\n📊 VÉRIFICATION FINALE:');
    const finalReviewsSnapshot = await getDocs(collection(db, 'reviews'));
    
    console.log(`Total reviews créées: ${finalReviewsSnapshot.docs.length}`);
    
    const reviewsByProduct: Record<string, number[]> = {};
    
    finalReviewsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`• Review ID: ${doc.id} - ProductID: "${data.productId}" - Rating: ${data.rating}⭐ - User: ${data.userName}`);
      
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
    });

    console.log('\n🍪 MOYENNES PAR PRODUIT:');
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const product = products.find(p => p.id === productId);
      console.log(`• "${product?.name}" (${productId}): ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    console.log('\n✅ TERMINÉ ! Les ratings devraient maintenant s\'afficher sur /produkt !');
    console.log('🔄 Allez sur http://localhost:3000/produkt et actualisez la page.');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le script
createWorkingReviews(); 