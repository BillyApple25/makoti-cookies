import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/types/firebase';

const USERS_COLLECTION = 'users';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, vorname: string, nachname: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name (combination of vorname + nachname)
      const displayName = `${vorname} ${nachname}`;
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await this.createUserDocument(userCredential.user, vorname, nachname);
      
      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Registrierung fehlgeschlagen');
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Ungültige Anmeldedaten');
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      // Optionnel : forcer la sélection du compte
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      // Créer le document utilisateur s'il n'existe pas
      await this.createUserDocument(result.user);
      
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw new Error('Google-Anmeldung fehlgeschlagen');
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Abmeldung fehlgeschlagen');
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Passwort-Reset-E-Mail konnte nicht gesendet werden');
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Create user document in Firestore
  static async createUserDocument(firebaseUser: FirebaseUser, vorname?: string, nachname?: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Extract vorname and nachname from displayName if not provided
        let extractedVorname = vorname;
        let extractedNachname = nachname;
        
        if (!vorname && !nachname && firebaseUser.displayName) {
          const nameParts = firebaseUser.displayName.split(' ');
          extractedVorname = nameParts[0] || '';
          extractedNachname = nameParts.slice(1).join(' ') || '';
        }

        const userData = {
          email: firebaseUser.email || '',
          vorname: extractedVorname || '',
          nachname: extractedNachname || '',
          image: firebaseUser.photoURL || undefined,
          createdAt: serverTimestamp()
        };

        await setDoc(userRef, userData);
      }
    } catch (error) {
      console.error('Error creating user document:', error);
      // Ne pas lancer l'erreur pour éviter de bloquer l'auth
    }
  }

  // Get user document from Firestore
  static async getUserDocument(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw new Error('Benutzerprofil konnte nicht geladen werden');
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, updates);

      // Also update Firebase Auth profile if vorname, nachname or image changed
      const currentUser = this.getCurrentUser();
      if (currentUser && (updates.vorname || updates.nachname || updates.image)) {
        const displayName = updates.vorname && updates.nachname 
          ? `${updates.vorname} ${updates.nachname}`
          : currentUser.displayName;
          
        await updateProfile(currentUser, {
          displayName: displayName || currentUser.displayName,
          photoURL: updates.image || currentUser.photoURL
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Profil konnte nicht aktualisiert werden');
    }
  }

  // Update user names
  static async updateUserNames(userId: string, vorname: string, nachname: string): Promise<void> {
    await this.updateUserProfile(userId, { vorname, nachname });
  }

  // Update user image
  static async updateUserImage(userId: string, image: string): Promise<void> {
    await this.updateUserProfile(userId, { image });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get user ID
  static getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.uid : null;
  }

  // Get user email
  static getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  // Get user display name (vorname + nachname)
  static getUserDisplayName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.displayName : null;
  }

  // Get user first name (from Firestore)
  static async getUserVorname(userId?: string): Promise<string | null> {
    try {
      const uid = userId || this.getUserId();
      if (!uid) return null;
      
      const userDoc = await this.getUserDocument(uid);
      return userDoc ? userDoc.vorname : null;
    } catch (error) {
      console.error('Error fetching user vorname:', error);
      return null;
    }
  }

  // Get user last name (from Firestore)
  static async getUserNachname(userId?: string): Promise<string | null> {
    try {
      const uid = userId || this.getUserId();
      if (!uid) return null;
      
      const userDoc = await this.getUserDocument(uid);
      return userDoc ? userDoc.nachname : null;
    } catch (error) {
      console.error('Error fetching user nachname:', error);
      return null;
    }
  }
} 