// TODO: Perhaps add in own mobile app dir
import { NextApiRequest, NextApiResponse } from "next";
import {
  checkOrgExists,
  createOrg,
  handleJoinRequest,
} from "../../utils/databaseUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { organizationName } = req.query;

  if (!organizationName || typeof organizationName !== "string") {
    return res.status(400).json({ error: "Organization name is required" });
  }

  try {
    if (req.method === "GET") {
      const exists = await checkOrgExists(organizationName);
      // console.log("exists: ", exists);
      return res.status(200).json({ exists });
    } else if (req.method === "POST") {
      const { userID, isPaidAdmin } = req.body;

      if (isPaidAdmin) {
        const updatedExists = await createOrg(organizationName, userID);
        return res.status(200).json({ exists: updatedExists });
      } else {
        await handleJoinRequest(organizationName, userID);
        return res.status(200).json({ exists: true });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error checking organization:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
