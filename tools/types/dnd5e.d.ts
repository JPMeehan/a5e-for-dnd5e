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
    value: Set<string>;
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

interface Activation {
  type: string;
  value: number;
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

interface Uses {
  spent: number;
  max: string;
  recovery: Array<{
    period: string;
    type: string;
    formula: string;
  }>
}

interface Damage {
  number: number;
  denomination: number;
  bonus: string;
  types: Set<string>;
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
    associated: Set<string>;
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
      activity: Set<string>;
      effect: Set<string>;
      item: Set<string>;
    }
  }>
  enchant: {
    identifier: string;
  }
  restrictions: {
    allowMagical: boolean;
    categories: Set<string>;
    properties: Set<string>;
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
  types: Set<string>;
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
  creatureSizes: Set<string>;
  creatureTypes: Set<string>;
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

export interface ActivitiesTemplate {
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
    subtype: string;
    baseItem: string;
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
    price: {
      value: number;
      denomination: string;
    }
    rarity: string;
  }
}