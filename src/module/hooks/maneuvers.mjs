import { CUSTOM_SHEETS, moduleID, moduleTypes } from '../utils.mjs';
const maneuverType = moduleTypes.maneuver;

/**
 * Sorts and displays maneuvers on the character sheet
 * @param {ActorSheet} app
 * @param {JQuery} html
 * @param {object} context
 * @returns
 */
export function inlineManeuverDisplay(app, html, context) {
  if (!game.user.isGM && app.actor.limited) return true;
  const newCharacterSheet = app.constructor.name === CUSTOM_SHEETS.DEFAULT;
  if (context.isCharacter || context.isNPC) {
    const owner = context.actor.isOwner;
    let maneuvers = context.items.filter((i) => i.type === maneuverType);
    maneuvers = app._filterItems(maneuvers, app._filters.spellbook);
    if (!maneuvers.length && !hasExertionPool(app.actor)) return true;
    const levels = context.system.spells;
    const spellbook = context.spellbook;
    const levelOffset = spellbook.length - 1;

    const registerSection = (
      sl,
      d,
      label,
      { preparationMode = 'prepared', override } = {}
    ) => {
      const aeOverride = foundry.utils.hasProperty(
        context.actor.overrides,
        `system.spells.spell${d}.override`
      );
      const i = d + levelOffset;
      spellbook[i] = {
        order: d,
        label: label,
        usesSlots: d > 0,
        canCreate: owner,
        canPrepare: context.actor.type === 'character' && d >= 1,
        spells: [],
        uses: '-',
        slots: '-',
        override: override || 0,
        dataset: {
          type: maneuverType,
          degree: p,
          preparationMode,
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

      // Activation
      const cost = maneuver.system.activation?.cost;
      const abbr = {
        action: 'DND5E.ActionAbbr',
        bonus: 'DND5E.BonusActionAbbr',
        reaction: 'DND5E.ReactionAbbr',
        minute: 'DND5E.TimeMinuteAbbr',
        hour: 'DND5E.TimeHourAbbr',
        day: 'DND5E.TimeDayAbbr',
      }[maneuver.system.activation.type];

      const itemContext = newCharacterSheet
        ? {
            activation:
              cost && abbr
                ? `${cost}${game.i18n.localize(abbr)}`
                : maneuver.labels.activation,
            preparation: { applicable: false },
          }
        : {
            toggleTitle: CONFIG.DND5E.spellPreparationModes.always,
            toggleClass: 'fixed',
          };

      if (newCharacterSheet) {
        // Range
        const units = maneuver.system.range?.units;
        if (units && units !== 'none') {
          if (units in CONFIG.DND5E.movementUnits) {
            itemContext.range = {
              distance: true,
              value: maneuver.system.range.value,
              unit: game.i18n.localize(`DND5E.Dist${units.capitalize()}Abbr`),
            };
          } else itemContext.range = { distance: false };
        }

        // To Hit
        const toHit = parseInt(maneuver.labels.modifier);
        if (maneuver.hasAttack && !isNaN(toHit)) {
          itemContext.toHit = {
            sign: Math.sign(toHit) < 0 ? '-' : '+',
            abs: Math.abs(toHit),
          };
        }
      }

      foundry.utils.mergeObject(context.itemContext[maneuver.id], itemContext);

      /** @type {number} */
      const d = maneuver.system.degree;
      const pl = `spell${d}`;
      const index = d + levelOffset;

      if (!spellbook[index]) {
        registerSection(pl, d, CONFIG.A5E.MANEUVERS.degree[d], {
          levels: levels[pl],
        });
      }

      // Add the maneuver to the relevant heading
      spellbook[index].spells.push(maneuver);
    });
    for (const i in spellbook) {
      if (spellbook[i] === undefined) delete spellbook[i];
    }
    const spellList = newCharacterSheet
      ? html.find('.spells')
      : html.find('.spellbook');
    const spellListTemplate = newCharacterSheet
      ? 'systems/dnd5e/templates/actors/tabs/character-spells.hbs'
      : 'systems/dnd5e/templates/actors/parts/actor-spellbook.hbs';
    renderTemplate(spellListTemplate, context).then((partial) => {
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

      if (newCharacterSheet) {
        spellList
          .find(`.items-section[data-type="${maneuverType}"]`)
          .find('.item-header.item-school')
          .html(game.i18n.localize('a5e-for-dnd5e.Maneuver.TraditionShort'));

        const schoolSlots = spellList.find('.item-detail.item-school');
        /** @type {Array<string>} */
        const traditions = Object.values(CONFIG.A5E.MANEUVERS.traditions).map(
          (t) => t.label
        );
        for (const div of schoolSlots) {
          if (traditions.includes(div.dataset.tooltip)) {
            div.innerHTML = `<dnd5e-icon src="modules/a5e-for-dnd5e/assets/icons/${div.dataset.tooltip.toLowerCase()}.svg"></dnd5e-icon>`;
          }
        }

        const schoolFilter = spellList.find('item-list-controls .filter-list');
        schoolFilter.append(
          Object.values(CONFIG.A5E.MANEUVERS.traditions).map((t) => {
            `<li><button type="button" class="filter-item">${t.label}</button></li>`;
          })
        );
      } else {
        const sectionHeader = spellList.find(
          `.items-header.spellbook-header[data-type="${maneuverType}"]`
        );
        sectionHeader
          .find('.spell-school')
          .html(game.i18n.localize('a5e-for-dnd5e.Maneuver.Tradition'));
        sectionHeader
          .find('.spell-action')
          .html(game.i18n.localize('a5e-for-dnd5e.Maneuver.Usage'));
        sectionHeader
          .find('.spell-target')
          .html(game.i18n.localize('a5e-for-dnd5e.Maneuver.Target'));
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
