import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export const createUserAction = async (
  email: string,
  password: string,
  displayName: string,
  organization: string,
) => {
  const auth = getAuth();
  const formattedOrganization =
    stringUtils.formatStringForFirebase(organization);
  const formattedEmail = stringUtils.formatEmailForFirebase(email);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formattedEmail,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName,
      });
    }

    const userRef = ref(firebaseDatabase, `users/${userCredential.user.uid}`);
    await set(userRef, {
      displayName,
      email: formattedEmail,
      organization: formattedOrganization,
    });

    return { success: true, data: userCredential.user };
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
};
