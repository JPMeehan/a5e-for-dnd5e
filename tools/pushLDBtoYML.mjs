import { extractPack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";
import path from "path";
import buildReferenceFolder from "./buildReferenceFolder.mjs";

const packs = await fs.readdir("packs");
for (const pack of packs) {
  if (pack === ".gitattributes") continue;
  console.log("Unpacking " + pack);
  const directory = path.join("src", "packs", pack);
  try {
    for (const file of await fs.readdir(directory)) {
      await fs.unlink(path.join(directory, file));
    }
  } catch (error) {
    if (error.code === "ENOENT") console.log("No files inside of " + pack);
    else console.log(error);
  }
  const src = path.join("packs", pack);
  const dest = path.join("src", "packs", pack);

  await extractPack(src, dest, { yaml: true, log: true });

  buildReferenceFolder(pack);
}
