// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// TODO: replace this with .env file
const firebaseConfig = {
  apiKey: "AIzaSyC9dfiZEmRmfZ6eSNR2rSLQf5rweG4ep-E",
  authDomain: "nusmaps-d41ae.firebaseapp.com",
  projectId: "nusmaps-d41ae",
  storageBucket: "nusmaps-d41ae.appspot.com",
  messagingSenderId: "404103690427",
  appId: "1:404103690427:web:e57b430771523a6c6f919e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
