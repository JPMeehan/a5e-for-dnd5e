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

/**
 *
 * @param {string} src  The abbreviated string for a source
 * @returns {string}    The full length name of the source
 */
export function expandSource(src) {
  switch (src) {
  }
  return src;
}

/**
 *
 * @param {string} classID  The parent class's name
 * @returns {string}        The name of the subclass feature
 */
export function subclassHeader(classID) {
  switch (classID) {
  }
  return "Item Grant";
}
