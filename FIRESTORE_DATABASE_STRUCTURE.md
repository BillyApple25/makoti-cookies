# Structure de la base de données Firestore

## Collections principales

### 1. **users** (Collection)
```typescript
interface User {
  id: string;           // Document ID
  email: string;
  vorname: string;
  nachname: string;
  password?: string;    // Hashé - optionnel
  image?: string;       // URL de l'avatar
  createdAt: Timestamp;
}
```

**Exemple de document :**
```json
{
  "email": "maria@example.com",
  "vorname": "Maria",
  "nachname": "Schmidt",
  "image": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. **products** (Collection)
```typescript
interface FirebaseProduct {
  id: string;           // Document ID
  name: string;
  description: string;
  price: number;        // En euros
  imageUrl: string;
  isNew: boolean;
  isBestseller: boolean;
  category?: string;
}
```

**Exemple de document :**
```json
{
  "name": "Double Choco",
  "description": "Für echte Schokoladenliebhaber - doppelt schokoladig mit Kakao...",
  "price": 3.00,
  "imageUrl": "https://example.com/double-choco.jpg",
  "isNew": false,
  "isBestseller": true,
  "category": "chocolate"
}
```

---

### 3. **orders** (Collection)
```typescript
interface Order {
  id: string;                    // Document ID
  userId: string;                // Référence vers users/{userId}
  userEmail: string;
  items: OrderItem[];            // Array d'objets
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'paypal' | 'stripe' | 'cash';
  shippingAddress: Address;      // Objet embedded
  billingAddress: Address;       // Objet embedded
  notes?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

**Exemple de document :**
```json
{
  "userId": "user123",
  "userEmail": "maria@example.com",
  "items": [
    {
      "productId": "prod1",
      "name": "Double Choco",
      "price": 3.00,
      "quantity": 2,
      "imageUrl": "https://example.com/double-choco.jpg"
    }
  ],
  "total": 6.00,
  "status": "delivered",
  "paymentMethod": "paypal",
  "shippingAddress": {
    "street": "Musterstraße 123",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "Deutschland",
    "name": "Maria Schmidt"
  },
  "billingAddress": { /* same structure */ },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 4. **carts** (Collection)
```typescript
interface Cart {
  userId: string;        // Document ID = userId
  items: CartItem[];     // Array d'objets
  lastUpdated: Timestamp;
}
```

**Exemple de document (Document ID = userId) :**
```json
{
  "items": [
    {
      "productId": "prod1",
      "name": "Double Choco",
      "price": 3.00,
      "quantity": 1,
      "imageUrl": "https://example.com/double-choco.jpg"
    }
  ],
  "lastUpdated": "2024-01-15T15:45:00Z"
}
```

---

### 5. **reviews** (Collection)
```typescript
interface Review {
  id: string;           // Document ID
  userId: string;       // Référence vers users/{userId}
  userName: string;
  userEmail: string;
  productId: string;    // Référence vers products/{productId}
  orderId: string;      // Référence vers orders/{orderId}
  rating: number;       // 1-5
  comment: string;
  createdAt: Timestamp;
}
```

**Exemple de document :**
```json
{
  "userId": "user123",
  "userName": "Maria Schmidt",
  "userEmail": "maria@example.com",
  "productId": "prod1",
  "orderId": "order456",
  "rating": 5,
  "comment": "Absolut fantastisch! Die perfekte Mischung...",
  "createdAt": "2024-01-15T16:00:00Z"
}
```

---

## Indexes recommandés

### reviews
- `productId` (ASC) + `createdAt` (DESC) - pour récupérer les avis d'un produit
- `userId` (ASC) + `createdAt` (DESC) - pour récupérer les avis d'un utilisateur

### orders
- `userId` (ASC) + `createdAt` (DESC) - pour récupérer les commandes d'un utilisateur
- `status` (ASC) + `createdAt` (DESC) - pour filtrer par statut

---

## Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users peuvent lire/écrire leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products sont lisibles par tous, écriture admin seulement
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Admin only
    }
    
    // Orders - utilisateurs peuvent lire leurs propres commandes
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Carts - utilisateurs peuvent gérer leur propre panier
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reviews - lecture publique, écriture pour utilisateurs connectés
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
``` 