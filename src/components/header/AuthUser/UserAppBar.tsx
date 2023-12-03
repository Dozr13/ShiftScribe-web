import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { UserSessionProps } from ".";
import stringUtils from "../../../utils/StringUtils";
import routes from "../../../utils/routes";

const UserAppBar = ({ session }: UserSessionProps) => {
  const organization = session?.user?.organization;

  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1 }}>
          ShiftScribe
        </Typography>

        <Link href={routes.orgOptions(stringUtils.slugify(organization ?? ""))}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ marginLeft: "auto" }}
          >
            {organization}
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default UserAppBar;
