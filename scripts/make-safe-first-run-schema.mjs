import { readFile, writeFile } from "node:fs/promises";

const root = "/home/ubuntu/jafory-affiliate-hub";
const sourcePath = `${root}/docs/JAFORY_V2_SUPABASE_SCHEMA.sql`;
const outputPath = `${root}/docs/JAFORY_V2_SUPABASE_SCHEMA_FIRST_RUN.sql`;
const source = await readFile(sourcePath, "utf8");
const destructiveTriggerBlock = `drop trigger if exists on_auth_user_created on auth.users;\ncreate trigger on_auth_user_created`;
const safeTriggerBlock = `create trigger on_auth_user_created`;
if (!source.includes(destructiveTriggerBlock)) throw new Error("Expected drop-trigger block not found");
let safe = source.replace(destructiveTriggerBlock, safeTriggerBlock);
safe = safe.replace("-- Jafory V2 clean Supabase schema\n", "-- Jafory V2 clean Supabase schema — safe first run for a new project\n");
safe = safe.replace("-- It creates structure only; it does not copy users, passwords, sessions, reviews, or old data.\n", "-- It creates structure only; it does not copy users, passwords, sessions, reviews, or old data.\n-- Run this first-run variant only once in the NEW Supabase project.\n");
if (/^\\s*drop\\s+/im.test(safe)) throw new Error("Safe schema still contains a DROP statement");
await writeFile(outputPath, safe);
console.log(JSON.stringify({ outputPath, bytes: Buffer.byteLength(safe), hasDrop: /^\\s*drop\\s+/im.test(safe), directTrigger: safe.includes("create trigger on_auth_user_created") }, null, 2));
