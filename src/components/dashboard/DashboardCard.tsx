import { Divider, Grid, Paper, Typography } from "@mui/material";
import { dashboardStyle } from "../../../constants/styles";
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
    </PageContainer>
  );
};

export default DashboardCard;
