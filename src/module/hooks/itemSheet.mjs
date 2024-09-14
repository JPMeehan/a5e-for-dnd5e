import {moduleID, modulePath} from "../utils.mjs";

/**
 * Adds the Rare spell and secondary schools
 * @param {ItemSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export async function spells(sheet, html, context) {
  /** @type {{editable: boolean, item: Item}} */
  const {editable, item: spell} = context;
  const rare = spell.getFlag(moduleID, "rareSpell") ?? false;
  const secondarySelected = spell.getFlag(moduleID, "secondarySchools") ?? [];

  /**
   * Description Tab
   */
  const description = html.find(".tab[data-tab=\"description\"]");

  const props = description.find("ol.properties-list:last-child");

  if (rare) {
    props.prepend(`<li>${game.i18n.localize("a5e-for-dnd5e.Spell.Rare")}</li>`);
  }
  if (secondarySelected.length) {
    const formatter = game.i18n.getListFormatter({style: "narrow"});
    props.append(
      `<li>${formatter.format(
        secondarySelected.map((s) => CONFIG.A5E.secondarySchools[s])
      )}</li>`
    );
  }

  /**
   * Details Tab
   */
  const details = html.find(".tab[data-tab=\"details\"]");

  // Rare Spells
  const rareInput = await renderTemplate(
    modulePath + "templates/legacy/rareSpell-partial.hbs",
    {rare, editable}
  );
  details.find(".form-group:nth-child(2)").before(rareInput);

  // Secondary Schools
  const secondarySchools = Object.entries(CONFIG.A5E.secondarySchools).map(
    ([value, label]) => ({
      value,
      label,
      selected: secondarySelected.includes(value)
    })
  );
  const secondaryInput = $(
    await renderTemplate(
      modulePath + "templates/legacy/secondarySchools-partial.hbs",
      {secondarySchools, secondarySelected, editable}
    )
  );
  details.find(".spell-components").before(secondaryInput);
  secondaryInput.find("label").after(secondaryInput.find("select"));
  if (!editable) secondaryInput.find("select").attr("disabled", true);
}
