"use client";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import {
  DASHBOARD,
  HOME,
  LOGIN,
  SIGN_UP,
} from "../../utils/constants/routes.constants";
import { showToast } from "../../utils/toast";

// Directly using MUI's Box component to apply custom styles
const headerStyles = {
  backgroundColor: theme.HEADER_BACKGROUND_COLOR,
  boxShadow: "none",
  color: theme.TEXT_COLOR,
};

const linkStyles = {
  color: theme.TEXT_COLOR,
  "&:hover": {
    color: theme.ACCENT_COLOR,
    textDecoration: "none",
  },
  marginRight: 2, // MUI theme spacing
  cursor: "pointer",
};

const Header = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    showToast("Logging out...");
    try {
      await signOut();
      showToast("You are now logged out");
      router.push(LOGIN);
    } catch (error: any) {
      showToast(error.message, false);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.HEADER_BACKGROUND_COLOR,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Link href={HOME} passHref>
            <Typography
              variant="h6"
              // component="a"
              sx={{
                flexGrow: 1,
                color: theme.TEXT_COLOR,
                textDecoration: "none",
                "&:hover": { color: theme.ACCENT_COLOR },
              }}
            >
              ShiftScribe
            </Typography>
          </Link>
          <Box sx={{ display: "flex" }}>
            {!user ? (
              <>
                <Link href={LOGIN} passHref>
                  <Button sx={linkStyles}>Login</Button>
                </Link>
                <Link href={SIGN_UP} passHref>
                  <Button sx={linkStyles}>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={DASHBOARD} passHref>
                  <Button sx={linkStyles}>Dashboard</Button>
                </Link>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <div
        style={{
          backgroundColor: theme.BACKGROUND_COLOR,
          height: "100vh",
          width: "100vw",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Header;
