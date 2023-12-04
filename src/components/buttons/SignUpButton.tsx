import { Button } from "@mui/material";
import React from "react";

interface SignUpButtonProps {
  onClick: () => void;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={onClick}
      fullWidth
      sx={{ maxWidth: 345, mx: "auto", mt: 5 }}
    >
      Sign Up
    </Button>
  );
};

export default SignUpButton;
