import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useFirebase } from "../../context/FirebaseContext";
import { TimeRecords } from "../../types/data";

interface PurgeOldRecordsProps {
  orgId: string;
  fetchDataFunction: () => Promise<TimeRecords | null | undefined>;
}

interface RecordUpdates {
  [key: string]: null;
}

const PurgeOldRecords = ({
  orgId,
  fetchDataFunction,
}: PurgeOldRecordsProps) => {
  const db = useFirebase();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handlePurge = async () => {
    const data = await fetchDataFunction();

    try {
      const purgeBeforeDate = new Date();
      purgeBeforeDate.setDate(purgeBeforeDate.getDate() - 14); // 14 days in the past

      if (!data) {
        enqueueSnackbar("No records found for the selected date range.", {
          variant: "error",
        });
        setLoading(false);
        return;
      }

      // Logic to determine records to delete based on the fetched data
      const toDelete = Object.keys(data).filter((key) => {
        const recordDate = new Date(parseInt(key));
        return recordDate < purgeBeforeDate; // Check if the record is older than the purgeBeforeDate
      });

      const recordUpdates: RecordUpdates = toDelete.reduce((updates, key) => {
        updates[`/orgs/${orgId}/timeRecords/${key}`] = null;
        return updates;
      }, {} as RecordUpdates);

      if (Object.keys(recordUpdates).length > 0) {
        await db.update("/", recordUpdates);
        enqueueSnackbar("Records purged successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("No records found for the selected date range.", {
          variant: "info",
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error occurred during purging records.", {
        variant: "error",
      });
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handlePurge}
      disabled={loading}
      sx={{ fontSize: "18px", my: 4, px: 3, py: 2 }}
    >
      Purge Records
    </Button>
  );
};

export default PurgeOldRecords;
