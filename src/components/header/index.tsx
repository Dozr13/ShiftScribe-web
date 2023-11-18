// "use client";
// import { AppBar, Grid, Toolbar } from "@mui/material";
// import { HEADER_BACKGROUND_COLOR, TEXT_COLOR } from "../../../constants/theme";
// import { useAuthCtx } from "../../context/AuthContext";
// import DesktopNav from "./DesktopNav";
// import Logo from "./Logo";

// const headerStyles = {
//   backgroundColor: HEADER_BACKGROUND_COLOR,
//   boxShadow: "none",
//   color: TEXT_COLOR,
// };

// const Header = () => {
//   const { user } = useAuthCtx();

//   const navItems = user
//     ? [
//         { href: "/dashboard", label: "Dashboard" },
//         { href: "/records", label: "Records" },
//         { href: "/employees", label: "Employees" },
//         { href: "/requests", label: "Requests" },
//         { href: "/jobs", label: "Jobs" },
//       ]
//     : [
//         { href: "/login", label: "Login" },
//         { href: "/signup", label: "Sign Up" },
//       ];

//   return (
//     <>
//       <AppBar position="sticky" sx={headerStyles}>
//         <Toolbar>
//           <Grid container alignItems="center" justifyContent="space-between">
//             <Grid item>
//               <Logo />
//             </Grid>
//             <Grid item>
//               <DesktopNav navItems={navItems} />
//             </Grid>
//           </Grid>
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// };

// export default Header;
