import PageContainer from "@/components/containers/PageContainer";
import JobCard from "@/components/jobs/JobCard";
import { CustomSession } from "@/types/session";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

const JobsPage = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  const orgId = session.user.organization;

  return (
    <PageContainer mainMessage={`Job List for ${orgId}`}>
      <JobCard orgId={orgId} />
    </PageContainer>
  );
};

export default JobsPage;
