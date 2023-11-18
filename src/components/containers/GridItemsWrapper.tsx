import { Grid } from "@mui/material";
import React, { ReactNode } from "react";
import { flexGrowStyle } from "../../../constants/styles";

interface GridItemWrapperProps {
  children: ReactNode;
  md?: number;
  sm?: number;
  xs?: number;
}

const GridItemWrapper: React.FC<GridItemWrapperProps> = ({
  children,
  md = 6,
  sm = 12,
  xs = 12,
}) => {
  return (
    <Grid item md={md} sm={sm} xs={xs} style={flexGrowStyle}>
      {children}
    </Grid>
  );
};

export default GridItemWrapper;
