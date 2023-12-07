// import type { NextApiRequest, NextApiResponse } from "next";
// import { checkOrganization } from "../../../app/actions/checkOrganizationAction";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   console.log("req.meth", req.method);
//   if (req.method !== "GET") {
//     res.status(405).json({ error: "Method Not Allowed" });
//     return;
//   }

//   const { organizationName } = req.query;

//   if (!organizationName || typeof organizationName !== "string") {
//     res.status(400).json({ error: "Organization name is required" });
//     return;
//   }

//   try {
//     const result = await checkOrganization(organizationName);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
// app/api/organization/check-organization/route.ts

// TODO: Ensure ok with other routes
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkOrganization } from "../../../actions/checkOrganizationAction";

export async function GET(request: NextRequest) {
  const organizationName = request.nextUrl.searchParams.get("organizationName");

  if (!organizationName) {
    return new NextResponse(
      JSON.stringify({ error: "Organization name is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const result = await checkOrganization(organizationName);
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in checkOrganization:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
