import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnUoAlPrQEQCbKawAudmkvVrFdGfXfUEc",
  authDomain: "superpdf-258ed.firebaseapp.com",
  projectId: "superpdf-258ed",
  storageBucket: "superpdf-258ed.appspot.com",
  messagingSenderId: "998380890751",
  appId: "1:998380890751:web:b4e26737519529a67c6d4a",
  measurementId: "G-G1LKYR6DP0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebase = {
  auth: getAuth.bind(null, app),
  onAuthStateChanged,
  oAuth: {
    method: { signInWithPopup },
  },
};
