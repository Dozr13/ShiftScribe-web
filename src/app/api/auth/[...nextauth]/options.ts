import { signInWithEmailAndPassword } from "@firebase/auth";
import { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ShiftScribeUser } from "../../../../../types/session";
import { firebaseAuth } from "../../../../services/firebase";
import admin from "../../../../services/firebase-admin";

interface MyJWT extends JWT {
  employee?: {
    id: string;
    accessLevel: number;
    userData: {
      displayName: string;
      email: string;
      organization: string;
    };
  };
  role?: string;
}

// const jwtCallback = async ({
//   token,
//   user,
//   account,
//   profile,
// }: {
//   token: JWT;
//   user?: User | null;
//   account?: Account | null;
//   profile?: Profile | null;
// }): Promise<MyJWT> => {
//   console.log("JWT Callback Start");

//   const email = token.email || profile?.email;

//   console.log("JWT Callback email", email);

//   if (email) {
//     console.log("Fetching user data for email:", email);
//     try {
//       const usersRef = admin
//         .database()
//         .ref(`/users`)
//         .orderByChild("email")
//         .equalTo(email);
//       console.log("Firebase ref created:", usersRef.toString());

//       const usersData = await usersRef.once("value");
//       console.log("Firebase data fetched");

//       const usersSnapshot = usersData.val();
//       if (usersSnapshot) {
//         console.log("Users data:", usersSnapshot);

//         let userSnapshot;
//         if (usersSnapshot) {
//           const userId = Object.keys(usersSnapshot)[0];
//           userSnapshot = { ...usersSnapshot[userId], id: userId };
//           console.log("User fetched successfully");
//         }

//         if (userSnapshot) {
//           token.uid = userSnapshot.id;
//           const orgRef = admin
//             .database()
//             .ref(
//               `/orgs/${userSnapshot.organization}/members/${userSnapshot.id}`,
//             );
//           const orgData = await orgRef.once("value");
//           const orgSnapshot = orgData.val();

//           token.employee = {
//             id: userSnapshot.id,
//             accessLevel: orgSnapshot?.accessLevel,
//             userData: {
//               displayName: userSnapshot.displayName,
//               email: userSnapshot.email,
//               organization: userSnapshot.organization,
//               accessLevel: userSnapshot.accessLevel,
//             },
//           };

const jwtCallback = async ({
  token,
  user,
  account,
  profile,
}: {
  token: JWT;
  user?: User | null;
  account?: Account | null;
  profile?: Profile | null;
}): Promise<MyJWT> => {
  console.log("JWT Callback Start");

  const email = token.email || profile?.email;
  console.log("JWT Callback Email:", email);

  if (email) {
    console.log("Starting Firebase user query for email:", email);
    try {
      const usersRef = admin.database().ref("/users");
      const usersQuery = usersRef.orderByChild("email").equalTo(email);
      console.log("Firebase user query created, awaiting response...");

      const usersData = await usersQuery.once("value");
      console.log("Firebase user query response received");

      const usersSnapshot = usersData.val();
      console.log("Firebase user snapshot:", usersSnapshot);

      if (usersSnapshot) {
        console.log("User data found in snapshot, processing...");
        const userId = Object.keys(usersSnapshot)[0];
        const userSnapshot = usersSnapshot[userId];
        console.log("User found:", userSnapshot);

        token.uid = userSnapshot.id;
        const orgRef = admin
          .database()
          .ref(`/orgs/${userSnapshot.organization}/members/${userSnapshot.id}`);
        console.log("Fetching organization data for user");

        const orgData = await orgRef.once("value");
        console.log("Organization data received");

        const orgSnapshot = orgData.val();
        console.log("Organization snapshot:", orgSnapshot);

        token.employee = {
          id: userSnapshot.id,
          accessLevel: orgSnapshot?.accessLevel,
          userData: {
            displayName: userSnapshot.displayName,
            email: userSnapshot.email,
            organization: userSnapshot.organization,
            accessLevel: userSnapshot.accessLevel,
          },
        };

        switch (orgSnapshot?.accessLevel) {
          case 0:
            token.role = "Unverified";
            break;
          case 1:
            token.role = "User";
            break;
          case 2:
            token.role = "Manager";
            break;
          case 3:
            token.role = "Admin";
            break;
          case 4:
            token.role = "Superuser";
            break;
          default:
            token.role = "UNKNOWN";
        }
        console.log("User and organization data processed");
      } else {
        console.log("No user data found for email:", email);
      }
    } catch (error) {
      console.error("Error during Firebase operations:", error);
    }
  } else {
    console.log("Email not found in JWT token or profile");
  }

  console.log("JWT Callback End");
  return token;
};

const sessionCallback = async ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) => {
  console.log("Session Callback Start");

  if (token && "role" in token) {
    const myToken = token as MyJWT;

    if (myToken.employee) {
      const user = session.user as ShiftScribeUser;
      user.uid = myToken.employee.id;
      myToken.employee.userData.displayName;
      user.email = myToken.employee.userData.email;
      user.accessLevel = myToken.employee.accessLevel;
      user.organization = myToken.employee.userData.organization;
      user.role = myToken.role;
    }
  }

  console.log("Session Callback End");

  return session;
};

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Authorizing credentials:", credentials);
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          // const email = credentials.email;
          // const password = credentials.password;
          const { email, password } = credentials;

          console.log(`Attempting to sign in user: ${email}`);

          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          const user = userCredential.user;

          console.log(`User signed in successfully: ${user.uid}`);

          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          };
        } catch (error) {
          console.error("Error during user sign-in:", error);

          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("An unknown error occurred during sign-in");
          }
        }
      },
    }),
    // GitHubProvider({
    //   profile(profile) {
    //     const employee: OrgEmployee = {
    //       id: profile.id.toString(),
    //       accessLevel: determineAccessLevel(profile),
    //       userData: {
    //         displayName:
    //           profile.name ?? "Err on displayName in GitHubProvider options",
    //         email: profile.email ?? "Err on email in GitHubProvider options",
    //         organization:
    //           profile.organization ??
    //           "Err on organization in GitHubProvider options",
    //       },
    //     };

    //     return employee;
    //   },

    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    GoogleProvider({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
};

// function determineAccessLevel(profile: any): number {
//   if (profile.email === "dev@deploy.com") {
//     return 4;
//   }
//   return 1;
// }
