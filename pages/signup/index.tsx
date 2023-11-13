import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { DASHBOARD } from "../../utils/constants/routes.constants";
import { signupSchema } from "../../validations/signup.validation";

const SignUpPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  type FormData = Yup.InferType<typeof signupSchema>;

  const { signUp } = useAuth();
  const router = useRouter();

  const methods = useForm<FormData>({
    mode: "onBlur",
    resolver: yupResolver(signupSchema),
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      await signUp(data.email, data.password);
      enqueueSnackbar("Successfully signed up!", {
        variant: "success",
      });
      router.push(DASHBOARD);
    } catch (error: any) {
      enqueueSnackbar("Error Signing up, please try again later.", {
        variant: "error",
      });
    }
  };
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mx: "auto",
          my: "20vh",
          width: "20vw",
          bgcolor: theme.BACKGROUND_COLOR,
          border: 2,
          borderColor: theme.BORDER_COLOR,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          color={theme.BUTTON_COLOR_PRIMARY}
          gutterBottom
        >
          Sign Up
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Organization"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.organization}
              helperText={errors.organization?.message}
              {...methods.register("organization")}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...methods.register("email")}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...methods.register("password")}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              {...methods.register("confirm_password")}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, bgcolor: theme.BUTTON_COLOR_PRIMARY }}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
