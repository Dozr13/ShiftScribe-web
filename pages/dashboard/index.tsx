import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ProtectedRoute from "../../components/protected-route";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { PermissionLevel } from "../../lib";
import {
  EMPLOYEE_LIST,
  JOB_LIST,
  LOGIN,
  RECORDS,
  REQUESTS,
} from "../../utils/constants/routes.constants";
import { showToast } from "../../utils/toast";
import DashboardCard from "../../components/cards/DashboardCard";

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleLogout = async () => {
    showToast("Logging out...");
    try {
      await auth.signOut();
      showToast("You are now logged out");
      router.push(LOGIN);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, false);
      } else {
        showToast("An unknown error occurred", false);
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
