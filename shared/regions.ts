export type JaforyMarket = "uae" | "bangladesh" | "pakistan" | "india" | "global";

const gulfTimeZones = new Set([
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Qatar",
  "Asia/Kuwait",
  "Asia/Bahrain",
  "Asia/Muscat",
]);

export function marketForTimeZone(timeZone: string): JaforyMarket {
  if (timeZone === "Asia/Dhaka") return "bangladesh";
  if (timeZone === "Asia/Karachi") return "pakistan";
  if (timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta") return "india";
  if (gulfTimeZones.has(timeZone)) return "uae";
  return "global";
}
