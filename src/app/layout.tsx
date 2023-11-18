import BadgeIcon from "@mui/icons-material/Badge";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ThemeRegistry from "../components/themeRegistry/ThemeRegistry";
import { options } from "./api/auth/[...nextauth]/options";

const metadata: Metadata = {
  title: "ShiftScribe",
  description: "Keeping your time, so you don't have to!",
};

const DRAWER_WIDTH = 240;

const LINKS = [
  { text: "Home", href: "/", icon: HomeIcon },
  { text: "Records", href: "/records", icon: WorkHistoryIcon },
  { text: "Requests", href: "/requests", icon: ScheduleIcon },
  { text: "Employees", href: "/employees", icon: BadgeIcon },
  { text: "Jobs", href: "/jobs", icon: LocationSearchingIcon },
];

const PLACEHOLDER_LINKS = [
  // { text: "Settings", icon: SettingsIcon },
  // { text: "Support", icon: SupportIcon },
  { text: "Login", icon: LoginIcon },
  { text: "Logout", icon: LogoutIcon },
];

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  const authLink = session
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

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppBar position="fixed" sx={{ zIndex: 2000 }}>
            <Toolbar sx={{ backgroundColor: "background.paper" }}>
              <DashboardIcon
                sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
              />
              <Typography variant="h6" color="text.primary">
                ShiftScribe
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                top: ["48px", "56px", "64px"],
                height: "auto",
                bottom: 0,
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Divider />
            <List>
              {LINKS.map(({ text, href, icon: Icon }) => (
                <ListItem key={href} disablePadding>
                  <ListItemButton component={Link} href={href}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ mt: "auto" }} />
            <List>
              <ListItem key={authLink.text} disablePadding>
                <ListItemButton component={Link} href={authLink.href}>
                  <ListItemIcon>
                    <authLink.icon />
                  </ListItemIcon>
                  <ListItemText primary={authLink.text} />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              ml: `${DRAWER_WIDTH}px`,
              mt: ["48px", "56px", "64px"],
              p: 3,
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
