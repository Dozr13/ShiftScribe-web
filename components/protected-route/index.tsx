import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import usePermissionRedirect from "../../hooks/auth/usePermissionRedirect";
import { PermissionLevel } from "../../lib";
import { LOGIN } from "../../utils/constants/routes.constants";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const auth = useAuth();

  usePermissionRedirect(
    PermissionLevel.SUPERUSER,
    () => router.push(LOGIN),
    auth.accessLevel,
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {auth ? children : null}
    </Box>
  );
};

export default ProtectedRoute;
