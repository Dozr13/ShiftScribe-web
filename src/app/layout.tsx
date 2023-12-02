import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import PageContainer from "../components/containers/PageContainer";
import AppWrapper from "../components/header";
import ThemeRegistry from "../components/themeRegistry/ThemeRegistry";
import { ShiftScribeUser } from "../types/session";
import { options } from "./api/auth/[...nextauth]/options";
import HomePage from "./page";

const metadata: Metadata = {
  title: "ShiftScribe",
  description: "Keeping your time, so you don't have to!",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(options);

  const user = session?.user as ShiftScribeUser;

  // if (!session) {
  //   return <HomePage />;
  //   // redirect("/api/auth/signin?callbackUrl=/");
  //   // redirect("/");
  // }

  // TODO: Ensure removal for prod
  // if (user) {
  //   console.log("uid:", user.uid);
  //   console.log("Access Level:", user.accessLevel);
  //   console.log("Organization:", user.organization);
  //   console.log("DisplayName:", user.displayName);
  //   console.log("Email:", user.email);
  //   console.log("Role:", user.role);
  // }

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppWrapper session={session ?? null} />
          <PageContainer>{!session ? <HomePage /> : children}</PageContainer>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
