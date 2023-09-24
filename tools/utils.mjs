import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";

/**
 * @typedef {Object} FolderTree
 * @param {string} name           The name of the folder
 * @param {string | null} parent  The ID of the parent folder, if it exists
 */

/**
 * Turns a pack name into the relevant folder setup
 * @param {string} pack Name of the pack being used
 * @returns {Promise<Map<string, FolderTree>>} Map of the folder relationships
 */
export async function prepFolders(pack) {
  const read_file = await fs.readFile(
    path.join("tools", "referenceFolders", pack + ".yml")
  );
  return yaml.load(read_file);
}

/**
 * Gets the folder name based based on relative information
 * @param {Map<string, FolderTree>} folderRef A folder map
 * @param {string} id                         ID of the document's folder
 * @param {number} depth                      How many layers of parent do we want to search
 * @returns {string} The name of the parent folder
 */
export function folderName(folderRef, id, depth) {
  f = folderRef[id];
  if (f.parent === null || depth === 0) return f.name;
  else if (depth > 0) return folderName(folderRef, f.parent, depth - 1);
  else return folderName(folderRef, f.parent, depth);
}

/**
 * Generate a random string ID of a given requested length.
 * Copied from core foundry
 * @param {number} length    The length of the random ID to generate
 * @return {string}          Return a string containing random letters and numbers
 */
export function randomID(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const r = Array.from({ length }, () => (Math.random() * chars.length) >> 0);
  return r.map((i) => chars[i]).join("");
}

/**
 *
 * Composes a UUID from pack, ID, and type information
 * @param {string} pack Pack the document is found in
 * @param {string} id   The ID of the document
 * @param {string} type The type of document (e.g. Actor or Item)
 * @returns The UUID of the item and its compendium
 */
export function uuid(pack, id, type) {
  const MODULE_ID = process.cwd();
  return ["Compendium", MODULE_ID, pack, type, id].join(".");
}
