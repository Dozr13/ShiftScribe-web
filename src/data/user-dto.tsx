import { get, ref } from "firebase/database";
import "server-only";
import { User } from "../../models/User";
import { firebaseDatabase } from "../services/firebase";
import { getCurrentUser } from "./auth";

function canSeeUsername(viewer: User) {
  return true;
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin() || viewer.organization === team;
}

export async function getProfileDTO(slug: string) {
  const userRef = ref(firebaseDatabase, `users/${slug}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const userData = snapshot.val();
  const currentUser = await getCurrentUser();

  return {
    username: canSeeUsername(currentUser) ? userData.username : null,
    phonenumber: canSeePhoneNumber(currentUser, userData.organization)
      ? userData.phonenumber
      : null,
  };
}
