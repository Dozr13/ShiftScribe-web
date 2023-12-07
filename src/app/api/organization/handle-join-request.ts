import type { NextApiRequest, NextApiResponse } from "next";
import { submitRequest } from "../../actions/requestActions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { orgId, userId, requestData } = req.body;

  if (!orgId || !userId || !requestData) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await submitRequest(orgId, userId, requestData);
    res.status(200).json({ message: "Join request submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
