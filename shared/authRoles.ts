export type JaforyRole = "admin" | "user";

export function resolveJaforyRole(openId: string, ownerOpenId: string, existingRole?: JaforyRole): JaforyRole {
  if (openId === ownerOpenId) return "admin";
  if (existingRole === "admin") return "admin";
  return "user";
}
