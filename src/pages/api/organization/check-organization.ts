import type { NextApiRequest, NextApiResponse } from "next";
import { checkOrganization } from "../../../app/actions/checkOrganizationAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { organizationName } = req.query;

  if (!organizationName || typeof organizationName !== "string") {
    res.status(400).json({ error: "Organization name is required" });
    return;
  }

  try {
    const result = await checkOrganization(organizationName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
