import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import DashboardCard from "../components/cards/DashboardCard";
import ProtectedRoute from "../components/protected-route";
import * as theme from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { PermissionLevel } from "../lib";
import {
  EMPLOYEE_LIST,
  JOB_LIST,
  LOGIN,
  RECORDS,
  REQUESTS,
} from "../utils/constants/routes.constants";

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!auth.user) {
      router.push(LOGIN);
    }
  }, [auth.user, router]);

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleLogout = async () => {
    enqueueSnackbar("Logging out...", {
      variant: "info",
    });
    try {
      await auth.signOut();
      enqueueSnackbar("You are now logged out", {
        variant: "success",
      });
      router.push(LOGIN);
    } catch (error: unknown) {
      if (error) {
        enqueueSnackbar("An unknown error occurred.", {
          variant: "success",
        });
      }
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ p: 3, backgroundColor: theme.BACKGROUND_COLOR }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color={theme.ACCENT_COLOR}
        >
          {`Welcome ${auth.user?.displayName}`}
        </Typography>

        {auth.permissionLevel >= PermissionLevel.SUPERUSER ? (
          <Grid container spacing={3}>
            <DashboardCard
              title="Manage Records"
              onClick={() => handleNavigation(RECORDS)}
            />
            <DashboardCard
              title="View Requests"
              onClick={() => handleNavigation(REQUESTS)}
            />
            <DashboardCard
              title="Edit Jobs"
              onClick={() => handleNavigation(JOB_LIST)}
            />
            <DashboardCard
              title="View Employees"
              onClick={() => handleNavigation(EMPLOYEE_LIST)}
            />
          </Grid>
        ) : (
          <Box textAlign="center">
            <Typography variant="h6" color={theme.ACCENT_COLOR} gutterBottom>
              You are unable to access this page without proper permissions
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Click Here To Logout
            </Button>
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default DashboardPage;
