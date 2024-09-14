import {modulePath} from "../utils.mjs";

export default class DestinySheet extends dnd5e.applications.item.ItemSheet5e {
  /**
   * @override
   */
  get template() {
    return modulePath + "templates/sheets/destiny-sheet.hbs";
  }
}
