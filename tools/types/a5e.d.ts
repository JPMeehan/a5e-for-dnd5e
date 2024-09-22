interface ActionRange {
  range: string | number;
  unit?: string;
}

interface ScalingProperties {
  formula: string;
  mode: string;
  step?: number;
}

interface Action {
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

interface Roll {
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

interface BaseTemplate {
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

interface ACTemplate {
  baseFormula: string;
  formula: string;
  grantsDisadvantage: boolean;
  maxDex: number;
  minStr: number;
  mode: number;
  requiresNoShield: boolean;
  requiresUnarmored: boolean;
}

interface GrantSchema {
  uuid: string;
  limitedReselection: string;
  selectionLimit?: number;
}

interface BaseGrant {
  grantType: string;
  label: string;
  optional?: boolean;
  level?: number;
  img?: number;
  default?: number;
}

interface AbilityGrant extends BaseGrant {
  grantType: "ability",
  abilities: {
    base: string[];
    options: string[];
    total: number;
  };
  bonus: string;
  context: {
    types: string[];
    requiresProficiency: boolean;
  };
}

interface AttackGrant extends BaseGrant {
  grantType: "attack",
  attackTypes: {
    base: string[];
    options: string[];
    total: number;
  };
  bonus: string;
  context: {
    spellLevels: string[];
    requiresProficiency: boolean;
  };
}

interface DamageGrant extends BaseGrant {
  grantType: "damage",
  bonus: number;
  damageType: string;
  context: {
    attackTypes: string[];
    damageTypes: string[];
    isCritBonus: boolean;
    spellLevels: string[];
  };
}

interface ExpertiseDiceGrant extends BaseGrant {
  grantType: "expertise"
}

interface FeatureGrant extends BaseGrant {}