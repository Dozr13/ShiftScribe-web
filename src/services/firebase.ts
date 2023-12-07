import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyABQFYo9_alESQOQnGdS03xWemNnq0amBE",
  authDomain: "shiftscribe-db.firebaseapp.com",
  databaseURL: "https://shiftscribe-db-default-rtdb.firebaseio.com",
  projectId: "shiftscribe-db",
  storageBucket: "shiftscribe-db.appspot.com",
  messagingSenderId: "322934906427",
  appId: "1:322934906427:web:4bf150ab942f7f6769861e",
  measurementId: "G-5QGQ8TNS3F",
};

let firebaseApp: FirebaseApp;

if (!getApps().length) {
  console.log("Initializing new Firebase app");
  firebaseApp = initializeApp(firebaseConfig);
  console.log("Initialized app");
} else {
  firebaseApp = getApps()[0];
}

const firebaseAuth = getAuth(firebaseApp);
const firebaseDatabase = getDatabase(firebaseApp);

export { firebaseAuth, firebaseDatabase };
