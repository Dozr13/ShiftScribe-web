"use client";
import { LoginForm } from "../../components/auth/login";
import PageContainer from "../../components/containers/PageContainer";

const Login = () => {
  return (
    <PageContainer
      mainMessage="ShiftScribe"
      secondaryMessage="Welcome, please login below"
    >
      <LoginForm />
    </PageContainer>
  );
};

export default Login;
