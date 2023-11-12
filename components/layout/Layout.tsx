import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Header from "../header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header>
        <Box
          component="main"
          sx={{
            backgroundColor: "var(--background-color)",
            flexGrow: 1,
            minHeight: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Header>
    </>
  );
};

export default Layout;
