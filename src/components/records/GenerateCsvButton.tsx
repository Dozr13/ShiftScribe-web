import { Button, CircularProgress } from "@mui/material";

interface GenerateCsvButtonProps {
  onGenerateCSV: () => void;
  disabled: boolean;
}

const GenerateCsvButton = ({
  disabled,
  onGenerateCSV,
}: GenerateCsvButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onGenerateCSV}
      disabled={disabled}
      sx={{ fontSize: "18px", my: 4, px: 3, py: 2 }}
    >
      {disabled ? <CircularProgress size={24} /> : "Generate CSV"}
    </Button>
  );
};

export default GenerateCsvButton;
