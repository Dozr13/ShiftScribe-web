import React from "react";
import PageContainer from "../../components/containers/PageContainer";
import UserWrapper from "../../components/header/AuthUser";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

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
