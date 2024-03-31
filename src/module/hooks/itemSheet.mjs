import { moduleID, modulePath } from '../utils.mjs';

/**
 * Adds the Rare spell and secondary schools
 * @param {ItemSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export async function spells(sheet, html, context) {
  const spell = sheet.item;
  const editable = context.editable;
  const details = html.find('.tab.details');

  // Secondary Schools
  const secondarySchools = spell.getFlag(moduleID, 'secondarySchools') ?? [];
  // TODO: Transform secondarySchools
  //   const secondaryInput = await renderTemplate(
  //     modulePath + 'templates/legacy/secondarySchools-partial.hbs',
  //     { secondarySchools }
  //   );

  // Rare Spells
  const rare = spell.getFlag(moduleID, 'rareSpell') ?? false;
  const rareInput = await renderTemplate(
    modulePath + 'templates/legacy/rareSpell-partial.hbs',
    { rare, editable }
  );
  details.find('.form-group:nth-child(6)').after(rareInput);
}
