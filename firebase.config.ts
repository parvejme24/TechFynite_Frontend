// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
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
export const auth = getAuth(app);

// Only initialize analytics if running in the browser and supported
export const analyticsPromise = isSupported().then(supported => {
  if (supported && typeof window !== "undefined") {
    return getAnalytics(app);
  }
  return null;
});
