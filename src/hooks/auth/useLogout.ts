// "use client";
// import { redirect } from "next/navigation";
// import { useSnackbar } from "notistack";
// import { useAuthCtx } from "../../context/AuthContext";

// export const useLogout = () => {
//   const auth = useAuthCtx();
//   const { enqueueSnackbar } = useSnackbar();

//   const handleLogout = async () => {
//     enqueueSnackbar("Logging out...", {
//       variant: "info",
//     });
//     try {
//       await auth.signOut();
//       enqueueSnackbar("You are now logged out", {
//         variant: "success",
//       });
//       redirect("/login");
//     } catch (error: any) {
//       enqueueSnackbar("There was an error, please try again.", {
//         variant: "error",
//       });
//     }
//   };

//   return handleLogout;
// };
