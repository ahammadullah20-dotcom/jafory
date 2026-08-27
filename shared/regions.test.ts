import { describe, expect, it } from "vitest";
import { marketForTimeZone } from "./regions";

describe("Jafory region defaults", () => {
  it("defaults Gulf-region time zones to the Arabic UAE experience", () => {
    expect(marketForTimeZone("Asia/Dubai")).toBe("uae");
    expect(marketForTimeZone("Asia/Riyadh")).toBe("uae");
    expect(marketForTimeZone("Asia/Doha")).toBe("global");
    expect(marketForTimeZone("Asia/Qatar")).toBe("uae");
  });

  it("defaults Bangladesh, Pakistan, India and all other regions appropriately", () => {
    expect(marketForTimeZone("Asia/Dhaka")).toBe("bangladesh");
    expect(marketForTimeZone("Asia/Karachi")).toBe("pakistan");
    expect(marketForTimeZone("Asia/Kolkata")).toBe("india");
    expect(marketForTimeZone("Europe/London")).toBe("global");
  });
});
