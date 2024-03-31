import { moduleID, modulePath } from '../utils.mjs';

/**
 * Adds the Rare spell and secondary schools
 * @param {ItemSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export async function spells(sheet, html, context) {
  /** @type {{editable: boolean, item: Item}} */
  const { editable, item: spell } = context;
  const details = html.find('.tab.details');

  // Rare Spells
  const rare = spell.getFlag(moduleID, 'rareSpell') ?? false;
  const rareInput = await renderTemplate(
    modulePath + 'templates/legacy/rareSpell-partial.hbs',
    { rare, editable }
  );
  details.find('.form-group:nth-child(2)').before(rareInput);

  // Secondary Schools
  const secondarySelected = spell.getFlag(moduleID, 'secondarySchools') ?? [];
  const secondarySchools = Object.entries(CONFIG.A5E.secondarySchools).map(
    ([value, label]) => ({
      value,
      label,
      selected: secondarySelected.includes(value),
    })
  );
  const secondaryInput = $(
    await renderTemplate(
      modulePath + 'templates/legacy/secondarySchools-partial.hbs',
      { secondarySchools, secondarySelected, editable }
    )
  );
  details.find('.spell-components').before(secondaryInput);
  secondaryInput.find('label').after(secondaryInput.find('select'));
}
