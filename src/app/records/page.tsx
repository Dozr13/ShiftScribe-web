"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import LoadingScreen from "../loading";
import { Box } from "@mui/material";
import RecordsUI from "../../ui/records/RecordsUI";

export const Records = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <RecordsUI />
    </Box>
  );
};

export default Records;
