import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageHeader from "../../components/containers/PageHeader";
import EmployeeCard from "../../components/employees/EmployeeCard";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

const EmployeesPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Employee List for ${orgId}`} />
      <EmployeeCard orgId={orgId} />
    </>
  );
};

export default EmployeesPage;
