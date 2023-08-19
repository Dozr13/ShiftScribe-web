import { get, ref, set, update } from 'firebase/database';
import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../lib/Firebase-admin';

interface CheckOrganizationRequest {
  organizationName: string;
  userID: string;
  displayName: string;
  email: string;
  isPaidAdmin: boolean;
  isApproved?: boolean;
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

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { organizationName } = req.query;

  if (
    !organizationName ||
    (Array.isArray(organizationName) && organizationName[0].trim() === '')
  ) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  try {
    const orgRef = ref(admin.database() as any, `orgs/${organizationName}`);
    const snapshot = await get(orgRef);
    const organizationExists = snapshot.exists();

    if (req.method === 'GET') {
      return res.status(200).json({ exists: organizationExists });
    }

    if (req.method === 'POST') {
      const { userID, isPaidAdmin } = req.body as CheckOrganizationRequest;

      if (isPaidAdmin) {
        await set(ref(admin.database() as any, `orgs/${organizationName}`), {
          superuser: userID,
        });

        await set(
          ref(
            admin.database() as any,
            `orgs/${organizationName}/members/${userID}`,
          ),
          {
            accessLevel: 4,
          },
        );

        const updatedSnapshot = await get(orgRef);
        const updatedOrganizationExists = updatedSnapshot.exists();

        return res.status(200).json({ exists: updatedOrganizationExists });
      } else if (organizationExists) {
        const orgJoinRequestsRef = ref(
          admin.database() as any,
          `orgs/${organizationName}/joinRequests`,
        );

        const orgJoinRequestsSnapshot = await get(orgJoinRequestsRef);
        const orgJoinRequests = orgJoinRequestsSnapshot.val();

        if (orgJoinRequests === null) {
          await set(orgJoinRequestsRef, { [userID]: true });
        } else {
          await update(orgJoinRequestsRef, { [userID]: true });
        }

        return res.status(200).json({ exists: organizationExists });
      } else {
        return res.status(404).json({ error: 'Organization does not exist' });
      }
    }
  } catch (error) {
    console.error('Error checking organization:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
