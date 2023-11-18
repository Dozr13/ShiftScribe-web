import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "./firebase";

interface UserSignUpProps {
  email: string;
  password: string;
}

const auth = getAuth(app);

export default async function signUp({ email, password }: UserSignUpProps) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
