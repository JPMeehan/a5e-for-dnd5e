import { ACTOR_SHEETS, moduleID, modulePath, moduleTypes } from '../utils.mjs';
const maneuverType = moduleTypes.maneuver;

/**
 * Sorts and displays maneuvers on the character sheet
 * @param {ActorSheet} sheet
 * @param {JQuery} html
 * @param {object} context
 * @returns
 */
export function inlineManeuverDisplay(sheet, html, context) {
  if (!game.user.isGM && sheet.actor.limited) return true;
  if (context.isCharacter || context.isNPC) {
    const owner = context.actor.isOwner;
    let maneuvers = context.items.filter((i) => i.type === maneuverType);
    maneuvers = sheet._filterItems(
      maneuvers,
      sheet._filters.spellbook.properties
    );
    if (!maneuvers.length && !hasExertionPool(sheet.actor)) return true;
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
        usesSlots: false,
        canCreate: owner,
        canPrepare: context.actor.type === 'character' && d >= 1,
        spells: [],
        uses: '-',
        slots: '-',
        override: override || 0,
        dataset: {
          type: maneuverType,
          degree: d,
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

      let itemContext = null;
      switch (sheet.constructor.name) {
        case ACTOR_SHEETS.DEFAULT:
          itemContext = {
            activation:
              cost && abbr
                ? `${cost}${game.i18n.localize(abbr)}`
                : maneuver.labels.activation,
            preparation: { applicable: false },
          };
          break;
        case ACTOR_SHEETS.LEGACY:
        case ACTOR_SHEETS.NPC:
          itemContext = {
            toggleTitle: CONFIG.DND5E.spellPreparationModes.always,
            toggleClass: 'fixed',
          };
          break;
      }

      if (sheet.constructor.name === ACTOR_SHEETS.DEFAULT) {
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
    const spellList =
      sheet.constructor.name === ACTOR_SHEETS.DEFAULT
        ? html.find('.spells')
        : html.find('.spellbook');
    const spellListTemplate = {
      [ACTOR_SHEETS.DEFAULT]:
        'systems/dnd5e/templates/actors/tabs/character-spells.hbs',
      [ACTOR_SHEETS.LEGACY]:
        'systems/dnd5e/templates/actors/parts/actor-spellbook.hbs',
      [ACTOR_SHEETS.NPC]:
        'systems/dnd5e/templates/actors/parts/actor-spellbook.hbs',
    }[sheet.constructor.name];
    if (!spellListTemplate) return;
    renderTemplate(spellListTemplate, context).then((partial) => {
      spellList.html(partial);
      const ep = sheet.actor.getFlag(moduleID, 'ep');
      if (ep && context.isCharacter) {
        const epContext = {
          ep: ep.value,
          epMax: ep.max,
        };
        const template = {
          [ACTOR_SHEETS.DEFAULT]: 'templates/default/ep-partial.hbs',
          [ACTOR_SHEETS.LEGACY]: 'templates/legacy/ep-partial.hbs',
        }[sheet.constructor.name];
        renderTemplate(modulePath + template, epContext).then(
          (exertionHeader) => {
            const epTarget = {
              [ACTOR_SHEETS.DEFAULT]: 'dnd5e-inventory',
              [ACTOR_SHEETS.LEGACY]: '.inventory-list',
            }[sheet.constructor.name];
            spellList.find(epTarget).prepend(exertionHeader);
          }
        );
      }

      switch (sheet.constructor.name) {
        case ACTOR_SHEETS.DEFAULT:
          spellList
            .find(`.items-section[data-type="${maneuverType}"]`)
            .find('.item-header.item-school')
            .html(game.i18n.localize('a5e-for-dnd5e.Maneuver.TraditionShort'));

          const schoolSlots = spellList.find('.item-detail.item-school');
          /** @type {Array<{label: string, icon: string}>} */
          const traditions = Object.values(CONFIG.A5E.MANEUVERS.tradition);
          for (const div of schoolSlots) {
            const trad = traditions.find(
              (t) => t.label === div.dataset.tooltip
            );
            if (trad) {
              div.innerHTML = `<dnd5e-icon src="${trad.icon}"></dnd5e-icon>`;
            }
          }

          const schoolFilter = spellList.find(
            'item-list-controls .filter-list'
          );
          schoolFilter.append(
            Object.values(CONFIG.A5E.MANEUVERS.tradition).map((t) => {
              `<li><button type="button" class="filter-item">${t.label}</button></li>`;
            })
          );
          break;
        case ACTOR_SHEETS.LEGACY:
        case ACTOR_SHEETS.NPC:
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
          break;
      }
      sheet.activateListeners(spellList);
    });

    if (sheet.constructor.name === 'ActorSheet5eNPC') {
      const features = html.find('dnd5e-inventory').first();
      const inventory = features.find('ol').last();
      for (const i of inventory.find('li')) {
        const item = sheet.actor.items.get(i.dataset.itemId);
        if (item.type === maneuverType) i.remove();
      }
    }
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
    spellcasting.type !== 'maneuvers' ||
    ['herald', 'wielder'].includes(spellcasting.progression)
  )
    return true;
  const prof = foundry.utils.getProperty(actor, 'system.attributes.prof');
  const max =
    {
      martial: 2 * prof,
      scholar: prof,
    }[spellcasting.progression] ?? 0;
  let ep = actor.getFlag(moduleID, 'ep');
  if (ep && foundry.utils.getType(ep) === 'Object')
    ep.max = Math.max(max, ep.max ?? 0);
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
