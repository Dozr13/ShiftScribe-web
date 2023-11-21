import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageHeader from "../../components/containers/PageHeader";
import RequestsCard from "../../components/requests/RequestsCard";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

const Requests = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
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
