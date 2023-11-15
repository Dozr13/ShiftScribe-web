import { Button } from "@mui/material";
import React from "react";

interface SignInButtonProps {
  isSigningIn: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({ isSigningIn }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSigningIn}
      fullWidth
      sx={{ maxWidth: 345, mx: "auto", mt: 5 }}
    >
      {isSigningIn ? "Signing in..." : "Sign In"}
    </Button>
  );
};

export default SignInButton;
