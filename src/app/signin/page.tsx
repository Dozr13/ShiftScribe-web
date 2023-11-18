import { SignInForm } from "../../components/auth/signin";
import PageContainer from "../../components/containers/PageContainer";

const Login = () => {
  return (
    <PageContainer
      mainMessage="ShiftScribe"
      secondaryMessage="Welcome, please login below"
    >
      <SignInForm />
    </PageContainer>
  );
};

export default Login;
