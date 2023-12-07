import type { NextApiRequest, NextApiResponse } from "next";
import { addEmployeeAction } from "../../actions/addEmployeeAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { organization, userId } = req.body;

  if (!organization || !userId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await addEmployeeAction(organization, userId);
    if (result.success) {
      res.status(200).json({ message: "Employee added successfully" });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in add-employee process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
