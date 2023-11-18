import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import LoadingScreen from "../loading";
import { Box } from "@mui/material";
import RecordsUI from "../../components/records/RecordsUI";
import { getServerSession } from "next-auth";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const Records = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <RecordsUI user={session.user} />
    </Box>
  );
};

export default Records;
