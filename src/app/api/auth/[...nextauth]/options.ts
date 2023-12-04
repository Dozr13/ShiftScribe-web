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
      token.uid = userSnapshot.id;
      const orgRef = admin
        .database()
        .ref(`/orgs/${userSnapshot.organization}/members/${userSnapshot.id}`);
      const orgData = await orgRef.once("value");
      const orgSnapshot = orgData.val();

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
    }
  }

  console.log("JWT Callback End");

  return token as MyJWT;
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
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          const email = credentials.email;
          const password = credentials.password;

          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          const user = userCredential.user;

          // console.log("user in options", user);

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
  if (profile.email === "dev@deploy.com") {
    return 4;
  }
  return 1;
}
