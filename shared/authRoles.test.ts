import { describe, expect, it } from "vitest";
import { resolveJaforyRole } from "./authRoles";

describe("Jafory administrator assignment", () => {
  it("always assigns the configured project owner as administrator", () => {
    expect(resolveJaforyRole("owner-open-id", "owner-open-id", "user")).toBe("admin");
  });

  it("does not grant administrator rights to newly signed-in public users", () => {
    expect(resolveJaforyRole("visitor-open-id", "owner-open-id")).toBe("user");
  });

  it("retains a role explicitly granted to an existing administrator", () => {
    expect(resolveJaforyRole("approved-admin", "owner-open-id", "admin")).toBe("admin");
  });
});
