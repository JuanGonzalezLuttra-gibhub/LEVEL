import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    projectId: "level-nutrition-2026",
    appId: "1:999865384493:web:cb1c4830cf278b85e382a4",
    storageBucket: "level-nutrition-2026.firebasestorage.app",
    apiKey: "AIzaSyDK_JfGT644GCzfIURtQ9HOUwNvbwzW1_E",
    authDomain: "level-nutrition-2026.firebaseapp.com",
    messagingSenderId: "999865384493",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
