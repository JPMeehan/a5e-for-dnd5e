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
