import type { NextApiRequest, NextApiResponse } from "next";
import { createUserAction } from "../../actions/userActions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // console.log("########## create-user", req.body);

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { email, password, displayName, organization } = req.body;

  try {
    const result = await createUserAction(
      email,
      password,
      displayName,
      organization,
    );
    if (result.success) {
      res.status(200).json({ user: result.data });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in user creation process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
