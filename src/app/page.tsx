"use client";
import { Grid } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";
import GridItemWrapper from "../components/containers/GridItemsWrapper";
import PageContainer from "../components/containers/PageContainer";
import { useAuthCtx } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuthCtx();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
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
