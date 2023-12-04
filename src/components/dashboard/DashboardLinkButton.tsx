import { Button, Card, CardActions, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { dashboardLinkButtonStyle } from "../../../constants/styles";
import { TEXT_COLOR } from "../../../constants/colorPalette";

interface DashboardLinkButtonProps {
  title: string;
  route: string;
}

const DashboardLinkButton = ({ title, route }: DashboardLinkButtonProps) => {
  return (
    <Grid item xs={12} sm={8} md={4} lg={6}>
      <Card sx={dashboardLinkButtonStyle}>
        <CardActions>
          <Link href={route}>
            <Button
              size="large"
              color="primary"
              fullWidth
              style={{ justifyContent: "center" }}
            >
              <Typography variant="h6" color={TEXT_COLOR}>
                {title}
              </Typography>
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DashboardLinkButton;
