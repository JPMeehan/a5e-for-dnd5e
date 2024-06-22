import { modulePath } from '../utils.mjs';

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
  dnd5e.dataModels.item.ItemDescriptionTemplate,
  dnd5e.dataModels.item.ActivatedEffectTemplate,
  dnd5e.dataModels.item.ActionTemplate
) {
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema(super.defineSchema(), {
      degree: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: 'a5e-for-5e.Maneuver.Degree',
      }),
      tradition: new fields.StringField({
        required: true,
        label: 'a5e-for-5e.Maneuver.Tradition',
      }),
      prerequisite: new fields.StringField({
        required: false,
        label: 'a5e-for-5e.Maneuver.Prerequisite',
      }),
      properties: new fields.SetField(new fields.StringField()),
    });
  }

  /* -------------------------------------------- */
  /*  Tooltips                                    */
  /* -------------------------------------------- */

  static ITEM_TOOLTIP_TEMPLATE = modulePath + 'templates/maneuver-tooltip.hbs';

  async getCardData(enrichmentOptions = {}) {
    const context = await super.getCardData(enrichmentOptions);
    context.maneuvers = CONFIG.A5E.MANEUVERS;
    context.tradition = this.tradition;
    context.isSpell = true;
    // context.tags = this.labels.components.tags;
    context.subtitle = [this.labels.degree, this.labels.school].filterJoin(
      ' &bull; '
    );
    return context;
  }

  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.parent.labels.activation],
      modifier: this.parent.labels.modifier,
      range: this.range,
      save: this.save,
    });
  }

  /* -------------------------------------------- */
  /*  Derived Data                                */
  /* -------------------------------------------- */

  prepareDerivedData() {
    this.labels = {};
    this.labels.degree = CONFIG.A5E.MANEUVERS.degree[this.degree];
    const traditionLabel =
      CONFIG.A5E.MANEUVERS.tradition[this.tradition]?.label;
    this.labels.tradition = traditionLabel;
    this.labels.school = traditionLabel;
    this.labels.ep = this.usesExertion ? 'a5e-for-dnd5e.Maneuver.EP' : '';
  }

  prepareFinalData() {
    this.prepareFinalActivatedEffectData();
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
    return this.parent?.actor?.system.attributes.spellcasting || 'str';
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get _typeCriticalThreshold() {
    return this.parent?.actor?.flags.dnd5e?.spellCriticalThreshold ?? Infinity;
  }

  /**
   * @returns {boolean}     Returns true if it spends exertion points as a resource
   */
  get usesExertion() {
    return this.consume.type === 'charges';
  }
}
