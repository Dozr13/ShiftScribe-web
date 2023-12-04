import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { CustomSession } from "../../../../types/session";
import { options } from "../../api/auth/[...nextauth]/options";

const TempMember = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  return (
    <Box>
      {/* <Typography>{session?.user?.uid}</Typography>
      <Typography>{session?.user?.email}</Typography>
      <Typography>{session?.user?.name}</Typography>
      <Typography>{session?.user?.accessLevel}</Typography>
      <Typography>{session?.user?.role}</Typography>
      <Typography>{session?.user?.organization}</Typography> */}
      <Typography variant="h4">User Profile Settings coming soon!</Typography>
    </Box>
  );
};

export default TempMember;
