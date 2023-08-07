import { getApp, getApps, initializeApp } from 'firebase/app';
import 'firebase/auth';
import { browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const FirebaseConfig = {
  apiKey: 'AIzaSyABQFYo9_alESQOQnGdS03xWemNnq0amBE',
  authDomain: 'shiftscribe-db.firebaseapp.com',
  databaseURL: 'https://shiftscribe-db-default-rtdb.firebaseio.com',
  projectId: 'shiftscribe-db',
  storageBucket: 'shiftscribe-db.appspot.com',
  messagingSenderId: '322934906427',
  appId: '1:322934906427:web:4bf150ab942f7f6769861e',
  measurementId: 'G-5QGQ8TNS3F',
};

let FIREBASE_APP;

if (!getApps().length) {
  FIREBASE_APP = initializeApp(FirebaseConfig, 'shiftscribe-web');
} else {
  FIREBASE_APP = getApp('shiftscribe-web');
}

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});
export const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);
