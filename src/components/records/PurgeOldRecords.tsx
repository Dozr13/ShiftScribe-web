import { Button } from "@mui/material";

interface PurgeOldRecordsProps {
  orgId: string;
  purgeFunction: () => Promise<void>;
}

const PurgeOldRecords = ({ orgId, purgeFunction }: PurgeOldRecordsProps) => {
  // const [loading, setLoading] = useState<boolean>(false);

  const handlePurge = async () => {
    // setLoading(true);
    await purgeFunction();
    // setLoading(false);
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handlePurge}
      // disabled={loading}
      sx={{ fontSize: "18px", my: 4, px: 3, py: 2 }}
    >
      Purge Records
    </Button>
  );
};

export default PurgeOldRecords;
