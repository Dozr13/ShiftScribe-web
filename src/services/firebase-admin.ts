// import "dotenv/config";
// import admin, { ServiceAccount } from "firebase-admin";

// if (
//   !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
//   !process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL ||
//   !process.env.FIREBASE_PRIVATE_KEY
// ) {
//   throw new Error("Missing Firebase environment variables");
// }

// const serviceAccount: ServiceAccount = {
//   projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
//   clientEmail: `${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL}`,
//   privateKey: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
// };

// if (!admin.apps.length) {
//   try {
//     console.log("firebase admin try", serviceAccount);
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//       databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`,
//     });
//   } catch (error) {
//     console.log("firebase admin catch", error);
//     console.error("Error initializing Firebase Admin SDK:", error);
//   }
// }

// export default admin;
import "dotenv/config";
import admin, { ServiceAccount } from "firebase-admin";

if (
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Missing Firebase environment variables");
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    console.log("Initializing Firebase Admin SDK");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
};

initializeFirebaseAdmin();

export default admin;
