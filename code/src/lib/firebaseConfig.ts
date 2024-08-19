// src/lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdS-km81dEJvcQljb81D-9xlP7Ep5p20g",
    authDomain: "whack-a-mole-3ca9d.firebaseapp.com",
    projectId: "whack-a-mole-3ca9d",
    storageBucket: "whack-a-mole-3ca9d.appspot.com",
    messagingSenderId: "753514730867",
    appId: "1:753514730867:web:72546a7abc694f359c6106",
    measurementId: "G-FD7ZW7JRKG"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
