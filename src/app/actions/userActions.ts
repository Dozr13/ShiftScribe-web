import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set, update } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export interface UserProfileUpdate {
  displayName?: string;
  email?: string;
  darkMode?: boolean;
}

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

export const updateUserProfile = async (
  uid: string,
  updates: UserProfileUpdate,
) => {
  try {
    const updatesRef: Record<string, any> = {};

    if (updates.displayName !== undefined) {
      updatesRef[`/users/${uid}/displayName`] = updates.displayName;
    }
    if (updates.email !== undefined) {
      updatesRef[`/users/${uid}/email`] = updates.email;
    }
    if (updates.darkMode !== undefined) {
      updatesRef[`/users/${uid}/darkMode`] = updates.darkMode;
    }

    await update(ref(firebaseDatabase), updatesRef);
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};
