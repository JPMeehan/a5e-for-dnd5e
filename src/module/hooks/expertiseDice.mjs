const moduleID = 'a5e-for-dnd5e';

/**
 * Adds expertise die configuration to skills and tools
 * @param {DocumentSheet} app
 * @param {JQuery} html
 * @param {object} context
 * @returns
 */
export function configSkillTool(app, html, context) {
  /** @type {Actor} */
  const actor = app.document;
  if (actor.documentName !== 'Actor') return;
  /** @type {Record<string, number>} */
  const ed = actor.getFlag(moduleID, 'ed') ?? {};

  const template = 'modules/a5e-for-dnd5e/templates/expertise-dice-partial.hbs';
  renderTemplate(template, {
    key: context.key,
    dice: ed[context.key] ?? 0,
    config: CONFIG.A5E.expertiseDie,
  }).then((partial) => {
    // Insert before check bonus
    html.find('.form-group:nth-child(4)').after(partial);
    html.height(html.height() + 10);
  });
}

/**
 *
 * @param {Dialog} app
 * @param {JQuery} html
 * @param {*} context
 */
export function rollConfig(app, html, context) {
  // Validate this is a roll dialog

  // Locate situational bonus
  const sitBonus = html.find('.form-group:nth-child(3)');

  // Stick the extra info right before the sit bonus
}
