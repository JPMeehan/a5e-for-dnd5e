import { moduleID, modulePath } from '../utils.mjs';

/**
 * Adds the Rare spell and secondary schools
 * @param {ItemSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export async function spells(sheet, html, context) {
  const spell = sheet.item;
  console.log(spell, html);
  const rare = spell.getFlag(moduleID, 'rareSpell') ?? false;
  const secondarySchools = spell.getFlag(moduleID, 'secondarySchools') ?? [];
  const rareInput = await renderTemplate(
    modulePath + 'templates/legacy/rareSpell-partial.hbs',
    { rare }
  );
  // TODO: Transform secondarySchools
  //   const secondaryInput = await renderTemplate(
  //     modulePath + 'templates/legacy/secondarySchools-partial.hbs',
  //     { secondarySchools }
  //   );
  const details = html.find('.tab.details');
  const school = details.find('.form-group:nth-child(3)');
  school.after();
}
