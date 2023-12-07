import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RequestsCard from "../../../components/card/RequestCard";
import PageHeader from "../../../components/containers/PageHeader";
import routes from "../../../utils/routes";
import { authOptions } from "../../../lib/auth";

const Requests = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    // TODO: Ensure working correctly
    redirect(routes.profile(session?.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Employee time change requests`} />
      <RequestsCard orgId={orgId} />
    </>
  );
};

export default Requests;
