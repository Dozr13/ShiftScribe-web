import { fetchEmployeeData } from "../../lib/employeeApi";

export async function fetchEmployees(orgId: string) {
  return await fetchEmployeeData(orgId);
}
