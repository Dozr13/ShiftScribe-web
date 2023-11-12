// pages/_app.tsx
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import Layout from "../components/layout/Layout";
import { AuthContextProvider } from "../context/AuthContext";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider maxSnack={3}>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
