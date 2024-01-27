import A5ECONFIG from './src/module/config.mjs';
import * as DataClasses from './src/module/data/_module.mjs';
import * as SheetClasses from './src/module/apps/_module.mjs';

const moduleID = 'a5e-for-dnd5e';
const moduleTypes = {
  culture: moduleID + '.culture',
  destiny: moduleID + '.destiny',
  maneuver: moduleID + '.maneuver',
};

Hooks.once('init', () => {
  foundry.utils.mergeObject(CONFIG, A5ECONFIG);

  Object.assign(CONFIG.Item.dataModels, {
    [moduleTypes.culture]: DataClasses.Culture,
    [moduleTypes.destiny]: DataClasses.Destiny,
    [moduleTypes.maneuver]: DataClasses.Maneuver,
  });

  for (const [name, sheetClass] of Object.entries(SheetClasses)) {
    const type = name.toLowerCase();
    Items.registerSheet(type, sheetClass, {
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
 *
 * INLINE MANEUVER DISPLAY
 *
 */

Hooks.on('renderActorSheet5e', (app, html, context) => {
  if (!game.user.isGM && app.actor.limited) return true;
  if (context.isCharacter || context.isNPC) {
    const owner = context.actor.isOwner;
    let maneuvers = context.items.filter(
      (i) => i.type === moduleTypes.maneuver
    );
    maneuvers = app._filterItems(maneuvers, app._filters.spellbook);
    if (!maneuvers.length && !hasExertionPool(app.actor)) return true;
    const levels = context.system.spells;
    const spellbook = context.spellbook;
    const useLabels = { '-20': '-', '-10': '-', 0: '&infin;' };
    const sections = { atwill: -20, innate: -10, pact: 0.5 };

    const registerSection = (
      sl,
      i,
      label,
      { prepMode = 'prepared', value, max, override } = {}
    ) => {
      const aeOverride = foundry.utils.hasProperty(
        context.actor.overrides,
        `system.spells.spell${i}.override`
      );
      spellbook[i] = {
        order: i,
        label: label,
        usesSlots: i > 0,
        canCreate: owner,
        canPrepare: context.actor.type === 'character' && i >= 1,
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {
          type: 'spell',
          level: prepMode in sections ? 1 : i,
          'preparation.mode': prepMode,
        },
        prop: sl,
        editable: context.editable && !aeOverride,
      };
    };

    maneuvers.forEach((maneuver) => {
      if (maneuver.system.usesExertion)
        maneuver.system.labels.ep = maneuver.sheet.epText(
          maneuver.system.consume.amount
        );
      foundry.utils.mergeObject(maneuver, {
        labels: maneuver.system.labels,
      });
      context.itemContext[maneuver.id].toggleTitle =
        CONFIG.DND5E.spellPreparationModes.always;
      context.itemContext[maneuver.id].toggleClass = 'fixed';

      const mode = 'always';
      let p = maneuver.system.degree;
      const pl = `spell${p}`;

      if (mode in sections) {
        p = sections[mode];
        if (!spellbook[p]) {
          const l = levels[mode] || {};
          const config = CONFIG.DND5E.spellPreparationModes[mode];
          registerSection(mode, p, config, {
            prepMode: mode,
            value: l.value,
            max: l.max,
            override: l.override,
          });
        }
      }

      // Known bug: This breaks if there's a mix of spells and maneuvers WITHOUT spellcaster levels
      else if (!spellbook[p]) {
        registerSection(pl, p, CONFIG.DND5E.spellLevels[p], {
          levels: levels[pl],
        });
      }

      // Add the power to the relevant heading
      spellbook[p].spells.push(maneuver);
    });
    const spellList = html.find('.spellbook');
    const template = 'systems/dnd5e/templates/actors/parts/actor-spellbook.hbs';
    renderTemplate(template, context).then((partial) => {
      spellList.html(partial);
      let ep = app.actor.getFlag(moduleID, 'ep');
      if (ep && context.isCharacter) {
        const ppContext = {
          ep: ep.value,
          epMax: ep.max,
        };
        renderTemplate(
          `/modules/a5e-for-dnd5e/templates/ep-partial.hbs`,
          ppContext
        ).then((exertionHeader) => {
          spellList.find('.inventory-list').prepend(exertionHeader);
        });
      }
      app.activateListeners(spellList);
    });
  } else return true;
});

/**
 * Determines if an actor has exertion points
 * @param {object} actor  The character
 * @returns {boolean}     Whether or not the character has an exertion pool
 */
function hasExertionPool(actor) {
  for (const cls of Object.values(actor.classes)) {
    if (
      cls.spellcasting.type === 'maneuvers' ||
      cls.spellcasting.progression === 'herald'
    )
      return true;
  }
  return false;
}
/**
 *
 * CALCULATE MAX EXERTION POINTS
 *
 */

Hooks.on(
  'dnd5e.computeManeuversProgression',
  (progression, actor, cls, spellcasting, count) => {
    if (
      spellcasting.type !== 'maneuvers' &&
      spellcasting.progression !== 'herald'
    )
      return true;
    const prof = foundry.utils.getProperty(actor, 'system.attributes.prof');
    const max = spellcasting.progression === 'default' ? 2 * prof : 0;
    let ep = actor.getFlag(moduleID, 'ep');
    if (ep) ep.max = Math.max(max, ep.max);
    else ep = { value: max, max };
    const flags = {
      [moduleID]: { ep },
    };
    foundry.utils.mergeObject(actor.flags, flags);
    // actor.setFlag(moduleID, "ep", ep)
  }
);

/**
 *
 * ITEM USAGE HANDLING
 *
 */

// Hooks.on("renderAbilityUseDialog", (dialog, html, data) => {
//   if (!dialog.item.system.usesExertion) return;

//   const content = game.i18n.format("PrimePsionics.PPManifest", {
//     limit: dialog.item.parent.getFlag("prime-psionics", "manifestLimit"),
//   });
//   const input = `<input type=number class="psi-points" name="ppSpend" value="${dialog.item.system.consume.amount}" min="${dialog.item.system.consume.amount}">`;

//   html.find("#ability-use-form").append("<div>" + content + input + "</div>");
//   html.height(html.height() + 10);
//   html.find("input[name='consumeResource']").parents(".form-group").remove();
// });

// Hooks.on("dnd5e.preItemUsageConsumption", (item, config, options) => {
//   if (!usesPP(item.system.consume)) return;
//   config.consumeResource = false;
// });

// Hooks.on("dnd5e.itemUsageConsumption", (item, config, options, usage) => {
//   if (!usesPP(item.system.consume)) return;
//   options.ppSpend = config.ppSpend;
//   const currentPP = item.parent.getFlag("prime-psionics", "pp")["value"];
//   const newPP = currentPP - config.ppSpend;
//   if (newPP >= 0) usage.actorUpdates["flags.prime-psionics.pp.value"] = newPP;
//   else {
//     ui.notifications.warn(game.i18n.localize("PrimePsionics.TooManyPP"));
//     return false;
//   }
// });

// Hooks.on("dnd5e.preDisplayCard", (item, chatData, options) => {
//   if (!usesPP(item.system.consume)) return;
//   chatData.content = chatData.content.replace(
//     "PrimePsionics.PP",
//     ppText(options.ppSpend)
//   );
//   chatData.flags["prime-psionics"] = { ppSpend: options.ppSpend };
// });

// Hooks.on("renderChatMessage", (app, html, context) => {
//   const ppSpend = app.getFlag("prime-psionics", "ppSpend");
//   if (ppSpend === undefined) return;
//   html.find("button[data-action='damage']")[0].dataset["ppspend"] = ppSpend;
// });

/**
 *
 * EXERTION POINT RESET ON LR
 *
 */

Hooks.on('dnd5e.preRestCompleted', (actor, result) => {
  result.updateData[`flags.${moduleID}.ep.value`] = actor.getFlag(
    moduleID,
    'ep'
  )['max'];
});
