import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import stringUtils from "./src/utils/StringUtils";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (token) {
    const organization = (token as any).organization;
    const formattedOrganization = stringUtils.slugify(organization!);

    if (organization) {
      const url = req.nextUrl.clone();
      url.pathname = `/${formattedOrganization}/dashboard`;
      return NextResponse.redirect(url);
    }
  } else {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
