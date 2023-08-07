import { get, ref } from 'firebase/database';
import { FIREBASE_DATABASE } from '../../lib/Firebase';

export async function checkOrganizationExists(
  organizationName: string,
): Promise<boolean> {
  try {
    const orgRef = ref(FIREBASE_DATABASE, `organizations/${organizationName}`);
    const snapshot = await get(orgRef);

    return snapshot.exists();
  } catch (error) {
    console.error('Error checking organization:', error);
    throw error;
  }
}
