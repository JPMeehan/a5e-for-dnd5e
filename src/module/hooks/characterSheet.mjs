import { moduleID, modulePath, moduleTypes } from '../utils.mjs';

/**
 *
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 */
export async function defaultSheet(sheet, html, context) {
  console.log(sheet, html, context);
  const originInfo = html.find('.right .top.flexrow .pills-lg');

  const actor = sheet.actor;
  const itemTypes = actor.itemTypes;

  /** @type {Item} */
  const culture = itemTypes[moduleTypes.culture][0];
  const culturePill = await renderTemplate(
    modulePath + 'templates/origin-pill.hbs',
    {
      actor,
      item: culture,
      type: moduleTypes.culture,
    }
  );

  originInfo.find('.pill-lg:nth-child(2)').after(culturePill);

  /** @type {Item} */
  const destiny = itemTypes[moduleTypes.destiny][0];
  const destinyPill = await renderTemplate(
    modulePath + 'templates/origin-pill.hbs',
    {
      actor,
      item: destiny,
      type: moduleTypes.destiny,
    }
  );

  originInfo.append(destinyPill);
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

  const exhaustion = html.find('.exhaustion');
  renderTemplate(modulePath + 'templates/stress-partial.hbs', {
    stress: actor.getFlag(moduleID, 'stress'),
  }).then((partial) => {
    exhaustion.after(partial);
  });

  const characteristics = html.find('.characteristics');
  renderTemplate(modulePath + 'templates/prestige-partial.hbs', {
    prestige: actor.getFlag(moduleID, 'prestige'),
    prestigeCenter: actor.getFlag(moduleID, 'prestigeCenter'),
  }).then((partial) => {
    characteristics.prepend(partial);

    /** Roll Listener */
    characteristics.on('click', '.prestige-roll', (_e) => {
      game.dnd5e.dice.d20Roll({
        parts: ['@prestige'],
        data: { prestige: actor.getFlag(moduleID, 'prestige') },
        title: game.i18n.localize('a5e-for-dnd5e.Prestige.check'),
        messageData: {
          speaker: { actor },
        },
      });
    });
  });
}
