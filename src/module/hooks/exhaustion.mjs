import { moduleID } from '../utils.mjs';

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

/**
 * A hook event that fires after a death saving throw has been rolled for an Actor, but before
 * updates have been performed.
 * @param {Actor5e} actor              Actor for which the death saving throw has been rolled.
 * @param {D20Roll} roll               The resulting roll.
 * @param {object} details
 * @param {Record<string, any>} details.updates     Updates that will be applied to the actor as a result of this save.
 * @param {string} details.chatString  Localizable string displayed in the create chat message. If not set, then
 *                                     no chat message will be displayed.
 * @returns {boolean}                  Explicitly return `false` to prevent updates from being performed.
 */
export function natOneDeathSave(actor, roll, details) {
  if (!game.settings.get(moduleID, 'useFatigueStress')) return;
  if (roll.isFumble) {
    const death = actor.system.attributes.death;
    const failures = death.failure + 1;
    const exhaustion = actor.system.attributes.exhaustion;
    const stress = actor.getFlag(moduleID, 'stress') ?? 0;
    details.updates = {
      'system.attributes.death.failure': Math.clamped(failures, 0, 3),
      'system.attributes.exhaustion': Math.clamped(
        exhaustion + 1,
        0,
        CONFIG.DND5E.conditionTypes.exhaustion.levels
      ),
      'flags.a5e-for-dnd5e.stress': Math.clamped(stress + 1, 0, 7),
    };
    if (failures < 3) details.chatString = '';
  }
}
