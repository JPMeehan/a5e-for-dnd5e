export default class ManeuverSheet extends dnd5e.applications.item.ItemSheet5e {
  get template() {
    return `/modules/a5e-for-dnd5e/templates/maneuver-sheet.hbs`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.maneuvers = CONFIG.A5E.MANEUVERS;

    const consume =
      context.system.consume.type === "flags"
        ? { ep: game.i18n.localize("a5e-for-dnd5e.Maneuver.EP") }
        : {};

    const consumption = context.system.consume;
    if (context.system.usesExertion) {
      if (context.system.labels.ep) {
        const epLabel = this.epText(consumption.amount);
        context.system.labels.ep = epLabel;
        context.itemStatus = epLabel;
      }
    } else delete context.system.labels.ep;
    foundry.utils.mergeObject(context, {
      labels: context.system.labels,
      abilityConsumptionTargets: consume,
    });

    return context;
  }

  epText(ep) {
    return `${ep} ${
      ep === 1
        ? game.i18n.localize("a5e-for-dnd5e.Maneuver.1EP")
        : game.i18n.localize("a5e-for-dnd5e.Maneuver.EP")
    }`;
  }
}
