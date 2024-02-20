import { moduleID, modulePath } from '../utils.mjs';
const edPartialHeight = 30;

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

  const template = modulePath + 'templates/expertise-dice-partial.hbs';
  renderTemplate(template, {
    key: `flags.${moduleID}.ed.${context.key}`,
    dice: ed[context.key] ?? 0,
    config: CONFIG.A5E.expertiseDie,
  }).then((partial) => {
    // Insert before check bonus
    html.find('.form-group:nth-child(4)').after(partial);
    html.height(html.height() + edPartialHeight);
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
  /** @type {Record<string, object>} */
  const buttons = app.data.buttons;
  if (
    !buttons.hasOwnProperty('normal') ||
    !buttons.hasOwnProperty('advantage') ||
    !buttons.hasOwnProperty('disadvantage')
  )
    return;
  else logger.log(app, context);

  // Locate situational bonus
  const sitBonus = html.find('.form-group:nth-child(3)');
  const labelText = sitBonus.find('label')[0].innerText;
  if (labelText !== game.i18n.localize('DND5E.RollSituationalBonus')) return;

  // Stick the extra info right before the sit bonus
  const ed = {};

  const template = modulePath + 'templates/expertise-dice-partial.hbs';
  renderTemplate(template, {
    key: 'expertDie',
    dice: ed[context.key] ?? 0,
    config: CONFIG.A5E.expertiseDie,
  }).then((partial) => {
    // Insert before check bonus
    sitBonus.before(partial);
    html.height(html.height() + edPartialHeight);
  });
}

/**
 *
 * @param {Actor} actor
 * @param {import("../../../dnd5e/module/dice/dice.mjs").D20RollConfiguration} rollData
 * @param {string} id
 */
export function applyExpertDie(actor, rollData, id) {
  /** @type {Record<string, number>} */
  const ed = actor.getFlag(moduleID, 'ed') ?? {};
  rollData.parts.push('@expertDie');
  rollData.data['expertDie'] = CONFIG.A5E.expertiseDie[ed[id]];
  console.log(rollData);
}
