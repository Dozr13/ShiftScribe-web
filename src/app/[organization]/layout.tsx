import { getServerSession } from "next-auth";
import React from "react";
import UserWrapper from "../../components/header/AuthUser";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = (await getServerSession(options)) as CustomSession;
  console.log("session in layout: ", session);

  return (
    <>
      <UserWrapper session={session ?? null} />
      {children}
    </>
  );
};

export default Layout;
