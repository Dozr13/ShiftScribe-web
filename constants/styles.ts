import * as theme from "./theme";

export const linkStyles = {
  color: theme.TEXT_COLOR,
  "&:hover": {
    color: theme.ACCENT_COLOR,
    textDecoration: "none",
  },
  marginRight: 2,
  cursor: "pointer",
};
