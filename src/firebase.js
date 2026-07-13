import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-hVDWgNRgptlrlbQF3HDjOKAZ3K3UXzg",
  authDomain: "coop-rmutt-2026.firebaseapp.com",
  projectId: "coop-rmutt-2026",
  storageBucket: "coop-rmutt-2026.firebasestorage.app",
  messagingSenderId: "1092794583877",
  appId: "1:1092794583877:web:2713d898d18ac4ac608c2c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);