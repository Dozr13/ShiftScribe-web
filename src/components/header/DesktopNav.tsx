import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { linkStyles } from "../../../constants/styles";
import { useAuthCtx } from "../../context/AuthContext";
import { useLogout } from "../../hooks/auth/useLogout";

const DesktopNav: React.FC<{
  navItems: Array<{ href: string; label: string; onClick?: () => void }>;
}> = ({ navItems }) => {
  const { user } = useAuthCtx();
  const handleLogout = useLogout();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {navItems.map((item) => (
        <React.Fragment key={item.href}>
          {item.onClick ? (
            <Button onClick={item.onClick}>{item.label}</Button>
          ) : (
            <Link href={item.href} style={linkStyles}>
              <Button>{item.label}</Button>
            </Link>
          )}
        </React.Fragment>
      ))}
      {user && <Button onClick={handleLogout}>Logout</Button>}
    </Box>
  );
};

export default DesktopNav;
