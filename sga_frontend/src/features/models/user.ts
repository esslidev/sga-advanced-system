export type UserRole = "standard" | "admin";

export const UserRole = {
  standard: "standard" as UserRole,
  admin: "admin" as UserRole,
};

export type User = {
  id: string;
  CIN: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
