"use client";
import SettingsIcon from "@mui/icons-material/Settings";
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
import { getAuthLink, getLinks } from "../../../../constants/navLinks";
import { DRAWER_WIDTH } from "../../../../constants/sizes";
import stringUtils from "../../../utils/StringUtils";
import { getUserAccessLevel } from "../../../utils/accessLevelUtils";
import SupportContentModal from "../../modals/SupportContentModal";
import UserProfileSettingsModal from "../../modals/user/UserProfileSettingsModal";

const UserSideBar = ({ session }: UserSessionProps) => {
  const authLink = getAuthLink(session);
  const accessLevel = getUserAccessLevel(session);
  const organization = session?.user?.organization;

  const formattedOrganization = stringUtils.slugify(organization!);
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleSupportClick = () => {
    setIsSupportModalOpen(true);
  };
  const links = getLinks(formattedOrganization);
  // const accountLinks = getAccountLinks(formattedOrganization);

  const linksToShow =
    accessLevel >= 2
      ? links
      : links.filter(
          (link) => link.text !== "Records" && link.text !== "Requests",
        );

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
            {linksToShow.map(({ text, href, icon: Icon }) => (
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
            <ListItem disablePadding>
              <ListItemButton onClick={handleSettingsClick}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
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
      {isSettingsModalOpen && (
        <Modal
          open={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
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
            <UserProfileSettingsModal
              uid={session?.user?.uid!}
              onClose={() => setIsSettingsModalOpen(false)}
            />
          </Box>
        </Modal>
      )}
      {isSupportModalOpen && (
        <Modal
          open={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
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
