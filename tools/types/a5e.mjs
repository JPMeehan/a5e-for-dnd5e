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
 * @property {Record<string, Rolls>} rolls
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
 * @typedef {object} Rolls
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
 * @property {object} source
 * @property {string} source.name
 * @property {string} source.link
 * @property {string} source.publisher
 * @property {object} uses
 * @property {number} uses.value
 * @property {string} uses.max
 * @property {string} uses.per
 * @property {object} uses.recharge
 * @property {string} uses.recharge.formula
 * @property {string} uses.recharge.threshold
 */

/**
 * @typedef {object} ACTemplate
 * @property {object} ac
 * @property {string} ac.baseFormula
 * @property {string} ac.formula
 * @property {number} ac.maxDex
 * @property {number} ac.minStr
 * @property {number} ac.mode
 * @property {boolean} ac.requiresNoShield
 * @property {boolean} ac.requiresUnarmored
 */

/**
 * @typedef {object} Spell
 * @property {object} system.components
 * @property {boolean} system.components.vocalized
 * @property {boolean} system.components.seen
 * @property {boolean} system.components.material
 * @property {boolean} system.concentration
 * @property {number} system.level
 * @property {string} system.materials
 * @property {boolean} system.materialsConsumed
 * @property {boolean} system.prepared
 * @property {string} system.prerequisite
 * @property {boolean} system.ritual
 * @property {object} system.schools
 * @property {string} system.schools.primary
 * @property {string[]} system.schools.secondary
 */
