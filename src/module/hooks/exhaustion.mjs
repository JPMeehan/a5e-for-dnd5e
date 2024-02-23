import { moduleID, modulePath, moduleTypes } from '../utils.mjs';

export function useFatigueStress() {
  const fatigue = {
    label: 'a5e-for-dnd5e.Fatigue',
    name: 'a5e-for-dnd5e.Fatigue',
    levels: 7,
  };
  foundry.utils.mergeObject(CONFIG.DND5E.conditionTypes.exhaustion, fatigue);
  foundry.utils.mergeObject(
    CONFIG.statusEffects.find((s) => s.id === 'exhaustion'),
    fatigue
  );
  CONFIG.DND5E.conditionEffects.halfMovement.delete('exhaustion-2');
  CONFIG.DND5E.conditionEffects.halfMovement.add('exhaustion-3');
  CONFIG.DND5E.conditionEffects.halfHealth.delete('exhaustion-4');
  CONFIG.DND5E.conditionEffects.noMovement.delete('exhaustion-5');
}
