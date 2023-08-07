import 'dotenv/config';
import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
  clientEmail: `${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL}`,
  privateKey: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}`,
};

console.log(serviceAccount);
console.log(
  'process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL',
  `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`,
);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`,
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;
