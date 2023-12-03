import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export async function signup(
  email: string,
  password: string,
  organization: string,
  displayName: string,
) {
  const auth = getAuth(firebaseApp);
  const formattedOrganization =
    stringUtils.formatStringForFirebase(organization);
  const slugifiedOrganization = stringUtils.slugify(organization);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    const uid = userCredential.user.uid;

    const userRef = ref(firebaseDatabase, `users/${uid}`);
    await set(userRef, {
      displayName,
      email,
      organization: organization,
    });

    const orgRef = ref(firebaseDatabase, `orgs/${formattedOrganization}`);
    await set(orgRef, {
      superuser: uid,
      originalName: organization,
    });

    const orgMemberRef = ref(
      firebaseDatabase,
      `orgs/${formattedOrganization}/members/${uid}`,
    );
    await set(orgMemberRef, {
      accessLevel: 4,
    });

    return {
      status: "success",
      data: {
        user: userCredential.user,
        endpoint: formattedOrganization,
        message: "Organization created successfully",
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
