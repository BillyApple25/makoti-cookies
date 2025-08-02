import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixReviews() {
  try {
    console.log('🔧 CORRECTION DES REVIEWS AVEC LES VRAIS IDs\n');

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

    if (reviewsSnapshot.docs.length > 0) {
      console.log('❌ Des reviews existent déjà. Supprimez-les d\'abord si nécessaire.');
      return;
    }

    // 3. Créer des reviews de test avec les vrais IDs
    console.log('\n🎯 Création de reviews de test...');
    
    const testReviews = [];
    
    // Pour chaque produit, créer 1-3 reviews
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const reviewCount = Math.floor(Math.random() * 3) + 1; // 1-3 reviews par produit
      
      for (let j = 0; j < reviewCount; j++) {
        const review = {
          productId: product.id, // UTILISER LE VRAI ID
          userId: `test-user-${i}-${j}`,
          userName: `Test User ${i+1}-${j+1}`,
          userEmail: `testuser${i}${j}@example.com`,
          rating: Math.floor(Math.random() * 5) + 1, // 1-5 étoiles
          comment: `Excellent produit ${product.name}! Review test ${j+1}.`,
          orderId: `test-order-${i}-${j}`,
          createdAt: serverTimestamp()
        };
        
        testReviews.push(review);
      }
    }

    // Ajouter les reviews à Firestore
    for (const review of testReviews) {
      await addDoc(collection(db, 'reviews'), review);
      console.log(`✅ Review ajoutée pour "${products.find(p => p.id === review.productId)?.name}" - ${review.rating}⭐`);
    }

    console.log(`\n🎉 ${testReviews.length} reviews créées avec succès !`);

    // 4. Calculer et afficher les moyennes
    console.log('\n📊 MOYENNES PAR PRODUIT:');
    const productStats: Record<string, {ratings: number[], count: number, average: number}> = {};

    testReviews.forEach(review => {
      if (!productStats[review.productId]) {
        productStats[review.productId] = { ratings: [], count: 0, average: 0 };
      }
      productStats[review.productId].ratings.push(review.rating);
      productStats[review.productId].count++;
    });

    Object.entries(productStats).forEach(([productId, stats]) => {
      const total = stats.ratings.reduce((sum, rating) => sum + rating, 0);
      stats.average = total / stats.count;
      const product = products.find(p => p.id === productId);
      console.log(`🍪 "${product?.name}": ${stats.average.toFixed(1)}⭐ (${stats.count} avis)`);
    });

    console.log('\n✅ TERMINÉ ! Allez maintenant sur /produkt pour voir les ratings !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le script
fixReviews(); 