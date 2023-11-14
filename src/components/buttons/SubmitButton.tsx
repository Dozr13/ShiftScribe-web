import { Button } from "@mui/material";
import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      fullWidth
      sx={{ maxWidth: 345, mx: "auto", mt: 5 }}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  );
};

export default SubmitButton;
