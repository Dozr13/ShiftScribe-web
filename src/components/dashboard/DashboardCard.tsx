"use client";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { ACCENT_COLOR } from "../../../constants/colorPalette";
import { dashboardStyle } from "../../../constants/styles";
import { PermissionLevel } from "../../../lib";
import { useAuthCtx } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useLogout";
import PageContainer from "../containers/PageContainer";
import DashboardLinkButton from "./DashboardLinkButton";

const DashboardCard = () => {
  const auth = useAuthCtx();
  const logout = useLogout();

  return (
    <PageContainer mainMessage={`Welcome ${auth.user?.displayName}`}>
      {auth.permissionLevel >= PermissionLevel.SUPERUSER ? (
        <Paper elevation={3} sx={dashboardStyle.paperContainer}>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <Grid container spacing={4} sx={dashboardStyle.gridContainer}>
            <DashboardLinkButton title="Manage Records" route="/records" />
            <DashboardLinkButton title="View Requests" route="/requests" />
            <DashboardLinkButton title="Edit Jobs" route="/jobs" />
            <DashboardLinkButton title="View Employees" route="/employees" />
          </Grid>
        </Paper>
      ) : (
        <Box textAlign="center" sx={{ marginTop: 3 }}>
          <Typography variant="h6" color={ACCENT_COLOR} gutterBottom>
            Insufficient permissions to access this page.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => logout}>
            Logout
          </Button>
        </Box>
      )}
    </PageContainer>
  );
};

export default DashboardCard;
