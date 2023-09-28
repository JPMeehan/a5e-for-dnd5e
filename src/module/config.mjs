const A5ECONFIG = {
  A5E: {
    MANEUVERS: {
      degree: {
        0: "a5e-for-dnd5e.Maneuver.Degrees.0",
        1: "a5e-for-dnd5e.Maneuver.Degrees.1",
        2: "a5e-for-dnd5e.Maneuver.Degrees.2",
        3: "a5e-for-dnd5e.Maneuver.Degrees.3",
        4: "a5e-for-dnd5e.Maneuver.Degrees.4",
        5: "a5e-for-dnd5e.Maneuver.Degrees.5",
      },
      tradition: {
        adm: "a5e-for-dnd5e.Maneuver.Traditions.adm",
        btz: "a5e-for-dnd5e.Maneuver.Traditions.btz",
        mgl: "a5e-for-dnd5e.Maneuver.Traditions.mgl",
        mas: "a5e-for-dnd5e.Maneuver.Traditions.mas",
        rc: "a5e-for-dnd5e.Maneuver.Traditions.rc",
        rze: "a5e-for-dnd5e.Maneuver.Traditions.rze",
        sk: "a5e-for-dnd5e.Maneuver.Traditions.sk",
        ss: "a5e-for-dnd5e.Maneuver.Traditions.ss",
        tpi: "a5e-for-dnd5e.Maneuver.Traditions.tpi",
        tac: "a5e-for-dnd5e.Maneuver.Traditions.tac",
        uwh: "a5e-for-dnd5e.Maneuver.Traditions.uwh",
      },
    },
  },
  DND5E: {},
};

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
A5ECONFIG.DND5E.weaponProperties = {
  burn: "A5E.WeaponPropertyBurn",
  breaker: "A5E.WeaponPropertyBreaker",
  compounding: "A5E.WeaponPropertyCompounding",
  defensive: "A5E.WeaponPropertyDefensive",
  flamboyant: "A5E.WeaponPropertyFlamboyant",
  handMounted: "A5E.WeaponPropertyHandMounted",
  inaccurate: "A5E.WeaponPropertyInaccurate",
  mounted: "A5E.WeaponPropertyMounted",
  muzzleLoading: "A5E.WeaponPropertyMuzzleLoading",
  parrying: "A5E.WeaponPropertyParrying",
  parryingImmunity: "A5E.WeaponPropertyParryingImmunity",
  quickdraw: "A5E.WeaponPropertyQuickdraw",
  range: "A5E.WeaponPropertyRange",
  rifled: "A5E.WeaponPropertyRifled",
  scatter: "A5E.WeaponPropertyScatter",
  shock: "A5E.WeaponPropertyShock",
  simple: "A5E.WeaponPropertySimple",
  stealthy: "A5E.ObjectPropertyStealthy",
  storage: "A5E.ObjectPropertyStorage",
  triggerCharge: "A5E.WeaponPropertyTriggerCharge",
  trip: "A5E.WeaponPropertyTrip",
  vicious: "A5E.WeaponPropertyVicious",
};

export default A5ECONFIG;
