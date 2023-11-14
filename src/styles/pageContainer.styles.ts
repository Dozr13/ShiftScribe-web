import { SxProps } from "@mui/system";
import {
  BACKGROUND_COLOR,
  SECONDARY_COLOR,
  SECONDARY_TEXT_COLOR,
} from "../../constants/colorPalette";

export const pageContainerStyles: Record<string, SxProps> = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: BACKGROUND_COLOR,
  },
  messageContainer: {
    textAlign: "center",
    p: 4,
  },
  mainMessage: {
    fontWeight: "800",
    color: SECONDARY_COLOR,
    "@media (max-width:600px)": {
      fontSize: "2.5rem",
    },
  },
  secondaryMessage: {
    color: SECONDARY_TEXT_COLOR,
    "@media (max-width:600px)": {
      fontSize: "1.2rem",
    },
  },
};
