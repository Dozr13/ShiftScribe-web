import type { NextApiRequest, NextApiResponse } from "next";
import handleAddEmployee from "./employee/add-employee";
import handleCreateOrganization from "./organization/create-organization";
import handleJoinRequest from "./organization/handle-join-request";
import handleJoinRequestAction from "./organization/join-request";
import handleCreateUser from "./user/create-user";
import handleDeleteUser from "./user/delete-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url = "", method } = req;

  // console.log("########################## url", url);
  // console.log("########################## method", method);

  try {
    const path = url.split("/").filter((part) => part);

    switch (path[0]) {
      case "employee":
        if (method === "POST") return handleAddEmployee(req, res);
        break;
      case "organization":
        switch (path[1]) {
          case "check":
            return handleCreateOrganization(req, res);
          case "create":
            return handleCreateOrganization(req, res);
          case "join":
            if (method === "POST") return handleJoinRequest(req, res);
            break;
          case "handle-join-request":
            return handleJoinRequestAction(req, res);
        }
        break;
      case "user":
        switch (path[1]) {
          case "create":
            return handleCreateUser(req, res);
          case "delete":
            return handleDeleteUser(req, res);
        }
        break;
      // Additional routes can be added as needed
    }

    res.status(404).json({ error: "Not Found" });
  } catch (error) {
    console.error("Error in routing process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
