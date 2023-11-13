"use client";
import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useLogout";
import { DASHBOARD } from "../../utils/constants/routes.constants";
import NavigationLinks from "./NavigationLinks";

const headerStyles = {
  backgroundColor: theme.HEADER_BACKGROUND_COLOR,
  boxShadow: "none",
  color: theme.TEXT_COLOR,
};

const Header = () => {
  const { user, signOut } = useAuth();

  const logout = useLogout();

  return (
    <>
      <AppBar position="sticky" sx={headerStyles}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Link
                href={DASHBOARD}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.TEXT_COLOR,
                    "&:hover": { color: theme.ACCENT_COLOR },
                  }}
                >
                  ShiftScribe
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex" }}>
                <NavigationLinks user={user} onLogout={logout} />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
