import { equalTo, get, orderByChild, query, ref } from "firebase/database";
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

export const fetchUserDataByEmail = async (email: string) => {
  const usersRef = ref(firebaseDatabase, "/users");
  const usersQuery = query(usersRef, orderByChild("email"), equalTo(email));
  const snapshot = await get(usersQuery);
  if (snapshot.exists()) {
    const users = snapshot.val();
    const uid = Object.keys(users)[0];
    return { ...users[uid], uid };
  }
  return null;
};

export const determineRoleBasedOnAccessLevel = (
  accessLevel: number,
): string => {
  switch (accessLevel) {
    case 0:
      return "Unverified";
    case 1:
      return "User";
    case 2:
      return "Manager";
    case 3:
      return "Admin";
    case 4:
      return "Superuser";
    default:
      return "UNKNOWN";
  }
};

export default fetchUserData;
