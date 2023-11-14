import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { pageContainerStyles } from "../../styles/pageContainer.styles";

interface PageContainerProps {
  children: ReactNode;
  mainMessage: string;
  secondaryMessage?: string;
}

const PageContainer = ({
  children,
  mainMessage,
  secondaryMessage,
}: PageContainerProps) => {
  return (
    <Box sx={pageContainerStyles.pageContainer}>
      <Box sx={pageContainerStyles.messageContainer}>
        <Typography variant="h3" sx={pageContainerStyles.mainMessage}>
          {mainMessage}
        </Typography>
        {secondaryMessage ? (
          <Typography variant="h5" sx={pageContainerStyles.secondaryMessage}>
            {secondaryMessage}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Box>
  );
};

export default PageContainer;
