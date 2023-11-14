"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { useSnackbar } from "notistack";
import { Suspense, useEffect } from "react";
import { ACCENT_COLOR } from "../../../constants/colorPalette";
import { PermissionLevel } from "../../../lib";
import DashboardCard from "../../components/DashboardCard";
import PageContainer from "../../components/containers/PageContainer";
import { useAuthCtx } from "../../context/AuthContext";

const Dashboard = () => {
  //   // const { userId } = auth();
  const auth = useAuthCtx();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!auth.user) {
      redirect("/login");
    }
  }, [auth.user]);

  const handleNavigation = (route: string) => {
    console.log(route);
    redirect(route);
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
      redirect("/login");
    } catch (error: unknown) {
      if (error) {
        enqueueSnackbar("An unknown error occurred.", {
          variant: "success",
        });
      }
    }
  };

  return (
    <PageContainer mainMessage={`Welcome ${auth.user?.displayName}`}>
      {auth.permissionLevel >= PermissionLevel.SUPERUSER ? (
        <Grid container spacing={3}>
          <Suspense fallback={<p>Loading Records...</p>}>
            <DashboardCard
              title="Manage Records"
              onClick={handleNavigation("/records")}
            />
          </Suspense>
          <DashboardCard
            title="View Requests"
            onClick={() => handleNavigation("/requests")}
          />
          <DashboardCard
            title="Edit Jobs"
            onClick={() => handleNavigation("/jobs")}
          />
          <DashboardCard
            title="View Employees"
            onClick={() => handleNavigation("/employees")}
          />
        </Grid>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" color={ACCENT_COLOR} gutterBottom>
            You are unable to access this page without proper permissions
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Click Here To Logout
          </Button>
        </Box>
      )}
      {/* </Box> */}
    </PageContainer>
  );
};

export default Dashboard;

//   return (
//     <Box>
//       <Suspense fallback={<p>Loading Records...</p>}>
//         <ViewRecords />
//       </Suspense>
//       <Suspense fallback={<p>Loading Requests...</p>}>
//         <Requests />
//       </Suspense>
//       <Suspense fallback={<p>Loading Jobs...</p>}>
//         <Jobs />
//       </Suspense>
//       <Suspense fallback={<p>Loading Employees...</p>}>
//         <Employees />
//       </Suspense>
//     </Box>
//   );
// };

// export default Dashboard;
