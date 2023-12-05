import { get, ref } from "firebase/database";
import { firebaseDatabase } from "../services/firebase";

export async function fetchUserData(uid: string) {
  try {
    const userRef = ref(firebaseDatabase, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No user data found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export default fetchUserData;
