
import {moduleID, modulePath} from "../utils.mjs";

/** @import RollConfigurationDialog from "../../../dnd5e/module/applications/dice/roll-configuration-dialog.mjs"; */ 
/** @import { SkillToolConfig } from "../../../dnd5e/module/applications/actor/_module.mjs"; */
/** @import { BasicRollConfiguration } from "../../../dnd5e/module/dice/basic-roll.mjs" */

const edPartialHeight = 30;

/**
 * Adds expertise die configuration to skills and tools
 * @param {SkillToolConfig} app
 * @param {HTMLElement} html
 * @returns
 */
export function configSkillTool(app, html) {
  /** @type {Actor} */
  const actor = app.document;
  if (actor.documentName !== "Actor") return;
  /** @type {Record<string, number>} */
  const ed = actor.getFlag(moduleID, "ed") ?? {};

  const selectInput = foundry.applications.fields.createSelectInput({
    name: `flags.${moduleID}.ed.${app.options.key}`,
    value: ed[app.options.key] ?? 0,
    options: Object.entries(CONFIG.A5E.expertiseDie).map(([value, label]) => ({value, label}))
  });

  const formGroup = foundry.applications.fields.createFormGroup({
    input: selectInput,
    label: "a5e-for-dnd5e.ExpertiseDie.label",
    localize: true
  });

  html.querySelector("fieldset.card").insertAdjacentElement("beforeend", formGroup);
}

/**
 * A hook event that fires when a roll config is built using the roll prompt.
 * @param {RollConfigurationDialog} dialog Roll configuration dialog.
 * @param {BasicRollConfiguration} config  Roll configuration data.
 * @param {FormDataExtended} [formData]    Any data entered into the rolling prompt.
 * @param {number} index                   Index of the roll within all rolls being prepared.
 */
export function buildRollConfig(dialog, config, formData, index) {
  if (!(dialog instanceof dnd5e.applications.dice.SkillToolRollConfigurationDialog)) return;
  const actor = dialog.config.subject;
  if (!(actor instanceof Actor)) return;
  const expertiseDice = actor.getFlag(moduleID, "ed") ?? {};
  const key = dialog.config.skill || dialog.config.tool;
  if (key) {
    const ed = formData?.get("expertiseDie") ?? expertiseDice[key] ?? 0;
    dialog.config.expertiseDie = ed; // 
    if (Number(ed)) {
      config.parts.push(`@expertDie[${game.i18n.localize("a5e-for-dnd5e.ExpertiseDie.flavor")}]`);
      config.data.expertDie = CONFIG.A5E.expertiseDie[ed];
    }
  }
}

/**
 * 
 * @param {RollConfigurationDialog} dialog 
 * @param {HTMLDialogElement} html 
 */
export function renderSkillToolRollConfigurationDialog(dialog, html) {
  if (!("expertiseDie" in dialog.config)) return;
  const actor = dialog.config.subject;
  if (!(actor instanceof Actor)) return;

  // The dialog selectively re-renders which means in v12 we need to check if the dialog already has the select
  // in v13 this can be swapped to checking for renderOptions.firstRender
  const ed = html.querySelector("select[name=\"expertiseDie\"]");
  if (ed) return;

  const selectInput = foundry.applications.fields.createSelectInput({
    name: "expertiseDie",
    value: dialog.config.expertiseDie ?? 0,
    options: Object.entries(CONFIG.A5E.expertiseDie).map(([value, label]) => ({value, label}))
  });

  const formGroup = foundry.applications.fields.createFormGroup({
    input: selectInput,
    label: "a5e-for-dnd5e.ExpertiseDie.label",
    localize: true
  });

  /** @type {HTMLFieldSetElement} */
  const configuration = html.querySelector("fieldset[data-application-part=\"configuration\"]");
  configuration.insertAdjacentElement("beforeend", formGroup);
}
