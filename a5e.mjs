import A5E_CONFIG from './src/module/config.mjs';
import * as DataClasses from './src/module/data/_module.mjs';
import * as SheetClasses from './src/module/apps/_module.mjs';
import * as a5eHooks from './src/module/hooks/_module.mjs';
import { ACTOR_SHEETS, moduleID, moduleTypes } from './src/module/utils.mjs';
import { _onDialogSubmit } from './src/module/hooks/expertiseDice.mjs';

Hooks.once('init', () => {
  foundry.utils.mergeObject(CONFIG, A5E_CONFIG);

  for (const [type, props] of Object.entries(
    A5E_CONFIG.A5E.newItemProperties
  )) {
    foundry.utils.mergeObject(CONFIG.DND5E.itemProperties, props);
    if (type.startsWith(moduleID)) {
      CONFIG.DND5E.validProperties[type] = new Set(Object.keys(props));
    } else {
      for (const p of Object.keys(props)) {
        CONFIG.DND5E.validProperties[type].add(p);
      }
    }
  }

  CONFIG.DND5E.validProperties[moduleTypes.maneuver].add('concentration');
  CONFIG.DND5E.validProperties[moduleTypes.maneuver].add('mgc');

  // Enabling advancements on cultures and destinies
  for (const advType of ['ItemChoice', 'ItemGrant', 'ScaleValue', 'Trait']) {
    CONFIG.DND5E.advancementTypes[advType].validItemTypes.add(
      moduleTypes.culture
    );
    CONFIG.DND5E.advancementTypes[advType].validItemTypes.add(
      moduleTypes.destiny
    );
  }

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

  game.settings.register(moduleID, 'useCultureEngineer', {
    name: `${moduleID}.Settings.UseCultureEngineer.name`,
    hint: `${moduleID}.Settings.UseCultureEngineer.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  });

  if (!game.settings.get(moduleID, 'useCultureEngineer')) {
    delete CONFIG.DND5E.skills.cul;
    delete CONFIG.DND5E.skills.eng;
  }

  game.settings.register(moduleID, 'showBlankOrigins', {
    name: `${moduleID}.Settings.ShowBlankOrigins.name`,
    hint: `${moduleID}.Settings.ShowBlankOrigins.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(moduleID, 'useFatigueStress', {
    name: `${moduleID}.Settings.UseFatigueStress.name`,
    hint: `${moduleID}.Settings.UseFatigueStress.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  });

  if (game.settings.get(moduleID, 'useFatigueStress'))
    a5eHooks.exhaustion.useFatigueStress();

  game.settings.register(moduleID, 'usePrestige', {
    name: `${moduleID}.Settings.UsePrestige.name`,
    hint: `${moduleID}.Settings.UsePrestige.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(moduleID, 'multiPrestige', {
    name: `${moduleID}.Settings.MultiPrestige.name`,
    hint: `${moduleID}.Settings.MultiPrestige.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  /** Expertise Die */
  libWrapper.register(
    moduleID,
    'CONFIG.Dice.D20Roll.prototype._onDialogSubmit',
    _onDialogSubmit,
    'WRAPPER'
  );
});

Hooks.once('i18nInit', () => {
  if (game.settings.get(moduleID, 'useFatigueStress')) {
    foundry.utils.mergeObject(game.i18n.translations.DND5E, {
      ExhaustionLevel: game.i18n.localize('a5e-for-dnd5e.FatigueLevel'),
      Exhaustion: game.i18n.localize('a5e-for-dnd5e.Fatigue'),
      ConExhaustion: game.i18n.localize('a5e-for-dnd5e.Fatigue'),
    });
  }
  _localizeHelper(CONFIG.A5E);
});

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

Hooks.on('renderActorSheet5eCharacter', (app, html, context) => {
  if (!game.user.isGM && app.actor.limited) return;

  switch (app.constructor.name) {
    case ACTOR_SHEETS.DEFAULT:
      a5eHooks.characterSheet.defaultSheet(app, html, context);
      break;
    case ACTOR_SHEETS.LEGACY:
      a5eHooks.characterSheet.legacySheet(app, html, context);
      break;
  }
});
// Hooks.on('tidy5e-sheet.renderActorSheet', (app, html, context) => {
//   if (!game.user.isGM && app.actor.limited) return;
//   a5eHooks.maneuvers.inlineManeuverDisplay(app, html, context);
// });

Hooks.on('dnd5e.rollDeathSave', a5eHooks.exhaustion.natOneDeathSave);

/**
 * EXPERTISE DICE
 */

Hooks.on('renderProficiencyConfig', a5eHooks.expertiseDice.configSkillTool);

Hooks.on('renderDialog', a5eHooks.expertiseDice.rollConfig);

Hooks.on('dnd5e.preRollToolCheck', a5eHooks.expertiseDice.applyExpertDie);
Hooks.on('dnd5e.preRollSkill', a5eHooks.expertiseDice.applyExpertDie);

/**
 * ITEM MODIFICATIONS
 */

Hooks.on('renderItemSheet5e', (sheet, html, context) => {
  switch (context.document.type) {
    case 'spell':
      a5eHooks.itemSheet.spells(sheet, html, context);
      break;
  }
});

/**
 * MANEUVERS
 */

Hooks.on('renderActorSheet5e', a5eHooks.maneuvers.inlineManeuverDisplay);
// Hooks.on(
//   'tidy5e-sheet.renderActorSheet',
//   a5eHooks.maneuvers.inlineManeuverDisplay
// );

// Hooks.on(
//   'dnd5e.computeManeuversProgression',
//   a5eHooks.maneuvers.maxExertionPoints
// );

// Hooks.on('dnd5e.preRestCompleted', a5eHooks.maneuvers.resetEP);

// Hooks.on(
//   'dnd5e.preItemUsageConsumption',
//   a5eHooks.maneuvers.disableConsumeResourceCheck
// );

// Hooks.on('dnd5e.itemUsageConsumption', a5eHooks.maneuvers.handleEPConsumption);
