import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Jafory protected procedures", () => {
  it("rejects unauthenticated product review submissions before writing data", async () => {
    const caller = appRouter.createCaller(makeContext(null));
    await expect(caller.review.create({ productId: 1, rating: 5, body: "This is a sufficiently detailed authentic shopper review.", language: "en" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects non-administrators from the control-panel APIs", async () => {
    const caller = appRouter.createCaller(makeContext({ id: 12, openId: "member", name: "Member", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.products.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
