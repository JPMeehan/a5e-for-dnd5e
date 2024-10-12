/**
 * Advancements
 */

export interface BaseAdvancement {
  _id: string;
  level: number;
  title: string;
  icon: string;
  classRestriction: string;
}

export type AbilityScores = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScoreImprovement {
  points: number;
  fixed: Record<AbilityScores, number>;
  cap: number;
}

/**
 * Item Grant
 */
export interface _ItemGrant {
  uuid: string;
}

/**
 * Spell Configuration
 */
export interface SpellConfiguration {
  ability: string;
  preparation: string;
  uses: {
    max: string;
    per: string;
  };
}

/**
 * Item Choice
 */
export interface ItemChoice {
  hint: string;
  choices: Record<string, number>;
  allowDrops: boolean;
  type: string;
  pool: _ItemGrant[];
  spell: {
    type: number;
    subtype: number;
    level: number;
  };
}

/**
 * Item Grant
 */
export interface ItemGrant {
  items: _ItemGrant[];
  optional: boolean;
  spell: SpellConfiguration;
}

/**
 * Scale Value
 */
export interface ScaleValue {
  identifier: {
    type: string;
    distance: {
      units: string;
    };
    scale: Record<string, any>;
  };
}

/**
 * Size
 */
export interface Size {
  hint: string;
  sizes: string[];
}

/**
 * Trait Choice
 */
export interface TraitChoice {
  count: number;
  pool?: string[];
}

/**
 * Trait
 */
export interface Trait {
  hint: string;
  mode: string;
  allowReplacements: boolean;
  grants: string[];
  choices: TraitChoice[];
}

/**
 * Ability Score Improvement Advancement
 */
export interface AbilityScoreImprovementAdvancement extends BaseAdvancement {
  type: "AbilityScoreImprovement";
  configuration: AbilityScoreImprovement;
}

/**
 * Hit Points Advancement
 */
export interface HitPointsAdvancement extends BaseAdvancement {
  type: "HitPoints";
}

/**
 * Item Choice Advancement
 */
export interface ItemChoiceAdvancement extends BaseAdvancement {
  type: "ItemChoice";
  configuration: ItemChoice;
}

/**
 * Item Grant Advancement
 */
export interface ItemGrantAdvancement extends BaseAdvancement {
  type: "ItemGrant";
  configuration: ItemGrant;
}

/**
 * Scale Value Advancement
 */
export interface ScaleValueAdvancement extends BaseAdvancement {
  type: "ScaleValue";
  configuration: ScaleValue;
}

/**
 * Size Advancement
 */
export interface SizeAdvancement extends BaseAdvancement {
  type: "Size";
  configuration: Size;
}

/**
 * Trait Advancement
 */
export interface TraitAdvancement extends BaseAdvancement {
  type: "Trait";
  configuration: Trait;
}

/**
 * Advancement
 */
export type Advancement = BaseAdvancement &
  (
    AbilityScoreImprovementAdvancement | 
    HitPointsAdvancement | 
    ItemChoiceAdvancement | 
    ItemGrantAdvancement | 
    ScaleValueAdvancement | 
    SizeAdvancement | 
    TraitAdvancement
);

/**
 * 
 * Shared
 * 
 */

interface SourceField {
  book: string;
  page: string;
  custom: string;
  license: string;
  revision: number;
  rules: string;
}

interface ItemDescription {
  description: {
    value: string;
    chat: string;
  }
  identifier: string;
  source: SourceField
}


/***************
 * 
 * ORIGINS
 * 
 ***************/

interface Movement {
  burrow: number;
  climb: number;
  fly: number;
  swim: number;
  walk: number;
  units: string;
  hover: boolean;
}

interface Senses {
  darkvision: number;
  blindsight: number;
  tremorsense: number;
  truesight: number;
  units: string;
  special: string;
}

interface CreatureType {
  value: string;
  subtype: string;
  swarm: string;
  custom: string;
}

interface EquipmentEntry {
  _id: string;
  group: string;
  sort: number;
  type: string;
  count: number;
  key: string;
  requiresProficiency: boolean;
}

interface StartingEquipment {
  startingEquipment: EquipmentEntry[],
  wealth: string;
}

interface SpellcastingField {
  progression: string;
  ability: string;
  preparation: {
    formula: string;
  }
}

export interface Race extends ItemDescription {
  advancement: Advancement[];
  movement: Movement;
  senses: Senses;
  type: CreatureType;
}

export interface Background extends ItemDescription, StartingEquipment {
  advancement: Advancement[];
}

export interface Class5e extends ItemDescription, StartingEquipment {
  levels: number;
  primaryAbility: {
    value: Array<string>;
    all: boolean;
  }
  hitDice: string;
  hitDiceUsed: number;
  advancement: Advancement[];
  spellcasting: SpellcastingField;
}

export interface Subclass5e extends ItemDescription {
  advancement: Advancement[];
  classIdentifier: string;
  spellcasting: SpellcastingField;
}

/**
 * 
 * Activities
 * 
 */

/** Activation Data */
interface Activation {
  /** Activation type (e.g. action, legendary action, minutes). */
  type: string; 
  /** Scalar value associated with the activation. */
  value: number;
  /** Condition required to activate this activity. */
  condition: string;
}

interface ConsumptionTarget {
  type: string;
  target: string;
  value: string;
  scaling: {
    mode: string
    formula: string;
  }
}

interface Duration {
  value: string;
  units: string;
  special: string;
}

interface AppliedEffect {
  _id: string;
}

/**
 * Uses Data
 */
interface Uses {
  /** Number of uses that have been spent. */
  spent: number;
  /** Formula for the maximum number of uses. */
  max: string;
  /** Recovery profiles for this activity's uses. */
  recovery: Array<{
    /** Period at which this profile is activated. */
    period: string;
    /** Whether uses are reset to full, reset to zero, or recover a certain number of uses. */
    type: string;
    /** Formula used to determine recovery if type is not reset. */
    formula: string;
  }>
}

interface Damage {
  number: number;
  denomination: number;
  bonus: string;
  types: Array<string>;
  custom: {
    enabled: boolean;
    formula: string;
  }
  scaling: {
    mode: string;
    number: number;
    formula: string;
  }
}

/**
 * Range data
 */
interface Range {
  /** Scalar value for the activity's range. */
  value: string;
  /** Units that are used for the range. */
  units: string;
  /** Description of any special range details. */
  special: string;
}

/**
 * Target Data
 */
interface Target {
  template: {
    /** Number of templates created. */
    count: string;
    /** Must all created areas be connected to one another? */
    contiguous: boolean;
    /** Type of area of effect caused by this activity. */
    type: string;
    /** Size of the activity's area of effect on its primary axis. */
    size: string;
    /** Width of line area of effect. */
    width: string;
    /** Height of cylinder area of effect. */
    height: string;
    /** Units used to measure the area of effect sizes. */
    units: string;
  }
  affects: {
    /** Number of individual targets that can be affected. */
    count: string;
    /** Type of targets that can be affected (e.g. creatures, objects, spaces). */
    type: string;
    /** When targeting an area, can the user choose who it affects? */
    choice: boolean;
    /** Description of special targeting. */
    special: string;
  }
}

interface BaseActivity {
  _id: string;
  // type: string;
  name: string;
  img: string;
  sort: number;
  activation: Activation;
  consumption: {
    scaling: {
      allowed: boolean;
      max: string;
    }
    spellSlot: boolean;
    targets: ConsumptionTarget[];
  }
  description: {
    chatFlavor: string;
  }
  duration: Duration & {
    concentration: boolean;
    override: boolean;
  }
  effects: AppliedEffect[];
  range: Range & {
    override: boolean;
  }
  target: Target & {
    override: boolean;
    prompt: boolean;
  }
  uses: Uses;
}

export interface AttackActivity extends BaseActivity {
  type: "attack";
  attack: {
    ability: string;
    bonus: string;
    critical: {
      threshold: number;
    }
    flat: boolean;
    type: {
      value: string;
      classification: string;
    }
  }
  damage: {
    critical: {
      bonus: string;
    }
    includeBase: boolean;
    parts: Damage[];
  }
}

export interface CheckActivity extends BaseActivity {
  type: "check";
  check: {
    ability: string;
    associated: Array<string>;
    dc: {
      calculation: string;
      formula: string;
    }
  }
}

export interface DamageActivity extends BaseActivity {
  type: "damage";
  damage: {
    critical: {
      allow: boolean;
      bonus: string;
    }
    parts: Damage[];
  }
}

export interface EnchantActivity extends BaseActivity {
  type: "enchant";
  effects: Array<AppliedEffect & {
    level: {
      min: number;
      max: number;
    }
    riders: {
      activity: Array<string>;
      effect: Array<string>;
      item: Array<string>;
    }
  }>
  enchant: {
    identifier: string;
  }
  restrictions: {
    allowMagical: boolean;
    categories: Array<string>;
    properties: Array<string>;
    type: string;
  }
}

export interface HealActivity extends BaseActivity {
  type: "heal";
  healing: Damage[];
}

export interface SaveActivity extends BaseActivity {
  type: "save";
  damage: {
    onSave: string;
    parts: Damage[];
  }
  effects: Array<AppliedEffect & {
    onSave: boolean;
  }>
  save: {
    ability: string;
    dc: {
      calculation: string;
      formula: string;
    }
  }
}

interface SummonProfile {
  _id: string;
  count: string;
  cr: string;
  level: {
    min: number;
    max: number;
  }
  name: string;
  types: Array<string>;
  uuid: string;
}

export interface SummonActivity extends BaseActivity {
  bonuses: {
    ac: string;
    hd: string;
    hp: string;
    attackDamage: string;
    saveDamage: string;
    healing: string;
  }
  creatureSizes: Array<string>;
  creatureTypes: Array<string>;
  match: {
    attacks: boolean;
    proficiency: boolean;
    saves: boolean;
  }
  profiles: SummonProfile[];
  summon: {
    identifier: string;
    mode: string;
    prompt: boolean;
  }
}

export interface UtilityActivity extends BaseActivity {
  roll: {
    formula: string;
    name: string;
    prompt: boolean;
    visible: boolean;
  }
}

export type Activity = AttackActivity | CheckActivity | DamageActivity | EnchantActivity | HealActivity | SaveActivity | SummonActivity;

export interface Activities {
  activities: Record<string, Activity>;
  uses: Uses;
}

/**
 * 
 * Gear
 * 
 */

export interface EquippableItem {
  attunement: string;
  attuned: boolean;
  equipped: boolean;
}

export interface Identifiable {
  identified: boolean;
  unidentified: {
    name: string;
    description: string;
  }
}

export interface ItemType {
  type: {
    value: string;
    subtype?: string;
    baseItem?: string;
  }
}

export interface Mountable {
  armor: {
    value: number;
  }
  cover: number;
  crewed: boolean;
  hp: {
    value: number;
    max: number;
    dt: number;
    conditions: string;
  }
  speed: {
    value: string;
    conditions: string;
  }
}

export interface PhysicalItem {
  container: string;
  quantity: number;
  weight: {
    value: number;
    units: string;
  }
  price: {
    value: number;
    denomination: string;
  }
  rarity: string;
}

export interface Currency {
  currency: Record<string, number>;
}

export interface Consumable extends Activities, ItemDescription, Identifiable, ItemType, PhysicalItem, EquippableItem {
  damage: {
    base: Damage;
    replace: boolean;
  }
  magicalBonus: number;
  properties: Array<string>;
  uses: Uses & {
    autoDestroy: boolean;
  }
}

export interface Container extends ItemDescription, Identifiable, PhysicalItem, EquippableItem, Currency {
  quantity: number;
  properties: Array<string>;
  capacity: {
    type: string;
    value: string;
  }
}

export interface Equipment extends Activities, ItemDescription, Identifiable, ItemType, PhysicalItem, EquippableItem, Mountable {
  armor: {
    value: number;
    magicalBonus: number;
    dex: number;
  }
  properties: Array<string>;
  strength: number;
  proficient: number;
}

export interface Loot extends ItemDescription, Identifiable, ItemType, PhysicalItem {
  properties: Array<string>;
}

export interface Tool extends Activities, ItemDescription, Identifiable, ItemType, PhysicalItem, EquippableItem {
  ability: string;
  chatFlavor: string;
  proficient: number;
  properties: Array<string>;
  bonus: string;
}

export interface Weapon extends Activities, ItemDescription, Identifiable, ItemType, PhysicalItem, EquippableItem, Mountable {
  ammunition: {
    type: string;
  }
  damage: {
    base: Damage;
    versatile: Damage;
  }
  magicalBonus: number;
  mastery: string;
  properties: Array<string>;
  proficient: number;
  range: {
    value: number;
    long: number;
    reach: number;
    units: string;
  }
}

/**************************
 * 
 * Non-Gear Activity Items
 * 
 **************************/

export interface Feat extends Activities, ItemDescription, ItemType {
  enchant: {
    max: string;
    period: string;
  }
  prerequisities: {
    level: number;
  }
  properties: Array<string>;
  requirements: string;
}

export interface Spell extends Activities, ItemDescription {
  ability: string;
  activation: Activation;
  duration: Duration;
  level: number;
  materials: {
    value: string;
    consumed: boolean;
    cost: number;
    supply: number;
  }
  preparation: {
    mode: string;
    prepared: boolean;
  }
  properties: Array<string>;
  range: Range;
  school: string;
  sourceClass: string;
  target: Target;
}

/**
 * 
 * A5E-for-DND5E Subtypes
 * 
 */

export interface Culture extends ItemDescription {
  advancement: Advancement[];
}

export interface Destiny extends ItemDescription {
  advancement: Advancement[];
}

export interface Maneuver extends ItemDescription, Activities {
  activation: Activation;
  duration: Duration;
  range: Range;
  target: Target;
  degree: number;
  tradition: string;
  prerequisite: string;
  properties: Array<string>;
  sourceClass: string;
}