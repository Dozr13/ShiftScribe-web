"use client";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";
import { LOGIN } from "../../utils/constants/routes.constants";

export const useLogout = () => {
  const auth = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await router.push(LOGIN);

      enqueueSnackbar("You are now logged out", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("There was an error, please try again.", {
        variant: "error",
      });
    }
  };

  return handleLogout;
};
