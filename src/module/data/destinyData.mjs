import { moduleID } from '../utils.mjs';

export default class DestinyData extends dnd5e.dataModels.ItemDataModel.mixin(
  dnd5e.dataModels.item.ItemDescriptionTemplate
) {
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      advancement: new foundry.data.fields.ArrayField(
        new dnd5e.dataModels.fields.AdvancementField()
      ),
    });
  }

  static metadata = Object.freeze({ singleton: true });

  /* -------------------------------------------- */
  /*  Socket Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Set the destiny reference in actor data.
   * @param {object} data     The initial data object provided to the document creation request
   * @param {object} options  Additional options which modify the creation request
   * @param {string} userId   The id of the User requesting the document update
   * @see {Document#_onCreate}
   * @protected
   */
  _onCreate(data, options, userId) {
    if (game.user.id !== userId || this.parent.actor?.type !== 'character')
      return;
    this.parent.actor.setFlag(moduleID, 'destiny', this.parent.id);
  }

  /* -------------------------------------------- */

  /**
   * Remove the destiny reference in actor data.
   * @param {object} options            Additional options which modify the deletion request
   * @param {documents.BaseUser} user   The User requesting the document deletion
   * @returns {Promise<boolean|void>}   A return value of false indicates the deletion operation should be cancelled.
   * @see {Document#_preDelete}
   * @protected
   */
  async _preDelete(options, user) {
    if (this.parent.actor?.type !== 'character') return;
    await this.parent.actor.unsetFlag(moduleID, 'destiny');
  }
}
