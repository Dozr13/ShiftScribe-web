import { Button } from "@mui/material";
import { StringUtils } from "../../lib";

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

  const filename = `Employees-Hours-${StringUtils.getHumanReadableDate(
    startDate ?? null,
  )}-${StringUtils.getHumanReadableDate(endDate ?? null)}.csv`;

  return (
    <Button
      component="a"
      href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
      download={filename}
      onClick={resetCsv}
      variant="contained"
    >
      Click to Download CSV
    </Button>
  );
};

export default DownloadCsvButton;
