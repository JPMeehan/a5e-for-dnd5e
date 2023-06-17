import A5ECONFIG from "./config.mjs";

Hooks.once("init", () => {


    foundry.utils.mergeObject(CONFIG, A5ECONFIG)
    
    // Object.assign(CONFIG.Item.dataModels, {
    //   "prime-psionics.power": PowerData
    // });
  
    // dnd5e.utils.preLocalize("spellcastingTypes.psionics.progression", {key: "label"});
  
    // Items.registerSheet("power", PowerSheet, {
    //   types: ["prime-psionics.power"],
    //   makeDefault: true
    // });
  });