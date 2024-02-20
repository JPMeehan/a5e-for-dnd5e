/**
 *
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 */
export function defaultSheet(sheet, html, context) {
  console.log(sheet, html, context);
}

/**
 *
 * @param {ActorSheet} app
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

  const actor = app.actor;
  /** @type {Item} */
  const culture = actor.itemTypes[moduleTypes.culture][0];
  if (culture) newFeatures[1].items.push(culture);
  /** @type {Item} */
  const destiny = actor.itemTypes[moduleTypes.destiny][0];
  if (destiny) newFeatures[3].items.push(destiny);

  const featureList = html.find('.features');
  const template = 'systems/dnd5e/templates/actors/parts/actor-features.hbs';
  renderTemplate(template, { ...context, sections: newFeatures }).then(
    (partial) => {
      featureList.html(partial);
      app.activateListeners(featureList);
    }
  );

  const exhaustion = html.find('.exhaustion');
  renderTemplate('/modules/a5e-for-dnd5e/templates/stress-partial.hbs', {
    stress: actor.getFlag(moduleID, 'stress'),
  }).then((partial) => {
    exhaustion.after(partial);
  });

  const characteristics = html.find('.characteristics');
  renderTemplate('modules/a5e-for-dnd5e/templates/prestige-partial.hbs', {
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
