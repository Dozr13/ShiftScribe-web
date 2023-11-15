import { auth } from "@/services/firebase";
import { LoginForm } from "../../ui/auth/login";
import PageContainer from "../../ui/containers/PageContainer";

const Login = () => {
  console.log("Verify", auth.config);
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
