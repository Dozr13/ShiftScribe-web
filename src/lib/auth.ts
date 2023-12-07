import { signInWithEmailAndPassword } from "@firebase/auth";
import type { NextAuthOptions } from "next-auth";
import { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { ShiftScribeUser } from "../../types/session";
import { firebaseAuth } from "../services/firebase";
import fetchUserData, {
  determineRoleBasedOnAccessLevel,
  fetchUserAccessLevel,
  fetchUserDataByEmail,
} from "../utils/fetchUserData";

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
  const email = token.email || profile?.email;

  if (email) {
    try {
      // console.log("in jwtCallback [...nextauth].ts", email);
      const basicUserData = await fetchUserDataByEmail(email);
      if (basicUserData) {
        const accessLevel = await fetchUserAccessLevel(
          basicUserData.organization,
          basicUserData.uid,
        );
        // console.log(
        //   "in jwtCallback basicUserData [...nextauth].ts",
        //   basicUserData,
        // );

        token.employee = {
          id: basicUserData.uid,
          accessLevel: accessLevel,
          userData: {
            displayName: basicUserData.displayName,
            email: basicUserData.email,
            organization: basicUserData.organization,
          },
        };
        token.role = determineRoleBasedOnAccessLevel(accessLevel);
      }
    } catch (error) {
      console.error("Error during user data retrieval:", error);
    }
  }

  // console.log("JWT Callback End", token);
  return token;
};

const sessionCallback = async ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) => {
  // console.log("Session Callback Start");

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

  // console.log("Session Callback End", session);

  return session;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // console.log("Authorizing credentials:", credentials);
        if (!credentials) {
          // console.error("No credentials provided");
          throw new Error("No credentials provided");
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email,
            credentials.password,
          );

          const userData = await fetchUserData(userCredential.user.uid);

          if (userData) {
            return {
              id: userCredential.user.uid,
              name: userData.displayName,
              email: userData.email,
              ...userData,
            };
          } else {
            // console.log("No user data found for the given credentials");
            return null;
          }
        } catch (error) {
          // console.error("Error during user sign-in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
};
