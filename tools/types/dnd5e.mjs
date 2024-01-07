/**
 * Field for storing creature type data.
 * @typedef CreatureType
 * @property {string} value
 * @property {string} subtype
 * @property {string} swarm
 * @property {string} custom
 */

/**
 * A template for currently held currencies.
 * @typedef Currency
 * @property {Object<string, string>} currency
 */

/**
 * Field for storing movement data.
 * @typedef Movement
 * @property {number} burrow
 * @property {number} climb
 * @property {number} fly
 * @property {number} swim
 * @property {number} walk
 * @property {string} units
 * @property {boolean} hover
 */

/**
 * Field for storing senses data.
 * @typedef Senses
 * @property {number} darkvision
 * @property {number} blindsight
 * @property {number} tremorsense
 * @property {number} truesight
 * @property {string} units
 * @property {string} special
 */

/**
 * Data model template for item actions.
 * @typedef Action
 * @property {string} ability             Ability score to use when determining modifier.
 * @property {string} actionType          Action type as defined in `DND5E.itemActionTypes`.
 * @property {string} attackBonus         Numeric or dice bonus to attack rolls.
 * @property {string} chatFlavor          Extra text displayed in chat.
 * @property {object} critical            Information on how critical hits are handled.
 * @property {number} critical.threshold  Minimum number on the dice to roll a critical hit.
 * @property {string} critical.damage     Extra damage on critical hit.
 * @property {object} damage              Item damage formulas.
 * @property {string[][]} damage.parts    Array of damage formula and types.
 * @property {string} damage.versatile    Special versatile damage formula.
 * @property {string} formula             Other roll formula.
 * @property {object} save                Item saving throw data.
 * @property {string} save.ability        Ability required for the save.
 * @property {number} save.dc             Custom saving throw value.
 * @property {string} save.scaling        Method for automatically determining saving throw DC.
 * @mixin
 */

/**
 * Data model template for items that can be used as some sort of action.
 * @typedef ActivatedEffect
 * @property {object} activation            Effect's activation conditions.
 * @property {string} activation.type       Activation type as defined in `DND5E.abilityActivationTypes`.
 * @property {number} activation.cost       How much of the activation type is needed to use this item's effect.
 * @property {string} activation.condition  Special conditions required to activate the item.
 * @property {object} duration              Effect's duration.
 * @property {number} duration.value        How long the effect lasts.
 * @property {string} duration.units        Time duration period as defined in `DND5E.timePeriods`.
 * @property {number} cover                 Amount of cover does this item affords to its crew on a vehicle.
 * @property {object} target                Effect's valid targets.
 * @property {number} target.value          Length or radius of target depending on targeting mode selected.
 * @property {number} target.width          Width of line when line type is selected.
 * @property {string} target.units          Units used for value and width as defined in `DND5E.distanceUnits`.
 * @property {string} target.type           Targeting mode as defined in `DND5E.targetTypes`.
 * @property {object} range                 Effect's range.
 * @property {number} range.value           Regular targeting distance for item's effect.
 * @property {number} range.long            Maximum targeting distance for features that have a separate long range.
 * @property {string} range.units           Units used for value and long as defined in `DND5E.distanceUnits`.
 * @property {object} uses                  Effect's limited uses.
 * @property {number} uses.value            Current available uses.
 * @property {string} uses.max              Maximum possible uses or a formula to derive that number.
 * @property {string} uses.per              Recharge time for limited uses as defined in `DND5E.limitedUsePeriods`.
 * @property {object} consume               Effect's resource consumption.
 * @property {string} consume.type          Type of resource to consume as defined in `DND5E.abilityConsumptionTypes`.
 * @property {string} consume.target        Item ID or resource key path of resource to consume.
 * @property {number} consume.amount        Quantity of the resource to consume per use.
 * @mixin
 */

/**
 * Items that can be attuned and equipped
 * @typedef EquippableItem
 * @property {number} attunement
 * @property {boolean} equipped
 */

/**
 * Item description & source.
 * @typedef ItemDescription
 * @property {object} description               Various item descriptions.
 * @property {string} description.value         Full item description.
 * @property {string} description.chat          Description displayed in chat card.
 * @property {string} description.unidentified  Description displayed if item is unidentified.
 * @property {SourceField} source               Adventure or sourcebook where this item originated.
 */

/**
 * Data fields that stores information on the adventure or sourcebook where this document originated.
 * @typedef SourceField
 * @property {string} book     Book/publication where the item originated.
 * @property {string} page     Page or section where the item can be found.
 * @property {string} custom   Fully custom source label.
 * @property {string} license  Type of license that covers this item.
 */

/**
 * Data model template for equipment that can be mounted on a vehicle.
 * @typedef Mountable
 * @property {object} armor          Equipment's armor class.
 * @property {number} armor.value    Armor class value for equipment.
 * @property {object} hp             Equipment's hit points.
 * @property {number} hp.value       Current hit point value.
 * @property {number} hp.max         Max hit points.
 * @property {number} hp.dt          Damage threshold.
 * @property {string} hp.conditions  Conditions that are triggered when this equipment takes damage.
 * @mixin
 */

/**
 * Data model template with information on physical items.
 * @typedef PhysicalItem
 * @property {number} quantity            Number of items in a stack.
 * @property {number} weight              Item's weight in pounds or kilograms (depending on system setting).
 * @property {object} price
 * @property {number} price.value         Item's cost in the specified denomination.
 * @property {string} price.denomination  Currency denomination used to determine price.
 * @property {string} rarity              Item rarity as defined in `DND5E.itemRarity`.
 * @property {boolean} identified         Has this item been identified?
 * @mixin
 */

/**
 * Data definition for Weapon items.
 * @typedef Weapon
 * @property {string} weaponType   Weapon category as defined in `DND5E.weaponTypes`.
 * @property {string} baseItem     Base weapon as defined in `DND5E.weaponIds` for determining proficiency.
 * @property {object} properties   Mapping of various weapon property booleans.
 * @property {number} proficient   Does the weapon's owner have proficiency?
 */
