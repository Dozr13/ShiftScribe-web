import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CustomSession } from "../../../../types/session";
import EmployeeCard from "../../../components/card/EmployeeCard";
import PageHeader from "../../../components/containers/PageHeader";
import routes from "../../../utils/routes";
import { options } from "../../api/auth/[...nextauth]/options";

const EmployeesPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect(routes.profile(session.user.organization));
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
