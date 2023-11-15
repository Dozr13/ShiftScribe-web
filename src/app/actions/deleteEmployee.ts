"use server";

import { deleteData } from "../../lib/employeeApi";

export default async function deleteEmployee(employeeId: string) {
  // Validation or authorization checks
  return await deleteData(employeeId);
}
