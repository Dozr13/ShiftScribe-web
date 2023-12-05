"use client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import { Fragment } from "react";
import { UserSessionProps } from ".";
import { TEXT_COLOR } from "../../../../constants/colorPalette";
import stringUtils from "../../../utils/StringUtils";
import { getUserAccessLevel } from "../../../utils/accessLevelUtils";
import routes from "../../../utils/routes";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    arrow
    placement="bottom"
    sx={{ zIndex: 50000, mt: 11 }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const UserAppBar = ({ session }: UserSessionProps) => {
  const accessLevel = getUserAccessLevel(session);

  const organization = session?.user?.organization;
  const organizationSlug = stringUtils.slugify(organization ?? "");

  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1 }}>
          ShiftScribe
        </Typography>
        {accessLevel >= 2 && (
          <CustomTooltip
            title={
              <Fragment>
                <Typography color="inherit" variant="button">
                  Organization Options
                </Typography>
                <em>{"Click here"}</em>{" "}
                {"To view and change options for your organization"}
              </Fragment>
            }
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                href={routes.orgOptions(organizationSlug)}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="button" sx={{ cursor: "pointer" }}>
                  Current Account: {organization}
                </Typography>
              </Link>
              <IconButton size="small" sx={{ color: TEXT_COLOR }}>
                <InfoIcon />
              </IconButton>
            </Box>
          </CustomTooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default UserAppBar;
