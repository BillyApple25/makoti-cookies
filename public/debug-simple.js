// 🔍 SCRIPT DE DEBUG ULTRA-SIMPLE
// Copiez dans la console pour voir l'état des reviews

console.log('🔍 DEBUG REVIEWS - DÉBUT');

async function debugReviews() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    const app = initializeApp({
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies"
    }, 'debug-' + Date.now());
    
    const db = getFirestore(app);

    console.log('✅ Firebase connecté pour debug');

    // 1. Compter les reviews
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log(`📊 TOTAL REVIEWS: ${reviewsSnapshot.docs.length}`);

    if (reviewsSnapshot.docs.length === 0) {
      console.log('❌ AUCUNE REVIEW TROUVÉE !');
      console.log('💡 Vous devez d\'abord créer des reviews de test !');
      return;
    }

    // 2. Lister toutes les reviews
    console.log('\n📋 LISTE DES REVIEWS:');
    reviewsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ProductID: "${data.productId}" | Rating: ${data.rating}⭐ | User: ${data.userName}`);
    });

    // 3. Calculer moyennes par produit
    const reviewsByProduct = {};
    reviewsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = [];
      }
      reviewsByProduct[data.productId].push(data.rating);
    });

    console.log('\n📊 MOYENNES PAR PRODUIT:');
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      console.log(`• ProductID "${productId}": ${avg.toFixed(1)}⭐ (${ratings.length} avis)`);
    });

    // 4. Récupérer les produits
    const productsSnapshot = await getDocs(collection(db, 'products'));
    console.log(`\n📦 TOTAL PRODUITS: ${productsSnapshot.docs.length}`);
    
    console.log('\n📋 LISTE DES PRODUITS:');
    productsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const hasReviews = reviewsByProduct[doc.id] ? '✅' : '❌';
      console.log(`${index + 1}. ${hasReviews} "${data.name}" → ID: "${doc.id}"`);
    });

    console.log('\n🎯 RÉSUMÉ:');
    console.log(`• ${reviewsSnapshot.docs.length} reviews au total`);
    console.log(`• ${Object.keys(reviewsByProduct).length} produits avec avis`);
    console.log(`• ${productsSnapshot.docs.length - Object.keys(reviewsByProduct).length} produits sans avis`);

    if (Object.keys(reviewsByProduct).length > 0) {
      console.log('\n✅ Il y a des reviews ! Les étoiles jaunes devraient s\'afficher.');
    } else {
      console.log('\n❌ Aucune review ! Toutes les étoiles devraient être grises.');
    }

  } catch (error) {
    console.error('❌ Erreur debug:', error);
  }
}

debugReviews(); 