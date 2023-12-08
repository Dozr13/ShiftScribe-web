import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { UserData } from "../../types/data";
import { firebaseDatabase } from "../services/firebase";

export const fetchUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = ref(firebaseDatabase, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();

      const userData: UserData = {
        organization: data.organization || "",
        email: data.email || "",
        displayName: data.displayName || "",
        darkMode: typeof data.darkMode !== "undefined" ? data.darkMode : false,
      };

      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchUserDataByEmail = async (email: string) => {
  // console.log("fetchUserDataByEmail called with email:", email);

  try {
    const usersRef = ref(firebaseDatabase, "/users");
    const usersQuery = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(usersQuery);

    // console.log("Firebase query executed. Snapshot exists:", snapshot.exists());

    if (snapshot.exists()) {
      const users = snapshot.val();
      const uid = Object.keys(users)[0];
      return { ...users[uid], uid };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data by email:", error);
    throw error;
  }
};

export const fetchUserAccessLevel = async (
  organization: string,
  uid: string,
) => {
  const orgRef = ref(firebaseDatabase, `orgs/${organization}/members/${uid}`);
  const orgSnapshot = await get(orgRef);

  if (orgSnapshot.exists()) {
    const memberData = orgSnapshot.val();
    return memberData.accessLevel;
  } else {
    // console.log(
    //   `No member data found for UID: ${uid} in organization: ${organization}`,
    // );
    return undefined;
  }
};

export const determineRoleBasedOnAccessLevel = (
  accessLevel: number,
): string => {
  // console.log("ACCESS LEVEL',", accessLevel);
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
