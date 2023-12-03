import { NextApiRequest, NextApiResponse } from "next";
import { updateData } from "../../lib/employeeApi";

type ResponseData = {
  message: string;
  error?: string;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // console.log("req.body: ", req.body);
  if (req.method === "PUT") {
    const { employeeId, orgId, displayName, email, accessLevel } = req.body;

    // console.log("employeeId ", employeeId);
    // console.log("orgId ", orgId);
    // console.log("displayName ", displayName);
    // console.log("email ", email);
    // console.log("accessLevel ", accessLevel);

    if (
      !displayName ||
      typeof displayName !== "string" ||
      displayName.trim() === ""
    ) {
      return res.status(400).json({
        message: "Invalid input",
        error: "DisplayName cannot be empty",
      });
    }

    if (
      !email ||
      typeof email !== "string" ||
      email.trim() === "" ||
      !isValidEmail(email)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid input", error: "Invalid email" });
    }

    if (
      typeof accessLevel !== "number" ||
      isNaN(accessLevel) ||
      accessLevel < 0 ||
      accessLevel > 4
    ) {
      return res.status(400).json({
        message: "Invalid input",
        error: "AccessLevel must be a number between 0 and 4",
      });
    }

    try {
      await updateData(`orgs/${orgId}/members/${employeeId}`, { accessLevel });

      await updateData(`users/${employeeId}`, { displayName, email });

      res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      res
        .status(500)
        .json({ message: "Error updating employee", error: errorMessage });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
