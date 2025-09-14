import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2ZupEIgNA0LtJ7VV3eJpVxRsPWEctJbE",
  authDomain: "controlmilk-adfdb.firebaseapp.com",
  projectId: "controlmilk-adfdb",
  storageBucket: "controlmilk-adfdb.firebasestorage.app",
  messagingSenderId: "689571588045",
  appId: "1:689571588045:web:15d6b6a95bc2071d9a0684",
  measurementId: "G-8L0WHVX4WP",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
