import { get, ref } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";
import stringUtils from "../../utils/StringUtils";

export async function checkOrganization(organization: string) {
  const formattedOrganization =
    stringUtils.formatStringForFirebase(organization);

  try {
    const orgRef = ref(firebaseDatabase, `orgs/${formattedOrganization}`);
    const snapshot = await get(orgRef);
    const exists = snapshot.exists();

    return {
      status: "success",
      data: {
        exists,
        message: exists
          ? "Organization already exists"
          : "Organization does not exist",
      },
    };
  } catch (error) {
    return {
      status: "error",
      data: { message: "An unexpected error occurred" },
    };
  }
}
