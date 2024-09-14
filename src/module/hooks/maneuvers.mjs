import {ACTOR_SHEETS, moduleTypes} from "../utils.mjs";
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
    if (!maneuvers.length) return true;
    const levels = context.system.spells;
    const spellbook = context.spellbook;
    const levelOffset = spellbook.length - 1;

    const registerSection = (
      sl,
      d,
      label,
      {preparationMode = "prepared", override} = {}
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
        canPrepare: (context.actor.type === "character") && (d >= 1),
        spells: [],
        uses: "-",
        slots: "-",
        override: override || 0,
        dataset: {
          type: maneuverType,
          degree: d,
          preparationMode
        },
        prop: sl,
        editable: context.editable && !aeOverride
      };
    };

    maneuvers.forEach((maneuver) => {
      if (maneuver.system.usesExertion)
        maneuver.system.labels.ep = maneuver.sheet.epText(
          maneuver.system.consume.amount
        );
      foundry.utils.mergeObject(maneuver, {
        labels: maneuver.system.labels
      });

      // Activation
      const cost = maneuver.system.activation?.value;
      const abbr = {
        action: "DND5E.ActionAbbr",
        bonus: "DND5E.BonusActionAbbr",
        reaction: "DND5E.ReactionAbbr",
        minute: "DND5E.TimeMinuteAbbr",
        hour: "DND5E.TimeHourAbbr",
        day: "DND5E.TimeDayAbbr"
      }[maneuver.system.activation.type];

      let itemContext = null;
      switch (sheet.constructor.name) {
        case ACTOR_SHEETS.DEFAULT_PC:
          itemContext = {
            activation:
              cost && abbr
                ? `${cost}${game.i18n.localize(abbr)}`
                : maneuver.labels.activation,
            preparation: {applicable: false}
          };
          break;
        case ACTOR_SHEETS.LEGACY_PC:
        case ACTOR_SHEETS.LEGACY_NPC:
          itemContext = {
            toggleTitle: CONFIG.DND5E.spellPreparationModes.always,
            toggleClass: "fixed"
          };
          break;
      }

      if (sheet.constructor.name === ACTOR_SHEETS.DEFAULT_PC) {
        // Range
        const units = maneuver.system.range?.units;
        if (units && (units !== "none")) {
          if (units in CONFIG.DND5E.movementUnits) {
            itemContext.range = {
              distance: true,
              value: maneuver.system.range.value,
              unit: game.i18n.localize(`DND5E.Dist${units.capitalize()}Abbr`)
            };
          } else itemContext.range = {distance: false};
        }

        // To Hit
        const toHit = parseInt(maneuver.labels.modifier);
        if (maneuver.hasAttack && !isNaN(toHit)) {
          itemContext.toHit = {
            sign: Math.sign(toHit) < 0 ? "-" : "+",
            abs: Math.abs(toHit)
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
          levels: levels[pl]
        });
      }

      // Add the maneuver to the relevant heading
      spellbook[index].spells.push(maneuver);
    });
    for (const i in spellbook) {
      if (spellbook[i] === undefined) delete spellbook[i];
    }
    const spellList =
      sheet.constructor.name === ACTOR_SHEETS.DEFAULT_PC
        ? html.find(".spells")
        : html.find(".spellbook");
    const spellListTemplate = {
      [ACTOR_SHEETS.DEFAULT_PC]:
        "systems/dnd5e/templates/actors/tabs/creature-spells.hbs",
      [ACTOR_SHEETS.DEFAULT_NPC]:
        "systems/dnd5e/templates/actors/tabs/creature-spells.hbs",
      [ACTOR_SHEETS.LEGACY_PC]:
        "systems/dnd5e/templates/actors/parts/actor-spellbook.hbs",
      [ACTOR_SHEETS.LEGACY_NPC]:
        "systems/dnd5e/templates/actors/parts/actor-spellbook.hbs"
    }[sheet.constructor.name];
    if (!spellListTemplate) return;
    renderTemplate(spellListTemplate, context).then((partial) => {
      spellList.html(partial);
      let schoolSlots;
      let traditions;
      let schoolFilter;
      let sectionHeader;

      switch (sheet.constructor.name) {
        case ACTOR_SHEETS.DEFAULT_PC:
          spellList
            .find(`.items-section[data-type="${maneuverType}"]`)
            .find(".item-header.item-school")
            .html(game.i18n.localize("a5e-for-dnd5e.Maneuver.TraditionShort"));

          schoolSlots = spellList.find(".item-detail.item-school");
          /** @type {Array<{label: string, icon: string}>} */
          traditions = Object.values(CONFIG.A5E.MANEUVERS.tradition);
          for (const div of schoolSlots) {
            const trad = traditions.find(
              (t) => t.label === div.dataset.tooltip
            );
            if (trad) {
              div.innerHTML = `<dnd5e-icon src="${trad.icon}"></dnd5e-icon>`;
            }
          }

          schoolFilter = spellList.find(
            "item-list-controls .filter-list"
          );
          schoolFilter.append(
            Object.values(CONFIG.A5E.MANEUVERS.tradition).map((t) => {
              `<li><button type="button" class="filter-item">${t.label}</button></li>`;
            })
          );
          break;
        case ACTOR_SHEETS.LEGACY_PC:
        case ACTOR_SHEETS.LEGACY_NPC:
          sectionHeader = spellList.find(
            `.items-header.spellbook-header[data-type="${maneuverType}"]`
          );
          sectionHeader
            .find(".spell-school")
            .html(game.i18n.localize("a5e-for-dnd5e.Maneuver.Tradition"));
          sectionHeader
            .find(".spell-action")
            .html(game.i18n.localize("a5e-for-dnd5e.Maneuver.Usage"));
          sectionHeader
            .find(".spell-target")
            .html(game.i18n.localize("a5e-for-dnd5e.Maneuver.Target"));
          break;
      }
      sheet.activateListeners(spellList);
    });

    if (sheet.constructor.name === "ActorSheet5eNPC") {
      const features = html.find("dnd5e-inventory").first();
      const inventory = features.find("ol").last();
      for (const i of inventory.find("li")) {
        const item = sheet.actor.items.get(i.dataset.itemId);
        if (item.type === maneuverType) i.remove();
      }
    }
  } else return true;
}
