// import { Box, Typography } from "@mui/material";
// import { ReactNode } from "react";
// import { pageContainerStyles } from "../../styles/pageContainer.styles";

// interface PageContainerProps {
//   children: ReactNode;
//   mainMessage: string;
//   secondaryMessage?: string;
// }

// const PageContainer = ({
//   children,
//   mainMessage,
//   secondaryMessage,
// }: PageContainerProps) => {
//   return (
//     <Box sx={pageContainerStyles.pageContainer}>
//       <Box sx={pageContainerStyles.messageContainer}>
//         <Typography variant="h3" sx={pageContainerStyles.mainMessage}>
//           {mainMessage}
//         </Typography>
//         {secondaryMessage ? (
//           <Typography variant="h5" sx={pageContainerStyles.secondaryMessage}>
//             {secondaryMessage}
//           </Typography>
//         ) : null}
//       </Box>
//       {children}
//     </Box>
//   );
// };

// export default PageContainer;
// PageContainer.tsx
import { Box } from "@mui/material";
import React from "react";
import { DRAWER_WIDTH } from "../../app/layout";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const appBarHeight = "64px";
  const verticalPadding = "24px";

  return (
    <Box
      component="main"
      sx={{
        height: `calc(100vh - ${appBarHeight} - ${verticalPadding})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        ml: `${DRAWER_WIDTH}px`,
        mt: appBarHeight,
        p: 3,
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
