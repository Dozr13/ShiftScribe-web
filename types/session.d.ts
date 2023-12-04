import { Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    uid: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessLevel: number;
    role?: UserRoleLabel | null;
    organization?: string | null;
  };
}

export interface ShiftScribeUser extends User {
  uid: string;
  accessLevel?: number;
  organization?: string;
  displayName?: string;
  email?: string;
  role?: string;
}
