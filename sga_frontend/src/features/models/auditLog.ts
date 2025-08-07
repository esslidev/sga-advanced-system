import type { User } from "./user";

export type AuditAction =
  | "signUp"
  | "signIn"
  | "signOut"
  | "userDeleted"
  | "visitorCreated"
  | "visitorUpdated"
  | "visitorDeleted"
  | "visitCreated"
  | "visitUpdated"
  | "visitDeleted";

export const AuditAction = {
  signUp: "signUp" as AuditAction,
  signIn: "signIn" as AuditAction,
  signOut: "signOut" as AuditAction,
  userDeleted: "userDeleted" as AuditAction,
  visitorCreated: "visitorCreated" as AuditAction,
  visitorUpdated: "visitorUpdated" as AuditAction,
  visitorDeleted: "visitorDeleted" as AuditAction,
  visitCreated: "visitCreated" as AuditAction,
  visitUpdated: "visitUpdated" as AuditAction,
  visitDeleted: "visitDeleted" as AuditAction,
};

export type auditLog = {
  id: string;
  action: AuditAction;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
