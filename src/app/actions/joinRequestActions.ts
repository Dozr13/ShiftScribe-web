import { ref, remove, set } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";

export const acceptJoinRequest = async (
  orgId: string,
  userIds: string[],
): Promise<void> => {
  for (const userId of userIds) {
    const memberRef = ref(firebaseDatabase, `orgs/${orgId}/members/${userId}`);
    await set(memberRef, { accessLevel: 1 });

    const joinRequestRef = ref(
      firebaseDatabase,
      `orgs/${orgId}/joinRequests/${userId}`,
    );
    await remove(joinRequestRef);
  }
};

export const denyJoinRequest = async (
  orgId: string,
  userIds: string[],
): Promise<void> => {
  for (const userId of userIds) {
    const joinRequestRef = ref(
      firebaseDatabase,
      `orgs/${orgId}/joinRequests/${userId}`,
    );
    await remove(joinRequestRef);
  }
};
