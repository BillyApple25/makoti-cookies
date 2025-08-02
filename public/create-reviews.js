// 🔧 SCRIPT POUR CRÉER DES REVIEWS DE TEST
// Copiez ce code dans la console de votre navigateur (F12) sur la page /produkt

console.log('🔧 CRÉATION DE REVIEWS DE TEST AVEC VRAIS IDs');

async function createTestReviews() {
  try {
    // Importer Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies",
      storageBucket: "makoti-cookies.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id"
    };

    const app = initializeApp(firebaseConfig, 'reviews-creator');
    const db = getFirestore(app);

    console.log('✅ Firebase connecté');

    // 1. Récupérer tous les produits
    console.log('\n📦 Récupération des produits...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    const products = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`• "${data.name}" → ID: "${doc.id}"`);
    });

    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé !');
      return;
    }

    // 2. Vérifier les reviews existantes
    console.log('\n⭐ Vérification des reviews...');
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log(`Reviews existantes: ${reviewsSnapshot.docs.length}`);

    // 3. Créer des reviews pour les 5 premiers produits
    console.log('\n🎯 Création de reviews...');
    
    const reviewsToCreate = [
      { rating: 5, comment: "Absolument délicieux ! Ces cookies sont parfaits.", user: "Marie D." },
      { rating: 4, comment: "Très bon goût, texture parfaite. Je recommande !", user: "Pierre L." },
      { rating: 5, comment: "Meilleurs cookies que j'ai jamais mangés ! Bravo !", user: "Sophie M." },
      { rating: 4, comment: "Excellent produit, livraison rapide. Très satisfait.", user: "Jean R." },
      { rating: 5, comment: "Une tuerie ! Toute la famille adore. Merci !", user: "Laura K." }
    ];

    let reviewsCreated = 0;

    // Créer 1-3 reviews pour chaque produit (max 5 produits)
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews
      
      for (let j = 0; j < numReviews && reviewsCreated < reviewsToCreate.length; j++) {
        const reviewData = reviewsToCreate[reviewsCreated];
        
        const review = {
          productId: product.id, // VRAI ID DU PRODUIT
          userId: `user-${reviewsCreated}`,
          userName: reviewData.user,
          userEmail: `user${reviewsCreated}@example.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (Produit: ${product.name})`,
          orderId: `order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée: "${product.name}" - ${review.rating}⭐ par ${review.userName}`);
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} reviews créées avec succès !`);

    // 4. Vérifier les moyennes
    console.log('\n📊 Vérification des nouvelles reviews...');
    const newReviewsSnapshot = await getDocs(collection(db, 'reviews'));
    const reviewsByProduct = {};

    newReviewsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
    });

    console.log('\n🍪 MOYENNES PAR PRODUIT:');
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const product = products.find(p => p.id === productId);
      console.log(`• "${product?.name}": ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    console.log('\n✅ TERMINÉ ! Actualisez la page /produkt pour voir les ratings !');
    console.log('💡 Si ça ne marche pas, vérifiez la console pour les erreurs de chargement');

  } catch (error) {
    console.error('❌ Erreur:', error);
    console.log('\n💡 Essayez d\'actualiser la page et relancer le script');
  }
}

// Lancer la création
createTestReviews(); 