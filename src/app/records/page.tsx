import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import LoadingScreen from "../loading";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageHeader from "../../components/containers/PageHeader";
import RecordsUI from "../../components/records/RecordsUI";
import { CustomSession } from "../../types/session";
import { options } from "../api/auth/[...nextauth]/options";

export const Records = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Records for: ${orgId}`} />
      <RecordsUI user={session.user} />
    </>
  );
};

export default Records;
