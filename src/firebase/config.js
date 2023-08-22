import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyABg5uPCsDnuCfbRoonitA_ouguphqXLdQ",
  authDomain: "todo-29a73.firebaseapp.com",
  projectId: "todo-29a73",
  storageBucket: "todo-29a73.appspot.com",
  messagingSenderId: "834512189239",
  appId: "1:834512189239:web:433eac4169bb8d0657ccb2",
  measurementId: "G-N4XT8B8PE3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
