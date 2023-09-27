import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";

/**
 * @typedef {object} Document
 * @property {string} name    The name of the document
 * @property {string} parent  The ID of the document's containing folder
 */

/**
 * A clean mapping of the folder relationships within a FVTT compendium pack
 */
export default class ReferenceFolder {
  /** @type {string} */
  #pack;

  /**  @type {Record<string, Document>} */
  #compendium;
  /**
   * Sets the pack the ReferenceFolder is for.
   * Must be followed by prepFolders()
   * @param {string} pack The pack this ReferenceFolder points to
   */
  constructor(pack) {
    this.#pack = pack;
  }

  /**
   * Gets the name of the pack
   * @return {string} The name of the pack
   */
  get pack() {
    return this.#pack;
  }

  /**
   * Fetches the loaded reference folder
   * @return {Record<string, Document>} The loaded reference folder
   */
  get compendium() {
    return this.#compendium;
  }

  /**
   * Secondary initialization that should be run after the constructor
   */
  async prepFolders() {
    const read_file = await fs.readFile(
      path.join("tools", "referenceFolders", this.pack + ".yml")
    );
    this.#compendium = yaml.load(read_file);
  }

  /**
   * Gets the folder name based based on relative information
   * @param {string} id     ID of the document's folder
   * @param {number} depth  How many layers of parent to look through
   * @returns {string} The name of the parent folder
   */
  getFolderName(id, depth) {
    const f = this.compendium[id];
    if (!f) console.log(id);
    if (f.parent === null || depth === 0) return f.name;
    else if (depth > 0) return this.getFolderName(f.parent, depth - 1);
    else return this.getFolderName(f.parent, depth);
  }

  /**
   * Builds a .yml file based on the extracted compendium files
   * @param {string} pack The name of the compendium to build a reference folder from
   */
  static async build(pack) {
    const folderStruct = {};
    const packList = await fs.readdir(path.join("src", "packs", pack));
    for (const p of packList) {
      const file = await fs.readFile(
        path.join("src", "packs", pack, p),
        "utf8"
      );
      const data = yaml.load(file);
      if (!data.hasOwnProperty("type")) continue;
      folderStruct[data._id] = {
        name: data.name,
        parent: data.folder,
      };
    }
    console.warn("FOOBAR");
    await fs.writeFile(
      path.join("tools", "referenceFolders", pack + ".yml"),
      yaml.dump(folderStruct, null, 2).trim(),
      { encoding: "utf-8", flag: "w" }
    );
  }
}
