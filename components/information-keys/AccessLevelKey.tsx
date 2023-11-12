import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import * as theme from "../../constants/theme";

const AccessLevelKey = () => (
  <Box
    sx={{
      backgroundColor: theme.HEADER_BACKGROUND_COLOR,
      padding: "10px",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      color: theme.TEXT_COLOR,
    }}
  >
    <Typography
      variant="h6"
      component="h3"
      sx={{ fontWeight: "bold", mb: 2, color: theme.TEXT_COLOR }}
    >
      Access Level Key:
    </Typography>
    <List>
      <ListItem>
        <ListItemText
          primary="0: Unverified"
          secondary="Pending verification or onboarding"
        />
      </ListItem>
      <ListItem>
        <ListItemText primary="1: User" secondary="Basic access to view data" />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="2: Manager"
          secondary="Can view, modify, and possibly add data"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="3: Admin"
          secondary="Higher privileges, may manage certain users or modules"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="4: Superuser"
          secondary="Highest level, full control over the system including user management, as well as web access"
        />
      </ListItem>
    </List>
  </Box>
);

export default AccessLevelKey;
