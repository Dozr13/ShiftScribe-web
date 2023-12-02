import { Box, Button, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomSession } from "../types/session";
import routes from "../utils/routes";
import { options } from "./api/auth/[...nextauth]/options";

const HomePage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (session) {
    redirect(routes.dashboard(session.user.organization));
  }

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h5">Welcome to ShiftScribe!</Typography>
      <Typography variant="body1">Select an option to continue:</Typography>
      <Box sx={{ mt: 2 }}>
        <Link href={routes.signup} passHref>
          <Button variant="outlined">Sign Up</Button>
        </Link>
        <Link href={routes.login} passHref>
          <Button variant="outlined">Log In</Button>
        </Link>
        <Link href={routes.about} passHref>
          <Button variant="outlined">About</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default HomePage;
