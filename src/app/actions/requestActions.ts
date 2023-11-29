import { off, onValue, ref, remove, set } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import { EventObject, OrgRequests } from "../../types/data";

export const fetchRequests = async (
  orgId: string,
  setRequests: (requests: OrgRequests[]) => void,
) => {
  const requestsRef = ref(firebaseDatabase, `orgs/${orgId}/adjustmentRequests`);
  const unsubscribe = onValue(requestsRef, (snapshot) => {
    const requestData = snapshot.val();
    const formattedRequests: OrgRequests[] = requestData
      ? Object.entries(requestData).map(([firebaseId, jobData]) => ({
          ...(jobData as OrgRequests),
          id: firebaseId,
        }))
      : [];
    setRequests(formattedRequests);
  });

  return () => off(requestsRef, "value", unsubscribe);
};

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

  try {
    await set(timeRecordsRef, timeRecordData);
    await remove(requestRef);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error moving request to timeRecords: " + error.message);
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error(
        "An unknown error occurred while moving request to timeRecords",
      );
    }
  }
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
