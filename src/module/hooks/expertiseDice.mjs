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
 * @param {Actor} actor
 * @param {import("../../../dnd5e/module/dice/dice.mjs").D20RollConfiguration} rollData
 * @param {string} id
 */
export function applyExpertDie(actor, rollData, id) {
  /** @type {Record<string, number>} */
  const ed = actor.getFlag(moduleID, 'ed') ?? {};
  rollData.parts.push('@expertDie[Expertise]');
  rollData.data['expertDie'] = CONFIG.A5E.expertiseDie[ed[id]];
}

/**
 *
 * @param {Dialog} dialog
 * @param {JQuery} html
 * @param {Record} context
 * @param {Actor} actor
 */
export function rollConfig(dialog, html, context, actor) {
  // Validate this is a roll dialog
  /** @type {Record<string, object>} */
  const buttons = dialog.data.buttons;
  if (
    !buttons.hasOwnProperty('normal') ||
    !buttons.hasOwnProperty('advantage') ||
    !buttons.hasOwnProperty('disadvantage')
  ) {
    return;
  }

  // Locate situational bonus
  const sitBonus = html.find('.form-group:nth-child(3)');
  const labelText = sitBonus.find('label')[0].innerText;
  if (labelText !== game.i18n.localize('DND5E.RollSituationalBonus')) return;

  /** @type {string} */
  const formula = html.find('.form-group:nth-child(1) input').val();

  const newFormula = formula.replace(/ \+ (1d\d|0)\[Expertise\]/, '');

  html.find('.form-group:nth-child(1) input').val(newFormula);

  const expertise = formula.match(/(1d\d|0)\[Expertise\]/);

  // Stick the extra info right before the sit bonus
  const ed = {
    '0[Expertise]': 0,
    '1d4[Expertise]': 1,
    '1d6[Expertise]': 2,
    '1d8[Expertise]': 3,
  };

  const template = modulePath + 'templates/expertise-dice-partial.hbs';
  renderTemplate(template, {
    key: 'expertDie',
    dice: ed[expertise[0]] ?? 0,
    config: CONFIG.A5E.expertiseDie,
  }).then((partial) => {
    // Insert before check bonus
    sitBonus.before(partial);
    html.height(html.height() + edPartialHeight);
  });
}

/**
 * Handle submission of the Roll evaluation configuration Dialog
 * @param {Function} wrapped       The original D20Roll_onDialogSubmit
 * @param {jQuery} html            The submitted dialog content
 * @param {number} advantageMode   The chosen advantage mode
 * @returns {D20Roll}              This damage roll.
 * @private
 */
export function _onDialogSubmit(wrapped, html, advantageMode) {
  /** @type {Roll} */
  const roll = wrapped(html, advantageMode);

  const form = html[0].querySelector('form');

  const dice = CONFIG.Dice;

  if (form.expertDie) {
    const expIndex = roll.terms.findIndex(
      (t) => t.options?.flavor === 'Expertise'
    );
    const expertise = roll.terms[expIndex];
    if (expIndex === -1) return roll;
    else if (expertise instanceof dice.termTypes.DiceTerm) {
      expertise.faces = [0, 4, 6, 8][form.expertDie.value];
    } else if (
      expertise instanceof dice.termTypes.NumericTerm &&
      form.expertDie.value > 0
    ) {
      roll.terms[expIndex] = new dice.terms.d({
        number: 1,
        faces: form.expertDie.value * 2 + 2,
        options: { flavor: 'Expertise' },
      });
    }
    roll.resetFormula();
  }

  return roll;
}
