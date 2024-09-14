import {modulePath, moduleTypes} from "../utils.mjs";

const {ItemDescriptionTemplate, ActivitiesTemplate} = dnd5e.dataModels.item;
const {ActivationField, DurationField, RangeField, TargetField} = dnd5e.dataModels.shared;

/**
 * Data definition for Maneuver items.
 * @mixes ItemDescriptionTemplate
 * @mixes ActivatedEffectTemplate
 * @mixes ActionTemplate
 *
 * @property {number} degree                    Degree (level) of the maneuver.
 * @property {string} tradition                 Combat tradition to which this maneuver belongs.
 * @property {string} prerequisite              Requirements for the maneuver
 * @property {Set<string>} properties           Maneuver's properties.
 */
export default class ManeuverData extends dnd5e.dataModels.ItemDataModel.mixin(
  ItemDescriptionTemplate,
  ActivitiesTemplate
) {
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema(super.defineSchema(), {
      activation: new ActivationField(),
      duration: new DurationField(),
      range: new RangeField(),
      target: new TargetField(),
      degree: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: "a5e-for-dnd5e.Maneuver.Degree"
      }),
      tradition: new fields.StringField({
        required: true,
        label: "a5e-for-dnd5e.Maneuver.Tradition"
      }),
      prerequisite: new fields.StringField({
        required: false,
        label: "a5e-for-dnd5e.Maneuver.Prerequisite"
      }),
      properties: new fields.SetField(new fields.StringField())
    });
  }

  /** @override */
  static get compendiumBrowserFilters() {
    return new Map([
      ["degree", {
        label: "a5e-for-dnd5e.Maneuver.Degree",
        type: "range",
        config: {
          keyPath: "system.degree",
          min: 0,
          max: Object.keys(CONFIG.A5E.MANEUVERS.degree).length - 1
        }
      }],
      ["tradition", {
        label: "a5e-for-dnd5e.Maneuver.Tradition",
        type: "set",
        config: {
          choices: CONFIG.A5E.MANEUVERS.tradition,
          keyPath: "system.tradition"
        }
      }],
      ["properties", this.compendiumBrowserPropertiesFilter(moduleTypes.maneuver)]
    ]);
  }

  /* -------------------------------------------- */
  /*  Data Migrations                             */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static _migrateData(source) {
    super._migrateData(source);
    ActivitiesTemplate.migrateActivities(source);
    ManeuverData.#migrateActivation(source);
    ManeuverData.#migrateTarget(source);
  }
  /**
   * Migrate activation data.
   * Added in DnD5e 4.0.0.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateActivation(source) {
    if (source.activation?.cost) source.activation.value = source.activation.cost;
  }

  /* -------------------------------------------- */

  /**
   * Migrate target data.
   * Added in DnD5e 4.0.0.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateTarget(source) {
    if (!("target" in source)) return;
    source.target.affects ??= {};
    source.target.template ??= {};

    if ("units" in source.target) source.target.template.units = source.target.units;
    if ("width" in source.target) source.target.template.width = source.target.width;

    const type = source.target.type ?? source.target.template.type ?? source.target.affects.type;
    if (type in CONFIG.DND5E.areaTargetTypes) {
      if ("type" in source.target) source.target.template.type = type;
      if ("value" in source.target) source.target.template.size = source.target.value;
    } else if (type in CONFIG.DND5E.individualTargetTypes) {
      if ("type" in source.target) source.target.affects.type = type;
      if ("value" in source.target) source.target.affects.count = source.target.value;
    }
  }

  /**
   * Add additional data shims for powers.
   */
  _applyManeuverShims() {
    Object.defineProperty(this.activation, "cost", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `activation.cost` property on `PowerData` has been renamed `activation.value`.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return this.value;
      },
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(this, "scaling", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `scaling` property on `PowerData` has been deprecated and is now handled by individual damage parts.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return {mode: "none", formula: null};
      },
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(this.target, "value", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `target.value` property on `PowerData` has been split into `target.template.size` and `target.affects.count`.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return this.template.size || this.affects.count;
      },
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(this.target, "width", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `target.width` property on `PowerData` has been moved to `target.template.width`.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return this.template.width;
      },
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(this.target, "units", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `target.units` property on `PowerData` has been moved to `target.template.units`.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return this.template.units;
      },
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(this.target, "type", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `target.type` property on `PowerData` has been split into `target.template.type` and `target.affects.type`.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return this.template.type || this.affects.type;
      },
      configurable: true,
      enumerable: false
    });
    const firstActivity = this.activities.contents[0] ?? {};
    Object.defineProperty(this.target, "prompt", {
      get() {
        foundry.utils.logCompatibilityWarning(
          "The `target.prompt` property on `PowerData` has moved into its activity.",
          {since: "DnD5e 4.0", until: "DnD5e 4.4", once: true}
        );
        return firstActivity.target?.prompt;
      },
      configurable: true,
      enumerable: false
    });
  }

  /* -------------------------------------------- */
  /*  Tooltips                                    */
  /* -------------------------------------------- */

  static ITEM_TOOLTIP_TEMPLATE = modulePath + "templates/maneuver-tooltip.hbs";

  async getCardData(enrichmentOptions = {}) {
    const context = await super.getCardData(enrichmentOptions);
    context.maneuvers = CONFIG.A5E.MANEUVERS;
    context.tradition = this.tradition;
    context.isSpell = true;
    // context.tags = this.labels.components.tags;
    context.subtitle = [this.labels.degree, this.labels.school].filterJoin(
      " &bull; "
    );
    return context;
  }

  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.parent.labels.activation],
      modifier: this.parent.labels.modifier,
      range: this.range,
      save: this.save
    });
  }

  /** @inheritDoc */
  async getSheetData(context) {
    context.subtitles = [
      {label: context.labels.level},
      {label: context.labels.discipline}
    ];
    context.psionics = CONFIG.PSIONICS;
    context.properties.active = this.parent.labels?.components?.tags;
    context.parts = [modulePath("templates/details-power.hbs"), "dnd5e.field-uses"];
  }

  /* -------------------------------------------- */
  /*  Derived Data                                */
  /* -------------------------------------------- */

  prepareDerivedData() {
    ActivitiesTemplate._applyActivityShims.call(this);
    this._applyManeuverShims();
    super.prepareDerivedData();
    this.prepareDescriptionData();

    this.labels = this.parent.labels ??= {};

    this.labels.degree = CONFIG.A5E.MANEUVERS.degree[this.degree];
    const traditionLabel =
      CONFIG.A5E.MANEUVERS.tradition[this.tradition]?.label;
    this.labels.tradition = traditionLabel;
    this.labels.school = traditionLabel;
    this.labels.ep = this.usesExertion ? "a5e-for-dnd5e.Maneuver.EP" : "";
  }

  prepareFinalData() {
    const rollData = this.parent.getRollData({deterministic: true});
    const labels = this.parent.labels ??= {};
    this.prepareFinalActivityData();
    ActivationField.prepareData.call(this, rollData, labels);
    DurationField.prepareData.call(this, rollData, labels);
    RangeField.prepareData.call(this, rollData, labels);
    TargetField.prepareData.call(this, rollData, labels);

    // Necessary because excluded from valid types in Item5e#_prepareProficiency
    if (!this.parent.actor?.system.attributes?.prof) {
      this.prof = new dnd5e.documents.Proficiency(0, 0);
      return;
    }

    this.prof = new dnd5e.documents.Proficiency(this.parent.actor.system.attributes.prof, this.proficiencyMultiplier ?? 0);
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
   * The proficiency multiplier for this item.
   * @returns {number}
   */
  get proficiencyMultiplier() {
    return 1;
  }

  /**
   * @returns {boolean}     Returns true if it spends exertion points as a resource
   */
  get usesExertion() {
    return this.activities.some(a => a.consumption.targets.some(c => c.type === "exertionPoints"));
  }
}
