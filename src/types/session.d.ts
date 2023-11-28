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

export interface ShiftScribeUser extends User {
  accessLevel?: number;
  organization?: string;
  displayName?: string;
  email?: string;
  role?: string;
}
