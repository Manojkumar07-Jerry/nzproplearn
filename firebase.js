import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production / Development Firebase Configuration
// Uses environment variables with safe fallback configuration for local development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyNexusGenZ_DemoKeyForLocalTesting_2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexus-genz-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexus-genz-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexus-genz-platform.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "884920192841",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:884920192841:web:a9b8c7d6e5f4"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Export Firebase Auth & Firestore Helper Functions
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
};

export default app;
