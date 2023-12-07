import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { firebaseAuth, firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export async function signup(
  organization: string,
  email: string,
  password: string,
  displayName: string,
) {
  // console.log("Signup Function Start");

  const formattedOrganization =
    stringUtils.formatStringForFirebase(organization);
  const slugifiedOrganization = stringUtils.slugify(organization);

  // console.log("email", email);

  try {
    // console.log("Before createUserWithEmailAndPassword");
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    // console.log("After createUserWithEmailAndPassword");

    await updateProfile(userCredential.user, { displayName });

    const uid = userCredential.user.uid;
    // console.log("Before setting userRef");

    const userRef = ref(firebaseDatabase, `users/${uid}`);
    const orgRef = ref(firebaseDatabase, `orgs/${formattedOrganization}`);
    const orgMemberRef = ref(
      firebaseDatabase,
      `orgs/${formattedOrganization}/members/${uid}`,
    );

    try {
      await set(userRef, {
        displayName,
        email,
        organization: formattedOrganization,
      });
      // console.log("User ref set successfully");

      await set(orgRef, {
        superuser: uid,
        originalName: organization,
      });
      // console.log("Org ref set successfully");

      await set(orgMemberRef, {
        accessLevel: 4,
      });
      // console.log("Org member ref set successfully");
    } catch (error) {
      console.error("Error in Firebase operation:", error);
    }

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
