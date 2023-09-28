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
