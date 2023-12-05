import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const TempMember = async () => {
  const session = await getServerSession(authOptions);

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
