import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageHeader from "../../../components/containers/PageHeader";
import RequestsCard from "../../../components/requests/RequestCard";
import { CustomSession } from "../../../types/session";
import { options } from "../../api/auth/[...nextauth]/options";
import routes from "../../../utils/routes";

const Requests = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect(routes.profile(session.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Requests made for: ${orgId}`} />
      <RequestsCard orgId={orgId} />
    </>
  );
};

export default Requests;
