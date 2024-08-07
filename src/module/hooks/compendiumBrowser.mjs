import { modulePath, moduleTypes } from "../utils.mjs";

/**
 * Adds tabs for cultures, destinies and maneuvers to the compendium browser
 */
export function addTabs() {
    const tabs = dnd5e.applications.CompendiumBrowser.TABS;
    const cultureTab = {
        tab: "cultures",
        label: "TYPES.Item.a5e-for-dnd5e.culturePl",
        svg: modulePath + 'assets/icons/subtypes/culture.svg',
        documentClass: "Item",
        types: [moduleTypes.culture]
    }
    tabs.splice(4, 0, cultureTab);
    const destinyTab = {
        tab: "destinies",
        label: "TYPES.Item.a5e-for-dnd5e.destinyPl",
        svg: modulePath + 'assets/icons/subtypes/destiny.svg',
        documentClass: "Item",
        types: [moduleTypes.destiny]
    }
    tabs.splice(6, 0, destinyTab);
    const maneuverTab = {
        tab: "maneuvers",
        label: "TYPES.Item.a5e-for-dnd5e.maneuverPl",
        svg: modulePath + 'assets/icons/subtypes/maneuver.svg',
        documentClass: "Item",
        types: [moduleTypes.culture]
    }
    tabs.splice(9, 0, maneuverTab);
}