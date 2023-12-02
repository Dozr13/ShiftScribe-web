import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { firebaseApp } from "../../services/firebase";

export async function signup(
  email: string,
  password: string,
  organization: string,
  displayName: string,
) {
  const auth = getAuth(firebaseApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    const userRef = ref(getDatabase(), `users/${userCredential.user.uid}`);
    await set(userRef, {
      displayName,
      email,
      organization,
    });

    return {
      status: "success",
      data: {
        user: userCredential.user,
        message: "User created successfully",
      },
    };
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      return {
        status: "error",
        data: {
          message: error.message,
        },
      };
    }

    return {
      status: "error",
      data: {
        message: "An unexpected error occurred",
      },
    };
  }
}
