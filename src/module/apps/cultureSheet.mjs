import {modulePath} from "../utils.mjs";

export default class CultureSheet extends dnd5e.applications.item.ItemSheet5e {
  /**
   * @override
   */
  get template() {
    return modulePath + "templates/sheets/culture-sheet.hbs";
  }
}
