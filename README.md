# Makoti Cookies - Firebase Architecture

## 🏗️ Architecture Overview

Ce projet utilise une architecture Firebase moderne avec séparation claire des responsabilités :

### 📁 Structure du Projet

```
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── orders/create/        # Création de commandes
│   └── ...                       # Pages de l'application
├── components/                   # Composants UI réutilisables
│   ├── AuthProvider.tsx          # Context d'authentification
│   ├── CartProvider.tsx          # Context du panier
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Hook d'authentification
│   ├── useProducts.ts            # Hook de gestion des produits
│   └── ...
├── lib/firebase/                 # Configuration Firebase
│   └── config.ts                 # Configuration Firebase
├── services/firebase/            # Services Firebase (DRY)
│   ├── authService.ts            # Service d'authentification
│   ├── productService.ts         # Service de gestion des produits
│   ├── orderService.ts           # Service de gestion des commandes
│   ├── reviewService.ts          # Service de gestion des avis
│   └── storageService.ts         # Service de stockage d'images
├── types/                        # Types TypeScript
│   └── firebase.ts               # Types Firebase
└── scripts/                      # Scripts d'utilité
    └── migrateToFirebase.ts      # Migration des données
```

## 🔥 Services Firebase Intégrés

### 1. **Firestore** - Base de données
- ✅ Affichage des cookies disponibles
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des commandes
- ✅ Système d'avis dynamiques

### 2. **Firebase Storage** - Stockage d'images
- ✅ Upload d'images produits
- ✅ Gestion des images utilisateurs
- ✅ Optimisation et redimensionnement

### 3. **Firebase Auth** - Authentification
- ✅ Authentification email/mot de passe
- ✅ Gestion des profils utilisateurs
- ✅ Zone client avec historique

### 4. **Firebase Functions** - Fonctions cloud
- ✅ Webhooks PayPal
- ✅ Traitement des paiements
- ✅ Validation des commandes

### 5. **Cloud Messaging** - Notifications
- ✅ Notifications de commandes prêtes
- ✅ Notifications push personnalisées

## 🚀 Installation et Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez les services nécessaires :
   - Firestore Database
   - Authentication (Email/Password)
   - Storage
   - Cloud Functions
   - Cloud Messaging

3. Copiez `env.example` vers `.env.local` et configurez vos clés :

```bash
cp env.example .env.local
```

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# PayPal & Stripe
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 3. Migration des données

Pour migrer les données existantes vers Firebase :

```bash
npm run migrate:firebase
```

### 4. Lancement de l'application

```bash
npm run dev
```

## 🎯 Fonctionnalités Principales

### 📦 Gestion des Produits
- **Service**: `ProductService`
- **Hook**: `useProducts()`
- **Fonctionnalités**:
  - Affichage des cookies avec statuts (Nouveau/Bestseller)
  - Gestion des catégories
  - Upload d'images via Firebase Storage
  - Contrôle manuel des statuts spéciaux

### 👤 Authentification
- **Service**: `AuthService`
- **Hook**: `useAuth()`
- **Context**: `AuthProvider`
- **Fonctionnalités**:
  - Inscription/Connexion
  - Profils utilisateurs
  - Réinitialisation de mot de passe

### 🛒 Gestion des Commandes
- **Service**: `OrderService`
- **API**: `/api/orders/create`
- **Fonctionnalités**:
  - Création de commandes
  - Suivi du statut
  - Historique utilisateur
  - Intégration PayPal/Stripe

### ⭐ Système d'Avis
- **Service**: `ReviewService`
- **Fonctionnalités**:
  - Avis uniquement après livraison
  - Vérification des commandes
  - Calcul dynamique des notes
  - Système de validation

### 🖼️ Gestion des Images
- **Service**: `StorageService`
- **Fonctionnalités**:
  - Upload optimisé
  - Redimensionnement automatique
  - Gestion des erreurs
  - URLs sécurisées

## 🔧 Utilisation des Services

### Exemple - Gestion des Produits

```typescript
// Dans un composant
import { useProducts } from '@/hooks/useProducts';

function ProductList() {
  const { 
    products, 
    newProducts, 
    bestsellerProducts, 
    loading, 
    error,
    setProductAsNew,
    setProductAsBestseller 
  } = useProducts();

  // Utilisation directe des données Firebase
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Exemple - Authentification

```typescript
// Dans un composant
import { useAuthContext } from '@/components/AuthProvider';

function UserProfile() {
  const { 
    user, 
    userProfile, 
    isAuthenticated, 
    signOut 
  } = useAuthContext();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Bonjour {userProfile?.displayName}</h1>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

## 📊 Règles de Sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - lecture publique, écriture admin uniquement
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders - accès utilisateur authentifié uniquement
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || request.auth.token.admin == true);
    }
    
    // Reviews - lecture publique, écriture utilisateur authentifié
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || request.auth.token.admin == true);
    }
    
    // Users - accès utilisateur uniquement
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.admin == true);
    }
  }
}
```

## 🎨 Principes DRY Appliqués

1. **Services Centralisés** : Toute la logique Firebase dans `/services/firebase/`
2. **Hooks Réutilisables** : État et logique partagés via des hooks personnalisés
3. **Types Partagés** : Types TypeScript centralisés dans `/types/firebase.ts`
4. **Providers Contextuels** : État global via React Context
5. **Composants Modulaires** : Composants UI réutilisables et indépendants

## 🔄 Migration et Déploiement

### Migration des données existantes
```bash
# Migrer les produits vers Firebase
npm run migrate:firebase
```

### Déploiement Firebase
```bash
# Installation Firebase CLI
npm install -g firebase-tools

# Login Firebase
firebase login

# Initialisation du projet
firebase init

# Déploiement
firebase deploy
```

## 📱 Fonctionnalités Avancées

- **Notifications Push** : Alertes commandes prêtes
- **Cache Intelligent** : Optimisation des requêtes Firestore
- **Images Optimisées** : Redimensionnement automatique
- **Paiements Sécurisés** : Intégration PayPal/Stripe
- **Avis Vérifiés** : Système de validation post-commande
- **Admin Dashboard** : Interface de gestion (à venir)

## 🛡️ Sécurité

- ✅ Règles Firestore restrictives
- ✅ Validation côté serveur
- ✅ Authentification requise pour actions sensibles
- ✅ Upload d'images sécurisé
- ✅ Webhooks PayPal/Stripe vérifiés

---

**Développé avec ❤️ pour Makoti Cookies** 