import { extractPack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";
import path from "path";

const a5eDir = path.join("../", "../", "systems", "a5e", "packs");

const packs = await fs.readdir(a5eDir);
for (const pack of packs) {
  const stats = await fs.lstat(path.join(a5eDir, pack));
  if (stats.isFile()) continue;
  console.log("Unpacking " + pack);
  const dest = path.join("src", "packs-origin", pack);
  try {
    for (const file of await fs.readdir(dest)) {
      await fs.unlink(path.join(dest, file));
    }
  } catch (error) {
    if (error.code === "ENOENT") console.log("No files inside of " + pack);
    else console.log(error);
  }
  const src = path.join(a5eDir, pack);

  await extractPack(src, dest, { yaml: true, log: true });
}
