import { Card, CardContent, Typography } from "@mui/material";
import { FormikProps } from "formik";
import SignUpButton from "../../buttons/SignUpButton";
import SubmitButton from "../../buttons/SubmitButton";
import ButtonContainer from "../../containers/ButtonContainer";
import LoginFields from "./LoginFields"; // Adjust the import path as necessary
import { redirect } from "next/navigation";

interface LoginCardProps {
  formik: FormikProps<{
    email: string;
    password: string;
  }>;
}

const LoginCard = ({ formik }: LoginCardProps) => {
  const handleSignUpClick = () => {
    redirect("/signup");
  };

  return (
    <Card sx={{ maxWidth: 345, mx: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Login
        </Typography>
        <LoginFields email="" password="" />
        <ButtonContainer direction="column" size="small">
          <SubmitButton isSubmitting={formik.isSubmitting} />
          <SignUpButton onClick={handleSignUpClick} />
        </ButtonContainer>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
