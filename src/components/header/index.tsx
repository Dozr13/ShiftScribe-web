import { Box } from "@mui/material";
import { Session } from "next-auth";
import UserAppBar from "./AuthUser/UserAppBar";
import UserSideBar from "./AuthUser/UserSideBar";
import IntroAppBar from "./UnauthorizedUser/IntroAppBar";

export interface UserSessionProps {
  session: Session | null;
}

const AppWrapper = ({ session }: UserSessionProps) => {
  return (
    <Box>
      {/* {!session && (
        <Box>
          <IntroAppBar />
          <IntroSideBar session={session} />
        </Box>
      )} */}
      {session ? <UserAppBar /> : <IntroAppBar />}
      <UserSideBar session={session} />
    </Box>
  );
};

export default AppWrapper;
