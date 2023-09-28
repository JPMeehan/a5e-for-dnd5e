const A5ECONFIG = {
  A5E: {
    MANEUVERS: {
      degree: {
        0: "a5e-for-dnd5e.Maneuver.Degrees.0",
        1: "a5e-for-dnd5e.Maneuver.Degrees.1",
        2: "a5e-for-dnd5e.Maneuver.Degrees.2",
        3: "a5e-for-dnd5e.Maneuver.Degrees.3",
        4: "a5e-for-dnd5e.Maneuver.Degrees.4",
        5: "a5e-for-dnd5e.Maneuver.Degrees.5",
      },
      tradition: {
        adm: "a5e-for-dnd5e.Maneuver.Traditions.adm",
        btz: "a5e-for-dnd5e.Maneuver.Traditions.btz",
        mgl: "a5e-for-dnd5e.Maneuver.Traditions.mgl",
        mas: "a5e-for-dnd5e.Maneuver.Traditions.mas",
        rc: "a5e-for-dnd5e.Maneuver.Traditions.rc",
        rze: "a5e-for-dnd5e.Maneuver.Traditions.rze",
        sk: "a5e-for-dnd5e.Maneuver.Traditions.sk",
        ss: "a5e-for-dnd5e.Maneuver.Traditions.ss",
        tpi: "a5e-for-dnd5e.Maneuver.Traditions.tpi",
        tac: "a5e-for-dnd5e.Maneuver.Traditions.tac",
        uwh: "a5e-for-dnd5e.Maneuver.Traditions.uwh",
      },
    },
  },
  DND5E: {},
};

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
A5ECONFIG.DND5E.weaponProperties = {
  burn: "A5E.WeaponPropertyBurn",
  breaker: "A5E.WeaponPropertyBreaker",
  compounding: "A5E.WeaponPropertyCompounding",
  defensive: "A5E.WeaponPropertyDefensive",
  flamboyant: "A5E.WeaponPropertyFlamboyant",
  handMounted: "A5E.WeaponPropertyHandMounted",
  inaccurate: "A5E.WeaponPropertyInaccurate",
  mounted: "A5E.WeaponPropertyMounted",
  muzzleLoading: "A5E.WeaponPropertyMuzzleLoading",
  parrying: "A5E.WeaponPropertyParrying",
  parryingImmunity: "A5E.WeaponPropertyParryingImmunity",
  quickdraw: "A5E.WeaponPropertyQuickdraw",
  range: "A5E.WeaponPropertyRange",
  rifled: "A5E.WeaponPropertyRifled",
  scatter: "A5E.WeaponPropertyScatter",
  shock: "A5E.WeaponPropertyShock",
  simple: "A5E.WeaponPropertySimple",
  stealthy: "A5E.ObjectPropertyStealthy",
  storage: "A5E.ObjectPropertyStorage",
  triggerCharge: "A5E.WeaponPropertyTriggerCharge",
  trip: "A5E.WeaponPropertyTrip",
  vicious: "A5E.WeaponPropertyVicious",
};

/**
 * Data definition for Maneuver items.
 * @mixes ItemDescriptionTemplate
 * @mixes ActivatedEffectTemplate
 * @mixes ActionTemplate
 *
 * @property {number} degree                     Degree (level) of the maneuver.
 * @property {string} tradition                  Combat tradition to which this maneuver belongs.
 * @property {object} scaling                    Details on how casting at higher levels affects this maneuver.
 * @property {string} scaling.mode               Spell scaling mode as defined in `DND5E.spellScalingModes`.
 * @property {string} scaling.formula            Dice formula used for scaling.
 */
class ManeuverData extends dnd5e.dataModels.SystemDataModel.mixin(
  dnd5e.dataModels.item.ItemDescriptionTemplate,
  dnd5e.dataModels.item.ActivatedEffectTemplate,
  dnd5e.dataModels.item.ActionTemplate
) {
  /** @inheritdoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      degree: new foundry.data.fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: "a5e-for-5e.Maneuver.Degree",
      }),
      tradition: new foundry.data.fields.StringField({
        required: true,
        label: "a5e-for-5e.Maneuver.Tradition",
      }),
      prerequisite: new foundry.data.fields.StringField({
        required: false,
        label: "a5e-for-5e.Maneuver.Prerequisite",
      }),
      isStance: new foundry.data.fields.BooleanField({
        required: true,
        label: "a5e-for-5e.Maneuver.isStance",
      }),
    });
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static migrateData(source) {
    super.migrateData(source);
  }

  /* -------------------------------------------- */
  /*  Derived Data                                */
  /* -------------------------------------------- */

  prepareDerivedData() {
    this.labels = {};
    this._prepareManeuver();
  }

  _prepareManeuver() {
    this.labels.degree = CONFIG.A5E.MANEUVERS.degree[this.degree];
    this.labels.tradition = CONFIG.A5E.MANEUVERS.tradition[this.tradition];
    this.labels.ep = this.usesExertion ? "a5e-for-5e.Maneuver.EP" : "";
  }

  /* -------------------------------------------- */
  /*  Getters                                     */
  /* -------------------------------------------- */

  /**
   * Properties displayed in chat.
   * @type {string[]}
   */
  get chatProperties() {
    let properties = [this.labels.degree];
    if (this.labels.ep) properties.push(this.labels.ep);

    return [...properties];
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get _typeAbilityMod() {
    return this.parent?.actor?.system.attributes.spellcasting || "str";
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get _typeCriticalThreshold() {
    return this.parent?.actor?.flags.dnd5e?.spellCriticalThreshold ?? Infinity;
  }

  /**
   * @param {object} consume        Effect's resource consumption.
   * @param {string} consume.type   Type of resource to consume
   * @param {string} consume.target Item ID or resource key path of resource to consume.
   * @returns {boolean}     Returns true if it spends psi points as a resource
   */
  get usesExertion() {
    return this.consume.type === "flags" && this.consume.target === "exert";
  }
}

class ManeuverSheet extends dnd5e.applications.item.ItemSheet5e {
  get template() {
    return `/modules/a5e-for-dnd5e/templates/maneuver-sheet.hbs`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.maneuvers = CONFIG.A5E.MANEUVERS;

    const consume =
      context.system.consume.type === "flags"
        ? { ep: game.i18n.localize("a5e-for-dnd5e.Maneuver.EP") }
        : {};

    const consumption = context.system.consume;
    if (context.system.usesExertion) {
      if (context.system.labels.ep) {
        const epLabel = this.epText(consumption.amount);
        context.system.labels.ep = epLabel;
        context.itemStatus = epLabel;
      }
    } else delete context.system.labels.ep;
    foundry.utils.mergeObject(context, {
      labels: context.system.labels,
      abilityConsumptionTargets: consume,
    });

    return context;
  }

  epText(ep) {
    return `${ep} ${
      ep === 1
        ? game.i18n.localize("a5e-for-dnd5e.Maneuver.1EP")
        : game.i18n.localize("a5e-for-dnd5e.Maneuver.EP")
    }`;
  }
}

const moduleName = "a5e-for-dnd5e";
const typeManeuver = "a5e-for-dnd5e.maneuver";

Hooks.once("init", () => {
  foundry.utils.mergeObject(CONFIG, A5ECONFIG);

  Object.assign(CONFIG.Item.dataModels, {
    [typeManeuver]: ManeuverData,
  });

  Items.registerSheet("maneuver", ManeuverSheet, {
    types: [typeManeuver],
    makeDefault: true,
  });
});

Hooks.once("i18nInit", () => _localizeHelper(CONFIG.A5E));

function _localizeHelper(object) {
  for (const [key, value] of Object.entries(object)) {
    switch (typeof value) {
      case "string":
        if (value.includes(moduleName)) object[key] = game.i18n.localize(value);
        break;
      case "object":
        _localizeHelper(object[key]);
        break;
    }
  }
}

/**
 *
 * INLINE POWER DISPLAY
 *
 */

Hooks.on("renderActorSheet5e", (app, html, context) => {
  if (!game.user.isGM && app.actor.limited) return true;
  if (context.isCharacter || context.isNPC) {
    const owner = context.actor.isOwner;
    let maneuvers = context.items.filter((i) => i.type === typeManeuver);
    maneuvers = app._filterItems(maneuvers, app._filters.spellbook);
    const levels = context.system.spells;
    const spellbook = context.spellbook;
    const useLabels = { "-20": "-", "-10": "-", 0: "&infin;" };
    const sections = { atwill: -20, innate: -10, pact: 0.5 };

    const registerSection = (
      sl,
      i,
      label,
      { prepMode = "prepared", value, max, override } = {}
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
        canPrepare: context.actor.type === "character" && i >= 1,
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {
          type: "spell",
          level: prepMode in sections ? 1 : i,
          "preparation.mode": prepMode,
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
      context.itemContext[maneuver.id].toggleClass = "fixed";

      const mode = "always";
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

      // Known bug: This breaks if there's a mix of spells and powers WITHOUT spellcaster levels
      else if (!spellbook[p]) {
        registerSection(pl, p, CONFIG.DND5E.spellLevels[p], {
          levels: levels[pl],
        });
      }

      // Add the power to the relevant heading
      spellbook[p].spells.push(maneuver);
    });
    const spellList = html.find(".spellbook");
    const template = "systems/dnd5e/templates/actors/parts/actor-spellbook.hbs";
    renderTemplate(template, context).then((partial) => {
      spellList.html(partial);
      let ep = app.actor.getFlag("prime-psionics", "pp");
      if (ep) {
        const ppContext = {
          ep: ep.value,
          ppMax: ep.max,
        };
        renderTemplate(
          `/modules/a5e-for-dnd5e/templates/ep-partial.hbs`,
          ppContext
        ).then((exertionHeader) => {
          spellList.find(".inventory-list").prepend(exertionHeader);
        });
      }
      app.activateListeners(spellList);
    });
  } else return true;
});

// /**
//  *
//  * CALCULATE MAX PSI POINTS
//  *
//  */

// Hooks.on(
//   "dnd5e.computePsionicsProgression",
//   (progression, actor, cls, spellcasting, count) => {
//     if (!progression.hasOwnProperty("psionics")) progression.psionics = 0;
//     const prog =
//       CONFIG.DND5E.spellcastingTypes.psionics.progression[
//         spellcasting.progression
//       ];
//     if (!prog) return;

//     progression.psionics += Math.floor(spellcasting.levels / prog.divisor ?? 1);
//     // Single-classed, non-full progression rounds up, rather than down, except at first level for half manifesters.
//     if (count === 1 && prog.divisor > 1 && progression.psionics) {
//       progression.psionics = Math.ceil(spellcasting.levels / prog.divisor);
//     }

//     const limit = Math.ceil(Math.min(progression.psionics, 10) / 2) * 2;
//     const updates = {
//       manifestLimit: limit,
//       pp: {
//         max: CONFIG.PSIONICS.ppProgression[progression.psionics],
//       },
//     };
//     if (actor === undefined) return;
//     const pp = actor.getFlag("prime-psionics", "pp");
//     if (pp === undefined)
//       updates.pp.value = CONFIG.PSIONICS.ppProgression[progression.psionics];
//     else if (typeof pp === "number") updates.pp.value = pp; // migration
//     const flags = actor.flags["prime-psionics"];
//     if (flags) foundry.utils.mergeObject(flags, updates);
//     else actor.flags["prime-psionics"] = updates;
//   }
// );

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
 * SCALING
 */

// Hooks.on("dnd5e.preRollDamage", (item, rollConfig) => {
//   if (item.type !== typePower) return;
//   if (item.system.scaling.mode === "talent") {
//     let level;
//     if (rollConfig.actor.type === "character")
//       level = rollConfig.actor.system.details.level;
//     else if (item.system.preparation.mode === "innate")
//       level = Math.ceil(rollConfig.actor.system.details.cr);
//     else level = rollConfig.actor.system.details.spellLevel;
//     const add = Math.floor((level + 1) / 6);
//     if (add === 0) return;
//     scaleDamage(
//       rollConfig.parts,
//       item.system.scaling.mode.formula || rollConfig.parts.join(" + "),
//       add,
//       rollConfig.data
//     );
//   } else if (
//     item.system.scaling.mode === "intensify" &&
//     item.system.scaling.formula
//   ) {
//     const ppSpend = Number(rollConfig.event.target.dataset["ppspend"]);
//     if (ppSpend === NaN) return;
//     const minPP = item.system.consume.amount;
//     const intensify = Math.max(0, ppSpend - minPP);
//     if (intensify === 0) return;
//     scaleDamage(
//       rollConfig.parts,
//       item.system.scaling.formula,
//       intensify,
//       rollConfig.data
//     );
//   }
// });
// /**
//  * Scale an array of damage parts according to a provided scaling formula and scaling multiplier.
//  * @param {string[]} parts    The original parts of the damage formula.
//  * @param {string} scaling    The scaling formula.
//  * @param {number} times      A number of times to apply the scaling formula.
//  * @param {object} rollData   A data object that should be applied to the scaled damage roll
//  * @returns {string[]}        The parts of the damage formula with the scaling applied.
//  * @private
//  */
// function scaleDamage(parts, scaling, times, rollData) {
//   if (times <= 0) return parts;
//   const p0 = new Roll(parts[0], rollData);
//   const s = new Roll(scaling, rollData).alter(times);

//   // Attempt to simplify by combining like dice terms
//   let simplified = false;
//   if (s.terms[0] instanceof Die && s.terms.length === 1) {
//     const d0 = p0.terms[0];
//     const s0 = s.terms[0];
//     if (
//       d0 instanceof Die &&
//       d0.faces === s0.faces &&
//       d0.modifiers.equals(s0.modifiers)
//     ) {
//       d0.number += s0.number;
//       parts[0] = p0.formula;
//       simplified = true;
//     }
//   }

//   // Otherwise, add to the first part
//   if (!simplified) parts[0] = `${parts[0]} + ${s.formula}`;
//   return parts;
// }
/**
 *
 * POWER POINT RESET ON LR
 *
 */

Hooks.on("dnd5e.preRestCompleted", (actor, result) => {
  if (!result.longRest) return true;
  result.updateData[`flags.${moduleName}.ep.value`] = actor.getFlag(
    moduleName,
    "ep"
  )["max"];
});

// /**
//  *
//  * SPELLCASTING TABLE
//  *
//  */

// Hooks.on(
//   "dnd5e.buildPsionicsSpellcastingTable",
//   (table, item, spellcasting) => {
//     table.headers = [
//       [
//         { content: game.i18n.localize("PrimePsionics.PP") },
//         { content: game.i18n.localize("PrimePsionics.PsiLimit") },
//       ],
//     ];

//     table.cols = [{ class: "spellcasting", span: 2 }];

//     for (const level of Array.fromRange(CONFIG.DND5E.maxLevel, 1)) {
//       const progression = { psionics: 0 };
//       spellcasting.levels = level;
//       globalThis.dnd5e.documents.Actor5e.computeClassProgression(
//         progression,
//         item,
//         { spellcasting }
//       );

//       const pp = CONFIG.PSIONICS.ppProgression[progression.psionics] || "—";
//       const limit =
//         Math.ceil(Math.min(progression.psionics, 10) / 2) * 2 || "—";

//       table.rows.push([
//         { class: "spell-slots", content: `${pp}` },
//         { class: "spell-slots", content: `${limit}` },
//       ]);
//     }
//   }
// );
//# sourceMappingURL=a5e.mjs.map
