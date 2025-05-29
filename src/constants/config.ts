// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxIWe0524TSmEQ_rlhivhIZnUiiqTugP4",
  authDomain: "sgc-iso9001.firebaseapp.com",
  projectId: "sgc-iso9001",
  storageBucket: "sgc-iso9001.firebasestorage.app",
  messagingSenderId: "403938448850",
  appId: "1:403938448850:web:c60711d531775f16c0240b",
  measurementId: "G-4H3N8G4TXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app);