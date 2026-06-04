import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhszC0e3Ohat3XkBHIi_gTOhu0sItdQyc",
  authDomain: "kindard-com.firebaseapp.com",
  projectId: "kindard-com",
  storageBucket: "kindard-com.firebasestorage.app",
  messagingSenderId: "547226491238",
  appId: "1:547226491238:web:3c00b095f7192e38dc10a7",
  measurementId: "G-SL0GBEZ2X3"
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
