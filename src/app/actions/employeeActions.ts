import * as employeeApi from "@/lib/employeeApi";
import { Employee } from "@/types/data";
import { get, getDatabase, off, onValue, ref, update } from "firebase/database";
import { firebaseDatabase } from "../../services/firebase";

export const addEmployee = async (
  orgId: string,
  employeeData: Omit<Employee, "id">,
): Promise<string | null> => {
  try {
    // The path where the new employee will be added
    const employeePath = `orgs/${orgId}/members`;
    // Push the new employee data to Firebase and get the unique key
    const employeeId = employeeApi.pushData(employeePath, employeeData);
    return employeeId;
  } catch (error) {
    console.error("Error adding new employee:", error);
    throw error;
  }
};

export const updateEmployee = async (
  orgId: string,
  employeeId: string,
  updateData: Partial<Employee>,
): Promise<void> => {
  try {
    // Update accessLevel at /orgs/orgId/members/employeeId
    if (updateData.accessLevel !== undefined) {
      const accessLevelRef = ref(
        firebaseDatabase,
        `orgs/${orgId}/members/${employeeId}`,
      );
      await update(accessLevelRef, { accessLevel: updateData.accessLevel });
    }

    // Prepare userData update object
    const userDataUpdates: Partial<Employee["userData"]> = {};
    if (updateData.userData?.displayName) {
      userDataUpdates.displayName = updateData.userData.displayName;
    }
    if (updateData.userData?.email) {
      userDataUpdates.email = updateData.userData.email;
    }

    // Update displayName, email, and potentially organization at /users/employeeId
    if (Object.keys(userDataUpdates).length > 0) {
      const userRef = ref(firebaseDatabase, `/users/${employeeId}`);
      await update(userRef, userDataUpdates);
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (
  orgId: string,
  employeeId: string,
): Promise<void> => {
  try {
    // The path to the specific employee
    const employeePath = `orgs/${orgId}/members/${employeeId}`;
    // Remove the employee data from Firebase
    await employeeApi.deleteData(employeePath);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// export const fetchOrgMembers = (
//   orgId: string,
//   onMembersFetched: (memberIds: string[]) => void,
// ) => {
//   const orgMembersRef = ref(firebaseDatabase, `orgs/${orgId}/members`);

//   const unsubscribe = onValue(orgMembersRef, (snapshot) => {
//     if (!snapshot.exists()) {
//       onMembersFetched([]);
//       return;
//     }

//     const memberIds = Object.keys(snapshot.val());
//     onMembersFetched(memberIds);
//   });

//   // Return a function to unsubscribe
//   return () => off(orgMembersRef, "value", unsubscribe);
// };

// export const fetchUserData = async (userIds: string[]): Promise<Employee[]> => {
//   const employees = await Promise.all(
//     userIds.map(async (userId) => {
//       const userRef = ref(db, `users/${userId}`);
//       const userSnapshot = await get(userRef);

//       return {
//         id: userId,
//         userData: userSnapshot.val(),
//       };
//     }),
//   );

//   return employees;
// };

export const fetchOrgMembers = (
  orgId: string,
  onMembersFetched: (
    membersData: Record<string, { accessLevel: number }>,
  ) => void,
) => {
  const orgMembersRef = ref(firebaseDatabase, `orgs/${orgId}/members`);

  const unsubscribe = onValue(orgMembersRef, (snapshot) => {
    if (!snapshot.exists()) {
      onMembersFetched({});
      return;
    }

    const membersData = snapshot.val();
    onMembersFetched(membersData);
  });

  return () => off(orgMembersRef, "value", unsubscribe);
};

export const fetchUserData = async (
  membersData: Record<string, { accessLevel: number }>,
): Promise<Employee[]> => {
  const db = getDatabase(); // Ensure firebaseApp is initialized globally

  const employees = await Promise.all(
    Object.entries(membersData).map(async ([userId, { accessLevel }]) => {
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      return {
        id: userId,
        accessLevel,
        userData: userSnapshot.val(),
      };
    }),
  );

  return employees;
};

// export const fetchEmployees = async (
//   orgId: string,
//   setEmployees: (employees: Employee[]) => void,
// ) => {
//   const handleMembersFetched = async (
//     membersData: Record<string, { accessLevel: number }>,
//   ) => {
//     const employeeData = await fetchUserData(membersData);
//     setEmployees(employeeData);
//   };

//   const unsubscribeMembers = fetchOrgMembers(orgId, handleMembersFetched);
//   return () => unsubscribeMembers();
// };
export const fetchEmployees = async (
  orgId: string,
  setEmployees: (employees: Employee[]) => void,
): Promise<() => void> => {
  let unsubscribeMembers: () => void;

  const handleMembersFetched = async (
    membersData: Record<string, { accessLevel: number }>,
  ) => {
    const employeeData = await fetchUserData(membersData);
    setEmployees(employeeData);
  };

  unsubscribeMembers = fetchOrgMembers(orgId, handleMembersFetched);

  // Return a cleanup function
  return () => {
    unsubscribeMembers();
    // Any other cleanup if needed
  };
};

// export const fetchEmployees = async (
//   orgId: string,
//   setEmployees: (employees: Employee[]) => void,
// ) => {
//   const employeesRef = ref(firebaseDatabase, `orgs/${orgId}/members`);
//   const userRef = ref(firebaseDatabase, "/users");
//   const unsubscribe = onValue(employeesRef, (snapshot) => {
//     const employeesData = snapshot.val();
//     const formattedEmployees: Employee[] = employeesData
//       ? Object.entries(employeesData).map(([firebaseId, employeeData]) => ({
//           ...(employeeData as Employee),
//           id: firebaseId,
//         }))
//       : [];
//     setEmployees(formattedEmployees);
//   });

//   return () => off(employeesRef, "value", unsubscribe);
// };
