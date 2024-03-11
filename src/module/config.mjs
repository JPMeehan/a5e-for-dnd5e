import { modulePath, moduleTypes } from './utils.mjs';

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
        adm: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.adm',
          icon: modulePath + 'assets/icons/traditions/adm.svg',
          fullKey: '',
        },
        btz: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.btz',
          icon: modulePath + 'assets/icons/traditions/btz.svg',
          fullKey: '',
        },
        mas: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.mas',
          icon: modulePath + 'assets/icons/traditions/mas.svg',
          fullKey: '',
        },
        mgl: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.mgl',
          icon: modulePath + 'assets/icons/traditions/mgl.svg',
          fullKey: '',
        },
        rc: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.rc',
          icon: modulePath + 'assets/icons/traditions/rc.svg',
          fullKey: '',
        },
        rze: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.rze',
          icon: modulePath + 'assets/icons/traditions/rze.svg',
          fullKey: '',
        },
        sk: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.sk',
          icon: modulePath + 'assets/icons/traditions/sk.svg',
          fullKey: '',
        },
        ss: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.ss',
          icon: modulePath + 'assets/icons/traditions/ss.svg',
          fullKey: '',
        },
        tpi: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.tpi',
          icon: modulePath + 'assets/icons/traditions/tpi.svg',
          fullKey: '',
        },
        tac: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.tac',
          icon: modulePath + 'assets/icons/traditions/tac.svg',
          fullKey: '',
        },
        uwh: {
          label: 'a5e-for-dnd5e.Maneuver.Traditions.uwh',
          icon: modulePath + 'assets/icons/traditions/uwh.svg',
          fullKey: '',
        },
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
    defaultArtwork: {
      Item: {
        [moduleTypes.culture]: modulePath + 'assets/icons/subtypes/culture.svg',
        [moduleTypes.destiny]: modulePath + 'assets/icons/subtypes/destiny.svg',
        [moduleTypes.maneuver]:
          modulePath + 'assets/icons/subtypes/maneuver.svg',
      },
    },
  },
};

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
A5E_CONFIG.A5E.newItemProperties = {
  weapon: {
    breaker: { label: 'a5e-for-dnd5e.WeaponProperty.Breaker' },
    compounding: { label: 'a5e-for-dnd5e.WeaponProperty.Compounding' },
    defensive: { label: 'a5e-for-dnd5e.WeaponProperty.Defensive' },
    mounted: { label: 'a5e-for-dnd5e.WeaponProperty.Mounted' },
    parrying: { label: 'a5e-for-dnd5e.WeaponProperty.Parrying' },
    vicious: { label: 'a5e-for-dnd5e.WeaponProperty.Vicious' },
  },
  [moduleTypes.maneuver]: {
    mastered: { label: 'a5e-for-dnd5e.Maneuver.Mastered' },
  },
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

A5E_CONFIG.DND5E.sourceBooks = {
  "Adventurer's Guide": 'Level Up: Advanced 5th Edition by EN Publishing',
  'Trials & Treasures': 'Level Up: Advanced 5th Edition by EN Publishing',
  'Monstrous Menagerie': 'Level Up: Advanced 5th Edition by EN Publishing',
  'Gate Pass Gazette': 'Level Up: Advanced 5th Edition by EN Publishing',
  "Dungeon Delver's Guide": 'Level Up: Advanced 5th Edition by EN Publishing',
};

export default A5E_CONFIG;
