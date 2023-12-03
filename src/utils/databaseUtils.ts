import admin from "../services/firebase-admin";

export const checkOrgExists = async (organizationName: string) => {
  const db = admin.database();
  const orgRef = db.ref(`orgs/${organizationName}`);
  const snapshot = await orgRef.once("value");
  return snapshot.exists();
};

export const createOrg = async (organizationName: string, userID: string) => {
  const db = admin.database();
  const orgRef = db.ref(`orgs/${organizationName}`);
  await orgRef.set({ superuser: userID });
  await db.ref(`orgs/${organizationName}/members/${userID}`).set({
    accessLevel: 4,
  });
  const snapshot = await orgRef.once("value");
  return snapshot.exists();
};

export const handleJoinRequest = async (
  organizationName: string,
  userID: string,
) => {
  const db = admin.database();
  const joinRequestsRef = db.ref(`orgs/${organizationName}/joinRequests`);
  const snapshot = await joinRequestsRef.once("value");
  const joinRequests = snapshot.val();
  if (joinRequests === null) {
    await joinRequestsRef.set({ [userID]: true });
  } else {
    await joinRequestsRef.update({ [userID]: true });
  }
};
