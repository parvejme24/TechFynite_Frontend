// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyxoZOxCz0B3mPyggLekVwV8FheYvjfjY",
  authDomain: "techfynite-12080.firebaseapp.com",
  projectId: "techfynite-12080",
  storageBucket: "techfynite-12080.firebasestorage.app",
  messagingSenderId: "18122277785",
  appId: "1:18122277785:web:f9afdb72a646171e9c8908",
  measurementId: "G-PC8LWR5T27",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
