import { get, onValue, ref, remove, set } from "firebase/database";
import { EventObject, OrgRequest, UserData } from "../../../types/data";
import { firebaseDatabase } from "../../services/firebase";

export const fetchRequests = async (
  orgId: string,
  setRequests: (requests: OrgRequest[]) => void,
) => {
  const requestsRef = ref(firebaseDatabase, `orgs/${orgId}/adjustmentRequests`);

  onValue(requestsRef, async (snapshot) => {
    const requestData = snapshot.val();
    if (!requestData) {
      setRequests([]);
      return;
    }

    const requestsWithUserData: OrgRequest[] = [];

    for (const [firebaseId, jobData] of Object.entries(requestData)) {
      const request = jobData as OrgRequest;
      request.id = firebaseId;

      const userRef = ref(firebaseDatabase, `/users/${request.submitter}`);
      const userSnapshot = await get(userRef);
      const userInfo = (userSnapshot.val() || {}) as UserData;

      requestsWithUserData.push({
        ...request,
        submitterName: userInfo.displayName || "Unknown User",
      });
    }

    setRequests(requestsWithUserData);
  });
};

// TODO: May refine
export const approveRequest = async (
  orgId: string,
  requestId: string,
  timeRecordData: { events: Record<string, EventObject>; submitter: string },
): Promise<void> => {
  const requestRef = ref(
    firebaseDatabase,
    `orgs/${orgId}/adjustmentRequests/${requestId}`,
  );
  const timeRecordsRef = ref(
    firebaseDatabase,
    `orgs/${orgId}/timeRecords/${requestId}`,
  );

  await set(timeRecordsRef, timeRecordData);
  await remove(requestRef);
};

export const denyRequest = async (
  orgId: string,
  requestId: string,
): Promise<void> => {
  const requestRef = ref(
    firebaseDatabase,
    `orgs/${orgId}/adjustmentRequests/${requestId}`,
  );
  await remove(requestRef);
};
