/**
 * NOTE: Access level 3 (sudo) is not recognized as a valid command.
 */
export enum PermissionLevel {
  "UNVERIFIED",
  "USER",
  "MANAGER",
  "ADMIN",
  "SUPERUSER",
}

export enum UserRole {
  Unverified = 0,
  User = 1,
  Manager = 2,
  Admin = 3,
  Superuser = 4,
}

export enum UserRoleLabel {
  Unverified = "Unverified",
  User = "User",
  Manager = "Manager",
  Admin = "Admin",
  Superuser = "Superuser",
}
