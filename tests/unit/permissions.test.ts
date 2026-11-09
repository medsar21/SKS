import { describe, expect, it } from "vitest";
import { canAccessAdmin, ownsCustomer } from "@/lib/permissions";
describe("contrôle des accès", () => {
  it("réserve l'administration aux rôles autorisés", () => {
    expect(canAccessAdmin("ADMIN")).toBe(true);
    expect(canAccessAdmin("SALES")).toBe(true);
    for (const role of ["CUSTOMER", "admin", "", "UNKNOWN"])
      expect(canAccessAdmin(role)).toBe(false);
  });
  it("refuse l'accès inter-clients et les comptes non liés", () => {
    expect(ownsCustomer("synthetic-a", "synthetic-a")).toBe(true);
    expect(ownsCustomer("synthetic-a", "synthetic-b")).toBe(false);
    expect(ownsCustomer("synthetic-a", null)).toBe(false);
  });
});
