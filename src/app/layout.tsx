import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React from "react";
import LandingContainer from "../components/containers/LandingContainer";
import LandingAppBar from "../components/header/UnauthorizedUser/LandingAppBar";
import ThemeRegistry from "../components/themeRegistry/ThemeRegistry";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <LandingContainer>
            <LandingAppBar />
            {children}
          </LandingContainer>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
