import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SubmitButton from "../../components/form-components/SubmitButton";
import ProtectedRoute from "../../components/protected-route";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { PermissionLevel } from "../../lib";
import {
  EMPLOYEE_LIST,
  JOB_LIST,
  LOGIN,
  RECORDS,
  REQUESTS,
} from "../../utils/constants/routes.constants";
import { showToast } from "../../utils/toast";

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const onClickManageRecords = () => {
    router.push(RECORDS);
  };

  const onClickViewRequests = () => {
    router.push(REQUESTS);
  };

  const onClickJobInformation = () => {
    router.push(JOB_LIST);
  };

  const onClickEmployeeInformation = () => {
    router.push(EMPLOYEE_LIST);
  };

  const handleLogout = async () => {
    showToast("Logging out...");
    try {
      await auth.signOut();
      showToast("You are now logged out");
      router.push(LOGIN);
    } catch (error: any) {
      showToast(error.message, false);
    }
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          py: 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.BACKGROUND_COLOR,
        }}
      >
        <Box
          sx={{
            color: theme.TEXT_COLOR,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, color: theme.ACCENT_COLOR }}>
            {" "}
            {`Welcome ${auth.user?.displayName}`}
          </Typography>

          {auth.permissionLevel >= PermissionLevel.SUPERUSER ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 4,
              }}
            >
              <SubmitButton
                message={"Manage Records"}
                onClick={onClickManageRecords}
              />
              <SubmitButton
                message={"View Requests"}
                onClick={onClickViewRequests}
              />
              <SubmitButton
                message={"Edit Jobs"}
                onClick={onClickJobInformation}
              />
              <SubmitButton
                message={"View Employees"}
                onClick={onClickEmployeeInformation}
              />
            </Box>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{ color: theme.ACCENT_COLOR, mb: 4 }}
              >
                You are unable to access this page without proper permissions
              </Typography>

              <SubmitButton
                message={"Click Here To Logout"}
                onClick={handleLogout}
              />
            </>
          )}
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default DashboardPage;
