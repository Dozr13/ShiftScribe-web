// import { getServerSession } from "next-auth";
// import React from "react";
// import PageContainer from "../../components/containers/PageContainer";
// import UserWrapper from "../../components/header/AuthUser";
// import { authOptions } from "../../lib/auth";

// const Layout = async (props: {
//   children: React.ReactNode;
//   grids: React.ReactNode;
//   options: React.ReactNode;
// }) => {
//   const session = await getServerSession(authOptions);

//   console.log("session: ", session);

//   return (
//     <PageContainer>
//       <UserWrapper session={session ?? null} />
//       {props.children}
//       {props.grids}
//       {props.options}
//     </PageContainer>
//   );
// };

// export default Layout;

// TODO: Looking into Parallel Routes

import { getServerSession } from "next-auth";
import React from "react";
import PageContainer from "../../components/containers/PageContainer";
import UserWrapper from "../../components/header/AuthUser";
import { authOptions } from "../../lib/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  const darkMode = session?.user?.darkMode ?? false;

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
