import { CustomSession } from "../../types/session";

export function getUserAccessLevel(session: CustomSession | null): number {
  return session?.user?.accessLevel ?? 0;
}
