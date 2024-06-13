/**
 * @typedef {object} ActionRange
 * @property {string | number} range
 * @property {string} [unit]
 *
 */

/**
 * @typedef {object} ScalingProperties
 * @property {string} formula
 * @property {string} mode
 * @property {number} [step]
 */

/**
 * @typedef {object} Action
 * @property {string} name
 * @property {string} [description]
 * @property {object} activation
 * @property {string} activation.type
 * @property {number} [activation.cost]
 * @property {string} [activation.reactionTrigger]
 * @property {object} [area]
 * @property {number} area.quantity
 * @property {string} area.shape
 * @property {object} [area.scaling]
 * @property {Record<string, string>} area.scaling.formula
 * @property {string} area.scaling.mode
 * @property {number} [area.scaling.step]
 * @property {number} [area.radius]
 * @property {number} [area.length]
 * @property {number} [area.width]
 * @property {number} [area.height]
 * @property {object} duration
 * @property {string} duration.unit
 * @property {number} duration.value
 * @property {any} consumers
 * @property {object} prompts
 * @property {Record<string, ActionRange>} ranges
 * @property {Record<string, Roll>} rolls
 * @property {object} target
 * @property {number} [target.quantity]
 * @property {ScalingProperties} target.scaling
 * @property {string} target.type
 * @property {object} uses
 * @property {object} uses.value
 * @property {object} uses.max
 * @property {object} uses.per
 * @property {object} [uses.recharge]
 */

/**
 * @typedef {object} Roll
 * @property {boolean} default
 * @property {string} label
 * @property {string} type
 * @property {string} [ability]
 * @property {string} [attackType]
 * @property {boolean} [proficient]
 * @property {boolean} [canCrit]
 * @property {string} [critBonus]
 * @property {string} [damageType]
 * @property {string} [formula]
 * @property {ScalingProperties} [scaling]
 * @property {string} [healingType]
 * @property {string} [skill]
 * @property {string} [tool]
 */

/**
 * @typedef {object} BaseTemplate
 * @property {Record<string, Action>} actions
 * @property {string} description
 * @property {boolean} favorite
 * @property {string} secretDescription
 * @property {string} source
 * @property {object} uses
 * @property {number} uses.value
 * @property {string} uses.max
 * @property {string} uses.per
 * @property {object} uses.recharge
 * @property {string} uses.recharge.formula
 * @property {string} uses.recharge.threshold
 */

/**
 * @typedef ACTemplate
 * @property {string} baseFormula
 * @property {string} formula
 * @property {boolean} grantsDisadvantage
 * @property {number} maxDex
 * @property {number} minStr
 * @property {number} mode
 * @property {boolean} requiresNoShield
 * @property {boolean} requiresUnarmored
 */

/**
 *
 * GRANTS
 *
 */

/**
 * @typedef GrantSchema
 * @property {string} uuid
 * @property {string} limitedReselection
 * @property {number} selectionLimit
 */

/**
 * @typedef BaseGrant
 * @property {string} grantType
 * @property {string} label
 * @property {boolean} [optional]
 * @property {number} [level]
 * @property {number} [img]
 * @property {number} [default]
 *
 */

/**
 * @typedef AbilityGrant
 * @property {"ability"} grantType
 * @property {object} abilities
 * @property {string[]} abilities.base
 * @property {string[]} abilities.options
 * @property {number} abilities.total
 * @property {string} bonus
 * @property {object} context
 * @property {string[]} context.types
 * @property {boolean} context.requiresProficiency
 */

/**
 * @typedef AttackGrant
 * @property {"attack"} grantType
 * @property {object} attackTypes
 * @property {string[]} attackTypes.base
 * @property {string[]} attackTypes.options
 * @property {number} attackTypes.total
 * @property {string} bonus
 * @property {object} context
 * @property {string[]} context.spellLevels
 * @property {boolean} context.requiresProficiency
 */

/**
 * @typedef DamageGrant
 * @property {"damage"} grantType
 * @property {number} bonus
 * @property {string} damageType
 * @property {object} context
 * @property {string[]} context.attackTypes
 * @property {string[]} context.damageTypes
 * @property {boolean} context.isCritBonus
 * @property {string[]} context.spellLevels
 */

/**
 * @typedef ExpertiseDiceGrant
 * @property {"expertiseDice"} grantType
 */

/**
 * @typedef FeatureGrant
 * @property {"feature"} grantType
 * @property {object} features
 * @property {GrantSchema[]} features.base
 * @property {GrantSchema[]} features.options
 * @property {number} features.total
 */

/**
 * @typedef HealingGrant
 * @property {"healing"} grantType
 * @property {string} bonus
 * @property {object} context
 * @property {string[]} context.healingTypes
 * @property {string[]} context.spellLevels
 * @property {string} healingType
 */

/**
 * @typedef InitiativeGrant
 * @property {"initiative"} grantType
 * @property {string} bonus
 * @property {object} context
 * @property {string[]} context.abilities
 * @property {string[]} context.skills
 */

/**
 * @typedef _ItemGrant
 * @property {string} uuid
 * @property {number} quantityOverride
 */

/**
 * @typedef ItemGrant
 * @property {"item"} grantType
 * @property {object} items
 * @property {_ItemGrant[]} items.base
 * @property {_ItemGrant[]} items.options
 * @property {number} items.total
 */

/**
 * @typedef MovementGrant
 * @property {"movement"} grantType
 * @property {object} movementTypes
 * @property {string[]} movementTypes.base
 * @property {string[]} movementTypes.options
 * @property {number} movementTypes.total
 * @property {string} bonus
 * @property {string} unit
 * @property {object} context
 * @property {boolean} context.isHover
 */

/**
 * @typedef ProficiencyGrant
 * @property {"proficiency"} grantType
 * @property {object} keys
 * @property {string[]} keys.base
 * @property {string[]} keys.options
 * @property {number} keys.total
 * @property {string} proficiencyType
 */

/**
 * @typedef SensesGrant
 * @property {"senses"} grantType
 * @property {object} senses
 * @property {string[]} senses.base
 * @property {string[]} senses.options
 * @property {number} senses.total
 * @property {string} bonus
 * @property {string} unit
 * @property {object} context
 * @property {boolean} context.otherwiseBlind
 */

/**
 * @typedef SkillGrant
 * @property {"skills"} grantType
 * @property {object} skills
 * @property {string[]} skills.base
 * @property {string[]} skills.options
 * @property {number} skills.total
 * @property {string} bonus
 * @property {string} unit
 * @property {object} context
 * @property {boolean} context.passiveOnly
 * @property {boolean} context.requiresProficiency
 */

/**
 * @typedef {"armorTypes" | "conditionImmunities" | "creatureTypes" |
 * "damageImmunities" | "damageResistances" | "damageVulnerabilities" |
 * "languages" | "maneuverTraditions" | "size" | "tools" | "weapons"} TraitType
 */

/**
 * @typedef Traits
 * @property {string[]} base
 * @property {string[]} options
 * @property {number} total
 * @property {TraitType} traitType
 */

/**
 * @typedef TraitGrant
 * @property {"trait"} grantType
 * @property {Traits} traits
 */

/**
 * @typedef {BaseGrant &
 * (AbilityGrant | AttackGrant | DamageGrant | ExpertiseDiceGrant |
 * FeatureGrant | HealingGrant | InitiativeGrant | ItemGrant | MovementGrant |
 * ProficiencyGrant | SensesGrant | SkillGrant | TraitGrant)} Grant
 */

/**********************
 *
 * Feature, Spell, Maneuver
 *
 **********************/

/**
 * @typedef Feature
 * @property {ACTemplate} ac
 * @property {boolean} concentration
 * @property {string} featureType
 * @property {Record<string, Grant>} grants
 * @property {string} prerequisite
 * @property {boolean} requiresBloodied
 */

/**
 * @typedef Spell
 * @property {object} components
 * @property {boolean} components.vocalized
 * @property {boolean} components.seen
 * @property {boolean} components.material
 * @property {boolean} concentration
 * @property {number} level
 * @property {string} materials
 * @property {boolean} materialsConsumed
 * @property {boolean} prepared
 * @property {string} prerequisite
 * @property {boolean} rare
 * @property {boolean} ritual
 * @property {object} schools
 * @property {string} schools.primary
 * @property {string[]} schools.secondary
 */

/**
 * @typedef Maneuver
 * @property {boolean} concentration
 * @property {number} degree
 * @property {number} exertionCost
 * @property {boolean} isStance
 * @property {string} prerequisite
 * @property {boolean} rare
 * @property {string} tradition
 */

/********************
 *
 *      ORIGINS
 *
 ********************/

/**
 * @typedef Background
 * @property {string} description
 * @property {Record<string, Grant>} grants
 * @property {string} source
 */

/**
 * @typedef Culture
 * @property {string} description
 * @property {Record<string, Grant>} grants
 * @property {string} source
 */

/**
 * @typedef Destiny
 * @property {string} description
 * @property {string} sourceOfInspiration
 * @property {string} inspirationFeature
 * @property {string} fulfillmentFeature
 */

/**
 * @typedef Heritage
 * @property {string} description
 * @property {Record<string, Grant>} grants
 * @property {string} source
 */

/***
 *
 * CLASSES
 *
 */

/**
 * @typedef ClassResource
 * @property {string} name
 * @property {object} reference
 * @property {string} type
 */

/**
 * @typedef ClassA5E
 * @property {string} slug
 * @property {string} description
 * @property {number} classLevels
 * @property {object} hp
 * @property {number} hp.hitDiceSize
 * @property {number} hp.hitDiceUsed
 * @property {object} hp.levels
 * @property {Record<string, Grant>} grants
 * @property {Array<ClassResource>} resources
 * @property {string} source
 * @property {object} spellcasting
 * @property {object} spellcasting.ability
 * @property {string} spellcasting.ability.base
 * @property {string[]} spellcasting.ability.options
 * @property {string} spellcasting.ability.value
 * @property {string} spellcasting.ability.casterType
 * @property {object} spellcasting.ability.knownCantrips
 * @property {object} spellcasting.ability.knownSpells
 * @property {string} wealth
 */

/**
 *
 * OBJECT
 *
 */

/**
 * @typedef ObjectA5E
 * @property {ACTemplate} ac
 * @property {string[]} ammunitionProperties
 * @property {string} armorCategory
 * @property {string[]} armorProperties
 * @property {boolean} attuned
 * @property {boolean} bulky
 * @property {string} containerId
 * @property {string} craftingComponents
 * @property {number} damagedState
 * @property {number} equippedState
 * @property {object} items
 * @property {string[]} materialProperties
 * @property {string} objectType
 * @property {boolean} plotItem
 * @property {number} price
 * @property {boolean} proficient
 * @property {number} quantity
 * @property {string} rarity
 * @property {boolean} requiresAttunement
 * @property {string} shieldCategory
 * @property {string[]} shieldProperties
 * @property {boolean} unidentified
 * @property {string} unidentifiedDescription
 * @property {string} unidentifiedName
 * @property {string[]} weaponProperties
 * @property {number} weight
 */
