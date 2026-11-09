export type AppRole = "ADMIN" | "SALES" | "CUSTOMER";
export function canAccessAdmin(role: string): boolean {
  return role === "ADMIN" || role === "SALES";
}
export function ownsCustomer(
  userId: string,
  customerUserId: string | null,
): boolean {
  return customerUserId !== null && userId === customerUserId;
}
