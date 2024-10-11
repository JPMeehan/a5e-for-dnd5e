export interface ActionRange {
  range: string | number;
  unit?: string;
}

export interface ScalingProperties {
  formula: string;
  mode: string;
  step?: number;
}

export interface Action {
  name: string;
  description?: string;
  activation: {
    type: string;
    cost?: number;
    reactionTrigger?: string;
  };
  area?: {
    quantity: number;
    shape: string;
    scaling?: {
      formula: Record<string, string>;
      mode: string;
      step?: number;
    };
    radius?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  duration: {
    unit: string;
    value: number;
  };
  consumers: any;
  prompts: object;
  ranges: Record<string, ActionRange>;
  rolls: Record<string, Roll>;
  target: {
    quantity?: number;
    scaling: ScalingProperties;
    type: string;
  };
  uses: {
    value: number;
    max: string;
    per: string;
    recharge: {
      formula: string;
      threshold: string;
    };
  };
}

export interface Roll {
  default: boolean;
  label: string;
  type: string;
  ability?: string;
  attackType?: string;
  proficient?: boolean;
  canCrit?: boolean;
  critBonus?: string;
  damageType?: string;
  formula?: string;
  scaling?: ScalingProperties;
  healingType?: string;
  skill?: string;
  tool?: string;
}

export interface BaseTemplate {
  actions: Record<string, Action>;
  description: string;
  favorite: boolean;
  secretDescription: string;
  source: string;
  uses: {
    value: number;
    max: string;
    per: string;
    recharge: {
      formula: string;
      threshold: string;
    };
  };
}

export interface ACTemplate {
  baseFormula: string;
  formula: string;
  grantsDisadvantage: boolean;
  maxDex: number;
  minStr: number;
  mode: number;
  requiresNoShield: boolean;
  requiresUnarmored: boolean;
}

export interface BaseGrant {
  _id: string;
  default: boolean;
  img: string;
  grantType: string;
  label: string;
  level: number;
  levelType: 'character' | 'class';
  optional: boolean;
  grantedBy?: { id: string, selectionId: string };
}

export interface AbilityGrant extends BaseGrant {
  grantType: 'ability';
  abilities: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  context: {
    types: string[],
    requiresProficiency: boolean
  }
}

export interface AttackGrant extends BaseGrant {
  grantType: 'attack';
  attackTypes: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  context: {
    spellLevels: string[],
    requiresProficiency: boolean
  }
}

export interface DamageGrant extends BaseGrant {
  grantType: 'damage';
  bonus: string;
  damageType: string;
  context: {
    attackTypes: string[],
    damageTypes: string[],
    spellLevels: string[],
    isCritBonus: boolean
  }
}

export interface ExertionGrant extends BaseGrant {
  grantType: 'exertion';
  exertionType: 'bonus' | 'pool';
  bonus: string;
  poolType: 'none' | 'prof' | 'doubleProf';
}

export interface ExpertiseDiceGrant extends BaseGrant {
  grantType: 'expertiseDice';
  keys: {
    base: string[],
    options: string[],
    total: number,
  };
  expertiseCount: number;
  expertiseType: string;
}

export interface FeatureGrant extends BaseGrant {
  grantType: 'feature';
  features: {
    base: { uuid: string, limitedReselection: boolean, selectionLimit: number }[],
    options: { uuid: string, limitedReselection: boolean, selectionLimit: number }[],
    total: number,
  };
}

export interface HealingGrant extends BaseGrant {
  grantType: 'healing';
  bonus: string;
  healingType: string;
  context: {
    healingTypes: string[],
    spellLevels: string[]
  }
}

export interface InitiativeGrant extends BaseGrant {
  grantType: 'initiative';
  bonus: string;
  context: {
    abilities: string[],
    skills: string[]
  }
}

type _ItemGrant = {
  uuid: string;
  quantityOverride: number;
}

export interface ItemGrant extends BaseGrant {
  grantType: 'item';
  items: {
    base: _ItemGrant[],
    options: _ItemGrant[],
  }
  total: number,
}

export interface MovementGrant extends BaseGrant {
  grantType: 'movement';
  movementTypes: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  unit: string;
  context: {
    isHover: boolean
  }
}

export interface ProficiencyGrant extends BaseGrant {
  grantType: 'proficiency';
  keys: {
    base: string[],
    options: string[],
    total: number,
  };
  proficiencyType: string;
}

export interface RollOverrideGrant extends BaseGrant {
  grantType: 'rollOverride';
  keys: {
    base: string[],
    options: string[],
    total: number,
  };
  rollMode: number;
  rollOverrideType: string;
}

export interface SensesGrant extends BaseGrant {
  grantType: 'senses';
  senses: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  unit: string;
  context: {
    otherwiseBlind: boolean
  }
}

export interface SkillGrant extends BaseGrant {
  grantType: 'skill';
  choices: {
    base: string[],
    options: string[],
    total: number,
  };
  skillKey: string;
  bonus: string;
}

export interface SkillSpecialtyGrant extends BaseGrant {
  grantType: 'skillSpecialty';
  skill: string;
  specialties: {
    base: string[],
    options: string[],
    total: number,
  };
}

export interface TraitGrant extends BaseGrant {
  grantType: 'trait';
  traits: {
    base: string[],
    options: string[],
    total: number,
    traitType: string
  };
}

export type Grant = AbilityGrant
  | AttackGrant
  | DamageGrant
  | HealingGrant
  | ExertionGrant
  | ExpertiseDiceGrant
  | FeatureGrant
  | InitiativeGrant
  | ItemGrant
  | MovementGrant
  | ProficiencyGrant
  | SensesGrant
  | SkillGrant
  | SkillSpecialtyGrant
  | TraitGrant;

/**********************
 *
 * Feature, Spell, Maneuver
 *
 **********************/

export interface Feature extends BaseTemplate {
  ac: ACTemplate;
  concentration: boolean;
  featureType: string;
  grants: Record<string, Grant>;
  prerequisite: string;
  requiresBloodied: boolean;
}

export interface Spell extends BaseTemplate {
  components: {
    vocalized: boolean;
    seen: boolean;
    material: boolean;
  };
  concentration: boolean;
  level: number;
  materials: string;
  materialsConsumed: boolean;
  prepared: boolean;
  prerequisite: string;
  rare: boolean;
  ritual: boolean;
  schools: {
    primary: string;
    secondary: string[];
  };
}

export interface Maneuver extends BaseTemplate {
  concentration: boolean;
  degree: number;
  exertionCost: number;
  isStance: boolean;
  prerequisite: string;
  rare: boolean;
  tradition: string;
}

/********************
 *
 *      ORIGINS
 *
 ********************/

export interface Background {
  description: string;
  grants: Record<string, Grant>;
  source: string;
}

export interface Culture {
  description: string;
  grants: Record<string, Grant>;
  source: string;
}

export interface Destiny {
  description: string;
  sourceOfInspiration: string;
  inspirationFeature: string;
  fulfillmentFeature: string;
}

export interface Heritage {
  description: string;
  grants: Record<string, Grant>;
  source: string;
}

/***
 *
 * CLASSES
 *
 */

export interface ClassResource {
  name: string;
  reference: object;
  type: string;
}

export interface ClassA5E {
  slug: string;
  description: string;
  classLevels: number;
  hp: {
    hitDiceSize: number;
    hitDiceUsed: number;
    levels: object;
  };
  grants: Record<string, Grant>;
  resources: ClassResource[];
  source: string;
  spellcasting: {
    ability: {
      base: string;
      options: string[];
      value: string;
    };
    casterType: string;
    knownCantrips: object;
    knownSpells: object;
  };
  wealth: string;
}

export interface Archetype {
  slug: string;
  class: string;
  description: string;
  grants: Record<string, Grant>;
  resources: ClassResource[];
  source: string;
  spellcasting: {
    ability: {
      base: string;
      options: string[];
      value: string;
    };
    casterType: string;
    knownCantrips: object;
    knownSpells: object;
  };
}

/**
 *
 * OBJECT
 *
 */

export interface ObjectA5E {
  ac: ACTemplate;
  ammunitionProperties: string[];
  armorCategory: string;
  armorProperties: string[];
  attuned: boolean;
  bulky: boolean;
  containerId: string;
  craftingComponents: string;
  damagedState: number;
  equippedState: number;
  items: object;
  materialProperties: string[];
  objectType: string;
  plotItem: boolean;
  price: number;
  proficient: boolean;
  quantity: number;
  rarity: string;
  requiresAttunement: boolean;
  shieldCategory: string;
  shieldProperties: string[];
  unidentified: boolean;
  unidentifiedDescription: string;
  unidentifiedName: string;
  weaponProperties: string[];
  weight: number;
}