const A5E_CONFIG = {
  A5E: {
    expertiseDie: {
      0: '',
      1: '1d4',
      2: '1d6',
      3: '1d8',
    },
    MANEUVERS: {
      degree: {
        0: 'a5e-for-dnd5e.Maneuver.Degrees.0',
        1: 'a5e-for-dnd5e.Maneuver.Degrees.1',
        2: 'a5e-for-dnd5e.Maneuver.Degrees.2',
        3: 'a5e-for-dnd5e.Maneuver.Degrees.3',
        4: 'a5e-for-dnd5e.Maneuver.Degrees.4',
        5: 'a5e-for-dnd5e.Maneuver.Degrees.5',
      },
      tradition: {
        adm: 'a5e-for-dnd5e.Maneuver.Traditions.adm',
        btz: 'a5e-for-dnd5e.Maneuver.Traditions.btz',
        mgl: 'a5e-for-dnd5e.Maneuver.Traditions.mgl',
        mas: 'a5e-for-dnd5e.Maneuver.Traditions.mas',
        rc: 'a5e-for-dnd5e.Maneuver.Traditions.rc',
        rze: 'a5e-for-dnd5e.Maneuver.Traditions.rze',
        sk: 'a5e-for-dnd5e.Maneuver.Traditions.sk',
        ss: 'a5e-for-dnd5e.Maneuver.Traditions.ss',
        tpi: 'a5e-for-dnd5e.Maneuver.Traditions.tpi',
        tac: 'a5e-for-dnd5e.Maneuver.Traditions.tac',
        uwh: 'a5e-for-dnd5e.Maneuver.Traditions.uwh',
      },
    },
  },
  DND5E: {
    skills: {
      cul: {
        ability: 'int',
        fullKey: 'culture',
        label: 'DND5E.SkillCul',
      },
      eng: {
        ability: 'int',
        fullKey: 'engineering',
        label: 'DND5E.SkillEng',
      },
    },
    specialTimePeriods: {
      stance: 'a5e-for-dnd5e.Stance',
    },
    spellProgression: {
      default: 'a5e-for-dnd5e.Maneuver.Progression.default',
      herald: 'a5e-for-dnd5e.Maneuver.Progression.herald',
    },
    spellcastingTypes: {
      leveled: {
        progression: {
          herald: {
            label: 'a5e-for-dnd5e.Maneuver.Progression.herald',
            divisor: 2,
          },
        },
      },
      maneuvers: {
        label: 'a5e-for-dnd5e.Maneuver.Label',
        progression: {
          default: {
            label: 'a5e-for-dnd5e.Maneuver.Progression.default',
          },
        },
      },
    },
  },
};

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
A5E_CONFIG.DND5E.weaponProperties = {
  burn: 'a5e-for-dnd5e.WeaponProperty.Burn',
  breaker: 'a5e-for-dnd5e.WeaponProperty.Breaker',
  compounding: 'a5e-for-dnd5e.WeaponProperty.Compounding',
  defensive: 'a5e-for-dnd5e.WeaponProperty.Defensive',
  flamboyant: 'a5e-for-dnd5e.WeaponProperty.Flamboyant',
  handMounted: 'a5e-for-dnd5e.WeaponProperty.HandMounted',
  inaccurate: 'a5e-for-dnd5e.WeaponProperty.Inaccurate',
  mounted: 'a5e-for-dnd5e.WeaponProperty.Mounted',
  muzzleLoading: 'a5e-for-dnd5e.WeaponProperty.MuzzleLoading',
  parrying: 'a5e-for-dnd5e.WeaponProperty.Parrying',
  parryingImmunity: 'a5e-for-dnd5e.WeaponProperty.ParryingImmunity',
  quickdraw: 'a5e-for-dnd5e.WeaponProperty.Quickdraw',
  range: 'a5e-for-dnd5e.WeaponProperty.Range',
  rifled: 'a5e-for-dnd5e.WeaponProperty.Rifled',
  scatter: 'a5e-for-dnd5e.WeaponProperty.Scatter',
  shock: 'a5e-for-dnd5e.WeaponProperty.Shock',
  triggerCharge: 'a5e-for-dnd5e.WeaponProperty.TriggerCharge',
  trip: 'a5e-for-dnd5e.WeaponProperty.Trip',
  vicious: 'a5e-for-dnd5e.WeaponProperty.Vicious',
};

A5E_CONFIG.DND5E.featureTypes = {
  culture: {
    label: 'DND5E.Feature.Culture',
  },
  destiny: {
    label: 'DND5E.Feature.Destiny',
  },
  class: {
    subtypes: {
      /** Adept */
      practicedTechnique: 'DND5E.ClassFeature.PracticedTechnique',
      focusFeature: 'DND5E.ClassFeature.FocusFeature',
      /** Artificer */
      fieldDiscovery: 'DND5E.ClassFeature.FieldDiscovery',
      /** Bard */
      battleHymn: 'DND5E.ClassFeature.BattleHymn',
      /** Berserker */
      developedTalent: 'DND5E.ClassFeature.DevelopedTalent',
      furiousCritical: 'DND5E.ClassFeature.FuriousCritical',
      /** Cleric */
      faithSign: 'DND5E.ClassFeature.FaithSign',
      /** Druid */
      natureSecret: 'DND5E.ClassFeature.NatureSecret',
      /** Fighter */
      soldieringKnack: 'DND5E.ClassFeature.SoldieringKnack',
      /** Herald */
      divineLesson: 'DND5E.ClassFeature.DivineLesson',
      /** Marshal */
      warLesson: 'DND5E.ClassFeature.WarLesson',
      /** Ranger */
      explorationKnack: 'DND5E.ClassFeature.ExplorationKnack',
      /** Rogue */
      skillTrick: 'DND5E.ClassFeature.SkillTrick',
      /** Savant */
      cleverScheme: 'DND5E.ClassFeature.CleverScheme',
      savantTrick: 'DND5E.ClassFeature.SavantTrick',
      /** Sorcerer */
      arcaneInnovation: 'DND5E.ClassFeature.ArcaneInnovation',
      /** Warlock (note: Eldritch Invocation is base 5e) */
      secretArcana: 'DND5E.ClassFeature.SecretArcana',
      /** Wizard */
      electiveStudy: 'DND5E.ClassFeature.ElectiveStudy',
    },
  },
};

export default A5E_CONFIG;
