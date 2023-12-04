import ScheduleIcon from "@mui/icons-material/Schedule";
import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

const LandingAppBar: React.FC<{}> = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ScheduleIcon sx={{ color: "#444", mr: 2 }} />
        <Typography variant="h6" color="text.primary" align="center">
          Welcome to ShiftScribe
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default LandingAppBar;
