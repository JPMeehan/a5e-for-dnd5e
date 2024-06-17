/**
 * @typedef {Object} ActiveEffectData
 * @property {string} _id                 The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
 * @property {string} name                The name of the which describes the name of the ActiveEffect
 * @property {EffectChangeData[]} changes The array of EffectChangeData objects which the ActiveEffect applies
 * @property {boolean} [disabled=false]   Is this ActiveEffect currently disabled?
 * @property {EffectDurationData} [duration] An EffectDurationData object which describes the duration of the ActiveEffect
 * @property {string} [description]       The HTML text description for this ActiveEffect document.
 * @property {string} [icon]              An icon image path used to depict the ActiveEffect
 * @property {string} [origin]            A UUID reference to the document from which this ActiveEffect originated
 * @property {string} [tint=null]         A color string which applies a tint to the ActiveEffect icon
 * @property {boolean} [transfer=false]   Does this ActiveEffect automatically transfer from an Item to an Actor?
 * @property {Set<string>} [statuses]     Special status IDs that pertain to this effect
 * @property {object} [flags]             An object of optional key/value flags
 */

/**
 * @typedef {Object} EffectDurationData
 * @property {number} [startTime]         The world time when the active effect first started
 * @property {number} [seconds]           The maximum duration of the effect, in seconds
 * @property {string} [combat]            The _id of the CombatEncounter in which the effect first started
 * @property {number} [rounds]            The maximum duration of the effect, in combat rounds
 * @property {number} [turns]             The maximum duration of the effect, in combat turns
 * @property {number} [startRound]        The round of the CombatEncounter in which the effect first started
 * @property {number} [startTurn]         The turn of the CombatEncounter in which the effect first started
 */

/**
 * @typedef {Object} EffectChangeData
 * @property {string} key                 The attribute path in the Actor or Item data which the change modifies
 * @property {string} value               The value of the change effect
 * @property {number} mode                The modification mode with which the change is applied
 * @property {number} priority            The priority level with which this change is applied
 */
