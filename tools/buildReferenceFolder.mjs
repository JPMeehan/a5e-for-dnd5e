import { promises as fs } from "fs";
import yaml from "js-yaml";
import path from "path";

export default async function buildReferenceFolder(pack) {
  // folderStruct = {"_id": {"name": "foobar", "parent": "_id"}}
  const folderStruct = {};
  const packList = await fs.readdir(path.join("src", "packs", pack));
  for (const p of packList) {
    const file = await fs.readFile(path.join("src", "packs", pack, p), "utf8");
    const data = yaml.load(file);
    if (!data.hasOwnProperty("type")) continue;
    folderStruct[data._id] = {
      name: data.name,
      parent: data.folder,
    };
  }
  await fs.writeFile(
    path.join("tools", "referenceFolders", pack + ".json"),
    yaml.dump(folderStruct, null, 2),
    "utf-8"
  );
}
