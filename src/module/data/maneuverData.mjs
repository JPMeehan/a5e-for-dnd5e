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
export default class ManeuverData extends dnd5e.dataModels.SystemDataModel.mixin(
  dnd5e.dataModels.item.ItemDescriptionTemplate,
  dnd5e.dataModels.item.ActivatedEffectTemplate,
  dnd5e.dataModels.item.ActionTemplate
) {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      degree: new foundry.data.fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: 'a5e-for-5e.Maneuver.Degree',
      }),
      tradition: new foundry.data.fields.StringField({
        required: true,
        label: 'a5e-for-5e.Maneuver.Tradition',
      }),
      prerequisite: new foundry.data.fields.StringField({
        required: false,
        label: 'a5e-for-5e.Maneuver.Prerequisite',
      }),
    });
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

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
    this.labels.ep = this.usesExertion ? 'a5e-for-5e.Maneuver.EP' : '';
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
   * @param {object} consume        Effect's resource consumption.
   * @param {string} consume.type   Type of resource to consume
   * @param {string} consume.target Item ID or resource key path of resource to consume.
   * @returns {boolean}     Returns true if it spends psi points as a resource
   */
  get usesExertion() {
    return this.consume.type === 'flags' && this.consume.target === 'exert';
  }
}
