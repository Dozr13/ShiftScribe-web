import { ref, set } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export const createOrganization = async (
  organizationName: string,
  userId: string,
) => {
  try {
    const formattedOrganization =
      stringUtils.formatStringForFirebase(organizationName);
    const orgRef = ref(firebaseDatabase, `orgs/${formattedOrganization}`);
    const orgMemberRef = ref(
      firebaseDatabase,
      `orgs/${formattedOrganization}/members/${userId}`,
    );

    await set(orgRef, { superuser: userId, originalName: organizationName });
    await set(orgMemberRef, { accessLevel: 4 });

    return { success: true, message: "Organization created successfully" };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { success: false, error: "Failed to create organization" };
  }
};
