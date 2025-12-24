
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  apiKey: "AIzaSyBp2AhYEHFRbEJ5eetfbsQQWO3vL8EdIXE",
  authDomain: "busy-buy-2-b0822.firebaseapp.com",
  projectId: "busy-buy-2-b0822",
  storageBucket: "busy-buy-2-b0822.firebasestorage.app",
  messagingSenderId: "870581347296",
  appId: "1:870581347296:web:643bf2b2fc24ae4db94185"
};

console.log(process.env);


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
export { db };
