import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const mapText = await readFile(join(root, "shared/storageImageMap.ts"), "utf8");
const entries = [...mapText.matchAll(/^\s*"([^"]+)":\s*"([^"]+)"/gm)].map(([, slug, source]) => ({ slug, source }));
const mediaNames = new Set(await readdir(join(root, "client/public/jafory-media")));

const report = entries.map(({ slug, source }) => {
  const fileName = source.split("/").pop() ?? "";
  const rejectedExpansion = /\/expansion-/i.test(source);
  const packaged = mediaNames.has(fileName);
  return { slug, source, fileName, rejectedExpansion, packaged, safe: packaged && !rejectedExpansion };
});

const summary = {
  total: report.length,
  safe: report.filter(item => item.safe).length,
  rejectedExpansion: report.filter(item => item.rejectedExpansion).length,
  missingPackageFile: report.filter(item => !item.packaged).length,
  unresolved: report.filter(item => !item.safe).map(item => item.slug),
};

console.log(JSON.stringify(summary, null, 2));
