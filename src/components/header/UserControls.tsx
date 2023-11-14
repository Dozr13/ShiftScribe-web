// import { Box, Button } from "@mui/material";
// import { User } from "firebase/auth";
// import Link from "next/link";
// import { LOGIN, SIGN_UP } from "../../../constants/routes";
// import { linkStyles } from "../../../constants/styles";

// interface UserControlsProps {
//   user: User | null;
//   onLogout: () => Promise<void>;
// }

// const UserControls = ({ user, onLogout }: UserControlsProps) => {
//   if (!user) {
//     return (
//       <Box sx={{ display: "flex" }}>
//         <Link href={LOGIN} passHref>
//           <Button sx={linkStyles}>Login</Button>
//         </Link>
//         <Link href={SIGN_UP} passHref>
//           <Button sx={linkStyles}>Sign Up</Button>
//         </Link>
//       </Box>
//     );
//   }

//   return (
//     <Button color="inherit" onClick={onLogout}>
//       Logout
//     </Button>
//   );
// };

// export default UserControls;
