import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";

const targetPack = process.argv[2];
const origin = path.join("src", "packs-origin", targetPack);
const packPath = path.join("src", "packs", targetPack);
const packList = await fs.readdir(origin);

// dnd5e item types = ["weapon", "equipment", "consumable", "tool", "loot", "background", "class", "subclass", "spell", "feat", "backpack"]
// a5e item types = ["feature", "maneuver", "object", "spell", "background", "culture", "destiny"]

/**
 *
 * @param {string | object} source The source to flatten
 * @returns {string} The flattened source
 */
function flattenSource(source) {
  return;
}

/**
 *
 * @param {*} word
 * @returns {string}
 */
function abbr(word) {
  return;
}

/**
 *
 * @param {string} s
 * @returns {string}
 */
function fixUUIDrefs(s) {
  return;
}

/**
 *
 * @param {object} action
 * @param {object} system
 * @returns
 */
function migrateAction(action, system) {
  return false;
}

/**
 *
 * @param {*} rolls
 * @param {*} action
 * @param {*} system
 */
function processRolls(rolls, action, system) {}

/**
 *
 * @param {string} alternative
 * @param {string} original
 * @returns {string}
 */
function actionType(alternative, original) {
  return;
}

/**
 *
 * @param {*} t
 * @param {object} action
 */
function updateTarget(t, action) {}

/**
 *
 * @param {object} system
 * @returns
 */
function migrateMonster(system) {
  return;
}

/**
 *
 * @param {object} system
 * @returns
 */
function migrateFeature(system) {
  return;
}

/**
 *
 * @param {object} system
 * @returns
 */
function migrateManeuver(system) {
  return;
}

/**
 *
 * @param {object} system
 * @returns
 */
function migrateObject(system) {
  return;
}

function splitPrice(price) {
  return;
}

/**
 *
 * @param {string} formula
 * @returns {number}
 */
function baseAC(formula) {
  return;
}

/**
 *
 * @param {object} system
 * @returns {string}
 */
function weaponType(system) {
  return;
}

function weaponProperties(system, description) {
  return;
}

function migrateSpell(system) {
  return;
}

function migrateBackground(system) {
  return;
}

function migrateCulture(system) {
  return;
}

function migrateDestiny(system) {
  return;
}

for (const p of packList) {
}
