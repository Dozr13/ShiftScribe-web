import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CustomSession } from "../../../../types/session";
import PageHeader from "../../../components/containers/PageHeader";
import RecordsCard from "../../../components/records/RecordsCard";
import routes from "../../../utils/routes";
import { options } from "../../api/auth/[...nextauth]/options";

const Records = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session || session.user.accessLevel <= 1 || !session.user.organization) {
    redirect(routes.profile(session.user.organization));
  }

  const orgId = session.user.organization;

  return (
    <>
      <PageHeader mainMessage={`Records for: ${orgId}`} />
      <RecordsCard orgId={orgId} />
    </>
  );
};

export default Records;
