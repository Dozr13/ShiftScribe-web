import GreetingMessage from "../../components/dashboard/GreetingMessage";

const Dashboard = async () => {
  // const session = (await getServerSession(options)) as CustomSession;

  // if (!session) {
  //   redirect("/signin");
  // }
  console.log("IN DASHBOARD");

  return (
    <>
      <GreetingMessage />
    </>
  );
};

export default Dashboard;
