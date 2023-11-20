import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
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

// const firebaseApp = initializeApp(firebaseConfig);

let firebaseApp: FirebaseApp;
if (!getApps().length) {
  console.log("Initializing new Firebase app");
  firebaseApp = initializeApp(firebaseConfig);
} else {
  console.log("Using existing Firebase app");
  firebaseApp = getApps()[0];
}

const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: browserLocalPersistence,
});

const firebaseDatabase = getDatabase(firebaseApp);

export { firebaseApp, firebaseAuth, firebaseDatabase };
