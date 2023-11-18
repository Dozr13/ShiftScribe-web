import { Box, Grid, IconButton, Modal, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { FaCalendar, FaTimes } from "react-icons/fa";
import {
  BORDER_COLOR,
  HEADER_BACKGROUND_COLOR,
} from "../../../constants/theme";
import { useFirebase } from "../../context/FirebaseContext";
import useDateRange from "../../hooks/useDateRange";
import generateCSVContent from "../../utils/GenerateCsvContent";
import { fetchData, getLastSundayTwoWeeksPrior } from "../../utils/dataService";
import PageContainer from "../containers/PageContainer";
import DateRangePicker from "./DateRangePicker";
import DownloadCsvButton from "./DownloadCsvButton";
import GenerateCsvButton from "./GenerateCsvButton";
import PurgeOldRecords from "./PurgeOldRecords";

interface RecordsCardProps {
  startLoading: () => void;
  stopLoading: () => void;
  handleError: (errorMessage: string) => void;
  orgId: string;
}

const RecordsCard: React.FC<RecordsCardProps> = ({
  startLoading,
  stopLoading,
  handleError,
  orgId,
}) => {
  const db = useFirebase();
  const { dateState, setDateState } = useDateRange();
  const { enqueueSnackbar } = useSnackbar();
  const [showDateRange, setShowDateRange] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);
  const [csv, setCsv] = useState<string>();

  // useEffect(() => {
  //   console.log("Updated csv:", csv);
  // }, [csv]);

  const generateCSV = async () => {
    const effectiveStartDate =
      dateState[0].startDate ?? getLastSundayTwoWeeksPrior();
    const effectiveEndDate = dateState[0].endDate ?? new Date();
    setLoadingCSV(true);

    console.log(orgId);
    const records = await handleFetchData(effectiveStartDate, effectiveEndDate);
    if (records) {
      const csvContent = await generateCSVContent({
        readUserFunction: db.read,
        orgId,
        startDate: effectiveStartDate,
        endDate: effectiveEndDate,
        data: records,
      });

      setCsv(csvContent);
    } else {
      enqueueSnackbar("No records found for the selected date range.", {
        variant: "error",
      });
    }
    console.log("csv", csv);
    setLoadingCSV(false);
  };

  const handleFetchData = useCallback(
    async (effectiveStartDate?: Date, effectiveEndDate?: Date) => {
      startLoading();
      try {
        const data = await fetchData(
          db,
          orgId,
          effectiveStartDate,
          effectiveEndDate,
        );
        console.log("Fetched Data:", data);
        return data;
      } catch (error) {
        handleError(error as string);
      } finally {
        stopLoading();
      }
    },
    [startLoading, db, orgId, handleError, stopLoading],
  );

  const handleShowDateRange = () => {
    setShowDateRange((prevShow) => !prevShow);
  };

  const purgeOldRecordsWrapper = async (startDate?: Date, endDate?: Date) => {
    return handleFetchData(startDate, endDate);
  };

  return (
    <PageContainer mainMessage={`Documents for: ${orgId}`}>
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
                  fetchDataFunction={purgeOldRecordsWrapper}
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
    </PageContainer>
  );
};

export default RecordsCard;
