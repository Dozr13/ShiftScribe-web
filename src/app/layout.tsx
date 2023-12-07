import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React from "react";
import LandingContainer from "../components/containers/LandingContainer";
import LandingAppBar from "../components/header/UnauthorizedUser/LandingAppBar";
import ThemeRegistry from "../components/themeRegistry/ThemeRegistry";
// import NextAuthProvider from "./context/NextAuthProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        {/* <NextAuthProvider> */}
        <ThemeRegistry>
          <LandingContainer>
            <LandingAppBar />
            {children}
          </LandingContainer>
        </ThemeRegistry>
        {/* </NextAuthProvider> */}
      </body>
    </html>
  );
};

export default RootLayout;
