import {
  Box,
  ClickAwayListener,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import EmployeeListItem, {
  Employee,
} from "../../components/employee-list-item";
import AccessLevelKey from "../../components/information-keys/AccessLevelKey";
import ProtectedRoute from "../../components/protected-route";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/FirebaseContext";
import { RequestThrottle } from "../../lib";
import LoadingScreen from "../loading";

const throttle = new RequestThrottle(3, 10);

const EmployeeInformationPage = () => {
  const auth = useAuth();
  const db = useFirebase();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);

  const questionButtonRef = useRef<HTMLButtonElement | null>(null);

  const accessKeyRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        showAccessKey &&
        accessKeyRef.current &&
        !accessKeyRef.current.contains(event.target as Node) &&
        questionButtonRef.current !== event.target
      ) {
        setShowAccessKey(false);
      }
    },
    [showAccessKey],
  );

  useEffect(() => {
    if (showAccessKey) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showAccessKey, handleClickOutside]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!auth.orgId) return;

      setLoading(true);

      const snapshot = await db.read(`orgs/${auth.orgId}/members`);
      // console.log('SNAPSHOT', snapshot);
      if (snapshot.exists()) {
        const membersData = snapshot.val();
        const memberIds = Object.keys(membersData);

        const employeesArray = await Promise.all(
          memberIds.map(async (memberId) => {
            const memberData = membersData[memberId];
            const userSnapshot = await db.read(`users/${memberId}`);
            const userData = userSnapshot.val();

            return {
              id: memberId,
              ...memberData,
              userData,
            };
          }),
        );

        setEmployees(employeesArray);
      }

      setLoading(false);
    };

    fetchEmployees();
  }, [auth.orgId, db]);

  const handleDelete = async (id: string) => {
    await db.update(`orgs/${auth.orgId}/members`, {
      [id]: null,
    });
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h3" color="textSecondary" sx={{ my: 4 }}>
          Employee Information
        </Typography>
        <Paper
          sx={{
            p: 5,
            border: 2,
            borderColor: theme.BORDER_COLOR,
            bgcolor: theme.HEADER_BACKGROUND_COLOR,
            borderRadius: 2,
            overflowY: "scroll",
            maxHeight: "90%",
            width: "70vw",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid
              item
              xs={2.4}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Name
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Email
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Organization
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              <Tooltip title={<AccessLevelKey />} placement="top" arrow>
                <Typography>Access Level</Typography>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.TEXT_COLOR,
              }}
            >
              Actions
            </Grid>
          </Grid>

          {/* List of employees */}
          {employees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              onDelete={handleDelete}
            />
          ))}
        </Paper>
        {showAccessKey && (
          <ClickAwayListener onClickAway={() => setShowAccessKey(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "160px",
                left: 0,
                width: "100%",
              }}
              ref={accessKeyRef}
            >
              <AccessLevelKey />
            </Box>
          </ClickAwayListener>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default EmployeeInformationPage;
