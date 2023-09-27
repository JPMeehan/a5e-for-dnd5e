import { promises as fs } from "fs";
import path from "path";
import { randomID } from "./utils.mjs";
import yaml from "js-yaml";
import ReferenceFolder from "./ReferenceFolder.mjs";

const targetPack = "spells";
const packPath = path.join("src", "packs", targetPack);

const packs = await fs.readdir(packPath);

class Folder {
  constructor(name, parentFolder = null, color = null) {
    this.name = name;
    this.color = color;
    this.flags = {};
    this.sort = 0;
    this.sorting = "a";
    this._type = "Item";
    this.folder = parentFolder;
    this._id = randomID();
    this._key = "!folders!" + this._id;
  }

  /**
   * Returns the folder as an object but with the _type replaced by type
   * @returns {object} The folder, as an object
   */
  get toObject() {
    const out = { ...this };
    out["type"] = this._type;
    delete out._type;
    return out;
  }
}

async function createFolders() {
  const outerFolders = ["Spells", "Rare Spells"];
  const innerFolders = [
    "Cantrip",
    "1st level",
    "2nd level",
    "3rd level",
    "4th level",
    "5th level",
    "6th level",
    "7th level",
    "8th level",
    "9th level",
  ];
  for (const o of outerFolders) {
    const outer = new Folder(o);
    let filename = outer.name.replace(" ", "_") + "_" + outer._id + ".yml";
    await fs.writeFile(
      path.join(packPath, filename),
      yaml.dump(outer.toObject, { indent: 2 }),
      { flag: "w" }
    );
    for (const i of innerFolders) {
      const inner = new Folder(i, outer._id);
      filename = inner.name.replace(" ", "_") + "_" + outer._id + ".yml";
      await fs.writeFile(
        path.join(packPath, filename),
        yaml.dump(inner.toObject, { indent: 2 })
      );
    }
  }
  await ReferenceFolder.build(targetPack);
}
console.warn("One");
try {
  await fs.access(path.join("tools", "referenceFolders", "spells.yml"));
} catch {
  await createFolders();
}

const spells = Array.from("0123456789");
const rareSpells = Array.from("0123456789");

const folders = new ReferenceFolder(targetPack);

await folders.prepFolders();

console.warn("Two");
for (const [id, f] of Object.entries(folders.compendium)) {
  if (!f.parent) continue;
  const parentName = folders.getFolderName(f, 1);
  const currentName = f.name;
  const level = currentName !== "Cantrip" ? parseInt(currentName[0]) : 0;
  if (parentName === "Spells") spells[level] = id;
  else rareSpells[level] = id;
  console.warn(id);
}

for (const p of packs) {
  console.warn(p);
  const read_file = await fs.readFile(path.join(packPath, p));
  const data = yaml.load(read_file);
  if (data.type !== "spell") continue;
  if (data.flags["a5e-for-dnd5e"]?.rareSpell) {
    data.folder = rareSpells[data.system.level];
  } else data.folder = spells[data.system.level];
  await fs.writeFile(
    path.join(packPath, p),
    yaml.dump(data, { indent: 2 }),
    "utf-8"
  );
}
