import { Button, CircularProgress } from "@mui/material";

interface generateCsvButtonProps {
  onGenerateCSV: () => Promise<void>;
  disabled: boolean;
}

const GenerateCsvButton = ({
  disabled,
  onGenerateCSV,
}: generateCsvButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onGenerateCSV}
      sx={{ fontSize: "18px", px: 4, py: 2 }}
    >
      {disabled ? <CircularProgress size={24} /> : "Generate CSV"}
    </Button>
  );
};

export default GenerateCsvButton;
