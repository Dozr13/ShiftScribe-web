import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DATABASE } from '../../lib/Firebase';

export async function checkOrganizationExists(
  organizationName: string,
): Promise<boolean> {
  try {
    const orgRef = doc(FIREBASE_DATABASE, 'organizations', organizationName);
    const docSnap = await getDoc(orgRef);

    return docSnap.exists();
  } catch (error) {
    console.error('Error checking organization:', error);
    throw error;
  }
}
