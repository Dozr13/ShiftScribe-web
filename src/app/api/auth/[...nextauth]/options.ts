import { signInWithEmailAndPassword } from "@firebase/auth";
import { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { FIREBASE_AUTH } from "../../../../../lib/Firebase";
import admin from "../../../../services/firebase-admin";
import { Employee } from "../../../../types/data";
// import { CustomSession } from "../../../../types/session";

interface CustomSession extends Session {
  user: ShiftScribeUser & User;
}

interface ShiftScribeUser extends User {
  accessLevel?: number;
  organization?: string;
  displayName?: string;
  email?: string;
}

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
}

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
}) => {
  console.log("JWT callback token:", token);

  const email = token.email || profile?.email;

  if (email) {
    const usersRef = admin.database().ref("/users");
    const usersData = await usersRef.once("value");
    const usersSnapshot = usersData.val();

    let userSnapshot;
    for (const userId in usersSnapshot) {
      if (usersSnapshot[userId].email === email) {
        userSnapshot = { ...usersSnapshot[userId], id: userId };
        break;
      }
    }

    if (userSnapshot) {
      token.employee = {
        id: userSnapshot.id,
        accessLevel: userSnapshot.accessLevel,
        userData: {
          displayName: userSnapshot.displayName,
          email: userSnapshot.email,
          organization: userSnapshot.organization,
        },
      };
    }
  }

  return token;
};

const sessionCallback = async ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) => {
  console.log("token in session", token);
  console.log("session in session", session);

  // Check if token is defined and has the employee property
  if (token && "employee" in token) {
    const myToken = token as MyJWT; // Safely cast the token to MyJWT

    if (myToken.employee) {
      const user = session.user as ShiftScribeUser; // Cast session.user to your custom user type
      user.displayName = myToken.employee.userData.displayName;
      user.email = myToken.employee.userData.email;
      user.accessLevel = myToken.employee.accessLevel;
      user.organization = myToken.employee.userData.organization;
      // Set other properties as needed
    }
  }

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
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          const email = credentials.email;
          const password = credentials.password;

          const userCredential = await signInWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password,
          );
          const user = userCredential.user;

          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    }),
    GitHubProvider({
      profile(profile) {
        const employee: Employee = {
          id: profile.id.toString(),
          accessLevel: determineAccessLevel(profile),
          userData: {
            displayName:
              profile.name ?? "Err on displayName in GitHubProvider options",
            email: profile.email ?? "Err on email in GitHubProvider options",
            organization:
              profile.organization ??
              "Err on organization in GitHubProvider options",
          },
        };

        return employee;
      },

      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
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

function determineAccessLevel(profile: any): number {
  // Implement logic to determine access level based on the profile
  // For example:
  console.log(profile, typeof profile);
  if (profile.email === "wadejp8@gmail.com") {
    return 4; // Admin
  }
  return 1; // Default to User
}
