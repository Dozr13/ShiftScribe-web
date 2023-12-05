import { signInWithEmailAndPassword } from "@firebase/auth";
import type { NextAuthOptions } from "next-auth";
import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ShiftScribeUser } from "../../../../types/session";
import { firebaseAuth } from "../../../services/firebase";
import fetchUserData, {
  determineRoleBasedOnAccessLevel,
  fetchUserDataByEmail,
} from "../../../utils/fetchUserData";

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
  console.log("JWT Callback Email:", email);

  if (email) {
    try {
      const userData = await fetchUserDataByEmail(email);
      if (userData) {
        console.log("JWT Callback User data found:", userData);
        token.employee = {
          id: userData.uid,
          accessLevel: userData.accessLevel,
          userData: {
            displayName: userData.displayName,
            email: userData.email,
            organization: userData.organization,
          },
        };
        token.role = determineRoleBasedOnAccessLevel(userData.accessLevel);
      }
    } catch (error) {
      console.error("Error during user data retrieval:", error);
    }
  } else {
    console.log("JWT Callback Email not found in JWT token or profile");
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

export const authOptions: NextAuthOptions = {
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
          console.error("No credentials provided");
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
            console.log("No user data found for the given credentials");
            return null;
          }
        } catch (error) {
          console.error("Error during user sign-in:", error);
          return null;
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

export default NextAuth(authOptions);
