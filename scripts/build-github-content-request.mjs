import { readFileSync, writeFileSync } from "node:fs";

const [archivePath, blobSha, outputPath] = process.argv.slice(2);
if (!archivePath || !blobSha || !outputPath) {
  throw new Error("Usage: node build-github-content-request.mjs <archive-path> <existing-sha> <output-path>");
}

const content = readFileSync(archivePath).toString("base64");
writeFileSync(outputPath, JSON.stringify({
  message: "Deploy corrected self-hosted Jafory Netlify source",
  content,
  sha: blobSha,
  branch: "main",
}));
