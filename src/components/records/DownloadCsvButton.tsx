import { Button } from "@mui/material";
import stringUtils from "../../utils/StringUtils";

interface DownloadCsvButtonProps {
  csv: string;
  resetCsv: () => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const DownloadCsvButton = ({
  csv,
  resetCsv,
  startDate,
  endDate,
}: DownloadCsvButtonProps) => {
  if (!csv) return null;

  const filename = `Employees-Hours-${stringUtils.getHumanReadableDate(
    startDate ?? null,
  )}-${stringUtils.getHumanReadableDate(endDate ?? null)}.csv`;

  return (
    <Button
      component="a"
      href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
      download={filename}
      onClick={resetCsv}
      variant="contained"
      sx={{ fontSize: "18px", my: 4, px: 3, py: 2 }}
    >
      Click to Download CSV
    </Button>
  );
};

export default DownloadCsvButton;
