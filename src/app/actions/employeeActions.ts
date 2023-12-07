import * as employeeApi from "@/lib/employeeApi";
import { get, off, onValue, ref, update } from "firebase/database";
import { OrgEmployee } from "../../../types/data";
import { firebaseDatabase } from "../../services/firebase";

// TODO: See if there's a way to implement
// export const addEmployee = async (
//   orgId: string,
//   employeeData: Omit<Employee, "id">,
// ): Promise<string | null> => {
//   try {
//     const employeePath = `orgs/${orgId}/members`;
//     const employeeId = employeeApi.pushData(employeePath, employeeData);
//     return employeeId;
//   } catch (error) {
//     console.error("Error adding new employee:", error);
//     throw error;
//   }
// };

export const updateEmployee = async (
  orgId: string,
  employeeId: string,
  updateData: Partial<OrgEmployee>,
): Promise<void> => {
  try {
    if (updateData.accessLevel !== undefined) {
      const accessLevelRef = ref(
        firebaseDatabase,
        `orgs/${orgId}/members/${employeeId}`,
      );
      await update(accessLevelRef, { accessLevel: updateData.accessLevel });
    }

    const userDataUpdates: Partial<OrgEmployee["userData"]> = {};
    if (updateData.userData?.displayName) {
      userDataUpdates.displayName = updateData.userData.displayName;
    }
    if (updateData.userData?.email) {
      userDataUpdates.email = updateData.userData.email;
    }

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
    const employeePath = `orgs/${orgId}/members/${employeeId}`;
    await employeeApi.deleteData(employeePath);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

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

export const fetchEmployeeData = async (
  membersData: Record<string, { accessLevel: number }>,
): Promise<OrgEmployee[]> => {
  const employees = await Promise.all(
    Object.entries(membersData).map(async ([userId, { accessLevel }]) => {
      const userRef = ref(firebaseDatabase, `users/${userId}`);
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

export const fetchEmployees = async (
  orgId: string,
  setEmployees: (employees: OrgEmployee[]) => void,
): Promise<() => void> => {
  let unsubscribeMembers: () => void;

  const handleMembersFetched = async (
    membersData: Record<string, { accessLevel: number }>,
  ) => {
    const employeeData = await fetchEmployeeData(membersData);
    setEmployees(employeeData);
  };

  unsubscribeMembers = fetchOrgMembers(orgId, handleMembersFetched);

  return () => {
    unsubscribeMembers();
  };
};
