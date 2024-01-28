const moduleID = 'a5e-for-dnd5e';
const maneuverType = 'a5e-for-dnd5e.maneuver';

/**
 * Sorts and displays maneuvers on the character sheet
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 * @returns
 */
export function inlineManeuverDisplay(app, html, context) {
  if (!game.user.isGM && app.actor.limited) return true;
  if (context.isCharacter || context.isNPC) {
    const owner = context.actor.isOwner;
    let maneuvers = context.items.filter((i) => i.type === maneuverType);
    maneuvers = app._filterItems(maneuvers, app._filters.spellbook);
    if (!maneuvers.length && !hasExertionPool(app.actor)) return true;
    const levels = context.system.spells;
    const spellbook = context.spellbook;
    const useLabels = { '-20': '-', '-10': '-', 0: '&infin;' };
    const sections = { atwill: -20, innate: -10, pact: 0.5 };

    const cantripOffset =
      !!spellbook.find((s) => s?.order === sections.atwill) +
      !!spellbook.find((s) => s?.order === sections.innate);
    const levelOffset =
      cantripOffset + !!spellbook.find((s) => s?.order === sections.pact);
    const emptyTen = Array.from({ length: 10 });
    if (!!spellbook.length) {
      // Resolving #5 - bad order for mixed psionics + spellcasting if have spells > spell level.
      const manifestLevels = emptyTen.map((e, i) =>
        spellbook.findIndex((s) => s?.order === i)
      );
      let inserted = 0;
      for (const index in manifestLevels) {
        const i = Number(index);
        if (i === 0 && manifestLevels[i] === -1) {
          inserted += 1;
          // Cantrip special case
          spellbook.splice(cantripOffset, 0, undefined);
        } else if (manifestLevels[i] + inserted !== i + levelOffset) {
          inserted += 1;
          spellbook.splice(i + levelOffset, 0, undefined);
        }
      }
    }

    const registerSection = (
      sl,
      d,
      label,
      { prepMode = 'prepared', value, max, override } = {}
    ) => {
      const aeOverride = foundry.utils.hasProperty(
        context.actor.overrides,
        `system.spells.spell${d}.override`
      );
      const i = d ? d + levelOffset : d + cantripOffset;
      spellbook[i] = {
        order: d,
        label: label,
        usesSlots: d > 0,
        canCreate: owner,
        canPrepare: context.actor.type === 'character' && d >= 1,
        spells: [],
        uses: useLabels[d] || value || 0,
        slots: useLabels[d] || max || 0,
        override: override || 0,
        dataset: {
          type: 'spell',
          level: prepMode in sections ? 1 : d,
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

      /** @type {number} */
      const d = maneuver.system.degree;
      const pl = `spell${d}`;
      const index = d ? d + levelOffset : d + cantripOffset;
      // Known bug: This breaks if there's a mix of spells and maneuvers WITHOUT spellcaster levels
      if (!spellbook[index]) {
        registerSection(pl, d, CONFIG.DND5E.spellLevels[d], {
          levels: levels[pl],
        });
      }

      // Add the maneuver to the relevant heading
      spellbook[index].spells.push(maneuver);
    });
    for (const i in spellbook) {
      if (spellbook[i] === undefined) delete spellbook[i];
    }
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
}

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
 * Calculates max exertion points
 * @param {*} progression
 * @param {Actor} actor
 * @param {*} cls
 * @param {*} spellcasting
 * @param {*} count
 * @returns
 */
export function maxExertionPoints(
  progression,
  actor,
  cls,
  spellcasting,
  count
) {
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
}

/**
 * Reset an actor's exertion points on a long rest
 * @param {Actor} actor
 * @param {*} result
 */
export function resetEP(actor, result) {
  result.updateData[`flags.${moduleID}.ep.value`] = actor.getFlag(
    moduleID,
    'ep'
  )['max'];
}

/**
 * ITEM USAGE HANDLING
 */

/**
 *
 * @param {Item5e} item                  Item being used.
 * @param {ItemUseConfiguration} config  Configuration data for the item usage being prepared.
 * @param {ItemUseOptions} options       Additional options used for configuring item usage.
 * @returns {boolean}                    Explicitly return `false` to prevent item from being used.
 */
export function disableConsumeResourceCheck(item, config, options) {
  if (!item.system.usesExertion) return;
  config.consumeResource = false;
}

export function handleEPConsumption(item, config, options, usage) {
  if (!item.system.usesExertion) return;
  const epSpend = item.system.consume.amount;
  const currentEP = item.parent.getFlag(moduleID, 'ep')['value'];
  const newPP = currentEP - epSpend;
  if (newPP >= 0) usage.actorUpdates['flags.a5e-for-dnd5e.ep.value'] = newPP;
  else {
    ui.notifications.warn(
      game.i18n.localize('a5e-for-dnd5e.Maneuver.TooManyEP')
    );
    return false;
  }
}
