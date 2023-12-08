import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types with custom session properties.
   */
  interface Session {
    user: {
      uid: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessLevel: number;
      role?: string | null;
      organization?: string | null;
      darkMode?: boolean;
    };
  }
}
