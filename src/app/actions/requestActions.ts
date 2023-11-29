import { get, off, onValue, ref, remove, set } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import { EventObject, OrgRequests, User } from "../../types/data";

// export const fetchRequests = async (
//   orgId: string,
//   setRequests: (requests: OrgRequests[]) => void,
// ) => {
//   const requestsRef = ref(firebaseDatabase, `orgs/${orgId}/adjustmentRequests`);

//   const unsubscribe = onValue(requestsRef, (snapshot) => {
//     const requestData = snapshot.val();
//     const formattedRequests: OrgRequests[] = requestData
//       ? Object.entries(requestData).map(([firebaseId, jobData]) => ({
//           ...(jobData as OrgRequests),
//           id: firebaseId,
//         }))
//       : [];
//     setRequests(formattedRequests);
//   });

//   return () => off(requestsRef, "value", unsubscribe);
// };
export const fetchRequests = async (
  orgId: string,
  setRequests: (requests: OrgRequests[]) => void,
) => {
  const requestsRef = ref(firebaseDatabase, `orgs/${orgId}/adjustmentRequests`);

  onValue(requestsRef, async (snapshot) => {
    const requestData = snapshot.val();
    if (!requestData) {
      setRequests([]);
      return;
    }

    const requestsWithUserData: OrgRequests[] = [];

    for (const [firebaseId, jobData] of Object.entries(requestData)) {
      const request = jobData as OrgRequests;
      request.id = firebaseId;

      // Fetch user data for each request
      const userRef = ref(firebaseDatabase, `/users/${request.submitter}`);
      const userSnapshot = await get(userRef);
      const userInfo = (userSnapshot.val() || {}) as User;

      // Append user display name to the request
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
