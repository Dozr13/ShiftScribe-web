import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import BackToLandingButton from "../landing/BackToLandingButton";

const AboutContent = () => {
  return (
    <Container maxWidth="sm">
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Simplify Scheduling and Time Tracking with ShiftScribe
      </Typography>
      <List>
        {[
          "Automated scheduling and easy shift management reduce admin workload.",
          "Real-time time tracking with intuitive reports for informed decision-making.",
          "Collaborative tools for efficient team management and employee engagement.",
        ].map((benefit, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={benefit} />
          </ListItem>
        ))}
      </List>
      <Typography
        variant="body1"
        sx={{ fontStyle: "italic", textAlign: "center", my: 4 }}
      >
        &quot;ShiftScribe has revolutionized how we handle our team&apos;s time
        management!&quot; - Jane Doe
      </Typography>
      <BackToLandingButton />
    </Container>
  );
};

export default AboutContent;
