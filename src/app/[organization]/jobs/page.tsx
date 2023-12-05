import JobCard from "@/components/card/JobCard";
import PageHeader from "@/components/containers/PageHeader";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import routes from "../../../utils/routes";

const JobsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    // TODO: Ensure working correctly
    redirect(routes.profile(session?.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Current Job List`} />
      <JobCard orgId={orgId} />
    </>
  );
};

export default JobsPage;
