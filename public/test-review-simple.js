// 🧪 TEST SIMPLE - UNE SEULE REVIEW POUR LE PRODUIT "Classic"
// Copiez dans la console (F12) sur la page /produkt

async function testSingleReview() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, where } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

    const app = initializeApp({
      apiKey: "AIzaSyDPSOCW5zL0_7X-jdEtM66yZeypx6XnHto",
      authDomain: "makoti-cookies.firebaseapp.com",
      projectId: "makoti-cookies"
    }, 'test-' + Date.now());
    
    const db = getFirestore(app);

    // 1. Trouver le produit "Classic"
    const productsSnapshot = await getDocs(collection(db, 'products'));
    let classicProduct = null;
    
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name === 'Classic') {
        classicProduct = { id: doc.id, name: data.name };
      }
    });

    if (!classicProduct) {
      alert('❌ Produit "Classic" non trouvé!');
      return;
    }

    console.log('📦 Produit Classic trouvé:', classicProduct);

    // 2. Vérifier les reviews existantes
    const existingReviews = await getDocs(query(
      collection(db, 'reviews'),
      where('productId', '==', classicProduct.id)
    ));

    console.log(`📊 Reviews existantes pour Classic: ${existingReviews.docs.length}`);
    
    existingReviews.forEach(doc => {
      const data = doc.data();
      console.log(`• Review: ${data.rating}⭐ par ${data.userName}`);
    });

    // 3. Ajouter UNE nouvelle review test
    const newReview = {
      productId: classicProduct.id,
      userId: 'test-user-debug',
      userName: 'Debug Testeur',
      userEmail: 'debug@test.com',
      rating: 5,
      comment: 'Test review pour vérifier l\'affichage - Classic est délicieux!',
      orderId: 'test-order-debug',
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'reviews'), newReview);
    console.log('✅ Nouvelle review ajoutée!');

    // 4. Vérification finale
    const finalReviews = await getDocs(query(
      collection(db, 'reviews'),
      where('productId', '==', classicProduct.id)
    ));

    console.log(`🎯 Total reviews après ajout: ${finalReviews.docs.length}`);

    alert(`✅ Review ajoutée!\n\nProduit: Classic\nTotal reviews: ${finalReviews.docs.length}\n\nActualisez la page et cliquez sur Classic pour voir le résultat!`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testSingleReview(); 