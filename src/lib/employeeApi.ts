import {
  DataSnapshot,
  QueryConstraint,
  child,
  get,
  limitToFirst,
  onValue,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { OrgEmployee } from "../../types/data";
import { firebaseDatabase } from "../services/firebase";

/**
 * Delete data at a given path.
 * @param Path
 * @returns Promise<void>
 */
export const deleteData = (Path: string): Promise<void> => {
  return remove(ref(firebaseDatabase, Path));
};

/**
 * Determine if the current path contains data.
 * @param Path string
 * @returns Promise<boolean>
 */
export const exists = async (Path: string): Promise<boolean> => {
  const Query = query(ref(firebaseDatabase, Path), limitToFirst(1));
  let Res = await get(Query);
  return Res.exists();
};

/**
 * Fetches employees for a given organization.
 * @param orgId The organization ID.
 * @returns An array of Employee objects.
 */
export const fetchEmployeeData = async (
  orgId: string,
): Promise<OrgEmployee[]> => {
  const orgMembersSnapshot = await get(
    child(ref(firebaseDatabase), `orgs/${orgId}/members`),
  );

  if (!orgMembersSnapshot.exists()) {
    return [];
  }

  const membersData = orgMembersSnapshot.val();
  const memberIds = Object.keys(membersData);

  const employeesArray: OrgEmployee[] = await Promise.all(
    memberIds.map(async (memberId) => {
      const userSnapshot = await get(
        child(ref(firebaseDatabase), `users/${memberId}`),
      );
      const userData = userSnapshot.val();

      return {
        id: memberId,
        ...membersData[memberId],
        userData,
      };
    }),
  );

  return employeesArray;
};

/**
 * Get the current time since unix epoch (milliseconds)
 * @returns number
 */
export const now = (): number => {
  return Date.now();
};

/**
 * Create a new child at the specified path with the provided data.
 * @param Path The database path where the new child will be added.
 * @param Data The data to be set for the new child.
 * @returns The unique key of the newly created child.
 */
export const pushData = (
  Path: string,
  Data: Record<string, unknown>,
): string | null => {
  const newChildRef = push(ref(firebaseDatabase, Path));
  set(newChildRef, Data);
  return newChildRef.key;
};

/**
 * Query the database.
 * @param Path
 * @param Data
 * @returns Promise<DataSnapshot>
 */
export const queryData = (
  Path: string,
  ...Data: QueryConstraint[]
): Promise<DataSnapshot> => {
  const Query = query(ref(firebaseDatabase, Path), ...Data);
  return get(Query);
};

/**
 * Attempt to overwrite the database at a given path.
 * @param Path
 * @param Data Object
 * @returns Promise<void>
 */
export const rawWrite = (
  Path: string,
  Data: Record<string, unknown> | null,
): Promise<void> => {
  return set(ref(firebaseDatabase, Path), Data);
};

/**
 * Attempt to fetch (once) the data at a given path.
 * @param Path
 * @returns Promise<DataSnapshot>
 */
export const readData = (Path: string): Promise<DataSnapshot> => {
  return get(child(ref(firebaseDatabase), Path));
};

/**
 * Attempt to write to the database given a path. If this path contains data, the promise will reject.
 * @param Path
 * @param Data Object
 */
export const safeWrite = (
  Path: string,
  Data: Record<string, unknown>,
): Promise<void> => {
  return new Promise<void>((res, rej) => {
    readData(Path).then((Res) => {
      if (Res.toJSON() !== null)
        rej(new Error("Data already exists at path: " + Path));
      else res(rawWrite(Path, Data));
    });
  });
};

/**
 * Safely update data at a given path.
 * @param Path
 * @param Data
 * @returns
 */
export const updateData = (
  Path: string,
  Data: Record<string, unknown>,
): Promise<void> => {
  return update(ref(firebaseDatabase, Path), Data);
};

/**
 * Listen for changes at a specified path.
 * @param Path
 * @param Callback (DataSnapshot) -> Void
 * @returns Unsubscribe
 */
export const watchData = (
  Path: string,
  Callback: (Snapshot: DataSnapshot) => void,
): (() => void) => {
  const Ref = ref(firebaseDatabase, Path);
  const unsubscribe = onValue(Ref, Callback);
  return unsubscribe;
};
