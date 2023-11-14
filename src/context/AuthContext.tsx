"use client";

import {
  Unsubscribe,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PermissionLevel } from "../../lib";
import { FIREBASE_AUTH } from "../../lib/Firebase";
import { OrgProfile, UserData } from "../types/data";
import { ResponseBad, ResponseOk } from "../types/response";

const ERROR_TYPE = {
  UserExists: "auth/email-already-in-use",
  WeakPassword: "auth/weak-password",
  UserNotFound: "auth/user-not-found",
  WrongPassword: "auth/wrong-password",
  InvalidEmail: "auth/invalid-email",
  EmailInUse: "auth/email-already-in-use",
  TooManyRequests: "auth/too-many-requests",
  OrgNotValid: "OrgNotValid",
  Unknown: "Unknown",
} as const;

/**
 * Since you cannot type the thrown error from a promise, I instead have
 * a response type that provides error codes.
 *
 * This is used on the signup method.
 */
export type SignupResponse<T = void> =
  | ResponseOk<T>
  | ResponseBad<keyof typeof ERROR_TYPE>;
type ContextType = typeof Context;

interface ExtendedContext extends ContextType {
  user: User | undefined;
  permissionLevel: PermissionLevel;
  orgId: string | undefined;
  isReady: boolean;
}
interface AuthContextValue {
  user: User | undefined;
  permissionLevel: PermissionLevel;
  isReady: boolean;
  orgId: string | undefined;
  signIn: (
    email: string,
    password: string,
  ) => Promise<SignupResponse<UserCredential>>;
  deleteAccount: () => Promise<void>;
  validateOrg: (Name: string) => Promise<boolean>;
  signUp: (
    username: string,
    email: string,
    password: string,
    organization: string,
  ) => Promise<SignupResponse<UserCredential>>;
  getUserData: (user: User) => Promise<UserData>;
  getUserByUID: (UID: string) => Promise<UserData>;
  onAuthChange: (Fn: (user: User | null) => void) => Unsubscribe;
  doesUserExist: (email: string) => Promise<boolean>;
}

async function writeUser(user: User, organization: string) {
  await set(ref(getDatabase(), `/users/${user.uid}`), {
    displayName: user.displayName,
    email: user.email,
    organization: organization,
  });

  await update(ref(getDatabase(), `/orgs/${organization}/joinRequests`), {
    [user.uid]: true,
  });
}

const isValidOrg = async (orgID: string) => {
  const Ref = await get(child(ref(getDatabase()), `orgs/${orgID}`));
  return Ref.exists() !== null;
};

const getErrorResponse = (res: any): ResponseBad<keyof typeof ERROR_TYPE> => {
  for (const [key, value] of Object.entries(ERROR_TYPE)) {
    if (value === res.code) {
      return {
        success: false,
        error: key as keyof typeof ERROR_TYPE,
      };
    }
  }

  console.warn("Uncaught Error: " + res.code);

  return {
    success: false,
    error: ERROR_TYPE.Unknown,
  };
};

/**
 * Methods attached to our context.
 *
 * Done this way to preserve typings and documentation.
 */
const Context = {
  /**
   * Sign into an account. If successful, this will change the user state.
   * @param email string
   * @param password string
   * @returns Promise<UserCredential>
   */
  signIn: (email: string, password: string) => {
    console.log("IN SIGNIN", email, password);
    return new Promise<SignupResponse<UserCredential>>((res) => {
      signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then((User) => res({ success: true, data: User }))
        .catch((e) => res(getErrorResponse(e)));
    });
  },

  /**
   * Attempt to check if an org is valid.
   * @param Name Org Name
   */
  validateOrg: async (Name: string) => {
    if (Name.trim() === "") return false;
    return await isValidOrg(Name);
  },

  /**
   * Create an account given a username and password.
   *
   * The password must be over 6 characters.
   * @param email
   * @param password
   * @returns Promise<SignupResponse<UserCredential>>
   */
  signUp: async (
    username: string,
    email: string,
    password: string,
    organization: string,
  ) => {
    return new Promise<SignupResponse<UserCredential>>((res) => {
      isValidOrg(organization).then((r) => {
        if (!r) res({ success: false, error: ERROR_TYPE.OrgNotValid });
        else
          createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then(async (authUser) => {
              await updateProfile(authUser.user, {
                displayName: username,
              });
              writeUser(authUser.user, organization).then(() =>
                res({
                  success: true,
                  data: authUser,
                }),
              );
            })
            .catch((e) => {
              res(getErrorResponse(e));
            });
      });
    });
  },

  getUserData: async (user: User): Promise<UserData> => {
    return (
      await get(child(ref(getDatabase()), `/users/${user.uid}`))
    ).toJSON() as UserData;
  },

  getUserByUID: async (UID: string): Promise<UserData> => {
    return (
      await get(child(ref(getDatabase()), `users/${UID}`))
    ).toJSON() as UserData;
  },

  /**
   * Create an account given a username and password from the admin portal.
   *
   * The password must be over 6 characters.
   * @param email
   * @param password
   * @returns Promise<SignupResponse<UserCredential>>
   */ // TODO: WORK ON FIGURING THIS OUT
  // createuser: async (
  //   username: string,
  //   email: string,
  //   password: string,
  //   organization: string,
  // ): Promise<SignupResponse<UserCredential>> => {
  //   try {
  //     const authUser = await createUserWithEmailAndPassword(
  //       FIREBASE_AUTH,
  //       email,
  //       password,
  //     );

  //     // Update the user's profile with the given username
  //     await updateProfile(authUser.user, {
  //       displayName: username,
  //     });

  //     // Write user data to '/users/$localId'
  //     await writeUser(authUser.user, organization);

  //     console.log('User profile updated:', authUser.user);

  //     // Get the current user's access level within the organization
  //     const orgUserDoc = await get(
  //       child(
  //         ref(getDatabase()),
  //         `orgs/${organization}/members/${authUser.user.uid}`,
  //       ),
  //     );
  //     const orgProfile: OrgProfile | null = orgUserDoc.exists()
  //       ? orgUserDoc.val()
  //       : null;
  //     const accessLevel = orgProfile?.accessLevel || 1;

  //     // Only allow admin users (access level 4) to create new users directly
  //     if (accessLevel === 4) {
  //       // Update the access level in '/orgs/$orgId/members/$localId'
  //       await update(
  //         ref(
  //           getDatabase(),
  //           `orgs/${organization}/members/${authUser.user.uid}`,
  //         ),
  //         {
  //           accessLevel: 1, // Set the appropriate access level for the new user
  //         },
  //       );
  //       console.log('Access level updated in /orgs:', authUser.user);

  //       return {
  //         success: true,
  //         data: authUser,
  //       };
  //     } else {
  //       return {
  //         success: false,
  //         error: ERROR_TYPE.PermissionDenied, // Return the PermissionDenied error
  //       };
  //     }

  //     // ...
  //   } catch (error) {
  //     console.error('Error occurred during account creation:', error);
  //     return getErrorResponse(error);
  //   }
  // },

  /**
   * Sign out of the current account.
   * @returns Promise<void>
   */
  signOut: () => {
    return signOut(FIREBASE_AUTH);
  },

  /**
   * Create an observer to watch the authentication state.
   *
   * Rarely used, user state is handled by auth context.
   * @param Fn Callback Method
   * @returns Unsubscribe Callback
   */
  onAuthChange: (Fn: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(FIREBASE_AUTH, Fn);
  },

  /**
   * Check to see if a user exists.
   * @param email
   * @returns Promise<boolean>
   */
  doesUserExist: async (email: string) => {
    return await fetchSignInMethodsForEmail(FIREBASE_AUTH, email).then(
      (result) => {
        return result.length > 0;
      },
    );
  },

  /**
   * Delete the signed in user's account. After this concludes, it will sign the user out.
   */
  deleteAccount: async () => {
    const auth = getAuth();

    if (auth.currentUser) {
      await set(ref(getDatabase(), `/users/${auth.currentUser.uid}`), null);
      await deleteUser(auth.currentUser);
    }
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthCtx = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>();
  const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>(0);
  const [orgId, setOrgId] = useState<string>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      setIsReady(false);
      setIsLoading(true);

      if (authUser) {
        const userDoc = await get(
          child(ref(getDatabase()), `users/${authUser.uid}`),
        );
        const res = userDoc.toJSON() as UserData;

        if (res) {
          setOrgId(res.organization);

          const orgUserDoc = await get(
            child(
              ref(getDatabase()),
              `orgs/${res.organization}/members/${authUser.uid}`,
            ),
          );

          if (orgUserDoc.exists()) {
            const data = orgUserDoc.toJSON() as OrgProfile;

            if (data) {
              const isSU = await get(
                child(ref(getDatabase()), `orgs/${res.organization}/superuser`),
              );
              if (isSU.val() === authUser.uid) {
                setPermissionLevel(4);
              } else {
                setPermissionLevel(data.accessLevel || 1);
              }
            }
          } else {
            setPermissionLevel(0);
          }
        }
      }
      setUser(authUser || undefined);
      setIsReady(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...Context,
        user,
        permissionLevel,
        orgId,
        isReady,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};
