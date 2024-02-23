import { moduleID, modulePath, moduleTypes } from '../utils.mjs';

export function useFatigueStress() {
  foundry.utils.mergeObject(CONFIG.DND5E.conditionTypes.exhaustion, {
    // icon: 'modules/chaosos-5e-content/assets/icons/exhaustion.svg',
    // reference:
    //   'Compendium.chaosos-5e-content.class-journals.JournalEntry.byhrzi2UPEpHbCNu.JournalEntryPage.iYCe6WcEW4Kosqfa',
    levels: 7,
  });
  CONFIG.DND5E.conditionEffects.halfMovement.delete('exhaustion-2');
  CONFIG.DND5E.conditionEffects.halfMovement.add('exhaustion-3');
  CONFIG.DND5E.conditionEffects.halfHealth.delete('exhaustion-4');
  CONFIG.DND5E.conditionEffects.noMovement.delete('exhaustion-5');
}
