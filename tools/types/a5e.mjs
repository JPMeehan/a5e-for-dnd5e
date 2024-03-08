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
 * @typedef GrantCore
 * @property {string} grantType
 * @property {string} label
 * @property {boolean} [optional]
 * @property {number} [level]
 * @property {number} [img]
 * @property {number} [default]
 *
 */

/**
 * @typedef ASI
 * @property {object} abilities
 * @property {object} context
 * @property {string} bonus
 */

/**
 * @typedef Proficiency
 * @property {object} keys
 * @property {string} proficiencyType
 */

/**
 * @typedef {object} Feature
 */

/**
 * @typedef {object} Item
 */

/**
 * @typedef Movement
 * @property {object} movementTypes
 * @property {string} bonus
 * @property {string} unit
 */

/**
 * @typedef Trait
 * @property {object} traits
 */

/**
 * @typedef {GrantCore & (ASI | Proficiency | Movement | Trait)} Grant
 */

/**********************
 *
 * Feature, Spell, Maneuver
 *
 **********************/

/**
 * @typedef {BaseTemplate} Feature
 * @property {ACTemplate} ac
 * @property {boolean} concentration
 * @property {string} featureType
 * @property {Record<string, Grant>} grants
 * @property {boolean} requiresBloodied
 */

/**
 * @typedef {BaseTemplate} Spell
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
 * @typedef {BaseTemplate} Maneuver
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

/**
 *
 * OBJECT
 *
 */

/**
 * @typedef {BaseTemplate} ObjectA5E
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
