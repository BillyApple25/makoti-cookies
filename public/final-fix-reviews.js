// 🔧 SCRIPT FINAL POUR RÉPARER LES REVIEWS
// Copiez ce code dans la console de votre navigateur (F12) sur la page /produkt

console.log('🔧 RÉPARATION FINALE DES REVIEWS - VERSION COMPLÈTE');

async function finalFixReviews() {
  try {
    // Import Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, deleteDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies",
      storageBucket: "makoti-cookies.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    };

    const app = initializeApp(firebaseConfig, 'final-fix-' + Date.now());
    const db = getFirestore(app);

    console.log('✅ Firebase connecté pour réparation');

    // 1. NETTOYER toutes les anciennes reviews
    console.log('\n🗑️ NETTOYAGE des anciennes reviews...');
    const oldReviews = await getDocs(collection(db, 'reviews'));
    let deletedCount = 0;
    for (const doc of oldReviews.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    console.log(`✅ ${deletedCount} anciennes reviews supprimées`);

    // 2. RÉCUPÉRER les VRAIS produits avec leurs IDs Firestore
    console.log('\n📦 RÉCUPÉRATION des produits avec VRAIS IDs...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    const products = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`✅ "${data.name}" → ID Firestore: "${doc.id}"`);
    });

    if (products.length === 0) {
      console.log('❌ AUCUN PRODUIT TROUVÉ!');
      return;
    }

    // 3. CRÉER de nouvelles reviews avec les BONS IDs
    console.log('\n🎯 CRÉATION de reviews avec les VRAIS IDs Firestore...');
    
    const reviewsData = [
      { rating: 5, userName: "Marie Dubois", comment: "Absolument délicieux!" },
      { rating: 4, userName: "Pierre Martin", comment: "Très bons cookies, je recommande!" },
      { rating: 5, userName: "Sophie Laurent", comment: "Les meilleurs cookies que j'ai jamais mangés!" },
      { rating: 4, userName: "Jean Moreau", comment: "Excellente qualité, livraison rapide." },
      { rating: 5, userName: "Anna Weber", comment: "Goût incroyable! Toute la famille adore." },
      { rating: 4, userName: "Thomas Klein", comment: "Frais et authentique. Service client au top." }
    ];

    let reviewsCreated = 0;
    
    // Créer 1-2 reviews pour les premiers produits
    for (let i = 0; i < Math.min(products.length, 4); i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 2) + 1; // 1-2 reviews
      
      console.log(`\n🍪 Création reviews pour: "${product.name}" (ID: ${product.id})`);
      
      for (let j = 0; j < numReviews && reviewsCreated < reviewsData.length; j++) {
        const reviewData = reviewsData[reviewsCreated];
        
        const review = {
          productId: product.id, // ⚠️ CRUCIAL: ID FIRESTORE RÉEL
          userId: `test-user-${reviewsCreated}`,
          userName: reviewData.userName,
          userEmail: `user${reviewsCreated}@test.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (${product.name})`,
          orderId: `test-order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };
        
        console.log(`💾 Sauvegarde: ProductID="${review.productId}" Rating=${review.rating}`);
        
        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée pour ${product.name}`);
        
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} reviews créées avec les BONS IDs!`);

    // 4. VÉRIFICATION - Calculer les moyennes
    console.log('\n📊 VÉRIFICATION des moyennes...');
    const finalReviews = await getDocs(collection(db, 'reviews'));
    const reviewsByProduct = {};

    finalReviews.forEach(doc => {
      const data = doc.data();
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
      console.log(`• Review: ProductID="${data.productId}" Rating=${data.rating} User="${data.userName}"`);
    });

    console.log('\n🍪 MOYENNES CALCULÉES:');
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const product = products.find(p => p.id === productId);
      console.log(`• "${product?.name}": ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    console.log('\n✅ RÉPARATION TERMINÉE!');
    console.log('🔄 Actualisez la page /produkt pour voir les ratings!');
    
    // Alerte de succès
    alert(`✅ SUCCÈS! ${reviewsCreated} reviews créées avec les bons IDs!\n\nActualisez la page /produkt pour voir les ratings s'afficher!`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la réparation:', error);
    alert('❌ Erreur! Vérifiez la console pour plus de détails.');
  }
}

// Lancer la réparation
finalFixReviews(); 