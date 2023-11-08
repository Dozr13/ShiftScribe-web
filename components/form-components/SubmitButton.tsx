import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import * as theme from "../../constants/theme"; // Ensure the path is correct

interface ButtonProps {
  message: string;
  onClick?: () => void;
  onSubmit?: (index: number, checked: boolean) => Promise<void>;
  disabled?: boolean;
  width?: string;
  isPrimary?: boolean;
}

const SubmitButton = ({
  disabled,
  message,
  onClick,
  width,
  isPrimary = true,
}: ButtonProps) => {
  return (
    <Box className="flex justify-center">
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: "100%",
          maxWidth: 200,
          height: "fit-content",
          mx: "auto",
          my: 2,
          py: 1,
          px: 2.5,
          backgroundColor: isPrimary
            ? theme.BUTTON_COLOR_PRIMARY
            : theme.BUTTON_COLOR_SECONDARY,
          color: theme.BUTTON_COLOR_TEXT,
          "&:hover": {
            backgroundColor: isPrimary
              ? theme.BUTTON_PRIMARY_HOVER_COLOR
              : theme.BUTTON_SECONDARY_HOVER_COLOR,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
          fontSize: "1rem",
          textTransform: "none",
          fontWeight: "bold",
          transition: "all 0.3s",
          borderRadius: "4px",
        }}
      >
        {message}
      </Button>
    </Box>
  );
};

export default SubmitButton;
