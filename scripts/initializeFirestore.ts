import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test pour les produits
const testProducts = [
  {
    name: "Double Choco",
    description: "Für echte Schokoladenliebhaber - doppelt schokoladig mit Kakao in Teig und weißer Schokolade als Topping.",
    price: 3.00,
    imageUrl: "https://readdy.ai/api/search-image?query=double%20chocolate%20cookie&width=400&height=300&seq=1&orientation=landscape",
    isNew: false,
    isBestseller: true,
    category: "chocolate"
  },
  {
    name: "Classic",
    description: "Der zeitlose Klassiker - goldbraune Cookies mit perfekter Balance aus knusprig und zart.",
    price: 3.00,
    imageUrl: "https://readdy.ai/api/search-image?query=classic%20chocolate%20chip%20cookie&width=400&height=300&seq=2&orientation=landscape",
    isNew: false,
    isBestseller: true,
    category: "classic"
  },
  {
    name: "Biscoff Lava",
    description: "Warme Cookies mit flüssigem Biscoff-Kern. Knusprig außen, cremig innen - ein wahrer Genuss!",
    price: 3.50,
    imageUrl: "https://readdy.ai/api/search-image?query=biscoff%20lava%20cookie&width=400&height=300&seq=3&orientation=landscape",
    isNew: true,
    isBestseller: false,
    category: "specialty"
  },
  {
    name: "Haselnuss",
    description: "Knusprige Cookies mit gerösteten Haselnüssen und einem Hauch von Vanille - pure Verführung.",
    price: 3.50,
    imageUrl: "https://readdy.ai/api/search-image?query=hazelnut%20cookie&width=400&height=300&seq=4&orientation=landscape",
    isNew: false,
    isBestseller: false,
    category: "nuts"
  },
  {
    name: "Oreo",
    description: "Beliebte Cookies mit zerkleinerten Oreo-Keksen und weißer Schokolade. Der perfekte Mix aus knusprig und cremig.",
    price: 3.50,
    imageUrl: "https://readdy.ai/api/search-image?query=oreo%20cookie&width=400&height=300&seq=5&orientation=landscape",
    isNew: false,
    isBestseller: true,
    category: "specialty"
  },
  {
    name: "Choco peanut",
    description: "Die perfekte Kombination aus Schokolade und Erdnüssen - für alle, die es kräftig und cremiger Erdnussbutter mögen.",
    price: 3.50,
    imageUrl: "https://readdy.ai/api/search-image?query=chocolate%20peanut%20cookie&width=400&height=300&seq=6&orientation=landscape",
    isNew: false,
    isBestseller: false,
    category: "nuts"
  }
];

// Données de test pour les utilisateurs
const testUsers = [
  {
    id: "test-user-1",
    email: "maria@example.com",
    vorname: "Maria",
    nachname: "Schmidt",
    image: "https://ui-avatars.com/api/?name=Maria+Schmidt&background=f59e0b&color=fff"
  },
  {
    id: "test-user-2", 
    email: "klaus@example.com",
    vorname: "Klaus",
    nachname: "Weber",
    image: "https://ui-avatars.com/api/?name=Klaus+Weber&background=3b82f6&color=fff"
  },
  {
    id: "test-user-3",
    email: "anna@example.com",
    vorname: "Anna", 
    nachname: "Müller",
    image: "https://ui-avatars.com/api/?name=Anna+Müller&background=10b981&color=fff"
  }
];

// Données de test pour les commandes
const testOrders = [
  {
    userId: "test-user-1",
    userEmail: "maria@example.com",
    items: [
      {
        productId: "1",
        name: "Double Choco",
        price: 3.00,
        quantity: 2,
        imageUrl: "https://readdy.ai/api/search-image?query=double%20chocolate%20cookie&width=400&height=300&seq=1&orientation=landscape"
      }
    ],
    total: 6.00,
    status: "delivered" as const,
    paymentMethod: "paypal" as const,
    shippingAddress: {
      street: "Musterstraße 123",
      city: "Berlin",
      postalCode: "10115",
      country: "Deutschland",
      name: "Maria Schmidt"
    },
    billingAddress: {
      street: "Musterstraße 123",
      city: "Berlin", 
      postalCode: "10115",
      country: "Deutschland",
      name: "Maria Schmidt"
    }
  },
  {
    userId: "test-user-2",
    userEmail: "klaus@example.com",
    items: [
      {
        productId: "2",
        name: "Classic",
        price: 3.00,
        quantity: 3,
        imageUrl: "https://readdy.ai/api/search-image?query=classic%20chocolate%20chip%20cookie&width=400&height=300&seq=2&orientation=landscape"
      }
    ],
    total: 9.00,
    status: "delivered" as const,
    paymentMethod: "stripe" as const,
    shippingAddress: {
      street: "Beispielweg 456",
      city: "München",
      postalCode: "80331",
      country: "Deutschland", 
      name: "Klaus Weber"
    },
    billingAddress: {
      street: "Beispielweg 456",
      city: "München",
      postalCode: "80331", 
      country: "Deutschland",
      name: "Klaus Weber"
    }
  }
];

// Données de test pour les reviews
const testReviews = [
  {
    userId: "test-user-1",
    userName: "Maria Schmidt",
    userEmail: "maria@example.com",
    productId: "1",
    orderId: "order-1",
    rating: 5,
    comment: "Absolut fantastisch! Die perfekte Mischung aus cremiger Schokolade und zartem Teig. Definitiv mein neuer Lieblingscookie!"
  },
  {
    userId: "test-user-2",
    userName: "Klaus Weber", 
    userEmail: "klaus@example.com",
    productId: "1",
    orderId: "order-2",
    rating: 4,
    comment: "Sehr lecker! Könnte etwas weniger süß sein, aber insgesamt eine tolle Qualität."
  },
  {
    userId: "test-user-3",
    userName: "Anna Müller",
    userEmail: "anna@example.com",
    productId: "2", 
    orderId: "order-3",
    rating: 5,
    comment: "Der Klassiker schlechthin! Knusprig außen, weich innen. Genau wie von Oma gemacht."
  }
];

async function initializeFirestore() {
  try {
    console.log('🚀 Initialisation de la base de données Firestore...\n');

    // 1. Ajouter les produits
    console.log('📦 Ajout des produits...');
    const productIds: string[] = [];
    for (let i = 0; i < testProducts.length; i++) {
      const productRef = doc(db, 'products', (i + 1).toString());
      await setDoc(productRef, testProducts[i]);
      productIds.push((i + 1).toString());
      console.log(`   ✅ Produit ajouté: ${testProducts[i].name}`);
    }

    // 2. Ajouter les utilisateurs de test
    console.log('\n👥 Ajout des utilisateurs de test...');
    for (const user of testUsers) {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        email: user.email,
        vorname: user.vorname,
        nachname: user.nachname,
        image: user.image,
        createdAt: serverTimestamp()
      });
      console.log(`   ✅ Utilisateur ajouté: ${user.vorname} ${user.nachname}`);
    }

    // 3. Ajouter les commandes de test
    console.log('\n📋 Ajout des commandes de test...');
    const orderIds: string[] = [];
    for (let i = 0; i < testOrders.length; i++) {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...testOrders[i],
        createdAt: serverTimestamp()
      });
      orderIds.push(orderRef.id);
      console.log(`   ✅ Commande ajoutée pour: ${testOrders[i].userEmail}`);
    }

    // 4. Ajouter les reviews de test
    console.log('\n⭐ Ajout des reviews de test...');
    for (let i = 0; i < testReviews.length; i++) {
      await addDoc(collection(db, 'reviews'), {
        ...testReviews[i],
        orderId: orderIds[Math.min(i, orderIds.length - 1)],
        createdAt: serverTimestamp()
      });
      console.log(`   ✅ Review ajoutée par: ${testReviews[i].userName}`);
    }

    // 5. Ajouter des paniers de test
    console.log('\n🛒 Ajout des paniers de test...');
    const testCart = {
      items: [
        {
          productId: "3",
          name: "Biscoff Lava",
          price: 3.50,
          quantity: 1,
          imageUrl: "https://readdy.ai/api/search-image?query=biscoff%20lava%20cookie&width=400&height=300&seq=3&orientation=landscape"
        }
      ],
      lastUpdated: serverTimestamp()
    };
    
    const cartRef = doc(db, 'carts', 'test-user-1');
    await setDoc(cartRef, testCart);
    console.log('   ✅ Panier ajouté pour Maria Schmidt');

    console.log('\n✨ Base de données initialisée avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`   • ${testProducts.length} produits`);
    console.log(`   • ${testUsers.length} utilisateurs`);
    console.log(`   • ${testOrders.length} commandes`);
    console.log(`   • ${testReviews.length} avis`);
    console.log('   • 1 panier');
    
    console.log('\n🔗 Vous pouvez maintenant:');
    console.log('   • Voir les produits avec leurs notes moyennes');
    console.log('   • Tester le système de reviews');
    console.log('   • Simuler des achats et commandes');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

// Exécuter le script
initializeFirestore(); 