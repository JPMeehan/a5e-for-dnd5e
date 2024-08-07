import { modulePath, moduleTypes } from "../utils.mjs";

/**
 * Adds tabs for cultures, destinies and maneuvers to the compendium browser
 */
export function addTabs() {
    const tabs = dnd5e.applications.CompendiumBrowser.TABS;
    const cultureTab = {
        tab: "cultures",
        label: "TYPES.Item.culturePl",
        svg: modulePath + 'assets/icons/subtypes/culture.svg',
        documentClass: "Item",
        types: [moduleTypes.culture]
    }
    const destinyTab = {
        tab: "destinies",
        label: "TYPES.Item.destinyPl",
        svg: modulePath + 'assets/icons/subtypes/destiny.svg',
        documentClass: "Item",
        types: [moduleTypes.destiny]
    }
    const maneuverTab = {
        tab: "maneuvers",
        label: "TYPES.Item.maneuverPl",
        svg: modulePath + 'assets/icons/subtypes/maneuver.svg',
        documentClass: "Item",
        types: [moduleTypes.culture]
    }

    tabs.push(cultureTab, destinyTab, maneuverTab);
}