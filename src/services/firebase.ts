import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
