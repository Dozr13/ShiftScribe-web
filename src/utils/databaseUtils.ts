import { get, ref, set, update } from "firebase/database";
import { firebaseDatabase } from "../services/firebase";

export const checkOrgExists = async (
  organizationName: string,
): Promise<boolean> => {
  const orgRef = ref(firebaseDatabase, `orgs/${organizationName}`);
  const snapshot = await get(orgRef);
  return snapshot.exists();
};

export const handleJoinRequest = async (
  organizationName: string,
  userID: string,
): Promise<void> => {
  const joinRequestsRef = ref(
    firebaseDatabase,
    `orgs/${organizationName}/joinRequests`,
  );
  const snapshot = await get(joinRequestsRef);
  const joinRequests = snapshot.val();
  if (joinRequests === null) {
    await set(joinRequestsRef, { [userID]: true });
  } else {
    await update(joinRequestsRef, { [userID]: true });
  }
};
