import type { NextApiRequest, NextApiResponse } from "next";
import {
  acceptJoinRequest,
  denyJoinRequest,
} from "../../actions/joinRequestActions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userIds, orgId, action } = req.body;

    if (!userIds || !orgId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      if (action === "accept") {
        await acceptJoinRequest(orgId, userIds);
      } else if (action === "deny") {
        await denyJoinRequest(orgId, userIds);
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      return res
        .status(200)
        .json({ message: `Join requests ${action}ed successfully` });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
