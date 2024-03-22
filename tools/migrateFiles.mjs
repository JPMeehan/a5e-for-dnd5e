import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const targetPack = process.argv[2];
const origin = path.join('src', 'packs-origin', targetPack);
let packPath = path.join('src', 'packs', targetPack);
const packList = await fs.readdir(origin);

switch (targetPack) {
  case 'adventuringGear':
  case 'magicItems':
    packPath = path.join('src', 'packs', 'gear');
    break;
  case 'backgroundFeatures':
  case 'cultureFeatures':
  case 'destinyFeatures':
  case 'heritageFeatures':
  case 'paragonGifts':
    packPath = path.join('src', 'packs', 'origin-features');
    break;
  case 'backgrounds':
  case 'cultures':
  case 'destinies':
  case 'heritages':
    packPath = path.join('src', 'packs', 'origins');
    break;
  case 'classFeatures':
    packPath = path.join('src', 'packs', 'class-features');
    break;
  case 'roll-tables':
    packPath = path.join('src', 'packs', 'tables');
    break;
  // feats, monsters, spells stay the same
}

let debugInfo = false;

// dnd5e item types = ["weapon", "equipment", "consumable", "tool", "loot", "background", "class", "subclass", "spell", "feat", "container"]
// a5e item types = ["feature", "maneuver", "object", "spell", "background", "culture", "destiny"]

/**
 * Maps a5e sources to their name
 * @param {string} src                             The a5e source
 * @returns {import('./types/dnd5e.mjs').SourceField} The converted source
 */
function mapSource(src) {
  /** Produced by `Object.entries(CONFIG.A5E.products).reduce((a, [k, v]) => {a[k] = v.title; return a}, {})` */
  const sourceMap = {
    acesAdventuringGuideToNecromancy: "Ace's Adventuring Guide to Necromancy",
    acesAdventuringGuideToNecromancySupplement:
      "Ace's Adventuring Guide to Necromancy: A Supplement",
    adventurersGuide: "Adventurer's Guide",
    adventuresInZeitgeist: 'Adventures in ZEITGEIST',
    arcaneSniper: 'Arcane Sniper',
    confidenceMage: 'Confidence Mage',
    doseOfDungeonpunk: 'Dose of Dungeonpunk - The Talos Heritage',
    dungeonDelversGuide: "Dungeon Delver's Guide",
    fieldEngineer: 'Field Engineer',
    fieryJustice: 'Fiery Justice',
    gpg0: 'Gate Pass Gazette #0',
    gpg1: 'Gate Pass Gazette #1',
    gpg2: 'Gate Pass Gazette #2',
    gpg3: 'Gate Pass Gazette #3',
    gpg4: 'Gate Pass Gazette #4',
    gpg5: 'Gate Pass Gazette #5',
    gpg6: 'Gate Pass Gazette #6',
    gpg7: 'Gate Pass Gazette #7',
    gpg8: 'Gate Pass Gazette #8',
    gpg9: 'Gate Pass Gazette #9',
    gpg10: 'Gate Pass Gazette #10',
    gpg11: 'Gate Pass Gazette #11',
    gpg12: 'Gate Pass Gazette #12',
    gpg13: 'Gate Pass Gazette #13',
    gpg14: 'Gate Pass Gazette #14',
    gpg15: 'Gate Pass Gazette #15',
    gpg16: 'Gate Pass Gazette #16',
    gpg17: 'Gate Pass Gazette #17',
    gpg18: 'Gate Pass Gazette #18',
    gpg19: 'Gate Pass Gazette #19',
    gpg20: 'Gate Pass Gazette #20',
    gpg21: 'Gate Pass Gazette #21',
    heroesOldAndNew: 'Heroes Old and New',
    moarComplete: 'Manual of Adventurous Resources: Complete',
    monstrousMenagerie: 'Monstrous Menagerie',
    mortalist: 'Mortalist',
    motifClasses: 'System Architecture: Motif Classes',
    mysteriousAndMarvelousMiscellanea: 'Mysterious and Marvelous Miscellanea',
    secretsOfTheSelkies: 'Secrets of the Selkies',
    sinuousSentinels: 'Sinuous Sentinels',
    spellsFromTheForgottenVault: 'Spells from the Forgotten Vault',
    spiritualist: 'Spiritualist',
    strangerSights: 'Stranger Sights: Challenges for 5e and Advanced 5e',
    thematicToolkitArcaneAvenger: 'Thematic Toolkit: Arcane Avenger',
    thematicToolkitBurningGloom: 'Thematic Toolkit: Burning Gloom',
    thematicToolkitCarryTheDarkness: 'Thematic Toolkit: Carry the Darkness',
    thematicToolkitCultist: 'Thematic Toolkit: Cultist',
    thematicToolkitFolkOfTheCourt: 'Thematic Toolkit: Folk of the Court',
    thematicToolkitItinerant: 'Thematic Toolkit: Itinerant',
    thematicToolkitJudgeJuryAndExecutioner:
      'Thematic Toolkit: Judge, Jury, and Executioner',
    thematicToolkitMasterOfCeremonies: 'Thematic Toolkit: Master of Ceremonies',
    thematicToolkitScrapper: 'Thematic Toolkit: Scrapper',
    thematicToolkitStoryteller: 'Thematic Toolkit: Storyteller',
    thematicToolkitThunderOfWar: 'Thematic Toolkit: Thunder of War',
    thematicToolkitVenomousShadow: 'Thematic Toolkit: Venomous Shadow',
    toSaveAKingdom: 'To Save a Kingdom',
    trialsAndTreasures: 'Trials and Treasures',
  };
  /** @type {import('./types/dnd5e.mjs').SourceField} */
  const source = {
    book: sourceMap[src] ?? '',
    license: 'OGL 1.0a',
  };
  if (source.book.includes('#')) {
    const issue = source.book.split('#');
    source.book = issue[0].trim();
    source.page = '#' + issue[1];
  }
  return source;
}

/**
 * Transforms a full length word into its relevant abbreviation
 * @param {string} word The word to abbreviate
 * @returns {string} The abbreviation
 */
function abbr(word) {
  const map = {
    abjuration: 'abj',
    conjuration: 'con',
    divination: 'div',
    enchantment: 'enc',
    evocation: 'evo',
    illusion: 'ill',
    necromancy: 'nec',
    transmutation: 'trs',
    meleeWeaponAttack: 'mwak',
    rangedWeaponAttack: 'rwak',
    meleeSpellAttack: 'msak',
    rangedSpellAttack: 'rsak',
    savingThrow: 'save',
    abilityCheck: 'abil',
    temporaryHealing: 'temphp',
    spellLevel: 'level',
    fiveFeet: '5',
    short: '30',
    medium: '60',
    long: '120',
    adamantMountain: 'adm',
    arcaneArtillery: 'arcart',
    arcaneKnight: 'arckn',
    awakenedMind: 'awm',
    beastUnity: 'bu',
    bitingZephyr: 'btz',
    comedicJabs: 'coj',
    cuttingOmen: 'cutom',
    eldritchBlackguard: 'elb',
    gallantHeart: 'gh',
    grindingCog: 'grc',
    mirrorsGlint: 'mgl',
    mistAndShade: 'mas',
    rapidCurrent: 'rc',
    razorsEdge: 'rze',
    sanctifiedSteel: 'sst',
    sanguineKnot: 'sk',
    selflessSentinel: 'ssn',
    spiritedSteed: 'ss',
    temperedIron: 'tpi',
    toothAndClaw: 'tac',
    unendingWheel: 'uwh',
    vipersFangs: 'vif',
  };
  return map[word] ?? word;
}

/**
 * Replaces UUID references to this module's compendiums
 * @param {string} uuid The source UUID
 * @returns {string}    The new UUID
 */
function fixUUIDrefs(uuid) {
  uuid = uuid.replace(
    'Compendium.a5e.a5e-spells',
    'Compendium.a5e-for-dnd5e.spells'
  );
  return uuid;
}

/**
 *
 * @param {import('./types/a5e.mjs').Action} action     The action being called
 * @param {import('./types/dnd5e.mjs').Action} system   The o5e system data to update
 * @returns {boolean} Validates that the action was completed
 */
function migrateAction(action, system) {
  const activation = {
    activation: {
      type: action?.activation?.type,
      cost: action?.activation?.cost,
      condition: action?.activation?.reactionTrigger,
    },
    duration: {},
    cover: null,
    crewed: false,
    target: {
      value: null,
      width: null,
      units: '',
      type: '',
    },
    range: {
      value: null,
      long: null,
      units: '',
    },
    uses: {
      value: null,
      max: '',
      per: null,
      recovery: '',
    },
    consume: {
      type: '',
      target: null,
      amount: null,
    },
    ability: null,
    actionType: null,
    attackBonus: '',
    chatFlavor: '',
    critical: {
      threshold: null,
      damage: '',
    },
    damage: {
      parts: [],
      versatile: '',
    },
    formula: '',
    save: {
      ability: '',
      dc: null,
      scaling: 'spell',
    },
  };
  updateTarget(activation.target, action);
  let rangeProp = 'value';
  for (const r of Object.values(action.ranges || {})) {
    const actionRange = r.range;
    if (actionRange === 'self') continue;
    activation.range[rangeProp] = abbr(actionRange);
    if (rangeProp === 'value') rangeProp = 'long';
    else console.warn('More than 2 ranges!');
  }
  for (const p of Object.values(action.prompts || {})) {
    activation.actionType = actionType(abbr(p.type), activation.actionType);
    if (activation.actionType === 'abil') activation.ability = p.ability;
    if (activation.actionType === 'save') activation.save.ability = p.ability;
  }
  Object.assign(system, activation);
  processRolls(action.rolls, action, system);
  if (system?.properties?.ver || system?.properties?.mnt) {
    /** @type {{versatile: string, parts: string[]}} */
    const dmg = system.damage;
    dmg.versatile = dmg.parts.splice(1, 1)[0][0];
  }
  return true;
}

/**
 * Handles the rolls object of the a5e item
 * @param {Record<string, import('./types/a5e.mjs').Roll} rolls
 * @param {import('./types/a5e.mjs').Action} action
 * @param {import('./types/dnd5e.mjs').Action & import('./types/dnd5e.mjs').Spell} system
 */
function processRolls(rolls, action, system) {
  if (!Object.keys(rolls || {}).length) return false;
  let formula = '';
  for (const r of Object.values(rolls)) {
    switch (r.type) {
      case 'attack':
        system.actionType = actionType(abbr(r.attackType), system.actionType);
        system.attackBonus = r.bonus ?? '';
        break;
      case 'damage':
        if (!r.formula) {
          console.warn('No formula found in', action.name);
          continue;
        }
        formula = r.formula.replace(/\w+.mod/, 'mod'); //  re.sub("@w+.mod", "@mod", r.formula);
        if (!r.damageType) {
          console.warn('No damage type found in', action.name);
          continue;
        }
        system.damage.parts.push([formula, r.damageType]);
        if (system.scaling && r.scaling) {
          system.scaling.formula = r.scaling.formula;
          system.scaling.mode = abbr(r.scaling.mode);
        }
        break;
      case 'healing':
        system.actionType = actionType('heal', system.actionType);
        if (!r.formula) {
          console.warn('No formula found in', action.name);
          continue;
        }
        formula = r.formula.replace(/\w+.mod/, 'mod'); // re.sub("@w+.mod", "@mod", r.formula);
        system.damage.parts.push([formula, abbr(r.healingType ?? 'healing')]);
        break;
      case 'abilityCheck':
        system.actionType = actionType('abil', system.actionType);
        break;
      default:
        console.warn(r.type, action.name);
    }
  }
  return true;
}

/**
 * Prioritizes action types
 * @param {string} alternative  The incoming action type
 * @param {string} current      The standing action type
 * @returns {string}  The prioritized action type
 */
function actionType(alternative, current) {
  switch (current) {
    case null:
    case 'save':
    case 'util':
    case 'other':
      return alternative;
    case 'mwak':
    case 'msak':
    case 'rwak':
    case 'rsak':
      return current;
    case 'abil':
    case 'heal':
      if (['mwak', 'msak', 'rwak', 'rsak'].includes(alternative))
        return alternative;
      else return current;
    default:
      return alternative;
  }
}

/**
 * Effect's valid targets, a subset of ActivatedEffect
 * @typedef Target 
 * @property {number} value          Length or radius of target depending on targeting mode selected.
 * @property {number} width          Width of line when line type is selected.
 * @property {string} units          Units used for value and width as defined in `DND5E.distanceUnits`.
 * @property {string} type           Targeting mode as defined in `DND5E.targetTypes`.

 */

/**
 * Updates the target property of an item
 * @param {Target} target                           Item's valid targets
 * @param {import("./types/a5e.mjs").Action} action The source action
 */
function updateTarget(target, action) {
  switch (action.area?.shape) {
    case 'circle':
    case 'cylinder':
      target.type = 'cylinder';
      target.value = action.area.radius;
      target.units = 'ft';
      return;
    case 'cone':
      target.type = 'cone';
      target.value = action.area.length;
      target.units = 'ft';
    case 'cube':
    case 'square':
      target.type = action.area.shape;
      target.value = action.area.width;
      target.units = 'ft';
      return;
    case 'line':
      target.type = 'line';
      target.value = action.area.length;
      target.width = action.area.width;
      target.units = 'ft';
      return;
    case 'sphere':
      target.type = 'sphere';
      target.value = action.area.radius;
      target.units = 'ft';
      return;
  }
  switch (action.target?.type) {
    case 'self':
    case 'creature':
    case 'object':
      target.type = action.target.type;
      target.value = action.target.quantity;
      break;
    case 'creatureObject':
      target.type = 'creatureOrObject';
      target.value = action.target.quantity;
      break;
    case 'other':
      target.type = 'space';
      break;
  }
}

/**
 *
 * @param {object} system The a5e bestiary entry
 * @returns {object}      The o5e bestiary entry
 */
function migrateMonster(system) {
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
  };
  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Feat & import('./types/dnd5e.mjs').ItemDescription} Feature
 */

/**
 *
 * @param {import('./types/a5e.mjs').Feature & import('./types/a5e.mjs').BaseTemplate} system The a5e feature
 * @returns {Feature}      The o5e feature
 */
function migrateFeature(system) {
  /** @type {Feature} */
  const o5e = {
    type: featureTypes(system),
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
    },
    source: mapSource(system.source),
    properties: [],
    requirements: system.prerequisite,
    recharge: {
      value: null,
      charged: true,
    },
  };

  if (system.concentration) o5e.properties.push('concentration');

  for (const a of Object.values(system.actions)) migrateAction(a, o5e);

  return o5e;
}

/**
 * Translates a5e featureTypes to dnd5e type.value and type.subtype
 * @param {import('./types/a5e.mjs').Feature} system
 * @returns {import('./types/dnd5e.mjs').ItemType}
 */
function featureTypes(system) {
  const typeMap = {
    background: 'background',
    boon: 'supernaturalGift',
    class: 'class',
    culture: 'culture',
    destiny: 'destiny',
    feat: 'feat',
    heritage: 'race',
    knack: 'class',
    legendaryAction: 'monster',
    naturalWeapon: '',
    other: '',
  };
  const subtypeMap = {
    /** Adept */
    practicedTechnique: 'Technique',
    focusFeature: 'Focus',
    /** Artificer */
    // fieldDiscovery: 'Field Discovery', // No consistent naming scheme
    /** Bard */
    battleHymn: 'Battle Hymn',
    /** Berserker */
    developedTalent: 'Talent',
    furiousCritical: 'Critical',
    /** Cleric */
    faithSign: 'Sign',
    /** Druid */
    natureSecret: 'Druid Secrets',
    /** Fighter */
    soldieringKnack: 'Knack',
    /** Herald */
    divineLesson: 'Lesson',
    /** Marshal */
    warLesson: 'Lesson',
    /** Ranger */
    explorationKnack: 'Knack',
    /** Rogue */
    skillTrick: 'Trick',
    /** Savant */
    cleverScheme: 'Clever Scheme',
    // savantTrick: 'Savant Trick', // No consistent naming scheme
    /** Sorcerer */
    arcaneInnovation: 'Innovation',
    metamagic: 'Metamagic',
    /** Warlock (note: Eldritch Invocation is base 5e) */
    secretArcana: 'Secrets',
    /** Wizard */
    electiveStudy: 'Elective',
    /** Witch */
    magicalMystery: 'Mystery',
  };

  let subtype = '';

  // some fancy loop for class features

  return {
    value: typeMap[system.featureType],
    subtype,
  };
}

/**
 * @typedef {import('./types/dnd5e.mjs').Maneuver & import('./types/dnd5e.mjs').ItemDescription} Maneuver
 */

/**
 *
 * @param {import('./types/a5e.mjs').Maneuver} system
 * @returns {Maneuver}
 */
function migrateManeuver(system) {
  /** @type {} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
    },
    source: mapSource(system.source),
    degree: Number(system.degree),
    tradition: abbr(system.tradition),
    prerequisite: system.prerequisite,
    properties: [],
  };

  if (system.concentration) o5e.properties.push('concentration');

  for (const a of Object.values(system.actions)) migrateAction(a, o5e);

  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').ItemDescription & import('./types/dnd5e.mjs').PhysicalItem & import('./types/dnd5e.mjs').Identifiable} PhysicalItem
 */

/**
 *
 * @param {import('./types/a5e.mjs').ObjectA5E & import('./types/a5e.mjs').BaseTemplate} system
 * @returns {PhysicalItem} Weapon, Container, Equipment,
 */
function migrateObject(system) {
  /** @type {PhysicalItem} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
    quantity: system.quantity,
    weight: system.weight,
    price: splitPrice(system.price),
    attunement: 0,
    equipped: false,
    rarity: system.rarity,
    identified: true,
  };
  /** @type {import('./types/dnd5e.mjs').Container} */
  const container = {
    // No data properties to pull from
    capacity: {
      type: 'weight',
      value: null,
      weightless: false,
    },
    currency: {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0,
    },
    documentSubType: 'container',
  };
  /** @type {import('./types/dnd5e.mjs').Equipment} */
  const equipment = {
    armor: {
      value: baseAC(system.ac.baseFormula),
      dex: system.ac.maxDex,
    },
    type: {
      value: system.shieldCategory ? 'shield' : system.armorCategory,
      baseItem: getBaseItem(system),
    },
    speed: {
      value: null,
      conditions: '',
    },
    strength: system.ac.minStr,
    stealth: system.ac.grantsDisadvantage,
    proficient: null,
    documentSubType: 'equipment',
  };
  /** @type {import('./types/dnd5e.mjs').Consumable} */
  const consumable = {
    type: { value: 'potion', subtype: '' },
    uses: {
      autoDestroy: false,
    },
    documentSubType: 'consumable',
  };
  /** @type {import('./types/dnd5e.mjs').Tool} */
  const tool = {
    type: { value: '', baseItem: getBaseItem(system) },
    ability: 'int',
    chatFlavor: '',
    proficient: null,
    bonus: '',
    documentSubType: 'tool',
  };
  /** @type {import('./types/dnd5e.mjs').Weapon} */
  const weapon = {
    type: { value: weaponType(system), baseItem: getBaseItem(system) },
    properties: weaponProperties(system, o5e.description),
    proficient: true,
    documentSubType: 'weapon',
  };
  const mountable = {
    armor: {
      value: null,
    },
    hp: {
      value: null,
      max: null,
      dt: null,
      conditions: '',
    },
  };
  switch (system.objectType) {
    case 'ammunition':
      Object.assign(o5e, consumable);
      o5e.type.value = 'ammo';
      break;
    case 'armor':
      Object.assign(o5e, mountable);
      Object.assign(o5e, equipment);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'clothing':
      Object.assign(o5e, mountable);
      Object.assign(o5e, equipment);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'consumable':
      Object.assign(o5e, consumable);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'container':
      Object.assign(o5e, container);
      break;
    case 'jewelry':
      Object.assign(o5e, mountable);
      Object.assign(o5e, equipment);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'miscellaneous':
      Object.assign(o5e, mountable);
      Object.assign(o5e, equipment);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'shield':
      Object.assign(o5e, mountable);
      Object.assign(o5e, equipment);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    case 'tool':
      Object.assign(o5e, tool);
      break;
    case 'weapon':
      Object.assign(o5e, weapon);
      Object.assign(o5e, mountable);
      for (const a of Object.values(system.actions)) migrateAction(a, o5e);
      break;
    default:
      o5e.documentSubType = 'loot';
  }
  return o5e;
}

/**
 * Breaks up the pricing
 * @param {number | string} price                   The string price from a5e
 * @returns {{value: number, denomination: string}} The price object for dnd5e
 */
function splitPrice(price) {
  if (typeof price === 'number') return { value: price, denomination: 'gp' };
  const s = price.split(' ');
  const p = {
    value: parseInt(s[0].replace(',', '')),
    denomination: s.length === 2 ? s[1] : 'gp',
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
  let wepRange = '';
  for (const a of Object.values(system.actions)) {
    for (const r of Object.values(a.rolls || {})) {
      switch (abbr(r.attackType)) {
        case 'mwak':
          wepRange = 'M';
          break;
        case 'rwak':
          wepRange = 'R';
          break;
      }
    }
  }
  if (!wepRange) return '';
  if (system.weaponProperties.includes('simple')) return 'simple' + wepRange;
  else return 'martial' + wepRange;
}

/**
 *
 * @param {object} system
 * @returns {string}
 */
function getBaseItem(system) {
  return '';
}

/**
 *
 * @param {object} system       The system data from the a5e weapon
 * @param {object} description  The description of the a5e weapon
 * @returns {Record<string, boolean|number>}  Also updates the item's description
 */
function weaponProperties(system, description) {
  /** @type {Array<string>} */
  const props = system.weaponProperties;
  const p = [];
  /**
   * Renames
   * Missing o5e: Firearm, Focus, Reload, Special
   */
  if (props.includes('dualWielding')) p.push('lgt');
  if (props.includes('finesse')) p.push('fin');
  if (props.includes('heavy')) p.push('hvy');
  if (props.includes('loading')) p.push('lod');
  if (props.includes('range')) p.push('amm');
  if (props.includes('reach')) p.push('rch');
  if (props.includes('rebounding')) p.push('ret');
  if (props.includes('thrown')) p.push('thr');
  if (props.includes('twoHanded')) p.push('two');
  if (props.includes('versatile')) p.push('ver');
  let s = '<hr>';
  if (props.includes('burn')) {
    s +=
      '<p><b>Burn:</b> The fire fusil only deals a base of 1 fire damage, but the target also catches on fire. It takes 1d10 fire damage at the start of each of its turns, and can end this damage by using its action to extinguish the flames.</p>';
  }
  if (
    props.includes('breaker') ||
    props.includes('breakerStone') ||
    props.includes('breakerWood')
  ) {
    p.push('breaker');
    s +=
      '<p><b>Breaker:</b> This weapon deals double damage to unattended objects, such as doors and walls. If this property only applies to a specific type of material, such as wood, it is stated in parenthesis after this property.</p>';
  }
  if (props.includes('compounding')) {
    p.push('compounding');
    s +=
      '<p><b>Compounding:</b> You use only your Strength modifier for attack and damage rolls made with this weapon.</p>';
  }
  if (
    props.includes('defensive') ||
    props.includes('defensiveHeavy') ||
    props.includes('defensiveMedium') ||
    props.includes('defensiveLight')
  ) {
    p.push('defensive');
    s +=
      '<p><b>Defensive:</b> This weapon is designed to be used with a shield of the stated degree or lighter (light, medium, or heavy). When you make an attack with this weapon and are using a shield designed for it, you can use a bonus action to either make an attack with your shield or increase your Armor Class by 1 until the start of your next turn.</p>';
  }
  if (props.includes('flamboyant')) {
    s +=
      '<p><b>Flamboyant:</b> Creatures have disadvantage on saving throws made to resist being distracted by this weapon, and you have advantage on Intimidation or Performance checks made with the use of it.</p>';
  }
  if (props.includes('handMounted')) {
    s +=
      '<p><b>Hand-Mounted:</b> This weapon is affixed to your hand. You can do simple activities such as climbing a ladder while wielding this weapon, and you have advantage on saving throws made to resist being disarmed. You cannot use a hand that is wielding a hand-mounted weapon to do complex tasks like picking a pocket, using thieves’ tools to bypass a lock, or casting spells with seen components.</p>';
  }
  if (props.includes('inaccurate')) {
    s +=
      '<p><b>Inaccurate:</b> Grenades do not add your ability score modifier to damage.</p><p>When you throw a grenade, choose a creature or an unoccupied 5-ft. space. (If the creature occupies more than one 5-ft. space, choose one of the squares it occupies.) Make an attack roll against AC 10. If the attack misses, the grenade veers off course, missing by 5 ft. in a random direction, or 10 ft. if the target area was at long range. Each creature in a 5-ft. radius of where the grenade lands must succeed a DC 12 Dexterity save or else take 3d6 bludgeoning damage.</p><p>If you targeted a creature and the attack roll is a critical hit, the grenade directly strikes that creature. The grenade does double damage to that creature without allowing a save. Other creatures in the area are affected normally.</p>';
  }
  if (props.includes('mounted')) {
    p.push('mnt');
    s +=
      '<p><b>Mounted:</b> This weapon deals the damage listed in parenthesis when you are wielding it while mounted.</p>';
  }
  if (props.includes('muzzleLoading')) {
    p.push('fir');
    s +=
      '<p><b>Muzzle Loading:</b> After each shot, it takes an action or bonus action to reload the weapon.</p><p>Sometimes irregular packing of a barrel causes the weapon not to function properly. Whenever you roll a natural 1 on an attack roll with a firearm, the gun misfires – nothing happens, and the gun remains loaded. Clearing the barrel requires an action, and makes the gun safe to use. You can continue using the misfired gun without clearing the barrel, but attacks with the weapon have disadvantage , and if you roll a second natural 1, the weapon has a mishap and explodes. It is destroyed and deals its base damage die to you (e.g., 2d8 with a musket).</p><p>Magical guns never misfire or have mishaps.</p>';
  }
  if (props.includes('parrying')) {
    s +=
      '<p><b>Parrying:</b> When you are wielding this weapon and you are not using a shield, once before your next turn you can gain an expertise die to your AC against a single melee attack made against you by a creature you can see. You cannot use this property while incapacitated , paralyzed , rattled , restrained , or stunned.</p>';
  }
  if (props.includes('parryingImmunity')) {
    s +=
      '<p><b>Parrying Immunity:</b> Attacks with this weapon ignore the parrying property and Armor Class bonuses from shields.</p>';
  }
  if (props.includes('quickdraw')) {
    s +=
      '<p><b>Quickdraw:</b> If you would normally only be able to draw one of these weapons on a turn, you may instead draw a number equal to the number of attacks you make. </p>';
  }
  if (props.includes('rifled')) {
    s +=
      '<p><b>Rifled:</b> Rifling extends the range a firearm can accurately hit a target. You can spend an action to aim down the weapon’s sight, and choose a creature you can see. Until you stop aiming, quadruple the weapon’s short and long ranges for the purpose of attacking that target.</p><p>Each turn thereafter you can spend an action or bonus action to continue aiming at the same target or switch to another target you can see. If you move or take damage, your aim is ruined and you have to start over again.</p>';
  }
  if (props.includes('scatter')) {
    s +=
      '<p><b>Scatter:</b> If you are wielding a shotgun and have advantage on an attack roll and both rolls hit the target, the weapon deals an extra 1d10 damage. If you have disadvantage, if one attack roll hits but the other misses, the target takes 1d4 damage. This graze damage is not increased by anything else (not ability modifiers, feats, smite spells, sneak attack, etc.), though resistances and vulnerabilities still apply.</p>';
  }
  if (props.includes('shock')) {
    s +=
      '<p><b>Shock:</b> When you attack a creature wearing metal armor with a lightning fusil, you have advantage on the attack roll.</p>';
  }
  if (props.includes('stealthy')) {
    s +=
      '<p><b>Stealthy:</b> This armor or weapon has been disguised to look like a piece of clothing or other normal item. A creature observing the item only realizes that it is armor or a weapon with a DC 15 Investigation check (made with disadvantage if the armor is being worn at the time or the weapon is sheathed).</p>';
  }
  if (props.includes('storage')) {
    s +=
      '<p><b>Storage:</b> This piece contains a hidden compartment the size of a small vial. On weapons, this compartment may have a release that allows liquid placed in the compartment, such as poison, to flow out and coat the blade or head. You can use a bonus action to release the liquid stored in a weapon.</p>';
  }
  if (props.includes('triggerCharge')) {
    s +=
      '<p><b>Trigger Charge:</b> An arcane fusil requires no ammunition, but you cannot simply shoot it by pulling the trigger. The planarite takes a moment to gather the necessary energy. To charge the fusil, you spend a bonus action and pull back a firing hammer. At the start of your next turn, the fusil is charged, and can be used for a single attack. </p><p>The shot of an arcane fusil is either a pellet of flame that engulfs a target hit, or a shaft of crackling lightning.</p><p>Once fired, you cannot charge a fusil again on the same turn. It can only be fired every other turn.</p><p>If you charge a fusil but do not fire it on your next turn, the weapon suffers a misfire. Similar to a muzzle-loading weapon, you can clear the barrel by spending an action, but until you do the weapon has disadvantage on attacks. If you suffer a second misfire without clearing the barrel, the fusil explodes and deals its base damage die to you.</p>';
  }
  if (props.includes('trip')) {
    s +=
      '<p><b>Trip:</b> When used with a combat maneuver that trips a creature or the Knockdown attack, this weapon increases your Maneuver DC by 1. If the target is mounted, your Maneuver DC is instead increased by 2.</p>';
  }
  if (props.includes('vicious')) {
    p.push('vicious');
    s +=
      '<p><b>Vicious:</b> A vicious weapon scores a critical hit on a roll of 19 or 20. If you already have a feature that increases the range of your critical hits, your critical hit range increases by 1 (maximum 17–20).</p>';
  }
  if (s.length > 5) description.value += s;
  return p;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Spell & import('./types/dnd5e.mjs').ItemDescription} Spell
 */

/**
 *
 * @param {import("./types/a5e.mjs").Spell & import('./types/a5e.mjs').BaseTemplate} system
 * @returns {Spell}
 */
function migrateSpell(system) {
  /** @type {Spell} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
    },
    source: mapSource(system.source),
    level: system.level,
    school: abbr(system.schools.primary),
    properties: [],
    materials: {
      value: system.materials,
      consumed: system.materialsConsumed,
      cost: 0,
      supply: 0,
    },
    preparation: {
      mode: 'prepared',
      prepared: false,
    },
    scaling: {
      mode: 'none',
      formula: null,
    },
  };
  if (system.components.vocalized) o5e.properties.push('vocal');
  if (system.components.seen) o5e.properties.push('somatic');
  if (system.components.material) o5e.properties.push('material');
  if (system.ritual) o5e.properties.push('ritual');
  if (system.concentration) o5e.properties.push('concentration');

  for (const a of Object.values(system.actions)) migrateAction(a, o5e);
  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Race & import('./types/dnd5e.mjs').ItemDescription} Heritage
 */

/**
 *
 * @param {import('./types/a5e.mjs').Heritage} system The a5e heritage
 * @param {string} name                               The race's name
 * @returns {import('./types/dnd5e.mjs').Race}        The o5e race
 */
function migrateHeritage(system, name) {
  /** @type {Heritage} */
  const o5e = {
    identifier: name.toLowerCase().replace(' ', '-'),
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
  };
  processGrants(o5e, Object.values(system.grants), 'heritage');
  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Background & import('./types/dnd5e.mjs').ItemDescription} Background
 */

/**
 *
 * @param {import('./types/a5e.mjs').Background} system The a5e background
 * @returns {import('./types/dnd5e.mjs').Background}    The o5e background
 */
function migrateBackground(system) {
  /** @type {Background} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
  };
  processGrants(o5e, Object.values(system.grants), 'background');
  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Culture & import('./types/dnd5e.mjs').ItemDescription} Culture
 */

/**
 *
 * @param {import('./types/a5e.mjs').Culture} system The a5e culture
 * @returns {import('./types/dnd5e.mjs').Culture}    The o5e culture
 */
function migrateCulture(system) {
  /** @type {Culture} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
  };
  processGrants(o5e, Object.values(system.grants), 'culture');
  return o5e;
}

/**
 * @typedef {import('./types/dnd5e.mjs').Destiny & import('./types/dnd5e.mjs').ItemDescription} Destiny
 */

/**
 *
 * @param {import('./types/a5e.mjs').Destiny} system The a5e destiny
 * @returns {import('./types/dnd5e.mjs').Destiny}    The o5e destiny
 */
function migrateDestiny(system) {
  /** @type {Destiny} */
  const o5e = {
    description: {
      value: fixUUIDrefs(system.description),
      chat: '',
      unidentified: '',
    },
    source: mapSource(system.source),
  };
  return o5e;
}

/**
 * Reads through the grants and handles their data
 * @param {Heritage | Background | Culture | Destiny} o5e The target o5e data
 * @param {import('./types/a5e.mjs').Grant[]} grants        The a5e grants
 * @param {string} type                                   The item type
 */
function processGrants(o5e, grants, type) {
  for (const grant of grants) {
    switch (grant.grantType) {
      case 'ability':
        break;
      case 'attack': // none implemented yet
        break;
      case 'damage': // none implemented yet
        break;
      case 'expertiseDice': // none implemented yet
        break;
      case 'feature':
        break;
      case 'healing': // none implemented yet
        break;
      case 'initiative': // none implemented yet
        break;
      case 'item':
        break;
      case 'movement':
        if (type === 'heritage') {
          for (const mvmtType of grant.movementTypes.base) {
            o5e.movement[mvmtType] = Number(grant.bonus);
          }
          o5e.movement.hover = grant.context.isHover;
        }
        break;
      case 'proficiency':
        break;
      case 'senses': // none implemented yet
        break;
      case 'skills': // none implemented yet
        break;
      case 'trait':
        break;
    }
  }
}

for (const p of packList) {
  const read_file = await fs.readFile(path.join(origin, p), 'utf-8');
  const data = yaml.load(read_file);
  if (data.flags?.core) delete data.flags.core;
  console.log(data.name);
  switch (data.type) {
    case 'npc':
      data.system = migrateMonster(data.system);
      break;
    case 'feature':
      data.system = migrateFeature(data.system);
      data.type = 'feat';
      break;
    case 'maneuver':
      data.system = migrateManeuver(data.system);
      data.type = 'a5e-for-dnd5e.maneuver';
      break;
    case 'object':
      data.system = migrateObject(data.system);
      data.type = data.system.documentSubType;
      delete data.system.documentSubType;
      break;
    case 'spell':
      data.flags['a5e-for-dnd5e'] = {
        secondarySchools: data.system.schools.secondary,
        rareSpell: data.system.rare,
      };
      data.system = migrateSpell(data.system);
      break;
    case 'heritage':
      data.system = migrateHeritage(data.system, data.name);
      break;
    case 'background':
      data.system = migrateBackground(data.system);
      break;
    case 'culture':
      data.system = migrateCulture(data.system);
      data.type = 'a5e-for-dnd5e.culture';
      break;
    case 'destiny':
      data.system = migrateDestiny(data.system);
      data.type = 'a5e-for-dnd5e.destiny';
      break;
  }
  if (!fs.lstat(packPath)) fs.mkdir(packPath);
  const fileOutPath = data.type + '_' + p;
  await fs.writeFile(
    path.join(packPath, fileOutPath),
    yaml.dump(data, { indent: 2 })
  );
}
