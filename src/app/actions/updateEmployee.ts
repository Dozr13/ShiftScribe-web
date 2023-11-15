"use server";

import { updateData } from "../../lib/employeeApi";
import { Employee } from "../../types/data";

export default async function updateEmployee(
  employeeId: string,
  employeeData: Partial<Employee>,
) {
  // Additional validation or authorization checks
  return await updateData(employeeId, employeeData);
}
