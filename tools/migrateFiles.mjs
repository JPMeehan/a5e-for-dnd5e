import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";

const targetPack = process.argv[2];
const origin = path.join("src", "packs-origin", targetPack);
let packPath = path.join("src", "packs", targetPack);
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
 * @param {import('./types/a5e.mjs').Action} action
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
  for (const r of Object.values(action.ranges || {})) {
    const actionRange = r.range;
    if (actionRange === "self") continue;
    activation.range[rangeProp] = abbr(actionRange);
    if (rangeProp === "value") rangeProp = "long";
    else console.log("More than 2 ranges!");
  }
  for (const p of Object.values(action.prompts || {})) {
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
 * @param {import("./types/a5e.mjs").Action} action
 */
function updateTarget(t, action) {
  switch (action.area?.shape) {
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
  switch (action.target?.type) {
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

/**
 * Breaks up the pricing
 * @param {number | string} price                   The string price from a5e
 * @returns {{value: number, denomination: string}} The price object for dnd5e
 */
function splitPrice(price) {
  if (typeof price === "number") return { value: price, denomination };
  const s = price.split(" ");
  const p = {
    value: parseInt(s[0].replace(",", "")),
    denomination: s.length === 2 ? s[1] : "gp",
  };
  return p;
}

/**
 *
 * @param {string} formula
 * @returns {number} The b
 */
function baseAC(formula) {
  const parsed = parseInt(formula);
  if (parsed === NaN) return 0;
  else return parsed;
}

/**
 *
 * @param {object} system
 * @returns {string}
 */
function weaponType(system) {
  let wepRange = "";
  for (a of system) {
    for (r of a.rolls) {
      switch (abbr(r.attackType)) {
        case "mwak":
          wepRange = "M";
          break;
        case "rwak":
          wepRange = "R";
          break;
      }
    }
  }
  if (!wepRange) return "";
  if (system.weaponProperties.includes("simple")) return "simple" + wepRange;
  else return "martial" + wepRange;
}

/**
 *
 * @param {object} system
 * @returns {string}
 */
function getBaseItem(system) {
  return "";
}

/**
 *
 * @param {object} system
 * @param {object} description
 * @returns {Record<string, boolean|number>}
 */
function weaponProperties(system, description) {
  /** @type {Array<string>} */
  const props = system.weaponProperties;
  const p = {};
  /**
   * Renames
   * Missing o5e: Firearm, Focus, Reload, Special
   */
  if (props.dualWielding) p.lgt = true;
  if (props.finesse) p.fin = true;
  if (props.heavy) p.hvy = true;
  if (props.loading) p.lod = true;
  if (props.range) p.amm = true;
  if (props.reach) p.rch = true;
  if (props.rebounding) p.ret = true;
  if (props.thrown) p.thr = true;
  if (props.twoHanded) p.two = true;
  if (props.versatile) p.ver = true;
  if (props.burn) {
    s +=
      "<p><b>Burn:</b> The fire fusil only deals a base of 1 fire damage, but the target also catches on fire. It takes 1d10 fire damage at the start of each of its turns, and can end this damage by using its action to extinguish the flames.</p>";
  }
  if (props.breaker) {
    s +=
      "<p><b>Breaker:</b> This weapon deals double damage to unattended objects, such as doors and walls. If this property only applies to a specific type of material, such as wood, it is stated in parenthesis after this property.</p>";
  }
  if (props.compounding) {
    p.cmp = true;
    s +=
      "<p><b>Compounding:</b> You use only your Strength modifier for attack and damage rolls made with this weapon.</p>";
  }
  if (props.defensive) {
    s +=
      "<p><b>Defensive:</b> This weapon is designed to be used with a shield of the stated degree or lighter (light, medium, or heavy). When you make an attack with this weapon and are using a shield designed for it, you can use a bonus action to either make an attack with your shield or increase your Armor Class by 1 until the start of your next turn.</p>";
  }
  if (props.flamboyant) {
    s +=
      "<p><b>Flamboyant:</b> Creatures have disadvantage on saving throws made to resist being distracted by this weapon, and you have advantage on Intimidation or Performance checks made with the use of it.</p>";
  }
  if (props.handMounted) {
    s +=
      "<p><b>Hand-Mounted:</b> This weapon is affixed to your hand. You can do simple activities such as climbing a ladder while wielding this weapon, and you have advantage on saving throws made to resist being disarmed. You cannot use a hand that is wielding a hand-mounted weapon to do complex tasks like picking a pocket, using thieves’ tools to bypass a lock, or casting spells with seen components.</p>";
  }
  if (props.inaccurate) {
    s +=
      "<p><b>Inaccurate:</b> Grenades do not add your ability score modifier to damage.</p><p>When you throw a grenade, choose a creature or an unoccupied 5-ft. space. (If the creature occupies more than one 5-ft. space, choose one of the squares it occupies.) Make an attack roll against AC 10. If the attack misses, the grenade veers off course, missing by 5 ft. in a random direction, or 10 ft. if the target area was at long range. Each creature in a 5-ft. radius of where the grenade lands must succeed a DC 12 Dexterity save or else take 3d6 bludgeoning damage.</p><p>If you targeted a creature and the attack roll is a critical hit, the grenade directly strikes that creature. The grenade does double damage to that creature without allowing a save. Other creatures in the area are affected normally.</p>";
  }
  if (props.mounted) {
    p.mnt = true;
    s +=
      "<p><b>Mounted:</b> This weapon deals the damage listed in parenthesis when you are wielding it while mounted.</p>";
  }
  if (props.muzzleLoading) {
    p.fir = true;
    s +=
      "<p><b>Muzzle Loading:</b> After each shot, it takes an action or bonus action to reload the weapon.</p><p>Sometimes irregular packing of a barrel causes the weapon not to function properly. Whenever you roll a natural 1 on an attack roll with a firearm, the gun misfires – nothing happens, and the gun remains loaded. Clearing the barrel requires an action, and makes the gun safe to use. You can continue using the misfired gun without clearing the barrel, but attacks with the weapon have disadvantage , and if you roll a second natural 1, the weapon has a mishap and explodes. It is destroyed and deals its base damage die to you (e.g., 2d8 with a musket).</p><p>Magical guns never misfire or have mishaps.</p>";
  }
  if (props.parrying) {
    s +=
      "<p><b>Parrying:</b> When you are wielding this weapon and you are not using a shield, once before your next turn you can gain an expertise die to your AC against a single melee attack made against you by a creature you can see. You cannot use this property while incapacitated , paralyzed , rattled , restrained , or stunned.</p>";
  }
  if (props.parryingImmunity) {
    s +=
      "<p><b>Parrying Immunity:</b> Attacks with this weapon ignore the parrying property and Armor Class bonuses from shields.</p>";
  }
  if (props.quickdraw) {
    s +=
      "<p><b>Quickdraw:</b> If you would normally only be able to draw one of these weapons on a turn, you may instead draw a number equal to the number of attacks you make. </p>";
  }
  if (props.rifled) {
    s +=
      "<p><b>Rifled:</b> Rifling extends the range a firearm can accurately hit a target. You can spend an action to aim down the weapon’s sight, and choose a creature you can see. Until you stop aiming, quadruple the weapon’s short and long ranges for the purpose of attacking that target.</p><p>Each turn thereafter you can spend an action or bonus action to continue aiming at the same target or switch to another target you can see. If you move or take damage, your aim is ruined and you have to start over again.</p>";
  }
  if (props.scatter) {
    s +=
      "<p><b>Scatter:</b> If you are wielding a shotgun and have advantage on an attack roll and both rolls hit the target, the weapon deals an extra 1d10 damage. If you have disadvantage, if one attack roll hits but the other misses, the target takes 1d4 damage. This graze damage is not increased by anything else (not ability modifiers, feats, smite spells, sneak attack, etc.), though resistances and vulnerabilities still apply.</p>";
  }
  if (props.shock) {
    s +=
      "<p><b>Shock:</b> When you attack a creature wearing metal armor with a lightning fusil, you have advantage on the attack roll.</p>";
  }
  if (props.stealthy) {
    s +=
      "<p><b>Stealthy:</b> This armor or weapon has been disguised to look like a piece of clothing or other normal item. A creature observing the item only realizes that it is armor or a weapon with a DC 15 Investigation check (made with disadvantage if the armor is being worn at the time or the weapon is sheathed).</p>";
  }
  if (props.storage) {
    s +=
      "<p><b>Storage:</b> This piece contains a hidden compartment the size of a small vial. On weapons, this compartment may have a release that allows liquid placed in the compartment, such as poison, to flow out and coat the blade or head. You can use a bonus action to release the liquid stored in a weapon.</p>";
  }
  if (props.triggerCharge) {
    s +=
      "<p><b>Trigger Charge:</b> An arcane fusil requires no ammunition, but you cannot simply shoot it by pulling the trigger. The planarite takes a moment to gather the necessary energy. To charge the fusil, you spend a bonus action and pull back a firing hammer. At the start of your next turn, the fusil is charged, and can be used for a single attack. </p><p>The shot of an arcane fusil is either a pellet of flame that engulfs a target hit, or a shaft of crackling lightning.</p><p>Once fired, you cannot charge a fusil again on the same turn. It can only be fired every other turn.</p><p>If you charge a fusil but do not fire it on your next turn, the weapon suffers a misfire. Similar to a muzzle-loading weapon, you can clear the barrel by spending an action, but until you do the weapon has disadvantage on attacks. If you suffer a second misfire without clearing the barrel, the fusil explodes and deals its base damage die to you.</p>";
  }
  if (props.trip) {
    s +=
      "<p><b>Trip:</b> When used with a combat maneuver that trips a creature or the Knockdown attack, this weapon increases your Maneuver DC by 1. If the target is mounted, your Maneuver DC is instead increased by 2.</p>";
  }
  if (props.vicious) {
    s +=
      "<p><b>Vicious:</b> A vicious weapon scores a critical hit on a roll of 19 or 20. If you already have a feature that increases the range of your critical hits, your critical hit range increases by 1 (maximum 17–20).</p>";
  }
  let s = "<hr>";
  if (s.length > 5) description.value += s;
  return p;
}

/**
 *
 * @param {import("./types/a5e.mjs").Spell | import("./types/a5e.mjs").BaseTemplate} system
 * @returns {}
 */
function migrateSpell(system) {
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: "",
      unidentified: "",
    },
    source: flattenSource(system.source),
    level: system.level,
    school: abbr(system.schools.primary),
    components: {
      vocal: system.components.vocalized,
      somatic: system.components.seen,
      material: system.components.material,
      ritual: system.ritual,
      concentration: system.concentration,
    },
    materials: {
      value: system.materials,
      consumed: system.materialsConsumed,
      cost: 0,
      supply: 0,
    },
    preparation: {
      mode: "prepared",
      prepared: false,
    },
    scaling: {
      mode: "none",
      formula: null,
    },
  };
  for (const a in Object.values(system.actions)) migrateAction(a, o5e);
  return o5e;
}

function migrateBackground(system) {
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: "",
      unidentified: "",
    },
    source: flattenSource(system.source),
  };
  return o5e;
}

function migrateCulture(system) {
  return;
}

function migrateDestiny(system) {
  return;
}

for (const p of packList) {
  const read_file = await fs.readFile(path.join(origin, p), "utf-8");
  const data = yaml.load(read_file);
  if (data.flags?.core) delete data.flags.core;
  console.log(data.name);
  switch (data.type) {
    case "npc":
      data.system = migrateMonster(data.system);
      break;
    case "feature":
      data.system = migrateFeature(data.system);
      data.type = data.system.type;
      delete data.system.type;
      break;
    case "maneuver":
      data.system = migrateManeuver(data.system);
      break;
    case "object":
      data.system = migrateObject(data.system);
      data.type = data.system.type;
      delete data.system.type;
      break;
    case "spell":
      data.flags["a5e-for-dnd5e"] = {
        secondarySchools: data.system.schools.secondary,
        rareSpell: targetPack === "rareSpells",
      };
      data.system = migrateSpell(data.system);
      break;
    case "background":
      data.system = migrateBackground(data.system);
      break;
    case "culture":
      data.system = migrateCulture(data.system);
      data.type = "background";
      break;
    case "destiny":
      data.system = migrateDestiny(data.system);
      data.type = "background";
      break;
  }
  switch (targetPack) {
    case "rareSpells":
      packPath = path.join("src", "packs", "spells");
      break;
    case "adventuringGear":
    case "magicItems":
      packPath = path.join("src", "packs", "equipment");
      break;
  }
  if (!fs.lstat(packPath)) fs.mkdir(packPath);
  await fs.writeFile(path.join(packPath, p), yaml.dump(data, { indent: 2 }));
}
