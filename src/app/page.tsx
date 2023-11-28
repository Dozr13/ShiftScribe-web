import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { CustomSession } from "../types/session";
import { options } from "./api/auth/[...nextauth]/options";
import Dashboard from "./dashboard/page";

const HomePage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  // if (!session) {
  //   return (
  //     <Box sx={{ textAlign: "center", padding: "20px" }}>
  //       <AuthRedirect />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      {session ? <Dashboard /> : <Typography>Login to continue</Typography>}
    </Box>
  );
};

export default HomePage;
