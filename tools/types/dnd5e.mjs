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
 * @typedef EquipmentEntryData Data for a single entry in the equipment list.
 * @property {string} _id                     Unique ID of this entry.
 * @property {string|null} group              Parent entry that contains this one.
 * @property {number} sort                    Sorting order of this entry.
 * @property {string} type                    Entry type as defined in `EquipmentEntryData#TYPES`.
 * @property {number} [count]                 Number of items granted. If empty, assumed to be `1`.
 * @property {string} [key]                   Category or item key unless type is "linked", in which case it is a UUID.
 * @property {boolean} [requiresProficiency]  Is this only a valid item if character already has the
 *                                            required proficiency.
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
 * @property {number} attunement    Attunement information as defined in `DND5E.attunementTypes`.
 * @property {boolean} equipped     Is this item equipped on its owning actor.
 */

/**
 * Items that can be identified.
 * @typedef Identifiable
 * @property {boolean} identified               Has this item been identified?
 * @property {object} unidentified
 * @property {string} unidentified.name         Name of the item when it is unidentified.
 * @property {string} unidentified.description  Description displayed if item is unidentified.
 */

/**
 * Item description & source.
 * @typedef ItemDescription
 * @property {object} description               Various item descriptions.
 * @property {string} description.value         Full item description.
 * @property {string} description.chat          Description displayed in chat card.
 * @property {SourceField} source               Adventure or sourcebook where this item originated.
 */

/**
 * Data fields that stores information on the adventure or sourcebook where this document originated.
 * @typedef SourceField
 * @property {string} [book]     Book/publication where the item originated.
 * @property {string} [page]     Page or section where the item can be found.
 * @property {string} [custom]   Fully custom source label.
 * @property {string} [license]  Type of license that covers this item.
 */

/**
 * @typedef ItemType Standardized item type object.
 * @property {string} value                Category to which this item belongs.
 * @property {string} [subtype]            Item subtype according to its category.
 * @property {string} [baseItem]           Item this one is based on.
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
 * @property {string} container           Container within which this item is located.
 * @property {number} quantity            Number of items in a stack.
 * @property {number} weight              Item's weight in pounds or kilograms (depending on system setting).
 * @property {object} price
 * @property {number} price.value         Item's cost in the specified denomination.
 * @property {string} price.denomination  Currency denomination used to determine price.
 * @property {string} rarity              Item rarity as defined in `DND5E.itemRarity`.
 * @mixin
 */

/**
 * Advancements
 */

/**
 * @typedef BaseAdvancement
 * @property {string} _id
 * @property {number} level
 * @property {string} title
 * @property {string} icon
 * @property {string} classRestriction
 */

/**
 * @typedef {"str" | "dex" | "con" | "int" | "wis" | "cha"} AbilityScores
 */

/**
 * @typedef AbilityScoreImprovement                 Data model for the Ability Score Improvement advancement configuration.
 * @property {number} points                        Number of points that can be assigned to any score.
 * @property {Record<AbilityScores, number>} fixed  Number of points automatically assigned to a certain score.
 * @property {number} cap
 */

/**
 * @typedef _ItemGrant
 * @property {string} uuid
 */

/**
 * @typedef SpellConfiguration
 * @property {string} ability
 * @property {string} preparation
 * @property {object} uses
 * @property {string} uses.max
 * @property {string} uses.per
 */

/**
 * @typedef ItemChoice
 * @property {string} hint
 * @property {Record<string, number>} choices
 * @property {boolean} allowDrops
 * @property {string} type
 * @property {_ItemGrant[]} pool
 * @property {object} spell
 * @property {number} spell.type
 * @property {number} spell.subtype
 * @property {number} spell.level
 */

/**
 * @typedef ItemGrant
 * @property {_ItemGrant[]} items
 * @property {boolean} optional
 * @property {SpellConfiguration} spell
 */

/**
 * @typedef ScaleValue                      Data model for the Scale Value advancement type.
 * @property {object} identifier            Identifier used to select this scale value in roll formulas.
 * @property {string} type                  Type of data represented by this scale value.
 * @property {object} distance
 * @property {string} distance.units        If distance type is selected, the units each value uses.
 * @property {Record<string, object>} scale Scale values for each level. Value format is determined by type.
 */

/**
 * @typedef Size                Configuration data for the size advancement type.
 * @property {string} hint
 * @property {string[]} sizes
 */

/**
 * @typedef TraitChoice         Configuration for a specific trait choice.
 * @property {number} count     Number of traits that can be selected.
 * @property {string[]} [pool]  List of trait or category keys that can be chosen. If no choices are provided,
 *                              any trait of the specified type can be selected.
 */

/**
 * @typedef Trait                         Configuration data for the TraitAdvancement.
 * @property {string} hint                Hint displayed instead of the automatically generated one.
 * @property {string} mode                Method by which this advancement modifies the actor's traits.
 * @property {boolean} allowReplacements  Whether all potential choices should be presented to the user if there
 *                                        are no more choices available in a more limited set.
 * @property {string[]} grants            Keys for traits granted automatically.
 * @property {TraitChoice[]} choices      Choices presented to the user.
 */

/**
 * @typedef AbilityScoreImprovementAdvancement
 * @property {AbilityScoreImprovement} configuration
 * @property {"AbilityScoreImprovement"} type
 */

/**
 * @typedef HitPointsAdvancement
 * @property {"HitPoints"} type
 */

/**
 * @typedef ItemChoiceAdvancement
 * @property {ItemChoice} configuration
 * @property {"ItemChoice"} type
 */

/**
 * @typedef ItemGrantAdvancement
 * @property {ItemGrant} configuration
 * @property {"ItemGrant"} type
 */

/**
 * @typedef ScaleValueAdvancement
 * @property {ScaleValue} configuration
 * @property {"ScaleValue"} type
 */

/**
 * @typedef SizeAdvancement
 * @property {Size} configuration
 * @property {"Size"} type
 */

/**
 * @typedef TraitAdvancement
 * @property {Trait} configuration
 * @property {"Trait"} type
 */

/**
 * @typedef {BaseAdvancement &
 * (AbilityScoreImprovementAdvancement | HitPointsAdvancement |
 * ItemChoiceAdvancement | ItemGrantAdvancement | ScaleValueAdvancement |
 * SizeAdvancement | TraitAdvancement)} Advancement
 */

/**
 * Item Types
 */

/**
 * Data definition for Race items.
 * @typedef Race
 * @property {string} identifier            Identifier slug for this race.
 * @property {Advancement[]} advancement    Advancement objects for this race.
 * @property {Movement} movement
 * @property {Senses} senses
 * @property {CreatureType} type
 */

/**
 * Data definition for Background items.
 * @typedef Background
 * @property {Advancement[]} advancement
 * @property {EquipmentEntryData[]} startingEquipment  Different equipment entries that will be granted.
 */

/**
 * Data definition for Class items.
 * @typedef Class5e
 * @property {string} identifier            Identifier slug for this class.
 * @property {number} levels                Current number of levels in this class.
 * @property {string} hitDice               Denomination of hit dice available as defined in `DND5E.hitDieTypes`.
 * @property {number} hitDiceUsed           Number of hit dice consumed.
 * @property {Advancement[]} advancement    Advancement objects for this class.
 * @property {object} spellcasting          Details on class's spellcasting ability.
 * @property {string} spellcasting.progression  Spell progression granted by class as from `DND5E.spellProgression`.
 * @property {string} spellcasting.ability      Ability score to use for spellcasting.
 * @property {EquipmentEntryData[]} startingEquipment  Different equipment entries that will be granted.
 */

/**
 * Data definition for Subclass items.
 * @typedef Subclass5e
 * @property {string} identifier       Identifier slug for this subclass.
 * @property {string} classIdentifier  Identifier slug for the class with which this subclass should be associated.
 * @property {object[]} advancement    Advancement objects for this subclass.
 * @property {object} spellcasting              Details on subclass's spellcasting ability.
 * @property {string} spellcasting.progression  Spell progression granted by class as from `DND5E.spellProgression`.
 * @property {string} spellcasting.ability      Ability score to use for spellcasting.
 */

/**
 * Data definition for Consumable items.
 * @typedef Consumable
 * @property {ItemType} type
 * @property {Array<string>} properties  Ammunition properties.
 * @property {object} uses
 * @property {boolean} uses.autoDestroy  Should this item be destroyed when it runs out of uses.
 */

/**
 * Data definition for Container items.
 * @typedef Container
 * @property {object} capacity              Information on container's carrying capacity.
 * @property {string} capacity.type         Method for tracking max capacity as defined in `DND5E.itemCapacityTypes`.
 * @property {number} capacity.value        Total amount of the type this container can carry.
 */

/**
 * Data definition for Equipment items.
 * @typedef Equipment
 * @property {ItemType} type
 * @property {object} armor             Armor details and equipment type information.
 * @property {number} armor.value       Base armor class or shield bonus.
 * @property {number} armor.dex         Maximum dex bonus added to armor class.
 * @property {object} speed             Speed granted by a piece of vehicle equipment.
 * @property {number} speed.value       Speed granted by this piece of equipment measured in feet or meters
 *                                      depending on system setting.
 * @property {string} speed.conditions  Conditions that may affect item's speed.
 * @property {number} strength          Minimum strength required to use a piece of armor.
 * @property {number} proficient        Does the owner have proficiency in this piece of equipment?
 */

/**
 * Data definition for Feature items.
 * @typedef Feat
 * @property {ItemType} type
 * @property {Array<string>} properties             General properties of a feature item.
 * @property {string} requirements                  Actor details required to use this feature.
 * @property {object} recharge                      Details on how a feature can roll for recharges.
 * @property {number} recharge.value                Minimum number needed to roll on a d6 to recharge this feature.
 * @property {boolean} recharge.charged             Does this feature have a charge remaining?
 */

/**
 * Data definition for Loot items.
 * @typedef Loot
 * @property {ItemType} type
 * @property {Array<string>} properties             General properties of a loot item.
 */

/**
 * Data definition for Spell items.
 * @typedef Spell
 * @property {number} level                      Base level of the spell.
 * @property {string} school                     Magical school to which this spell belongs.
 * @property {Array<string>} properties            General components and tags for this spell.
 * @property {object} materials                  Details on material components required for this spell.
 * @property {string} materials.value            Description of the material components required for casting.
 * @property {boolean} materials.consumed        Are these material components consumed during casting?
 * @property {number} materials.cost             GP cost for the required components.
 * @property {number} materials.supply           Quantity of this component available.
 * @property {object} preparation                Details on how this spell is prepared.
 * @property {string} preparation.mode           Spell preparation mode as defined in `DND5E.spellPreparationModes`.
 * @property {boolean} preparation.prepared      Is the spell currently prepared?
 * @property {object} scaling                    Details on how casting at higher levels affects this spell.
 * @property {string} scaling.mode               Spell scaling mode as defined in `DND5E.spellScalingModes`.
 * @property {string} scaling.formula            Dice formula used for scaling.
 */

/**
 * Data definition for Tool items.
 * @typedef Tool
 * @property {ItemType} type
 * @property {string} ability     Default ability when this tool is being used.
 * @property {string} chatFlavor  Additional text added to chat when this tool is used.
 * @property {number} proficient  Level of proficiency in this tool as defined in `DND5E.proficiencyLevels`.
 * @property {string} bonus       Bonus formula added to tool rolls.
 */

/**
 * Data definition for Weapon items.
 * @typedef Weapon
 * @property {ItemType} type
 * @property {Array<string>} properties   Weapon's properties
 * @property {number} proficient          Does the weapon's owner have proficiency?
 */

/**
 *
 * A5E-for-DND5E Module Subtypes
 *
 */

/**
 * Data definition for Maneuver items.
 * @typedef Maneuver
 * @property {number} degree                    Degree (level) of the maneuver.
 * @property {string} tradition                 Combat tradition to which this maneuver belongs.
 * @property {string} prerequisite              Requirements for the maneuver
 * @property {Set<string>} properties           Maneuver's properties.
 */

/**
 * Data definition for Culture items.
 * @typedef Culture
 * @property {Advancement[]} advancement
 */

/**
 * Data definition for Destiny items.
 * @typedef Destiny
 * @property {Advancement[]} advancement
 */
