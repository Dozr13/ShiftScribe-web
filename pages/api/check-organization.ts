import { get, ref, set, update } from 'firebase/database';
import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../lib/Firebase-admin';

interface CheckOrganizationRequest {
  organizationName: string;
  userID: string;
  displayName: string;
  email: string;
  isPaidAdmin: boolean;
}

interface CheckOrganizationResponse {
  exists: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckOrganizationResponse | { error: string }>,
) {
  // console.log('Request method:', req.method);
  // console.log('Query parameters:', req.query);

  const organizationName = req.query.organizationName;
  if (
    !organizationName ||
    (Array.isArray(organizationName) && organizationName[0].trim() === '')
  ) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  if (req.method === 'GET') {
    try {
      const { organizationName } = req.query;
      // console.log('Organization name from query:', organizationName);

      // Check if the organization exists in the Realtime Database
      const orgRef = ref(admin.database() as any, `orgs/${organizationName}`);

      const snapshot = await get(orgRef);
      const organizationExists = snapshot.exists();
      // console.log('Organization exists:', organizationExists);

      res.status(200).json({ exists: organizationExists });
    } catch (error) {
      console.error('Error checking organization:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { organizationName, userID, displayName, email, isPaidAdmin } =
        req.body as CheckOrganizationRequest;

      // Check if the organization exists in the Realtime Database
      const orgRef = ref(admin.database() as any, `orgs/${organizationName}`);
      const snapshot = await get(orgRef);
      const organizationExists = snapshot.exists();
      // console.log('Organization exists:', organizationExists);

      if (isPaidAdmin) {
        const orgID = organizationName;

        // Set the superuser property in the new organization
        await set(ref(admin.database() as any, `orgs/${orgID}`), {
          superuser: userID,
        });

        // Add the user to /orgs/${orgID}/members/${userID} with accessLevel: 4
        await set(
          ref(admin.database() as any, `orgs/${orgID}/members/${userID}`),
          {
            accessLevel: 4,
          },
        );

        // Update the organizationExists based on the current state after modifications
        const updatedSnapshot = await get(orgRef);
        const updatedOrganizationExists = updatedSnapshot.exists();
        // console.log('Updated organization exists:', updatedOrganizationExists);

        res.status(200).json({ exists: updatedOrganizationExists });
      } else if (!isPaidAdmin && organizationExists) {
        // If isPaidAdmin is false, add the user to /orgs/${orgID}/joinRequests with userID: true
        const orgID = organizationName;
        const orgJoinRequestsRef = ref(
          admin.database() as any,
          `orgs/${orgID}/joinRequests`,
        );
        const orgJoinRequestsSnapshot = await get(orgJoinRequestsRef);
        const orgJoinRequests = orgJoinRequestsSnapshot.val();

        // console.log('orgJoinRequests:', JSON.stringify(orgJoinRequests));

        if (orgJoinRequests === null) {
          // If joinRequests doesn't exist, create it with the user as the first entry
          await set(orgJoinRequestsRef, { [userID]: true });
        } else {
          // If joinRequests exists, update it with the new user entry
          await update(orgJoinRequestsRef, { [userID]: true });
        }

        res.status(200).json({ exists: organizationExists });
      } else if (!isPaidAdmin && !organizationExists) {
        res.status(500).json({ error: 'Organization does not exist' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error checking organization:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Add default response for other HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
