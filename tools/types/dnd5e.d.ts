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