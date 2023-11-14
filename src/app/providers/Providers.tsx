"use client";

import { SnackbarProvider } from "notistack";
import { AuthContextProvider } from "../../context/AuthContext";
import ThemeRegistry from "../../utils/ThemeRegistry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry options={{ key: "mui-theme" }}>
      <SnackbarProvider maxSnack={3}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </SnackbarProvider>
    </ThemeRegistry>
  );
}
