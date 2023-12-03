import { Box } from "@mui/material";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { redirect } from "next/navigation";
import { CustomSession } from "../../types/session";
import PageHeader from "../components/containers/PageHeader";
import Landing from "../components/landing/Landing";
import stringUtils from "../utils/StringUtils";
import routes from "../utils/routes";
import { options } from "./api/auth/[...nextauth]/options";

const HomePage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (session) {
    const formattedOrganization = stringUtils.slugify(
      session.user.organization ?? "",
    );

    redirect(routes.dashboard(formattedOrganization));
  }

  return (
    <Box style={{ textAlign: "center", marginTop: "50px" }}>
      <Head>
        <title>Welcome to Our Site</title>
        <meta name="description" content="Learn more about what we offer." />
      </Head>
      <PageHeader mainMessage={`Welcome to ShiftScribe!`} />
      <Landing />
    </Box>
  );
};

export default HomePage;
