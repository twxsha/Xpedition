// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdynDwNWSMiBFJYrNVUnXGMDNgafTGrEY",
  authDomain: "xpedition-19d61.firebaseapp.com",
  projectId: "xpedition-19d61",
  storageBucket: "xpedition-19d61.appspot.com",
  messagingSenderId: "238630406696",
  appId: "1:238630406696:web:f8401275b9e11bc79d831d",
  measurementId: "G-865QTZZHHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
