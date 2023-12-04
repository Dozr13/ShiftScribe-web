import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CustomSession } from "../../../../types/session";
import RecordsCard from "../../../components/card/RecordsCard";
import PageHeader from "../../../components/containers/PageHeader";
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
      <PageHeader
        mainMessage={`Records kept for Organization: ${orgId}`}
        secondaryMessage={`Download, Remove, and View Records`}
      />
      <RecordsCard orgId={orgId} />
    </>
  );
};

export default Records;
