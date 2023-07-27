import 'dotenv/config';
import admin from 'firebase-admin';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: 'https://shiftscribe-db-default-rtdb.firebaseio.com',
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;
