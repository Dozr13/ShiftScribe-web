"use client";
import { Grid } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthCtx } from "../context/AuthContext";
import GridItemWrapper from "../ui/containers/GridItemsWrapper";
import PageContainer from "../ui/containers/PageContainer";

export default function Home() {
  const { user } = useAuthCtx();
  const router = useRouter();

  if (user) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }

  return (
    <PageContainer mainMessage="Welcome to ShiftScribe">
      <Grid container spacing={8}>
        <GridItemWrapper md={4}>
          <Link href="/dashboard">Sign In</Link>
        </GridItemWrapper>
      </Grid>
    </PageContainer>
  );
}
