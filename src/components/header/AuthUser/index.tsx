import { Box } from "@mui/material";
import { CustomSession } from "../../../types/session";
import UserAppBar from "./UserAppBar";
import UserSideBar from "./UserSideBar";

export interface UserSessionProps {
  session: CustomSession | null;
}

const UserWrapper = ({ session }: UserSessionProps) => {
  return (
    <Box>
      <UserAppBar />
      <UserSideBar session={session} />
    </Box>
  );
};

export default UserWrapper;
