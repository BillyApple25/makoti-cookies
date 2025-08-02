import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

async function testFirestoreConnection() {
  console.log('🔍 TEST DE CONNEXION FIRESTORE SIMPLIFIÉE');
  console.log('==========================================');

  try {
    // Test 1: Connexion de base
    console.log('📡 Test de connexion à Firestore...');
    
    // Test 2: Vérifier la collection products
    console.log('🍪 Vérification de la collection "products"...');
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    
    console.log(`   📊 Nombre total de produits: ${productsSnapshot.size}`);
    
    if (productsSnapshot.empty) {
      console.log('   ❌ Aucun produit trouvé dans la collection');
      console.log('   💡 Lancez "npm run init:firebase" pour initialiser les données');
      return;
    }

    // Afficher tous les produits
    console.log('   📋 Liste des produits:');
    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      const status = [];
      if (data.isNew) status.push('🆕 Nouveau');
      if (data.isBestseller) status.push('🏆 Bestseller');
      console.log(`      - ${data.name} - €${data.price} ${status.join(' ')}`);
    });

    // Test 3: Vérifier les produits nouveaux
    console.log('\n🆕 Vérification des produits nouveaux...');
    const newProductsQuery = query(productsRef, where('isNew', '==', true));
    const newProductsSnapshot = await getDocs(newProductsQuery);
    console.log(`   📊 Nombre de nouveaux produits: ${newProductsSnapshot.size}`);

    // Test 4: Vérifier les bestsellers
    console.log('🏆 Vérification des produits bestsellers...');
    const bestsellerQuery = query(productsRef, where('isBestseller', '==', true));
    const bestsellerSnapshot = await getDocs(bestsellerQuery);
    console.log(`   📊 Nombre de bestsellers: ${bestsellerSnapshot.size}`);

    // Test 5: Vérifier la collection users
    console.log('👤 Vérification de la collection "users"...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log(`   📊 Nombre d'utilisateurs: ${usersSnapshot.size}`);

    // Test 6: Vérifier la collection orders
    console.log('🛒 Vérification de la collection "orders"...');
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    console.log(`   📊 Nombre de commandes: ${ordersSnapshot.size}`);

    // Test 7: Vérifier la collection reviews
    console.log('⭐ Vérification de la collection "reviews"...');
    const reviewsRef = collection(db, 'reviews');
    const reviewsSnapshot = await getDocs(reviewsRef);
    console.log(`   📊 Nombre d'avis: ${reviewsSnapshot.size}`);

    console.log('\n✅ DIAGNOSTIC TERMINÉ - Toutes les collections sont OK !');
    console.log('🔥 Votre base Firebase est prête à utiliser !');

  } catch (error) {
    console.error('❌ ERREUR DE CONNEXION FIRESTORE:');
    console.error('   Message:', error);
    
    if (error instanceof Error) {
      console.error('   Détails:', error.message);
      
      // Messages d'aide spécifiques
      if (error.message.includes('PERMISSION_DENIED')) {
        console.log('\n💡 SOLUTION: Configurez les règles Firestore:');
        console.log('   1. Allez dans Firebase Console → Firestore Database → Règles');
        console.log('   2. Remplacez par:');
        console.log('      rules_version = "2";');
        console.log('      service cloud.firestore {');
        console.log('        match /databases/{database}/documents {');
        console.log('          match /{document=**} {');
        console.log('            allow read, write: if true;');
        console.log('          }');
        console.log('        }');
        console.log('      }');
      }
      
      if (error.message.includes('API key')) {
        console.log('\n💡 SOLUTION: Vérifiez votre clé API Firebase dans lib/firebase/config.ts');
      }
    }
  }
}

// Exécuter le test
testFirestoreConnection(); 