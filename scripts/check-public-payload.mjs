import { supabaseHome } from "../server/supabaseCatalog.ts";

const response = await supabaseHome();
if (!response) throw new Error("Supabase catalogue configuration is unavailable for the public payload verification.");

const bytes = Buffer.byteLength(JSON.stringify(response), "utf8");
const budget = 5_500_000;
console.log(`PUBLIC_CATALOGUE_PAYLOAD_BYTES=${bytes}`);

if (bytes >= budget) {
  throw new Error(`Public catalogue payload is ${bytes} bytes, exceeding the ${budget}-byte Netlify safety budget.`);
}
