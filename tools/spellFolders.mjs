import { promises as fs } from "fs";
import path from "path";
import { randomID } from "./utils.mjs";
import yaml from "js-yaml";
import buildReferenceFolder from "./buildReferenceFolder.mjs";

const targetPack = "spells";
const packPath = path.join("src", "packs", targetPack);

const packs = await fs.readdir(packPath);

class Folder {
  constructor(name, color = null, parentFolder = null) {
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
  for (const folder of outerFolders) {
    const outer = new Folder(folder);
    let filename = outer.name.replace(" ", "_") + "_" + outer._id + ".json";
    console.log({ ...outer });
    const outerFolder = await fs.writeFile(
      path.join(packPath, filename),
      yaml.dump({ ...outer }, { indent: 2 })
    );
    // buildReferenceFolder(targetPack)
  }
}

const spellReferenceExists = fs.access(
  path.join("tools", "referenceFolders", "spells.json")
);
// if (!spellReferenceExists) createFolders();

createFolders();

const spells = Array.from("0123456789");
const rareSpells = Array.from("0123456789");
