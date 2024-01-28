import A5E_CONFIG from './src/module/config.mjs';
import * as DataClasses from './src/module/data/_module.mjs';
import * as SheetClasses from './src/module/apps/_module.mjs';
import * as a5eHooks from './src/module/hooks/_module.mjs';

const moduleID = 'a5e-for-dnd5e';
const moduleTypes = {
  culture: moduleID + '.culture',
  destiny: moduleID + '.destiny',
  maneuver: moduleID + '.maneuver',
};

Hooks.once('init', () => {
  foundry.utils.mergeObject(CONFIG, A5E_CONFIG);

  Object.assign(CONFIG.Item.dataModels, {
    [moduleTypes.culture]: DataClasses.Culture,
    [moduleTypes.destiny]: DataClasses.Destiny,
    [moduleTypes.maneuver]: DataClasses.Maneuver,
  });

  for (const [name, sheetClass] of Object.entries(SheetClasses)) {
    const type = name.toLowerCase();
    Items.registerSheet(moduleID, sheetClass, {
      types: [moduleTypes[type]],
      makeDefault: true,
      label: `${moduleID}.${name}.SheetLabel`,
    });
  }
});

Hooks.once('i18nInit', () => _localizeHelper(CONFIG.A5E));

/**
 * Re-implementation of dnd5e's Localization Helper for this module
 * @param {Record<string, string | Record<string, string>>} object
 */
function _localizeHelper(object) {
  for (const [key, value] of Object.entries(object)) {
    switch (typeof value) {
      case 'string':
        if (value.includes(moduleID)) object[key] = game.i18n.localize(value);
        break;
      case 'object':
        _localizeHelper(object[key]);
        break;
    }
  }
}

/**
 * INLINE CHARACTER SHEET DISPLAY
 * - Fatigue and Stress
 * - Culture
 * - Destiny
 * - Prestige
 */

Hooks.on(
  'renderActorSheet5eCharacter',
  /**
   *
   * @param {ActorSheet} app
   * @param {JQuery} html
   * @param {object} context
   */
  (app, html, context) => {
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
);

/**
 * EXPERTISE DICE
 */

Hooks.on('renderProficiencyConfig', a5eHooks.expertiseDice.configSkillTool);

// Hooks.on('renderDialog', a5eHooks.expertiseDice.rollConfig);

Hooks.on('dnd5e.preRollToolCheck', a5eHooks.expertiseDice.applyExpertDie);
Hooks.on('dnd5e.preRollSkillCheck', a5eHooks.expertiseDice.applyExpertDie);

/**
 * MANEUVERS
 */

Hooks.on('renderActorSheet5e', a5eHooks.maneuvers.inlineManeuverDisplay);

Hooks.on(
  'dnd5e.computeManeuversProgression',
  a5eHooks.maneuvers.maxExertionPoints
);

Hooks.on('dnd5e.preRestCompleted', a5eHooks.maneuvers.resetEP);

Hooks.on(
  'dnd5e.preItemUsageConsumption',
  a5eHooks.maneuvers.disableConsumeResourceCheck
);

Hooks.on('dnd5e.itemUsageConsumption', a5eHooks.maneuvers.handleEPConsumption);
