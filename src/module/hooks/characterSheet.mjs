import { moduleID, modulePath, moduleTypes } from '../utils.mjs';

/**
 * A prestige definition
 * @typedef {{rating: number, center: string}} Prestige
 */

/**
 *
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 */
export async function defaultSheet(sheet, html, { editable, ...context }) {
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
    modulePath + 'templates/default/origin-pill.hbs',
    {
      actor,
      item: culture,
      type: moduleTypes.culture,
      editable,
      displayBlank,
    }
  );
  originInfo.find('.pill-lg:nth-child(2)').after(culturePill);

  const destiny = itemTypes[moduleTypes.destiny][0];
  const destinyPill = await renderTemplate(
    modulePath + 'templates/default/origin-pill.hbs',
    {
      actor,
      item: destiny,
      type: moduleTypes.destiny,
      editable,
      displayBlank,
    }
  );
  originInfo.append(destinyPill);

  // Need to manually reapply listeners in v11
  const cultureClass = moduleTypes.culture.replace('.', '\\.');
  const destinyClass = moduleTypes.destiny.replace('.', '\\.');
  // General "edit" fn and then specific delete buttons
  const embeddedOrigins = `.${cultureClass}, .${destinyClass}, .${cultureClass} .item-action, .${destinyClass} .item-action`;
  originInfo.on('click', embeddedOrigins, sheet._onItemAction.bind(sheet));
  const blankOrigins = `[data-action][data-item-type^="${moduleID}"]`
  originInfo.on('click', blankOrigins, sheet._onAction.bind(sheet));

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
    const prestige = getPrestige(actor);
    const biographyTraits = html.find('.tab.biography .middle');
    if (game.settings.get(moduleID, 'multiPrestige')) {
      const prestigeHTML = await renderTemplate(
        modulePath + 'templates/character/multi-prestige.hbs',
        { editable, prestige }
      );
      biographyTraits.append(prestigeHTML);
    } else {
      const appearance = biographyTraits.find('.right .textbox-half');
      const prestigeHTML = await renderTemplate(
        modulePath + 'templates/default/single-prestige.hbs',
        { prestige: prestige[0], editable, element: 'h3' }
      );

      appearance.first().after(prestigeHTML);
    }
    biographyTraits.on('click', 'a.prestige', (e) => {
      const data = e.currentTarget.dataset;
      switch (data.action) {
        case 'roll':
          rollPrestige(actor, Number(data.rating));
          break;
        case 'add':
          addPrestige(actor);
          break;
        case 'delete':
          removePrestige(actor, Number(data.index));
          break;
      }
    });
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
 * @param {Actor} actor
 * @returns {Array<Prestige>}
 */
function getPrestige(actor) {
  const prestige = actor.getFlag(moduleID, 'prestige');
  // case 1: Convert object of numbers to array
  if (prestige) return Object.values(prestige);
  // case 2: No prestige flag set yet
  else if (prestige === undefined)
    return [
      {
        center: game.i18n.localize('a5e-for-dnd5e.Prestige.center'),
        rating: 1,
      },
    ];
  // case 3: deleted all values for empty object
  else return [];
}

/**
 * Performs a prestige check
 * @param {Actor} actor
 * @param {number} prestige
 */
function rollPrestige(actor, prestige) {
  game.dnd5e.dice.d20Roll({
    parts: ['@prestige'],
    data: { prestige },
    title: game.i18n.localize('a5e-for-dnd5e.Prestige.check'),
    messageData: {
      speaker: { actor },
    },
  });
}

/**
 * Adds a new prestige center to the actor
 * @param {Actor} actor
 */
function addPrestige(actor) {
  const start = {
    center: game.i18n.localize('a5e-for-dnd5e.Prestige.center'),
    rating: 1,
  };
  /** @type {Record<number, Prestige>} */
  const prestige = actor.getFlag(moduleID, 'prestige') ?? { 0: start };
  prestige[Object.keys(prestige).length] = start;
  actor.setFlag(moduleID, 'prestige', prestige);
}

/**
 * Removes a prestige center
 * @param {Actor} actor
 * @param {number} index
 */
function removePrestige(actor, index) {
  /** @type {Record<number, Prestige} */
  const prestige = actor.getFlag(moduleID, 'prestige');
  if (!prestige) {
    actor.setFlag(moduleID, 'prestige', {});
    return;
  }

  /** @type {Array<Prestige>} */
  const prestigeArray = Object.values(prestige);

  prestigeArray.splice(index, 1);

  const newPrestige = prestigeArray.reduce(
    (acc, curr, i) => {
      acc[i] = curr;
      return acc;
    },
    { [`-=${prestigeArray.length}`]: null }
  );
  actor.setFlag(moduleID, 'prestige', newPrestige);
}

/**
 *
 * @param {ActorSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 */
export function tidySheet(sheet, html, context) {}

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
    renderTemplate(modulePath + 'templates/legacy/stress-partial.hbs', {
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
    const prestige = getPrestige(actor)[0];
    renderTemplate(modulePath + 'templates/legacy/prestige-partial.hbs', {
      prestige,
      editable: true,
    }).then((partial) => {
      characteristics.prepend(partial);

      /** Roll Listener */
      characteristics.on('click', '.prestige-roll', () =>
        rollPrestige(actor, prestige.rating)
      );
    });
  }
}
