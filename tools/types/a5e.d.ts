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

export interface ItemGrant extends BaseGrant {
  grantType: 'item';
  items: {
    base: {
      uuid: string,
      quantityOverride: number,
    }[],
    options: {
      uuid: string,
      quantityOverride: number,
    }[],
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