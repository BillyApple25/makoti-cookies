// 🔧 SCRIPT POUR CRÉER DES REVIEWS DE TEST
// À COPIER-COLLER DANS LA CONSOLE DU NAVIGATEUR (F12)
// Assurez-vous d'être sur la page /produkt

console.log('🔧 CRÉATION DE REVIEWS DE TEST');

async function createBrowserReviews() {
  try {
    // Utiliser Firebase déjà chargé par l'application
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies",
      storageBucket: "makoti-cookies.appspot.com",
      messagingSenderId: "123456789",
      appId: "your-app-id"
    };

    // Créer une instance Firebase unique pour ce script
    const app = initializeApp(firebaseConfig, 'review-creator-' + Date.now());
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

    // 2. Créer des reviews pour les premiers produits
    console.log('\n🎯 Création de reviews...');
    
    const reviewsData = [
      { rating: 5, user: "Marie Schmidt", comment: "Absolument délicieux ! Ces cookies sont parfaits." },
      { rating: 4, user: "Pierre Laurent", comment: "Très bon goût, texture parfaite. Je recommande !" },
      { rating: 5, user: "Sophie Martin", comment: "Meilleurs cookies que j'ai jamais mangés ! Bravo !" },
      { rating: 4, user: "Jean Robert", comment: "Excellent produit, livraison rapide. Très satisfait." },
      { rating: 5, user: "Laura Klein", comment: "Une tuerie ! Toute la famille adore. Merci !" },
      { rating: 4, user: "Thomas Weber", comment: "Cookies de qualité exceptionnelle. Service au top." },
      { rating: 5, user: "Anna Müller", comment: "Fraîcheur garantie, goût authentique. Je suis conquise !" }
    ];

    let reviewsCreated = 0;

    // Créer 1-2 reviews pour chaque produit (max 5 produits)
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 2) + 1; // 1-2 reviews
      
      for (let j = 0; j < numReviews && reviewsCreated < reviewsData.length; j++) {
        const reviewData = reviewsData[reviewsCreated];
        
        const review = {
          productId: product.id, // VRAI ID DU PRODUIT
          userId: `user-${reviewsCreated}`,
          userName: reviewData.user,
          userEmail: `user${reviewsCreated}@example.com`,
          rating: reviewData.rating,
          comment: `${reviewData.comment} (${product.name})`,
          orderId: `order-${reviewsCreated}`,
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review créée: "${product.name}" - ${review.rating}⭐ par ${review.userName}`);
        reviewsCreated++;
      }
    }

    console.log(`\n🎉 ${reviewsCreated} reviews créées avec succès !`);

    // 3. Vérifier les nouvelles moyennes
    console.log('\n📊 Vérification des moyennes...');
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

    console.log('\n✅ TERMINÉ !');
    console.log('🔄 Actualisez la page /produkt pour voir les ratings !');
    
    // Alerte pour l'utilisateur
    alert(`✅ ${reviewsCreated} reviews créées ! Actualisez la page pour voir les notes moyennes.`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    alert('❌ Erreur lors de la création des reviews. Vérifiez la console pour plus de détails.');
  }
}

// Lancer la création
createBrowserReviews(); 