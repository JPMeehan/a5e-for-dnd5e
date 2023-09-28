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
        if (value.includes("a5e-for-dnd5e"))
          object[key] = game.i18n.localize(value);
        break;
      case "object":
        _localizeHelper(object[key]);
        break;
    }
  }
}
//# sourceMappingURL=a5e.mjs.map
