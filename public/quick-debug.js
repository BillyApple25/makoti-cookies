// 🔍 DIAGNOSTIC RAPIDE - Copiez ce code dans la console de votre navigateur (F12)

console.log('🔍 DIAGNOSTIC DES IDs PRODUITS vs REVIEWS');

// Fonction pour vérifier les IDs
async function checkProductAndReviewIds() {
  try {
    // Importer Firebase (en utilisant la version locale si possible)
    let firebase, firestore;
    
    try {
      // Essayer d'utiliser Firebase déjà chargé par l'application
      if (window.firebase) {
        firebase = window.firebase;
        firestore = firebase.firestore();
      }
    } catch (e) {
      console.log('Utilisation de Firebase externe...');
      // Fallback vers Firebase externe
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
      const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

      const firebaseConfig = {
        apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
        authDomain: "makoti-cookies.firebaseapp.com",
        projectId: "makoti-cookies", 
        storageBucket: "makoti-cookies.appspot.com"
      };

      const app = initializeApp(firebaseConfig, 'debug-app');
      firestore = getFirestore(app);
    }

    console.log('✅ Connexion à Firestore établie');

    // Récupérer tous les produits
    console.log('\n📦 PRODUITS DANS FIRESTORE:');
    const productsRef = firestore.collection ? firestore.collection('products') : collection(firestore, 'products');
    const productsSnapshot = await (firestore.collection ? productsRef.get() : getDocs(productsRef));
    
    const products = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`• ID: "${doc.id}" - Nom: "${data.name}"`);
    });

    // Récupérer toutes les reviews
    console.log('\n⭐ REVIEWS DANS FIRESTORE:');
    const reviewsRef = firestore.collection ? firestore.collection('reviews') : collection(firestore, 'reviews');
    const reviewsSnapshot = await (firestore.collection ? reviewsRef.get() : getDocs(reviewsRef));
    
    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      const data = doc.data();
      reviews.push({ id: doc.id, productId: data.productId, rating: data.rating, userName: data.userName });
      console.log(`• ProductID: "${data.productId}" - Rating: ${data.rating}/5 - User: ${data.userName}`);
    });

    // Vérifier les correspondances
    console.log('\n🔍 ANALYSE DES CORRESPONDANCES:');
    
    const productIds = new Set(products.map(p => p.id));
    const reviewProductIds = new Set(reviews.map(r => r.productId));
    
    console.log('IDs des produits:', Array.from(productIds));
    console.log('IDs dans les reviews:', Array.from(reviewProductIds));
    
    // Trouver les problèmes
    const orphanReviews = reviews.filter(r => !productIds.has(r.productId));
    const productsWithReviews = products.filter(p => reviewProductIds.has(p.id));
    
    if (orphanReviews.length > 0) {
      console.log('\n❌ PROBLÈME TROUVÉ: Reviews avec des productIds invalides:');
      orphanReviews.forEach(review => {
        console.log(`   Review pour productId "${review.productId}" (n'existe pas)`);
      });
      
      console.log('\n💡 SOLUTION:');
      console.log('   1. Vérifiez l\'ID correct du produit RED Velvet dans la collection "products"');
      console.log('   2. Mettez à jour le productId dans vos reviews pour qu\'il corresponde');
      
      // Suggérer des corrections
      if (products.length > 0) {
        console.log('\n🎯 IDs CORRECTS À UTILISER:');
        products.forEach(product => {
          console.log(`   "${product.name}" → ID: "${product.id}"`);
        });
      }
    } else if (productsWithReviews.length > 0) {
      console.log('\n✅ CORRESPONDANCES CORRECTES:');
      productsWithReviews.forEach(product => {
        const productReviews = reviews.filter(r => r.productId === product.id);
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        console.log(`   "${product.name}": ${avgRating.toFixed(1)}⭐ (${productReviews.length} avis)`);
      });
      
      console.log('\n🤔 Si les notes ne s\'affichent pas, le problème est ailleurs...');
    } else {
      console.log('\n❌ AUCUNE CORRESPONDANCE TROUVÉE!');
      console.log('   Les IDs des produits et des reviews ne correspondent absolument pas.');
    }

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    console.log('\n💡 Essayez d\'actualiser la page et de relancer ce script');
  }
}

// Lancer le diagnostic
checkProductAndReviewIds(); 