// 🚀 SCRIPT ULTRA-SIMPLE POUR CRÉER DES REVIEWS DE TEST
// Copiez-collez dans la console du navigateur (F12) sur la page /produkt

console.log('🚀 CRÉATION DE REVIEWS DE TEST');

async function createTestReviews() {
  try {
    // Import Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, deleteDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Config Firebase simplifiée
    const app = initializeApp({
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies"
    }, 'test-' + Date.now());
    
    const db = getFirestore(app);
    console.log('✅ Firebase connecté');

    // 1. SUPPRIMER toutes les anciennes reviews
    console.log('🗑️ Suppression des anciennes reviews...');
    const oldReviews = await getDocs(collection(db, 'reviews'));
    for (const doc of oldReviews.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ ${oldReviews.docs.length} anciennes reviews supprimées`);

    // 2. RÉCUPÉRER les produits
    console.log('📦 Récupération des produits...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`📦 Produit: "${data.name}" → ID: ${doc.id}`);
    });

    if (products.length === 0) {
      alert('❌ Aucun produit trouvé dans Firestore!');
      return;
    }

    // 3. CRÉER des reviews simples
    console.log('⭐ Création de reviews...');
    
    const reviewsToCreate = [
      { rating: 5, userName: "Alice Martin", comment: "Absolument délicieux!" },
      { rating: 4, userName: "Bob Durand", comment: "Très bon produit" },
      { rating: 5, userName: "Claire Moreau", comment: "Parfait, je recommande!" },
      { rating: 4, userName: "David Lambert", comment: "Excellent goût" }
    ];

    let reviewCount = 0;
    
    // Créer des reviews pour les 3 premiers produits
    for (let i = 0; i < Math.min(products.length, 3); i++) {
      const product = products[i];
      
      // 1-2 reviews par produit
      const numReviews = i === 0 ? 2 : 1; 
      
      for (let j = 0; j < numReviews && reviewCount < reviewsToCreate.length; j++) {
        const reviewData = reviewsToCreate[reviewCount];
        
        const review = {
          productId: product.id, // ID FIRESTORE RÉEL
          userId: `user-${reviewCount}`,
          userName: reviewData.userName,
          userEmail: `user${reviewCount}@test.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (pour ${product.name})`,
          orderId: `order-${reviewCount}`,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée pour "${product.name}": ${reviewData.rating}⭐ par ${reviewData.userName}`);
        
        reviewCount++;
      }
    }

    // 4. VÉRIFICATION
    console.log('📊 Vérification...');
    const finalReviews = await getDocs(collection(db, 'reviews'));
    
    const reviewsByProduct = {};
    finalReviews.forEach(doc => {
      const data = doc.data();
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
    });

    console.log('\n🍪 MOYENNES PAR PRODUIT:');
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      const product = products.find(p => p.id === productId);
      console.log(`• "${product?.name}": ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    console.log('\n🎉 TERMINÉ !');
    console.log(`✅ ${reviewCount} reviews créées avec succès!`);
    console.log('🔄 ACTUALISEZ LA PAGE /produkt MAINTENANT!');
    
    alert(`🎉 SUCCÈS!\n\n${reviewCount} reviews créées!\n\nACTUALISEZ la page /produkt pour voir les étoiles!`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    alert('❌ Erreur! Voir la console pour plus de détails.');
  }
}

// EXÉCUTER
createTestReviews(); 