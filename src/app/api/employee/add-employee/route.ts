// TODO: Finish sign up new user api
// import { push, ref, set } from "firebase/database";
// import { NextResponse } from "next/server";
// import { firebaseDatabase } from "../../../../services/firebase";
// import { AddUserRequestBody } from "../../../../types/docTypes";

// export async function POST(req: Request) {
//   try {
//     const { displayName, email, organization, password }: AddUserRequestBody =
//       await req.json();

//     const usersRef = ref(firebaseDatabase, `users/${email}`);
//     const newUserRef = push(usersRef);

//     if (!displayName || !email || !organization || !password) {
//       throw new Error(
//         "completed tasks or in progress can't be empty during initialization",
//       );
//     }

//     set(newUserRef, {
//       displayName: displayName,
//       email: email,
//       organization: organization,
//       password: password,
//     });
//     return NextResponse.json({
//       userId: newUserRef.key,
//       message: "Successfully Added User to firebase 👍",
//     });
//   } catch (error: any) {
//     return NextResponse.error();
//   }
// }
