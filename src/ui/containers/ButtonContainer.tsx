import { Box } from "@mui/material";
import React from "react";

interface ButtonContainerProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  size?: "small" | "medium" | "large";
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  children,
  direction = "row",
  size = "medium",
}) => {
  const style = {
    display: "flex",
    flexDirection: direction,
    gap: size === "small" ? "0.5rem" : size === "large" ? "1.5rem" : "1rem",
    justifyContent: "center",
    alignItems: "center",
  };

  return <Box sx={style}>{children}</Box>;
};

export default ButtonContainer;
