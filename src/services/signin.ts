import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

interface UserSignInProps {
  email: string;
  password: string;
}

const auth = getAuth(app);

export default async function signIn({ email, password }: UserSignInProps) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
