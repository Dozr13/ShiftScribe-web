import { Box } from "@mui/material";
import React from "react";
import { APP_BAR_HEIGHT, VERTICAL_PADDING } from "../../../constants/sizes";
import { ChildrenProps } from "./PageContainer";

const LandingContainer: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        height: `calc(100vh - ${APP_BAR_HEIGHT} - ${VERTICAL_PADDING})`,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        bgcolor: "background.default",
        mt: APP_BAR_HEIGHT,
        p: 3,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export default LandingContainer;
