// data/auth.tsx
import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "../../models/User";
import { decryptAndValidate } from "../utils/decryptAndValidate";
import { ref, get } from "firebase/database";
import { firebaseDatabase } from "../services/firebase";

export const getCurrentUser = cache(async () => {
  const token = cookies().get("AUTH_TOKEN");

  if (!token) {
    throw new Error("No auth token found");
  }

  const decodedToken = await decryptAndValidate(token.value);
  const userId = decodedToken.id;

  // Fetch user data from /users
  const userRef = ref(firebaseDatabase, `users/${userId}`);
  const userSnapshot = await get(userRef);

  if (!userSnapshot.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnapshot.val();

  // Fetch access level from /orgs/members
  const memberRef = ref(
    firebaseDatabase,
    `orgs/${userData.organization}/members/${userId}`,
  );
  const memberSnapshot = await get(memberRef);

  if (!memberSnapshot.exists()) {
    throw new Error("Member not found in organization");
  }

  const memberData = memberSnapshot.val();

  return new User(
    userId,
    userData.displayName,
    userData.email,
    userData.organization,
    memberData.accessLevel,
  );
});
