import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { AuthContextProvider } from "../context/AuthContext";

import Header from "../components/header";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <html lang="en">
    //   <body>
    <SnackbarProvider maxSnack={3}>
      <AuthContextProvider>
        <Header />
        <Component {...pageProps} />
      </AuthContextProvider>
    </SnackbarProvider>
    //   </body>
    // </html>
  );
}

export default MyApp;
