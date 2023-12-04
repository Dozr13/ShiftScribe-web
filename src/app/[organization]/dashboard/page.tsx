import PageHeader from "../../../components/containers/PageHeader";
import GreetingMessage from "../../../components/dashboard/GreetingMessage";

const Dashboard = async () => {
  return (
    <>
      <PageHeader
        mainMessage={`Welcome ShiftScribe!`}
        secondaryMessage={`Here is your Dashboard, which currently contains a brief summary of app capabilities, but will have notifications and other features in the future`}
      />
      <GreetingMessage />
    </>
  );
};

export default Dashboard;
