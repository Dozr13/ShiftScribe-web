import SignupForm from "../../components/auth/signup/SignupForm";
import PageHeader from "../../components/containers/PageHeader";

const SignUp = () => {
  return (
    <>
      <PageHeader mainMessage={`Sign Up Today!`} />
      <SignupForm />
    </>
  );
};

export default SignUp;
