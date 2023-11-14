// import { Button } from "@mui/material";
// import { User } from "firebase/auth";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { linkStyles } from "../../constants/styles";
// import {
//   DASHBOARD,
//   EMPLOYEE_LIST,
//   JOB_LIST,
//   LOGIN,
//   RECORDS,
//   REQUESTS,
//   SIGN_UP,
// } from "../../utils/constants/routes.constants";

// interface NavigationLinksProps {
//   user: User;
//   onLogout: () => Promise<void>;
// }

// const NavigationLinks = ({ user, onLogout }: NavigationLinksProps) => {
//   const router = useRouter();

//   if (!user) {
//     return (
//       <>
//         <Link href={LOGIN} passHref>
//           <Button sx={linkStyles}>Login</Button>
//         </Link>
//         <Link href={SIGN_UP} passHref>
//           <Button sx={linkStyles}>Sign Up</Button>
//         </Link>
//       </>
//     );
//   } else if (router.pathname === DASHBOARD) {
//     return (
//       <Button sx={linkStyles} onClick={onLogout}>
//         Logout
//       </Button>
//     );
//   } else {
//     return (
//       <>
//         <Link href={RECORDS} passHref>
//           <Button sx={linkStyles}>Records</Button>
//         </Link>
//         <Link href={REQUESTS} passHref>
//           <Button sx={linkStyles}>Requests</Button>
//         </Link>
//         <Link href={JOB_LIST} passHref>
//           <Button sx={linkStyles}>Job Information</Button>
//         </Link>
//         <Link href={EMPLOYEE_LIST} passHref>
//           <Button sx={linkStyles}>Employee Information</Button>
//         </Link>
//         <Button sx={{ ...linkStyles }} onClick={onLogout}>
//           Logout
//         </Button>
//       </>
//     );
//   }
// };

// export default NavigationLinks;
