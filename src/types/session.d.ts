import { Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessLevel: number;
    role?: UserRoleLabel | null;
    organization?: string | null;
  };
}
