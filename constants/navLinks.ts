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

export const LINKS = [
  { text: "Home", href: "/", icon: HomeIcon },
  { text: "Records", href: "/records", icon: WorkHistoryIcon },
  { text: "Requests", href: "/requests", icon: ScheduleIcon },
  { text: "Employees", href: "/employees", icon: BadgeIcon },
  { text: "Jobs", href: "/jobs", icon: LocationSearchingIcon },
];

export const PLACEHOLDER_LINKS = [
  { text: "Settings", href: "/temp-member", icon: SettingsIcon },
  { text: "Support", href: "/temp-client-member", icon: SupportIcon },
];

export const INTRO_LINKS = [
  {
    text: "Login",
    href: "/api/auth/signin",
    icon: LoginIcon,
  },
  {
    text: "Sign Up",
    href: "/signup",
    icon: SubscriptionsIcon,
  },
];

export const getAuthLink = (session: Session | null) => {
  return session
    ? {
        text: "Logout",
        href: "/api/auth/signout?callbackUrl=/",
        icon: LogoutIcon,
      }
    : {
        text: "Login",
        href: "/api/auth/signin",
        icon: LoginIcon,
      };
};
