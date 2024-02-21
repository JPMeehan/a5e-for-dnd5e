import { moduleID, modulePath, moduleTypes } from '../utils.mjs';

export function useFatigueStress() {
  foundry.utils.mergeObject(CONFIG.DND5E.conditionTypes.exhaustion, {
    // icon: 'modules/chaosos-5e-content/assets/icons/exhaustion.svg',
    // reference:
    //   'Compendium.chaosos-5e-content.class-journals.JournalEntry.byhrzi2UPEpHbCNu.JournalEntryPage.iYCe6WcEW4Kosqfa',
    levels: 7,
  });
  CONFIG.DND5E.conditionEffects.halfMovement.delete('exhaustion-2');
  CONFIG.DND5E.conditionEffects.halfMovement.add('exhaustion-3');
  CONFIG.DND5E.conditionEffects.halfHealth.delete('exhaustion-4');
  CONFIG.DND5E.conditionEffects.noMovement.delete('exhaustion-5');
}

/**
 *
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 */
export async function defaultSheet(sheet, html, context) {
  /**
   * Culture and Destiny
   */

  const originInfo = html.find('.right .top.flexrow .pills-lg');
  /** @type {Actor} */
  const actor = sheet.actor;
  const itemTypes = actor.itemTypes;
  const displayBlank = game.settings.get(moduleID, 'showBlankOrigins');

  const culture = itemTypes[moduleTypes.culture][0];
  const culturePill = await renderTemplate(
    modulePath + 'templates/origin-pill.hbs',
    {
      actor,
      item: culture,
      type: moduleTypes.culture,
      editable: context.editable,
      displayBlank,
    }
  );
  originInfo.find('.pill-lg:nth-child(2)').after(culturePill);

  const destiny = itemTypes[moduleTypes.destiny][0];
  const destinyPill = await renderTemplate(
    modulePath + 'templates/origin-pill.hbs',
    {
      actor,
      item: destiny,
      type: moduleTypes.destiny,
      editable: context.editable,
      displayBlank,
    }
  );
  originInfo.append(destinyPill);

  // Need to manually reapply listeners in v11
  const cultureClass = moduleTypes.culture.replace('.', '\\.');
  const destinyClass = moduleTypes.destiny.replace('.', '\\.');
  // General "edit" fn and then specific delete buttons
  const targetClasses = `.${cultureClass}, .${destinyClass}, .${cultureClass} .item-action, .${destinyClass} .item-action`;
  originInfo.on('click', targetClasses, sheet._onItemAction.bind(sheet));

  /**
   * Fatigue and Stress
   */
  if (game.settings.get(moduleID, 'useFatigueStress')) {
    const exhaustion = html.find('.sidebar .card .stats .top');
    const fatigue = exhaustion.children()[0];
    fatigue.classList.add('fatigue');
    fatigue.innerHTML = await renderTemplate(
      modulePath + 'templates/pipsFatigueStress.hbs',
      {
        conditions: constructPips('Fatigue', actor),
      }
    );

    const stress = exhaustion.children()[2];
    stress.classList.add('stress');
    stress.dataset.prop = `flags.${moduleID}.stress`;
    stress.innerHTML = await renderTemplate(
      modulePath + 'templates/pipsFatigueStress.hbs',
      {
        conditions: constructPips('Stress', actor),
      }
    );
  }

  /**
   * Prestige
   */
  if (game.settings.get(moduleID, 'usePrestige')) {
    const levelDisplay = html.find('.sheet-header .right');
    console.log(levelDisplay);
  }
}

/**
 *
 * @param {"Fatigue" | "Stress"} condition The tracked condition name
 * @param {Actor} actor      The actor with conditions
 */
function constructPips(condition, actor) {
  const max = 7;

  const dataPath =
    condition === 'Fatigue'
      ? 'system.attributes.exhaustion'
      : `flags.${moduleID}.stress`;

  return Array.fromRange(max, 1).reduce((acc, n) => {
    const label = game.i18n.format(moduleID + '.' + condition + 'Level', { n });
    const classes = ['pip'];
    const filled = foundry.utils.getProperty(actor, dataPath) >= n;

    if (filled) classes.push('filled');
    if (n === max) classes.push('death');
    const pip = {
      n,
      label,
      filled,
      tooltip: label,
      classes: classes.join(' '),
    };
    acc.push(pip);
    return acc;
  }, []);
}

/**
 *
 * @param {ActorSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export function legacySheet(sheet, html, context) {
  const newFeatures = [
    context.features[0],
    {
      dataset: { type: moduleTypes.culture },
      hasActions: false,
      items: [],
      label: `TYPES.Item.${moduleTypes.culture}`,
    },
    context.features[1],
    {
      dataset: { type: moduleTypes.destiny },
      hasActions: false,
      items: [],
      label: `TYPES.Item.${moduleTypes.destiny}`,
    },
    ...context.features.slice(2),
  ];

  const actor = sheet.actor;
  const itemTypes = actor.itemTypes;

  /** @type {Item} */
  const culture = itemTypes[moduleTypes.culture][0];
  if (culture) newFeatures[1].items.push(culture);
  /** @type {Item} */
  const destiny = itemTypes[moduleTypes.destiny][0];
  if (destiny) newFeatures[3].items.push(destiny);

  const featureList = html.find('.features');
  const template = 'systems/dnd5e/templates/actors/parts/actor-features.hbs';
  renderTemplate(template, { ...context, sections: newFeatures }).then(
    (partial) => {
      featureList.html(partial);
      sheet.activateListeners(featureList);
    }
  );

  /**
   * Fatigue
   */
  if (game.settings.get(moduleID, 'useFatigueStress')) {
    const exhaustion = html.find('.exhaustion');
    renderTemplate(modulePath + 'templates/stress-partial.hbs', {
      stress: actor.getFlag(moduleID, 'stress'),
    }).then((partial) => {
      exhaustion.after(partial);
    });
  }

  /**
   * Prestige
   */
  if (game.settings.get(moduleID, 'usePrestige')) {
    const characteristics = html.find('.characteristics');
    renderTemplate(modulePath + 'templates/prestige-partial.hbs', {
      prestige: actor.getFlag(moduleID, 'prestige'),
      prestigeCenter: actor.getFlag(moduleID, 'prestigeCenter'),
    }).then((partial) => {
      characteristics.prepend(partial);

      /** Roll Listener */
      characteristics.on('click', '.prestige-roll', () => rollPrestige(actor));
    });
  }
}

/**
 * Rolls the actor's prestige
 * @param {Actor} actor
 */
function rollPrestige(actor) {
  game.dnd5e.dice.d20Roll({
    parts: ['@prestige'],
    data: { prestige: actor.getFlag(moduleID, 'prestige') },
    title: game.i18n.localize('a5e-for-dnd5e.Prestige.check'),
    messageData: {
      speaker: { actor },
    },
  });
}
