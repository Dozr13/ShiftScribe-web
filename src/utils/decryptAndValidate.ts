import jwt from "jsonwebtoken";

export const decryptAndValidate = async (token: string): Promise<any> => {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
  } catch (error) {
    console.error("Failed to decrypt or validate token:", error);
    throw error;
  }
};
