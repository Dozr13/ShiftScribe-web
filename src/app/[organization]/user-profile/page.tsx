import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const TempMember = async () => {
  const session = await getServerSession(authOptions);

  return (
    <Box>
      <Typography variant="h4">User Profile Settings coming soon!</Typography>
      {/* <Typography>{session?.user?.uid}</Typography> */}
      <br />
      <br />
      <Typography>Current email: {session?.user?.email}</Typography>
      <Typography>Name: {session?.user?.name}</Typography>
      <Typography>
        Current Access Level: {session?.user?.accessLevel}
      </Typography>
      <Typography>Current Role: {session?.user?.role}</Typography>
      <Typography>Your Organization: {session?.user?.organization}</Typography>
    </Box>
  );
};

export default TempMember;
