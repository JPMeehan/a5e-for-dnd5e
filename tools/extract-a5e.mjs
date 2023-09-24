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

/**
fvtt package workon a5e --type "System"
rm -rf ./src/packs-origin/*
for FILE in ../../systems/a5e/packs/*.db 
do 
    echo ${FILE:24}
    db=${FILE:24:${#FILE}-27}
    [[ $db = 'monsters' ]] && t='Actor' || t='Item'
    # echo $t
    fvtt package unpack -n $db --out ./src/packs-origin/$db --in ../../systems/a5e/packs/$db --nedb -t $t
done

# fvtt package unpack -n $1 --outputDirectory ./src/packs/$1
# python ./tools/buildReferenceFolder.py $1
 */
