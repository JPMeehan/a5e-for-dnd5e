import A5ECONFIG from "./config.mjs";
import ManeuverData from "./maneuverData.mjs";
import ManeuverSheet from "./maneuverSheet.mjs";

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
