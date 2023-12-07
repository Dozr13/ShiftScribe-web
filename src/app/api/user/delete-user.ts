import type { NextApiRequest, NextApiResponse } from "next";
import { deleteUserAction } from "../../actions/userActions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const result = await deleteUserAction(userId);

  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json(result);
}
