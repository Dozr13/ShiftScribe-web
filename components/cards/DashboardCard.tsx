import { Button, Card, CardActions, Grid, Typography } from "@mui/material";

interface DashboardCardProps {
  title: string;
  onClick: (route: any) => void;
}

const DashboardCard = ({ title, onClick }: DashboardCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card>
        <CardActions>
          <Button size="large" color="primary" fullWidth onClick={onClick}>
            <Typography variant="h6">{title}</Typography>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DashboardCard;
