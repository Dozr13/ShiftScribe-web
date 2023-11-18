import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

const EmployeesPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }
  // const auth = useAuthCtx();
  // const [initialEmployees, setInitialEmployees] = useState<Employee[] | null>(
  //   [],
  // );
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     if (!auth.orgId) return;

  //     setLoading(true);

  //     try {
  //       const db = getDatabase();
  //       const orgMembersSnapshot = await get(
  //         child(ref(db), `orgs/${auth.orgId}/members`),
  //       );

  //       if (orgMembersSnapshot.exists()) {
  //         const membersData = orgMembersSnapshot.val();
  //         const memberIds = Object.keys(membersData);

  //         const employeesArray = await Promise.all(
  //           memberIds.map(async (memberId) => {
  //             const memberData = membersData[memberId];
  //             const userSnapshot = await get(
  //               child(ref(db), `users/${memberId}`),
  //             );
  //             const userData = userSnapshot.val();

  //             return {
  //               id: memberId,
  //               ...memberData,
  //               userData,
  //             };
  //           }),
  //         );

  //         setInitialEmployees(employeesArray);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching employees:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployees();
  // }, [auth.orgId]); // Dependency on auth.orgId

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>Employees</h1>
    </div>
    // <PageContainer mainMessage={`Employee List for ${auth.orgId}`}>
    /* <EmployeeCard initialEmployees={initialEmployees} /> */
    // </PageContainer>
  );
};

export default EmployeesPage;
