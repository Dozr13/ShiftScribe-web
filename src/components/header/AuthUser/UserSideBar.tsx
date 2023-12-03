import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { UserSessionProps } from ".";
import {
  getAccountLinks,
  getAuthLink,
  getLinks,
} from "../../../../constants/navLinks";
import { DRAWER_WIDTH } from "../../../../constants/sizes";
import stringUtils from "../../../utils/StringUtils";

const UserSideBar = ({ session }: UserSessionProps) => {
  const authLink = getAuthLink(session);
  const organization = session?.user?.organization;
  const formattedOrganization = stringUtils.slugify(organization!);

  const links = getLinks(formattedOrganization);
  const accountLinks = getAccountLinks(formattedOrganization);

  return (
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

      {session && (
        <Box height={"100%"}>
          <List>
            {links.map(({ text, href, icon: Icon }) => (
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
          <List sx={{ width: "100%", position: "absolute", bottom: 0 }}>
            <Divider sx={{ mt: "auto" }} />
            {accountLinks.map(({ text, href, icon: Icon }) => (
              <ListItem key={href} disablePadding>
                <ListItemButton component={Link} href={href}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem key={authLink.text} disablePadding>
              <ListItemButton component={Link} href={authLink.href}>
                <ListItemIcon>
                  <authLink.icon />
                </ListItemIcon>
                <ListItemText primary={authLink.text} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Drawer>
  );
};

export default UserSideBar;
