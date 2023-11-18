import { Card, CardContent, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { redirect } from "next/navigation";
import SubmitButton from "../../buttons/SignInButton";
import SignUpButton from "../../buttons/SignUpButton";
import ButtonContainer from "../../containers/ButtonContainer";
import SignInFields from "./SignInFields"; // Adjust the import path as necessary

interface SignInCardProps {
  formik: FormikProps<{
    email: string;
    password: string;
  }>;
}

const SignInCard = ({ formik }: SignInCardProps) => {
  const handleSignUpClick = () => {
    redirect("/signup");
  };

  return (
    <Card sx={{ maxWidth: 345, mx: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          SignIn
        </Typography>
        <SignInFields email="" password="" />
        <ButtonContainer direction="column" size="small">
          <SubmitButton isSigningIn={formik.isSubmitting} />
          <SignUpButton onClick={handleSignUpClick} />
        </ButtonContainer>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
