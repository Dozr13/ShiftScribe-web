import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PermissionLevel } from "./lib";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth?.token?.role);

    if (
      req.nextUrl.pathname.startsWith("/CreateUser") &&
      req.nextauth?.token?.accessLevel !== PermissionLevel.MANAGER
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = { matcher: ["/temp-member"] };
