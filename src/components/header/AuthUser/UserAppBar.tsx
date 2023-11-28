import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

const UserAppBar: React.FC<{}> = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" color="text.primary">
          ShiftScribe
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default UserAppBar;
