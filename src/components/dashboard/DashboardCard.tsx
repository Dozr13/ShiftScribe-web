import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { ACCENT_COLOR } from "../../../constants/colorPalette";
import { dashboardStyle } from "../../../constants/styles";
import { UserRole } from "../../../lib/Enum";
import PageContainer from "../containers/PageContainer";
import DashboardLinkButton from "./DashboardLinkButton";

export interface SessionUserProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessLevel: number;
    role?: any;
    organization?: string | null;
  };
}

const DashboardCard: React.FC<SessionUserProps> = ({ user }) => {
  return (
    <PageContainer mainMessage={`Welcome ${user.name}`}>
      {user.accessLevel >= UserRole.Manager ? (
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
          <Button
            variant="contained"
            color="secondary"
            onClick={redirect("/denied")}
          >
            Logout
          </Button>
        </Box>
      )}
    </PageContainer>
  );
};

export default DashboardCard;
