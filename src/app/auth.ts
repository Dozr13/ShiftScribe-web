// import { User } from "firebase/auth";
// import { FIREBASE_AUTH } from "./../../lib/Firebase";
// // import NextAuth from "next-auth";
// // import CredentialsProvider from "next-auth/providers/credentials";
// // import { signInWithEmailAndPassword } from "firebase/auth";
// // import { FIREBASE_AUTH } from "../../lib/Firebase"; // Adjust the import path as per your project structure

// // // Firebase login function
// // const firebaseLogin = async (email: string, password: string) => {
// //   try {
// //     const userCredential = await signInWithEmailAndPassword(
// //       FIREBASE_AUTH,
// //       email,
// //       password,
// //     );
// //     const user = userCredential.user;

// //     if (!user) {
// //       throw new Error("Authentication failed");
// //     }

// //     // Here you can add additional checks or fetch more user data if needed

// //     return { email: user.email, uid: user.uid };
// //   } catch (err) {
// //     console.error("Firebase login error:", err);
// //     throw new Error("Failed to login");
// //   }
// // };

// // export default NextAuth({
// //   providers: [
// //     CredentialsProvider({
// //       async authorize(credentials, req) {
// //         if (!credentials || !credentials.email || !credentials.password) {
// //           throw new Error("Missing credentials");
// //         }

// //         return await firebaseLogin(credentials.email, credentials.password);
// //       },
// //     }),
// //   ],
// //   callbacks: {
// //     async jwt({ token, user }) {
// //       if (user) {
// //         token.uid = user.id;
// //         // Add any other user properties you'd like to include in the JWT
// //       }
// //       return token;
// //     },
// //     async session({ session, token }) {
// //       if (token) {
// //         session.user?.email = token.uid; // ! The left-hand side of an assignment expression may not be an optional property access.ts(2779)

// //         // Add any other user properties you'd like to include in the session
// //       }
// //       return session;
// //     },
// //   },
// //   // ...additional NextAuth configuration as needed...
// // });

// import nookies from "nookies";
// import { useEffect } from "react";

// const AuthContext = createContext<{ user: firebase.User | null }>({
//   user: null,
// });

// export function AuthProvider({ children }: any) {
//   const [user, setUser] = useState<firebase.User | null>(null);

//   // listen for token changes
//   // call setUser and write new token as a cookie
//   useEffect(() => {
//     return firebase.auth().onIdTokenChanged(async (user) => {
//       if (!user) {
//         setUser(null);
//         nookies.set(undefined, "token", "", { path: "/" });
//       } else {
//         const token = await user.getIdToken();
//         setUser(user);
//         nookies.set(undefined, "token", token, { path: "/" });
//       }
//     });
//   }, []);

//   // force refresh the token every 10 minutes
//   useEffect(() => {
//     const handle = setInterval(async () => {
//       const user = firebaseClient.auth().currentUser;
//       if (user) await user.getIdToken(true);
//     }, 10 * 60 * 1000);

//     // clean up setInterval
//     return () => clearInterval(handle);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
//   );
// }
