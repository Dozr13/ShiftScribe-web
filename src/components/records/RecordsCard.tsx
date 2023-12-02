"use client";
import { Box, Grid, IconButton, Modal, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FaCalendar, FaTimes } from "react-icons/fa";
import {
  BORDER_COLOR,
  HEADER_BACKGROUND_COLOR,
} from "../../../constants/theme";
import {
  fetchAndGenerateCSV,
  purgeOldRecords,
} from "../../app/actions/recordsActions";
import useDateRange from "../../hooks/useDateRange";
import { getLastSundayTwoWeeksPrior } from "../../utils/dataService";
import DateRangePicker from "./DateRangePicker";
import DownloadCsvButton from "./DownloadCsvButton";
import GenerateCsvButton from "./GenerateCsvButton";
import PurgeOldRecords from "./PurgeOldRecords";

interface RecordsCardProps {
  orgId: string;
}

const RecordsCard: React.FC<RecordsCardProps> = ({ orgId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { dateState, setDateState } = useDateRange();
  const [showDateRange, setShowDateRange] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);
  const [csv, setCsv] = useState<string>();

  const effectiveStartDate =
    dateState[0].startDate ?? getLastSundayTwoWeeksPrior();
  const effectiveEndDate = dateState[0].endDate ?? new Date();

  const generateCSV = async () => {
    setLoadingCSV(true);
    const { success, csv, message } = await fetchAndGenerateCSV(
      orgId,
      effectiveStartDate,
      effectiveEndDate,
    );

    if (success && csv) {
      setCsv(csv);
    } else {
      // TODO: Implement better error message for if the dates selected don't have any records
      enqueueSnackbar(message || "An error occurred", { variant: "error" });
    }
    setLoadingCSV(false);
  };

  const handleShowDateRange = () => {
    setShowDateRange((prevShow) => !prevShow);
  };

  const purgeOldRecordsWrapper = async () => {
    const startDate = dateState[0].startDate;
    const endDate = dateState[0].endDate;
    console.log("Purging records from:", startDate, "to", endDate);

    const result = await purgeOldRecords(orgId, startDate, endDate);

    if (result.success) {
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: 4,
          border: 2,
          borderColor: BORDER_COLOR,
          bgcolor: HEADER_BACKGROUND_COLOR,
          borderRadius: 2,
          width: "50vw",
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          {csv ? (
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <DownloadCsvButton
                  csv={csv}
                  resetCsv={() => setCsv(undefined)}
                  startDate={dateState[0].startDate}
                  endDate={dateState[0].endDate}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <GenerateCsvButton
                  disabled={loadingCSV}
                  onGenerateCSV={generateCSV}
                />
              </Grid>
              <Grid item>
                <PurgeOldRecords
                  orgId={orgId}
                  purgeFunction={purgeOldRecordsWrapper}
                />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={handleShowDateRange}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showDateRange ? <FaTimes /> : <FaCalendar />}
                  <Box mr={1} />
                  <Typography variant="h6" color="primary">
                    {showDateRange ? "Close Date Range" : "Toggle Date Range"}
                  </Typography>
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>

      {showDateRange && (
        <Modal open={showDateRange} onClose={handleShowDateRange}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              p: 4,
              minWidth: 300,
              maxWidth: 600,
              borderRadius: 2,
              boxShadow: 24,
              overflowY: "auto",
            }}
          >
            <DateRangePicker
              dateState={dateState}
              setDateState={setDateState}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default RecordsCard;
