// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzBiQ0I-kvKdaGwUQcR09fc__u5gECg8A",
  authDomain: "divya-kala-academy.firebaseapp.com",
  projectId: "divya-kala-academy",
  storageBucket: "divya-kala-academy.appspot.com",
  messagingSenderId: "657110681659",
  appId: "1:657110681659:web:df6e02f69400046160741e",
  measurementId: "G-03PWJZ2RJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = {db}