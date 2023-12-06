import type { NextApiRequest, NextApiResponse } from "next";
import { createOrganization } from "../../../app/actions/createOrganizationAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { organization, userId } = req.body;

  if (!organization || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await createOrganization(organization, userId);
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
