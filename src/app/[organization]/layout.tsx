import { getServerSession } from "next-auth";
import React from "react";
import { CustomSession } from "../../../types/session";
import PageContainer from "../../components/containers/PageContainer";
import UserWrapper from "../../components/header/AuthUser";
import { options } from "../api/auth/[...nextauth]/options";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = (await getServerSession(options)) as CustomSession;

  return (
    <>
      <PageContainer>
        <UserWrapper session={session ?? null} />
        {children}
      </PageContainer>
    </>
  );
};

export default Layout;
