import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import SupportIcon from "@mui/icons-material/Support";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { Session } from "next-auth";
import { UserData } from "../src/types/data";
import routes from "../src/utils/routes";

export const getLinks = (
  organization: UserData["organization"] | null | undefined,
) => [
  { text: "Home", href: routes.dashboard(organization), icon: HomeIcon },
  {
    text: "Records",
    href: routes.records(organization),
    icon: WorkHistoryIcon,
  },
  { text: "Requests", href: routes.requests(organization), icon: ScheduleIcon },
  { text: "Employees", href: routes.employees(organization), icon: BadgeIcon },
  {
    text: "Jobs",
    href: routes.jobs(organization),
    icon: LocationSearchingIcon,
  },
];

export const PLACEHOLDER_LINKS = [
  { text: "Settings", href: "/temp-member", icon: SettingsIcon },
  { text: "Support", href: "/temp-client-member", icon: SupportIcon },
];

export const INTRO_LINKS = [
  {
    text: "Login",
    href: routes.login,
    icon: LoginIcon,
  },
  {
    text: "Sign Up",
    href: routes.signup,
    icon: SubscriptionsIcon,
  },
];

export const getAuthLink = (session: Session | null) => {
  return session
    ? {
        text: "Logout",
        href: routes.logout,
        icon: LogoutIcon,
      }
    : {
        text: "Login",
        href: routes.login,
        icon: LoginIcon,
      };
};
