import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormInput } from "../../components/form-components/FormInput";
import SubmitButton from "../../components/form-components/SubmitButton";
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
    <div className="sign-up-form container rounded-md w-96 border-2 bg-gray-400 border-gray-400">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
        Sign Up
      </h2>
      <FormProvider {...methods}>
        <form
          action=""
          className="w-80 mx-auto pb-12 px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            label="Organization"
            name="org"
            type="text"
            formOptions={signupSchema.fields.organization}
            errors={errors.email}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            formOptions={signupSchema.fields.email}
            errors={errors.email}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            formOptions={signupSchema.fields.password}
            errors={errors.password}
          />
          <FormInput
            label="Confirm Password"
            name="confirm_password"
            type="password"
            formOptions={signupSchema.fields.confirm_password}
            errors={errors.confirm_password}
          />
          <SubmitButton message={"Sign Up"} />
        </form>
      </FormProvider>
    </div>
  );
};

export default SignUpPage;
