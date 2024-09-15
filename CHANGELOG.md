# Changelog

## 2.0.0

- Rewrite for dnd5e system 4.0.0
- Thorough rework of import system to accommodate new activities model
- Maneuvers, Cultures, and Destinies now use the default 5e Item Sheet
- Fixed bug preventing display of Basic Maneuvers on sheet
- Fixed bug where Compendium Browser tab for maneuvers showed cultures

## 1.1.1

- Updated data imports from a5e
- Added max compatibility of `dnd5e` 3.3.9 because of upcoming breaks in 4.0
- Fixed proficiency bonus not adding to maneuvers

## 1.1.0 Archetypes

- Increased minimum version to Foundry v12 and D&D 3.3
- Added subclasses to subclass compendium
- Added Compendium Browser support for cultures, destinies, and maneuvers
- Fixed bug with sheet display of maneuvers in D&D 3.3

## 1.0.0 Classes

- Added classes to class compendiums
- [BREAKING] Changed the value of the "Default Maneuvers" progression from `default` to `martial` to reduce risk of name collision with other modules
- [BREAKING] Refactored maneuvers to leverage dnd5e's built in Item Charges consumption method
- Added a macro to apply Maneuver Mastery as an enchantment
- Added Destiny features as advancements; the fulfillment features are set to the automatic level of 16
- Updated data imports from a5e, alongside many fixes to advancements on origins
- Added mapping to translate most active effect change keys
- Fixed many in-text references

## 0.9.3 Future Prep

- Began preparing migration scripts for class support
- Refactored sheet rendering for potential compatibility with Tidy5E
- Fixed extraneous console logs
- Fixed a bug where exertion point max would become NaN
- Updated data imports from a5e

## 0.9.2 Equipment

- Updated data imports from a5e
- Improved CONFIG support for weapons and shields not found in the base system
- Improved base type handling for weapons, armor, and shields.

## 0.9.1 Better Spells

- Updated data imports from a5e
- Fixed handling of touch and self ranges
- Exposed Rare and Secondary Schools properties of spells
  - Added listing to the properties on the Description tab
  - Added inputs to the Details tab

## 0.9.0 Beta

- Cultures and Destinies now support advancements
- Added first draft of origins (Heritages, Cultures, Backgrounds, Destinies)
- Improved data for tools, enabled them as the base tools in CONFIG

## 0.8.5 Origin and Class Features

- Filled in the Class Features and Origin Features packs
  - Source data is poorly structured, this will need significant manual updates
- Added Magical Mystery as valid feature subtype

## 0.8.4

- Fixed bug in build process that failed to include the assembled packs in the distribution

## 0.8.3 Combat Maneuvers

- Added `magical` and `concentration` as valid maneuver properties
- Expanded maneuver tradition options to match A5E system offerings
- Initial setup of the Maneuvers pack
- Improved source labels

## 0.8.2 Spells and Gear

- Added `properties` field to maneuvers
  - Currently only includes "Mastered"
  - "Mastered" does not _do_ anything at the moment
- Initial setup of Gear and Spells packs

## 0.8.1

- Fixed bug with Weapon Properties that would prevent sheet display

## 0.8 Alpha Release

Basic feature showcase

- Expertise dice
- Prestige Rating
- Fatigue and Stress
- Combat Maneuvers

Cultures & Destinies are implemented as much as possible, but cannot currently provide advancements.
