// 🧪 SCRIPT POUR CRÉER DES DONNÉES DE TEST POUR LE SYSTÈME DE RATING
// Copiez ce code dans la console de votre navigateur (F12) sur n'importe quelle page de votre app

console.log('🚀 CRÉATION DE DONNÉES DE TEST POUR LE SYSTÈME DE RATING');

async function createRatingTestData() {
  try {
    // Import Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, deleteDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    // Configuration Firebase (remplacez par vos vraies clés)
    const firebaseConfig = {
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies"
    };

    const app = initializeApp(firebaseConfig, 'test-' + Date.now());
    const db = getFirestore(app);

    console.log('✅ Firebase connecté');

    // 1. Nettoyer les anciennes reviews
    console.log('🗑️ Suppression des anciennes reviews...');
    const oldReviews = await getDocs(collection(db, 'reviews'));
    for (const doc of oldReviews.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ ${oldReviews.docs.length} anciennes reviews supprimées`);

    // 2. Récupérer les produits existants
    console.log('📦 Récupération des produits...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (productsSnapshot.empty) {
      alert('❌ Aucun produit trouvé ! Ajoutez d\'abord des produits à votre collection.');
      return;
    }

    const products = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({ id: doc.id, name: data.name });
      console.log(`📦 Produit: "${data.name}" → ID: ${doc.id}`);
    });

    // 3. Créer des reviews réalistes
    console.log('⭐ Création de reviews réalistes...');
    
    const reviewTemplates = [
      { rating: 5, userName: "Marie Dubois", comment: "Absolument délicieux ! Texture parfaite et goût authentique. Je recommande vivement !" },
      { rating: 4, userName: "Pierre Martin", comment: "Très bon produit, livraison rapide. Légèrement trop sucré à mon goût mais très satisfait." },
      { rating: 5, userName: "Sophie Laurent", comment: "Les meilleurs cookies que j'ai jamais mangés ! Toute la famille adore. Commande déjà repassée." },
      { rating: 4, userName: "Jean Moreau", comment: "Excellente qualité, emballage soigné. Le prix est un peu élevé mais ça vaut le coup." },
      { rating: 5, userName: "Anna Weber", comment: "Goût incroyable, on sent la qualité des ingrédients. Service client au top aussi !" },
      { rating: 3, userName: "David Lambert", comment: "Correct sans plus. Pas mauvais mais j'en attendais plus vu les avis précédents." },
      { rating: 5, userName: "Claire Rousseau", comment: "Parfait pour les événements ! Mes invités ont adoré. Texture moelleuse et croustillante à la fois." },
      { rating: 4, userName: "Thomas Klein", comment: "Frais et authentique. Livré rapidement. J'aurais aimé plus de variété dans les saveurs." },
      { rating: 5, userName: "Julie Petit", comment: "Incontournable ! C'est devenu ma pâtisserie préférée. Qualité constante à chaque commande." },
      { rating: 4, userName: "Marc Benoit", comment: "Très bon rapport qualité-prix. Cookies bien emballés, aucun n'était cassé." }
    ];

    let reviewCount = 0;
    
    // Distribuer les reviews sur les produits (certains produits auront plus d'avis)
    for (let i = 0; i < Math.min(products.length, 6); i++) {
      const product = products[i];
      
      // Nombre d'avis variable : de 1 à 4 selon le produit
      const numReviews = Math.min(
        Math.floor(Math.random() * 4) + 1, 
        reviewTemplates.length - reviewCount
      );
      
      console.log(`\n🍪 Création de ${numReviews} review(s) pour: "${product.name}"`);
      
      for (let j = 0; j < numReviews && reviewCount < reviewTemplates.length; j++) {
        const template = reviewTemplates[reviewCount];
        
        const review = {
          productId: product.id, // ID Firestore réel
          userId: `test-user-${reviewCount}`,
          userName: template.userName,
          userEmail: `user${reviewCount}@test.com`,
          rating: template.rating,
          comment: `${template.comment} (Produit: ${product.name})`,
          orderId: `test-order-${reviewCount}`,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'reviews'), review);
        console.log(`✅ Review ${template.rating}⭐ par ${template.userName}`);
        
        reviewCount++;
      }
    }

    // 4. Vérification et statistiques
    console.log('\n📊 VÉRIFICATION FINALE...');
    const finalReviews = await getDocs(collection(db, 'reviews'));
    
    const reviewsByProduct = {};
    const ratingsDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    finalReviews.forEach(doc => {
      const data = doc.data();
      
      // Grouper par produit
      if (!reviewsByProduct[data.productId]) {
        reviewsByProduct[data.productId] = { ratings: [], count: 0 };
      }
      reviewsByProduct[data.productId].ratings.push(data.rating);
      reviewsByProduct[data.productId].count++;
      
      // Distribution des notes
      ratingsDistribution[data.rating]++;
    });

    console.log('\n🍪 RÉSUMÉ PAR PRODUIT:');
    Object.entries(reviewsByProduct).forEach(([productId, data]) => {
      const product = products.find(p => p.id === productId);
      const avg = data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length;
      console.log(`• "${product?.name}": ${avg.toFixed(1)}⭐ (${data.count} avis)`);
    });

    console.log('\n📊 DISTRIBUTION DES NOTES:');
    Object.entries(ratingsDistribution).forEach(([rating, count]) => {
      const percentage = ((count / reviewCount) * 100).toFixed(1);
      console.log(`${rating}⭐: ${count} avis (${percentage}%)`);
    });

    console.log('\n🎯 STATISTIQUES GLOBALES:');
    console.log(`• Total reviews créées: ${reviewCount}`);
    console.log(`• Produits avec avis: ${Object.keys(reviewsByProduct).length}/${products.length}`);
    console.log(`• Note moyenne globale: ${(Object.values(ratingsDistribution).reduce((sum, count, index) => sum + (count * (index + 1)), 0) / reviewCount).toFixed(1)}⭐`);

    // Alerte de succès
    alert(`🎉 SUCCÈS !\n\n${reviewCount} reviews créées pour ${Object.keys(reviewsByProduct).length} produits !\n\nVos étoiles devraient maintenant s'afficher sur la page /produkt !\n\nActualisez la page pour voir les résultats.`);
    
    console.log('\n✅ TERMINÉ ! Vos données de test sont prêtes !');
    console.log('🔄 Actualisez votre page /produkt pour voir les ratings s\'afficher !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
    alert('❌ Erreur ! Vérifiez la console pour plus de détails.');
  }
}

// Lancer la création
createRatingTestData(); 