import { ref, update } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

interface AddEmployeeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export const addEmployeeAction = async (
  organization: string,
  userId: string,
): Promise<AddEmployeeResult> => {
  try {
    const formattedOrganization =
      stringUtils.formatStringForFirebase(organization);
    const updates: { [key: string]: any } = {};

    updates[`/orgs/${formattedOrganization}/joinRequests/${userId}`] = true;

    await update(ref(firebaseDatabase), updates);

    return {
      success: true,
      message: `Employee added to organization '${formattedOrganization}' successfully`,
    };
  } catch (error) {
    console.error("Error adding employee to organization:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to add employee to organization" };
  }
};
