// "use client";
// import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useSnackbar } from "notistack";
// import React from "react";
// import * as theme from "../../constants/theme";
// import { useAuth } from "../../context/AuthContext";
// import { DASHBOARD, LOGIN } from "../../utils/constants/routes.constants";
// import NavigationLinks from "./NavigationLinks";

// const headerStyles = {
//   backgroundColor: theme.HEADER_BACKGROUND_COLOR,
//   boxShadow: "none",
//   color: theme.TEXT_COLOR,
// };

// const Header = ({ children }: { children: React.ReactNode }) => {
//   const { user, signOut } = useAuth();
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();

//   const handleLogout = async () => {
//     enqueueSnackbar("Logging out...", {
//       variant: "info",
//     });
//     try {
//       await signOut();
//       enqueueSnackbar("You are now logged out", {
//         variant: "success",
//       });
//       router.push(LOGIN);
//     } catch (error: any) {
//       enqueueSnackbar("There was an error, please try again.", {
//         variant: "error",
//       });
//     }
//   };

//   return (
//     <>
//       <AppBar position="sticky" sx={headerStyles}>
//         <Toolbar>
//           <Grid container alignItems="center" justifyContent="space-between">
//             <Grid item>
//               <Link
//                 href={DASHBOARD}
//                 passHref
//                 style={{ textDecoration: "none" }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     color: theme.TEXT_COLOR,
//                     "&:hover": { color: theme.ACCENT_COLOR },
//                   }}
//                 >
//                   ShiftScribe
//                 </Typography>
//               </Link>
//             </Grid>
//             <Grid item>
//               <Box sx={{ display: "flex" }}>
//                 <NavigationLinks user={user} onLogout={handleLogout} />
//               </Box>
//             </Grid>
//             {/* <Grid item>
//               <Box sx={{ display: "flex" }}>
//                 {!user ? (
//                   <>
//                     <Link href={LOGIN} passHref>
//                       <Button sx={linkStyles}>Login</Button>
//                     </Link>
//                     <Link href={SIGN_UP} passHref>
//                       <Button sx={linkStyles}>Sign Up</Button>
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link href={DASHBOARD} passHref>
//                       <Button sx={linkStyles}>Dashboard</Button>
//                     </Link>
//                     <Button color="inherit" onClick={handleLogout}>
//                       Logout
//                     </Button>
//                   </>
//                 )}
//               </Box>
//             </Grid> */}
//           </Grid>
//         </Toolbar>
//       </AppBar>
//       <Box
//         style={{
//           backgroundColor: theme.BACKGROUND_COLOR,
//           height: "100vh",
//           width: "100vw",
//         }}
//       >
//         {children}
//       </Box>
//     </>
//   );
// };

// export default Header;
