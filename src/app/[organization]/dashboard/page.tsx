import { getServerSession } from "next-auth";
import PageHeader from "../../../components/containers/PageHeader";
import GreetingMessage from "../../../components/dashboard/GreetingMessage";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { getUserAccessLevel } from "../../../utils/accessLevelUtils";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const accessLevel = getUserAccessLevel(session);

  return (
    <>
      {accessLevel < 2 ? (
        <PageHeader mainMessage={`Welcome ShiftScribe!`} />
      ) : (
        <PageHeader
          mainMessage={`Welcome ShiftScribe!`}
          secondaryMessage={`Here is your Dashboard, which currently contains a brief summary of app capabilities, but will have notifications and other features in the future`}
        />
      )}
      <GreetingMessage accessLevel={accessLevel} />
    </>
  );
};

export default Dashboard;
