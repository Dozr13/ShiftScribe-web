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
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import * as theme from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { DASHBOARD } from "../../utils/constants/routes.constants";
import { loginSchema } from "../../validations/login.validation";

const LoginPage = () => {
  type FormData = Yup.InferType<typeof loginSchema>;

  const { signIn } = useAuth();
  const router = useRouter();

  const methods = useForm<FormData>({
    mode: "onBlur",
    resolver: yupResolver(loginSchema),
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = methods;

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Logging in...");
    try {
      await signIn(data.email, data.password);
      toast.success("Successfully logged in!", { id: toastId });
      router.push(DASHBOARD);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
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
          Welcome
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
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

export default LoginPage;
