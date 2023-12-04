"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import routes from "../../utils/routes";

const BackToLandingButton = () => {
  const pathname = usePathname();

  return (
    pathname !== "/" && (
      <Link href={routes.home} style={{ textDecoration: "none" }} passHref>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Back to Landing
        </Button>
      </Link>
    )
  );
};

export default BackToLandingButton;
