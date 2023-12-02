import PageHeader from "@/components/containers/PageHeader";
import JobCard from "@/components/jobs/JobCard";
import { CustomSession } from "@/types/session";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../../api/auth/[...nextauth]/options";
import routes from "../../../utils/routes";

const JobsPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect(routes.profile(session.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Job List for ${orgId}`} />
      <JobCard orgId={orgId} />
    </>
  );
};

export default JobsPage;
