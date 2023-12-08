import admin from "../../services/firebaseAdmin";

export const deleteUserAction = async (userId: string) => {
  try {
    await admin.auth().deleteUser(userId);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
