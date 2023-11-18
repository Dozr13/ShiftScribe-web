// "use client";
// import { Grid } from "@mui/material";
// import Link from "next/link";
// import GridItemWrapper from "../ui/containers/GridItemsWrapper";
// import PageContainer from "../ui/containers/PageContainer";

// export default function Home() {
//   // const { user } = useAuthCtx();
//   // const router = useRouter();

//   // if (user) {
//   //   router.push("/dashboard");
//   // } else {
//   //   router.push("/login");
//   // }

//   return (
//     <PageContainer mainMessage="Welcome to ShiftScribe">
//       <Grid container spacing={8}>
//         <GridItemWrapper md={4}>
//           <Link href="/dashboard">Sign In</Link>
//         </GridItemWrapper>
//       </Grid>
//     </PageContainer>
//   );
// }

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardCard from "../components/dashboard/DashboardCard";
import { CustomSession } from "../types/session";
import { options } from "./api/auth/[...nextauth]/options";

const HomePage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session) {
    redirect("/signin");
  }

  return <DashboardCard user={session.user} />;
};

export default HomePage;
