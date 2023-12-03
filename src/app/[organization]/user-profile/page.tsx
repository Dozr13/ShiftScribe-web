import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CustomSession } from "../../../../types/session";
import { options } from "../../api/auth/[...nextauth]/options";

const TempMember = async () => {
  const session = (await getServerSession(options)) as CustomSession;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/temp-member");
  }

  // console.log("SESSION", session, typeof session);
  return (
    <div>
      <h1>TEMP MEMBER WOOT</h1>
      <p>{session?.user?.uid}</p>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.accessLevel}</p>
      <p>{session?.user?.role}</p>
      <p>{session?.user?.organization}</p>
    </div>
  );
};

export default TempMember;
