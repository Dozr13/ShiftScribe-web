import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EmployeeCard from "../../components/employees/EmployeeCard";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

const EmployeesPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (session.user.accessLevel <= 1) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }
  console.log("sess", session);
  return (
    // <PageContainer
    //   mainMessage={`Employee List for ${session.user.organization}`}
    // >
    <EmployeeCard orgId={session.user.organization ?? ""} />
    // </PageContainer>
  );
};

export default EmployeesPage;
