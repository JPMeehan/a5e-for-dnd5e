import { promises as fs, read } from "fs";
import path from "path";

export async function prepFolders(pack) {
  const read_file = await fs.readFile(
    path.join("tools", "referenceFolders", pack + ".json")
  );
  return JSON.parse(read_file);
}

export function folderName(folderRef, id, depth) {
  f = folderRef[id];
  if (f.parent === null || depth === 0) return f.name;
  else if (depth > 0) return folderName(folderRef, f.parent, depth - 1);
  else return folderName(folderRef, f.parent, depth);
}

// literally copying from core foundry
export function randomID(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const r = Array.from({ length }, () => (Math.random() * chars.length) >> 0);
  return r.map((i) => chars[i]).join("");
}

export function uuid(pack, id, type) {
  const MODULE_ID = process.cwd();
  return ["Compendium", MODULE_ID, pack, type, id].join(".");
}
