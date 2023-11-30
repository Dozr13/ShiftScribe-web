import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { fetchEmployees } from "../../app/actions/employeeActions";
import { Employee } from "../../types/data";

export const useEmployees = (orgId: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      unsubscribe = await fetchEmployees(orgId, setEmployees);
    };

    init();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orgId]);

  const refreshEmployees = async () => {
    try {
      await fetchEmployees(orgId, setEmployees);
    } catch (error) {
      console.error("Error refreshing employees:", error);
      enqueueSnackbar("Error refreshing employees", { variant: "error" });
    }
  };

  return { employees, setEmployees, refreshEmployees };
};
