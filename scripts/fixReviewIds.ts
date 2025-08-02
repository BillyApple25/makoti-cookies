import { db } from '@/lib/firebase/config';
import { collection, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

async function fixReviewIds() {
  try {
    console.log('🔧 CORRECTION DES PRODUCT IDs DANS LES REVIEWS\n');

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

    // 2. Récupérer toutes les reviews existantes
    console.log('\n⭐ Récupération des reviews existantes...');
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    
    const existingReviews: Array<any> = [];
    reviewsSnapshot.forEach(doc => {
      const data = doc.data();
      existingReviews.push({ 
        id: doc.id, 
        ref: doc.ref,
        ...data 
      });
      console.log(`📝 Review existante: ProductID "${data.productId}" - ${data.rating}⭐ - ${data.userName}`);
    });

    if (existingReviews.length === 0) {
      console.log('❌ Aucune review trouvée !');
      return;
    }

    // 3. Supprimer toutes les anciennes reviews
    console.log('\n🗑️ Suppression des anciennes reviews...');
    for (const review of existingReviews) {
      await deleteDoc(review.ref);
      console.log(`❌ Review supprimée: ${review.id}`);
    }

    // 4. Créer de nouvelles reviews avec les VRAIS IDs
    console.log('\n🎯 Création de nouvelles reviews avec les bons IDs...');
    
    let reviewsCreated = 0;
    
    // Créer des reviews pour les 3 premiers produits avec les vrais IDs
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      
      // Créer 1-2 reviews par produit
      const numReviews = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numReviews && reviewsCreated < 6; j++) {
        const reviewData = getReviewData(reviewsCreated);
        
        const newReview = {
          productId: product.id, // UTILISER LE VRAI ID FIRESTORE
          userId: `user-${reviewsCreated}`,
          userName: reviewData.userName,
          userEmail: `user${reviewsCreated}@test.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (${product.name})`,
          orderId: `order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'reviews'), newReview);
        console.log(`✅ Nouvelle review: "${product.name}" - ${newReview.rating}⭐ par ${newReview.userName}`);
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} nouvelles reviews créées avec les bons IDs !`);

    // 5. Vérifier les nouvelles moyennes
    console.log('\n📊 NOUVELLES MOYENNES PAR PRODUIT:');
    const newReviewsSnapshot = await getDocs(collection(db, 'reviews'));
    const reviewsByProduct: Record<string, number[]> = {};

    newReviewsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
    });

    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const product = products.find(p => p.id === productId);
      console.log(`🍪 "${product?.name}": ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    console.log('\n✅ TERMINÉ ! Les ratings devraient maintenant s\'afficher sur la page /produkt !');
    console.log('🔄 Actualisez la page /produkt pour voir les résultats.');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

function getReviewData(index: number) {
  const reviewsData = [
    { userName: "edou thomas", rating: 5, comment: "Absolument délicieux ! Parfait comme toujours." },
    { userName: "Marie Schmidt", rating: 4, comment: "Très bon goût, texture parfaite. Je recommande !" },
    { userName: "Pierre Laurent", rating: 5, comment: "Meilleurs cookies que j'ai jamais mangés !" },
    { userName: "Sophie Martin", rating: 4, comment: "Excellent produit, livraison rapide." },
    { userName: "Jean Robert", rating: 5, comment: "Une tuerie ! Toute la famille adore." },
    { userName: "Laura Klein", rating: 4, comment: "Fraîcheur garantie, goût authentique." }
  ];
  
  return reviewsData[index % reviewsData.length];
}

// Exécuter le script
fixReviewIds(); 