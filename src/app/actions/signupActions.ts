import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { firebaseApp, firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export async function signup(
  organization: string,
  email: string,
  password: string,
  displayName: string,
) {
  // console.log("Signup Function Start");

  const auth = getAuth(firebaseApp);
  const formattedOrganization =
    stringUtils.formatStringForFirebase(organization);
  const slugifiedOrganization = stringUtils.slugify(organization);

  // console.log("email", email);

  try {
    // console.log("Before createUserWithEmailAndPassword");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // console.log("After createUserWithEmailAndPassword");

    await updateProfile(userCredential.user, { displayName });

    const uid = userCredential.user.uid;

    // console.log("Before setting userRef");

    const userRef = ref(firebaseDatabase, `users/${uid}`);
    await set(userRef, {
      displayName,
      email,
      organization: formattedOrganization,
    });
    // console.log("After setting userRef");

    // console.log("Before setting orgRef");

    const orgRef = ref(firebaseDatabase, `orgs/${formattedOrganization}`);
    await set(orgRef, {
      superuser: uid,
      originalName: organization,
    });
    // console.log("After setting orgRef");

    // console.log("Before setting orgMemberRef");
    const orgMemberRef = ref(
      firebaseDatabase,
      `orgs/${formattedOrganization}/members/${uid}`,
    );

    await set(orgMemberRef, {
      accessLevel: 4,
    });
    // console.log("After setting orgMemberRef");

    // console.log("Signup Function End");
    return {
      status: "success",
      data: {
        user: userCredential.user,
        endpoint: slugifiedOrganization,
        message: "Organization created successfully",
      },
    };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email address is already in use";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message;
      }
    } else if (typeof error === "object" && "message" in error) {
      errorMessage = error.message;
    }

    return {
      status: "error",
      data: { message: errorMessage },
    };
  }
}
