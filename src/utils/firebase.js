// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-13e97.firebaseapp.com",
  projectId: "interviewiq-13e97",
  storageBucket: "interviewiq-13e97.firebasestorage.app",
  messagingSenderId: "938516266065",
  appId: "1:938516266065:web:86d2b78e31928ef72b0c70"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth,provider}