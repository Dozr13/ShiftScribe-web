import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  return <Dashboard />;
};

export default Dashboard;
