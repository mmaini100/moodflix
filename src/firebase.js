// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCO39C8Hr8t5-Q-WIAAMT5VrBhATaf2ZSQ",
    authDomain: "moodflix-854b3.firebaseapp.com",
    projectId: "moodflix-854b3",
    storageBucket: "moodflix-854b3.firebasestorage.app",
    messagingSenderId: "1038582347987",
    appId: "1:1038582347987:web:6ed3b507c056759ebf3c26"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
