"use client";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/header";
import { AuthContextProvider } from "../context/AuthContext";
import ThemeRegistry from "../utils/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Wade Pate's Portfolio",
  description: "Get to know more about Wade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry options={{ key: "mui-theme" }}>
          <AuthContextProvider>
            <Header />
            <Box className="main-container">{children}</Box>
          </AuthContextProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
