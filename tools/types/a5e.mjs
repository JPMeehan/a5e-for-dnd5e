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
 * @typedef {object} a5eAction
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
