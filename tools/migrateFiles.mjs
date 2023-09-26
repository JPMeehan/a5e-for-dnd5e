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
  if (typeof src === "string") return source || "A5E Adventurer's Guide";
  else return source["name"];
}

/**
 * Transforms a full length word into its relevant abbreviation
 * @param {string} word The word to abbreviate
 * @returns {string} The abbreviation
 */
function abbr(word) {
  switch (word) {
    case "abjuration":
      return "abj";
    case "conjuration":
      return "con";
    case "divination":
      return "div";
    case "enchantment":
      return "enc";
    case "evocation":
      return "evo";
    case "illusion":
      return "ill";
    case "necromancy":
      return "nec";
    case "transmutation":
      return "trs";
    case "meleeWeaponAttack":
      return "mwak";
    case "rangedWeaponAttack":
      return "rwak";
    case "meleeSpellAttack":
      return "msak";
    case "rangedSpellAttack":
      return "rsak";
    case "savingThrow":
      return "save";
    case "abilityCheck":
      return "abil";
    case "temporaryHealing":
      return "temphp";
    case "spellLevel":
      return "level";
    case "fiveFeet":
      return "5";
    case "short":
      return "30";
    case "medium":
      return "60";
    case "long":
      return "120";
    default:
      return word;
  }
}

/**
 * Replaces UUID references to this module's compendiums
 * @param {string} uuid The source UUID
 * @returns {string}    The new UUID
 */
function fixUUIDrefs(uuid) {
  uuid = uuid.replace(
    "Compendium.a5e.a5e-spells",
    "Compendium.a5e-for-dnd5e.spells"
  );
  uuid = uuid.replace(
    "Compendium.a5e.a5e-rare-spells",
    "Compendium.a5e-for-dnd5e.spells"
  );
  return uuid;
}

/**
 *
 * @param {import('./types/a5e.mjs').a5eAction} action
 * @param {object} system
 * @returns {boolean} Validates that the action was completed
 */
function migrateAction(action, system) {
  const activation = {
    activation: {
      type: action?.activation?.type,
      cost: action?.activation?.type,
      condition: action?.activation?.reactionTrigger,
    },
    duration: {},
    cover: null,
    crewed: false,
    target: {
      value: null,
      width: null,
      units: "",
      type: "",
    },
    range: {
      value: null,
      long: null,
      units: "",
    },
    uses: {
      value: null,
      max: "",
      per: null,
      recovery: "",
    },
    consume: {
      type: "",
      target: null,
      amount: null,
    },
    ability: null,
    actionType: null,
    attackBonus: "",
    chatFlavor: "",
    critical: {
      threshold: null,
      damage: "",
    },
    damage: {
      parts: [],
      versatile: "",
    },
    formula: "",
    save: {
      ability: "",
      dc: null,
      scaling: "spell",
    },
  };
  updateTarget(activation, action);
  let rangeProp = "value";
  for (const r of action?.ranges) {
    const actionRange = r.range;
    if (actionRange === "self") continue;
    activation.range[rangeProp] = abbr(actionRange);
    if (rangeProp === "value") rangeProp = "long";
    else console.log("More than 2 ranges!");
  }
  for (p of action?.prompts) {
    activation.actionType = actionType(abbr(p.type), activation.actionType);
    if (activation.actionType === "abil") activation.ability = p.ability;
    if (activation.actionType === "save") activation.save.ability = p.ability;
  }
  Object.assign(system, activation);
  processRolls(action.rolls, action, system);
  if (system?.properties?.ver || system?.properties?.mnt) {
    dmg = system.damage;
    dmg.versatile = dmg.parts.pop(1)[0];
  }
  return true;
}

/**
 *
 * @param {*} rolls
 * @param {*} action
 * @param {*} system
 */
function processRolls(rolls, action, system) {}

/**
 * Prioritizes action types
 * @param {string} alternative  The incoming action type
 * @param {string} current      The standing action type
 * @returns {string}  The prioritized action type
 */
function actionType(alternative, current) {
  switch (current) {
    case null:
    case "save":
    case "util":
    case "other":
      return alternative;
    case "mwak":
    case "msak":
    case "rwak":
    case "rsak":
      return current;
    case "abil":
    case "heal":
      if (["mwak", "msak", "rwak", "rsak"].includes(alternative))
        return alternative;
      else return current;
    default:
      return alternative;
  }
}

/**
 * Updates the target
 * @param {object} t
 * @param {import("./types/a5e.mjs").a5eAction} action
 */
function updateTarget(t, action) {
  switch (action.area.shape) {
    case "circle":
    case "cylinder":
      t.type = "cylinder";
      t.value = action.area.radius;
      t.units = "ft";
      return;
    case "cone":
      t.type = "cone";
      t.value = action.area.length;
      t.units = "ft";
    case "cube":
    case "square":
      t.type = action.area.shape;
      t.value = action.area.width;
      t.units = "ft";
      return;
    case "line":
      t.type = "line";
      t.value = action.area.length;
      t.width = action.area.width;
      t.units = "ft";
      return;
    case "sphere":
      t.type = "sphere";
      t.value = action.area.radius;
      t.units = "ft";
      return;
  }
  switch (action.target.type) {
    case "self":
    case "creature":
    case "object":
      t.type = action.target.type;
      t.value = action.target.quantity;
    case "creatureObject":
      t.type = "enemy";
      t.value = action.target.quantity;
  }
}

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
