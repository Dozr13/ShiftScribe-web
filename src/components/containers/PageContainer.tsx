import { Box } from "@mui/material";
import React from "react";
import {
  APP_BAR_HEIGHT,
  DRAWER_WIDTH,
  VERTICAL_PADDING,
} from "../../../constants/sizes";

export interface ChildrenProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        height: `calc(100vh - ${APP_BAR_HEIGHT} - ${VERTICAL_PADDING})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        ml: `${DRAWER_WIDTH}px`,
        mt: APP_BAR_HEIGHT,
        p: 3,
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
