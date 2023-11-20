// "use client";
// import createCache from "@emotion/cache";
// import { CacheProvider } from "@emotion/react";
// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider } from "@mui/material/styles";
// import { useServerInsertedHTML } from "next/navigation";
// import { useState } from "react";
// import { AuthContextProvider } from "../context/AuthContext";
// import theme from "./theme";

// interface CacheOptions {
//   key: string;
//   prepend?: boolean;
// }

// interface ThemeRegistryProps {
//   options: CacheOptions;
//   children: React.ReactNode;
// }

// export default function ThemeRegistry(props: ThemeRegistryProps) {
//   const { options, children } = props;

//   const [{ cache, flush }] = useState(() => {
//     const cache = createCache(options);
//     cache.compat = true;
//     const prevInsert = cache.insert;
//     let inserted: string[] = [];
//     cache.insert = (...args) => {
//       const serialized = args[1];
//       if (cache.inserted[serialized.name] === undefined) {
//         inserted.push(serialized.name);
//       }
//       return prevInsert(...args);
//     };
//     const flush = () => {
//       const prevInserted = inserted;
//       inserted = [];
//       return prevInserted;
//     };
//     return { cache, flush };
//   });

//   useServerInsertedHTML(() => {
//     const names = flush();
//     if (names.length === 0) {
//       return null;
//     }
//     let styles = "";
//     for (const name of names) {
//       styles += cache.inserted[name];
//     }
//     return (
//       <style
//         key={cache.key}
//         data-emotion={`${cache.key} ${names.join(" ")}`}
//         dangerouslySetInnerHTML={{
//           __html: options.prepend ? `@layer emotion {${styles}}` : styles,
//         }}
//       />
//     );
//   });

//   return (
//     <CacheProvider value={cache}>
//       <ThemeProvider theme={theme}>
//         <AuthContextProvider>
//           <CssBaseline />
//           {children}
//         </AuthContextProvider>
//       </ThemeProvider>
//     </CacheProvider>
//   );
// }
"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import theme from "./theme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </SnackbarProvider>
  );
}
