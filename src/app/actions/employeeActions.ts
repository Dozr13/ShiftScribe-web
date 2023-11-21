import * as employeeApi from "@/lib/employeeApi";
import { Employee } from "@/types/data";

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
    // The path to the specific employee
    const employeePath = `orgs/${orgId}/members/${employeeId}`;
    // Update the employee data in Firebase
    await employeeApi.updateData(employeePath, updateData);
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

export const fetchEmployees = async (orgId: string): Promise<Employee[]> => {
  try {
    // Fetch all employees from the specific organization
    const employees = await employeeApi.fetchEmployeeData(orgId);
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
