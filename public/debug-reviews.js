// Script de debug pour vérifier les reviews dans la console du navigateur
// Copiez-collez ce code dans la console de votre navigateur (F12)

console.log('🔍 DÉBUT DU DEBUG DES REVIEWS');

// Fonction pour vérifier les collections Firestore
async function debugFirestoreReviews() {
  try {
    // Importer Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Configuration Firebase (utilisez vos vraies clés)
    const firebaseConfig = {
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto", // Votre clé visible dans la console
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies", 
      storageBucket: "makoti-cookies.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialisé');

    // Vérifier les produits
    console.log('\n📦 PRODUITS:');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    console.log(`Nombre de produits: ${productsSnapshot.docs.length}`);
    
    productsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`• ID: "${doc.id}" - Nom: "${data.name}"`);
    });

    // Vérifier les reviews
    console.log('\n⭐ REVIEWS:');
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log(`Nombre de reviews: ${reviewsSnapshot.docs.length}`);
    
    if (reviewsSnapshot.docs.length === 0) {
      console.log('❌ AUCUNE REVIEW TROUVÉE!');
      console.log('💡 Ajoutez des reviews dans Firestore pour voir les notes moyennes');
      return;
    }

    reviewsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`• ProductID: "${data.productId}" - Rating: ${data.rating}/5 - User: ${data.userName}`);
    });

    // Calculer les moyennes
    console.log('\n📊 MOYENNES PAR PRODUIT:');
    const reviews = reviewsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const stats = {};

    reviews.forEach(review => {
      if (!stats[review.productId]) {
        stats[review.productId] = { total: 0, count: 0 };
      }
      stats[review.productId].total += review.rating;
      stats[review.productId].count++;
    });

    Object.entries(stats).forEach(([productId, data]) => {
      const avg = data.total / data.count;
      console.log(`• Produit ${productId}: ${avg.toFixed(1)}⭐ (${data.count} avis)`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le debug
debugFirestoreReviews(); 