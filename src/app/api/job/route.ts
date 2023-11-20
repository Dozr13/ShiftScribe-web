// import { firebaseDatabase } from "@/services/firebase";
// import { get as getFirebaseData, ref, update } from "firebase/database";
// import { NextResponse } from "next/server";

// export async function PUT(req: Request) {
//   console.log("req.body: ;", req);
//   try {
//     // Parse request body to get employeeId, orgId, and updated info
//     const { employeeId, orgId, displayName, email, accessLevel } =
//       await req.json();

//     console.log("employeeId: ", employeeId);
//     console.log("orgId: ", orgId);
//     console.log("displayName: ", displayName);
//     console.log("email: ", email);
//     console.log("accessLevel: ", accessLevel);

//     if (!employeeId || !orgId) {
//       throw new Error(
//         !employeeId ? "EmployeeId must be provided" : "OrgId must be provided",
//       );
//     }

//     // References to the employee's data in the Firebase database
//     const employeeOrgRef = ref(
//       firebaseDatabase,
//       `orgs/${orgId}/members/${employeeId}`,
//     );
//     const employeeRef = ref(firebaseDatabase, `users/${employeeId}`);

//     console.group("Refs and beyond");
//     console.log("######### employeeOrgRef: ", employeeOrgRef);
//     console.log("######### employeeRef: ", employeeRef);

//     // Check if the employee exists in the organization
//     const orgSnapshot = await getFirebaseData(employeeOrgRef);
//     console.log("######### orgSnapshot: ", orgSnapshot);

//     if (!orgSnapshot.exists()) {
//       return NextResponse.json({
//         message: `Employee with id ${employeeId} not found in organization ${orgId}`,
//       });
//     }

//     // Check if the employee's user data exists
//     const userSnapshot = await getFirebaseData(employeeRef);
//     console.log("######### userSnapshot: ", userSnapshot);

//     if (!userSnapshot.exists()) {
//       return NextResponse.json({
//         message: `Employee data for id ${employeeId} not found`,
//       });
//     }

//     // Update the employee's information
//     const orgUpdates: { [key: string]: any } = {};
//     orgUpdates[`orgs/${orgId}/members/${employeeId}/accessLevel`] = accessLevel;

//     const employeeUpdates: { [key: string]: any } = {};
//     employeeUpdates[`users/${employeeId}/displayName`] = displayName;
//     employeeUpdates[`users/${employeeId}/email`] = email;

//     console.log("###### orgUpdates: ", orgUpdates);
//     console.log("###### employeeUpdates: ", employeeUpdates);

//     console.groupEnd();

//     await update(ref(firebaseDatabase), orgUpdates);
//     await update(ref(firebaseDatabase), employeeUpdates);

//     return NextResponse.json({
//       message: `Employee with id ${employeeId} updated successfully`,
//     });
//   } catch (error: any) {
//     console.error("Error updating employee:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }
