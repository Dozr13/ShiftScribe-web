import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EmployeeCard from "../../../components/card/EmployeeCard";
import PageHeader from "../../../components/containers/PageHeader";
import { authOptions } from "../../../lib/auth";
import routes from "../../../utils/routes";

const EmployeesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect(routes.profile(session?.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Current Employee List`} />
      <EmployeeCard orgId={orgId} />
    </>
  );
};

export default EmployeesPage;
