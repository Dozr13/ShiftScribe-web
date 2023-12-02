import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../../lib/Enum";

// Define a custom interface for the expected cookie structure
interface CustomCookies {
  authenticated?: string;
  userRole?: string;
}

export function authenticationMiddleware(request: NextRequest) {
  // Cast the cookies object to the CustomCookies interface
  const cookies = request.cookies as unknown as CustomCookies;

  // Check if the user is authenticated based on a session cookie or token.
  if (cookies.authenticated !== "true") {
    // If not authenticated, redirect the user to the login page.
    console.log("COOOOKIES");
    return NextResponse.redirect("/");
  }

  // Read the user role from the session cookie (assuming you set it during login).
  const userRole = cookies.userRole;

  // Convert userRole to a number if it's defined, as the cookie values are strings.
  const userRoleNumber = userRole ? parseInt(userRole, 10) : undefined;

  // Check if the user has the necessary role to access the route (e.g., Manager role).
  if (userRoleNumber !== UserRole.Manager) {
    // If the user doesn't have the required role, deny access and redirect to a permission-denied page.
    return NextResponse.redirect("/permission-denied");
  }

  // If authenticated and has the necessary role, allow the request to proceed to the next Middleware or route handler.
  return NextResponse.next();
}

// TODO FINISH middleware
// export const config = {
//   matcher: ["/organization/:path*"],
// };
