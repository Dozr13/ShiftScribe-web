import { Box, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardCard from "../components/cards/DashboardCard";
import ProtectedRoute from "../components/protected-route";
import * as theme from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/auth/useLogout";
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
  const logout = useLogout();

  useEffect(() => {
    if (!auth.user) {
      router.push(LOGIN);
    }
  }, [auth.user, router]);

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          p: 10,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          color={theme.ACCENT_COLOR}
        >
          {`Welcome ${auth.user?.displayName}`}
        </Typography>
        <Paper
          sx={{
            my: 4,
            p: 5,
            border: 2,
            borderColor: theme.BORDER_COLOR,
            bgcolor: theme.HEADER_BACKGROUND_COLOR,
            borderRadius: 2,
            maxHeight: "40vh",
            width: "70vw",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {auth.permissionLevel >= PermissionLevel.SUPERUSER && (
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
          )}
        </Paper>

        <Typography
          variant="h4"
          color="textSecondary"
          align="center"
          sx={{ my: 4, width: "50%" }}
        >
          We&apos;re currently undergoing a lot of maintenance but services
          should still be fully available, please reach out if you experience
          any troubles.
        </Typography>
      </Box>
    </ProtectedRoute>
  );
};

export default DashboardPage;
