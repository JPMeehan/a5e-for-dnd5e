const moduleID = 'a5e-for-dnd5e';

/**
 *
 * @param {DocumentSheet} app
 * @param {JQuery} html
 * @param {object} context
 * @returns
 */
export function sheetConfig(app, html, context) {
  /** @type {Actor} */
  const actor = app.document;
  if (actor.documentName !== 'Actor') return;
  /** @type {Record<string, number>} */
  const ed = actor.getFlag(moduleID, 'ed') ?? {};

  const template = 'modules/a5e-for-dnd5e/templates/expertise-dice-partial.hbs';
  renderTemplate(template, {
    key: context.key,
    dice: ed[context.key] ?? 0,
    config: CONFIG.A5E.EXPERTISEDIE,
  }).then((partial) => {
    // Insert before check bonus
    html.find('.form-group:nth-child(4)').after(partial);
  });
}
