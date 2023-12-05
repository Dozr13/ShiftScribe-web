import { Box } from "@mui/material";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { redirect } from "next/navigation";
import Landing from "../components/landing/Landing";
import stringUtils from "../utils/StringUtils";
import routes from "../utils/routes";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    const formattedOrganization = stringUtils.slugify(
      session.user.organization ?? "",
    );

    redirect(routes.dashboard(formattedOrganization));
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      <Head>
        <title>Welcome to ShiftScribe</title>
        <meta
          name="description"
          content="ShiftScribe: Streamline your team's scheduling and time tracking with ease."
        />
      </Head>
      <Landing />
    </Box>
  );
};

export default HomePage;
