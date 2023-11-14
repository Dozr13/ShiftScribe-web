import { createTheme } from "@mui/material/styles";
import {
  ACCENT_COLOR,
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BUTTON_COLOR_PRIMARY,
  BUTTON_COLOR_TEXT,
  BUTTON_PRIMARY_HOVER_COLOR,
  BUTTON_SECONDARY_HOVER_COLOR,
  HEADER_BACKGROUND_COLOR,
  MID_GROUND_COLOR,
  // PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_TEXT_COLOR,
  TEXT_COLOR,
} from "../../constants/colorPalette";

const theme = createTheme({
  palette: {
    background: {
      default: BACKGROUND_COLOR,
      paper: HEADER_BACKGROUND_COLOR,
    },
    text: {
      primary: TEXT_COLOR,
      disabled: MID_GROUND_COLOR,
      secondary: ACCENT_COLOR,
    },
    primary: {
      main: BUTTON_COLOR_PRIMARY,
      contrastText: BUTTON_COLOR_TEXT,
      light: BUTTON_PRIMARY_HOVER_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: SECONDARY_TEXT_COLOR,
      light: BUTTON_SECONDARY_HOVER_COLOR,
    },
    divider: BORDER_COLOR,
  },
});

export default theme;
