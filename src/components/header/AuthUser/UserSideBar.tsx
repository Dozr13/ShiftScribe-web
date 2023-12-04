"use client";
import SupportIcon from "@mui/icons-material/Support";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { UserSessionProps } from ".";
import {
  getAccountLinks,
  getAuthLink,
  getLinks,
} from "../../../../constants/navLinks";
import { DRAWER_WIDTH } from "../../../../constants/sizes";
import stringUtils from "../../../utils/StringUtils";
import SupportContentModal from "../../modals/SupportContentModal";

const UserSideBar = ({ session }: UserSessionProps) => {
  const authLink = getAuthLink(session);
  const organization = session?.user?.organization;
  const formattedOrganization = stringUtils.slugify(organization!);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const handleSupportClick = () => {
    setSupportModalOpen(true);
  };
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
            <ListItem disablePadding>
              <ListItemButton onClick={handleSupportClick}>
                <ListItemIcon>
                  <SupportIcon />
                </ListItemIcon>
                <ListItemText primary="Support" />
              </ListItemButton>
            </ListItem>
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
      {supportModalOpen && (
        <Modal
          open={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              p: 4,
              minWidth: 500,
              maxWidth: 600,
              borderRadius: 2,
              boxShadow: 24,
              overflowY: "auto",
            }}
          >
            <SupportContentModal />
          </Box>
        </Modal>
      )}
    </Drawer>
  );
};

export default UserSideBar;
