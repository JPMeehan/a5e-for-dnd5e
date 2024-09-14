import {modulePath, moduleTypes} from "./utils.mjs";

const A5E_CONFIG = {
  A5E: {
    expertiseDie: {
      0: "",
      1: "1d4",
      2: "1d6",
      3: "1d8"
    },
    MANEUVERS: {
      degree: {
        0: "a5e-for-dnd5e.Maneuver.Degrees.0",
        1: "a5e-for-dnd5e.Maneuver.Degrees.1",
        2: "a5e-for-dnd5e.Maneuver.Degrees.2",
        3: "a5e-for-dnd5e.Maneuver.Degrees.3",
        4: "a5e-for-dnd5e.Maneuver.Degrees.4",
        5: "a5e-for-dnd5e.Maneuver.Degrees.5"
      },
      tradition: {
        /** Adventurer's Guide */
        adm: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.adm",
          icon: modulePath + "assets/icons/traditions/adm.svg",
          fullKey: "adamantMountain"
        },
        btz: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.btz",
          icon: modulePath + "assets/icons/traditions/btz.svg",
          fullKey: "bitingZephyr"
        },
        mas: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.mas",
          icon: modulePath + "assets/icons/traditions/mas.svg",
          fullKey: "mistAndShade"
        },
        mgl: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.mgl",
          icon: modulePath + "assets/icons/traditions/mgl.svg",
          fullKey: "mirrorsGlint"
        },
        rc: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.rc",
          icon: modulePath + "assets/icons/traditions/rc.svg",
          fullKey: "rapidCurrent"
        },
        rze: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.rze",
          icon: modulePath + "assets/icons/traditions/rze.svg",
          fullKey: "razorsEdge"
        },
        sk: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.sk",
          icon: modulePath + "assets/icons/traditions/sk.svg",
          fullKey: "sanguineKnot"
        },
        ss: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.ss",
          icon: modulePath + "assets/icons/traditions/ss.svg",
          fullKey: "spiritedSteed"
        },
        tpi: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.tpi",
          icon: modulePath + "assets/icons/traditions/tpi.svg",
          fullKey: "temperedIron"
        },
        tac: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.tac",
          icon: modulePath + "assets/icons/traditions/tac.svg",
          fullKey: "toothAndClaw"
        },
        uwh: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.uwh",
          icon: modulePath + "assets/icons/traditions/uwh.svg",
          fullKey: "unendingWheel"
        },
        /** Other sources */
        arcart: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.arcart",
          icon: modulePath + "assets/icons/traditions/arcart.svg",
          fullKey: "arcaneArtillery"
        },
        arckn: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.arckn",
          icon: modulePath + "assets/icons/traditions/arckn.svg",
          fullKey: "arcaneKnight"
        },
        awm: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.awm",
          icon: modulePath + "assets/icons/traditions/awm.svg",
          fullKey: "awakenedMind"
        },
        bu: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.bu",
          icon: modulePath + "assets/icons/traditions/bu.svg",
          fullKey: "beastUnity"
        },
        coj: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.coj",
          icon: modulePath + "assets/icons/traditions/coj.svg",
          fullKey: "comedicJabs"
        },
        cutom: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.cutom",
          icon: modulePath + "assets/icons/traditions/cutom.svg",
          fullKey: "cuttingOmen"
        },
        elb: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.elb",
          icon: modulePath + "assets/icons/traditions/elb.svg",
          fullKey: "eldritchBlackguard"
        },
        gh: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.gh",
          icon: modulePath + "assets/icons/traditions/gh.svg",
          fullKey: "gallantHeart"
        },
        grc: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.grc",
          icon: modulePath + "assets/icons/traditions/grc.svg",
          fullKey: "grindingCog"
        },
        sst: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.sst",
          icon: modulePath + "assets/icons/traditions/sst.svg",
          fullKey: "sanctifiedSteel"
        },
        ssn: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.ssn",
          icon: modulePath + "assets/icons/traditions/ssn.svg",
          fullKey: "selflessSentinel"
        },
        vif: {
          label: "a5e-for-dnd5e.Maneuver.Traditions.vif",
          icon: modulePath + "assets/icons/traditions/vif.svg",
          fullKey: "vipersFangs"
        }
      }
    },
    secondarySchools: {
      acid: "a5e-for-dnd5e.Spell.Secondary.Schools.Acid",
      affliction: "a5e-for-dnd5e.Spell.Secondary.Schools.Affliction",
      air: "a5e-for-dnd5e.Spell.Secondary.Schools.Air",
      arcane: "a5e-for-dnd5e.Spell.Secondary.Schools.Arcane",
      architecture: "a5e-for-dnd5e.Spell.Secondary.Schools.Architecture",
      attack: "a5e-for-dnd5e.Spell.Secondary.Schools.Attack",
      beasts: "a5e-for-dnd5e.Spell.Secondary.Schools.Beasts",
      chaos: "a5e-for-dnd5e.Spell.Secondary.Schools.Chaos",
      cold: "a5e-for-dnd5e.Spell.Secondary.Schools.Cold",
      communication: "a5e-for-dnd5e.Spell.Secondary.Schools.Communication",
      compulsion: "a5e-for-dnd5e.Spell.Secondary.Schools.Compulsion",
      control: "a5e-for-dnd5e.Spell.Secondary.Schools.Control",
      displacement: "a5e-for-dnd5e.Spell.Secondary.Schools.Displacement",
      divine: "a5e-for-dnd5e.Spell.Secondary.Schools.Divine",
      earth: "a5e-for-dnd5e.Spell.Secondary.Schools.Earth",
      enhancement: "a5e-for-dnd5e.Spell.Secondary.Schools.Enhancement",
      evil: "a5e-for-dnd5e.Spell.Secondary.Schools.Evil",
      fear: "a5e-for-dnd5e.Spell.Secondary.Schools.Fear",
      fire: "a5e-for-dnd5e.Spell.Secondary.Schools.Fire",
      force: "a5e-for-dnd5e.Spell.Secondary.Schools.Force",
      good: "a5e-for-dnd5e.Spell.Secondary.Schools.Good",
      healing: "a5e-for-dnd5e.Spell.Secondary.Schools.Healing",
      hearth: "a5e-for-dnd5e.Spell.Secondary.Schools.Hearth",
      knowledge: "a5e-for-dnd5e.Spell.Secondary.Schools.Knowledge",
      law: "a5e-for-dnd5e.Spell.Secondary.Schools.Law",
      lightning: "a5e-for-dnd5e.Spell.Secondary.Schools.Lightning",
      movement: "a5e-for-dnd5e.Spell.Secondary.Schools.Movement",
      multiclass: "a5e-for-dnd5e.Spell.Secondary.Schools.Multiclass",
      nature: "a5e-for-dnd5e.Spell.Secondary.Schools.Nature",
      necrotic: "a5e-for-dnd5e.Spell.Secondary.Schools.Necrotic",
      negation: "a5e-for-dnd5e.Spell.Secondary.Schools.Negation",
      obscurement: "a5e-for-dnd5e.Spell.Secondary.Schools.Obscurement",
      planar: "a5e-for-dnd5e.Spell.Secondary.Schools.Planar",
      plants: "a5e-for-dnd5e.Spell.Secondary.Schools.Plants",
      poison: "a5e-for-dnd5e.Spell.Secondary.Schools.Poison",
      prismatic: "a5e-for-dnd5e.Spell.Secondary.Schools.Prismatic",
      protection: "a5e-for-dnd5e.Spell.Secondary.Schools.Protection",
      psionic: "a5e-for-dnd5e.Spell.Secondary.Schools.Psionic",
      psychic: "a5e-for-dnd5e.Spell.Secondary.Schools.Psychic",
      radiant: "a5e-for-dnd5e.Spell.Secondary.Schools.Radiant",
      scrying: "a5e-for-dnd5e.Spell.Secondary.Schools.Scrying",
      senses: "a5e-for-dnd5e.Spell.Secondary.Schools.Senses",
      shadow: "a5e-for-dnd5e.Spell.Secondary.Schools.Shadow",
      shapechanging: "a5e-for-dnd5e.Spell.Secondary.Schools.Shapechanging",
      sound: "a5e-for-dnd5e.Spell.Secondary.Schools.Sound",
      storm: "a5e-for-dnd5e.Spell.Secondary.Schools.Storm",
      summoning: "a5e-for-dnd5e.Spell.Secondary.Schools.Summoning",
      technological: "a5e-for-dnd5e.Spell.Secondary.Schools.Technological",
      telepathy: "a5e-for-dnd5e.Spell.Secondary.Schools.Telepathy",
      teleportation: "a5e-for-dnd5e.Spell.Secondary.Schools.Teleportation",
      terrain: "a5e-for-dnd5e.Spell.Secondary.Schools.Terrain",
      thunder: "a5e-for-dnd5e.Spell.Secondary.Schools.Thunder",
      time: "a5e-for-dnd5e.Spell.Secondary.Schools.Time",
      transformation: "a5e-for-dnd5e.Spell.Secondary.Schools.Transformation",
      unarmed: "a5e-for-dnd5e.Spell.Secondary.Schools.Unarmed",
      undead: "a5e-for-dnd5e.Spell.Secondary.Schools.Undead",
      utility: "a5e-for-dnd5e.Spell.Secondary.Schools.Utility",
      water: "a5e-for-dnd5e.Spell.Secondary.Schools.Water",
      weaponry: "a5e-for-dnd5e.Spell.Secondary.Schools.Weaponry",
      weather: "a5e-for-dnd5e.Spell.Secondary.Schools.Weather"
    }
  },
  DND5E: {
    actorSizes: {
      titan: {
        abbreviation: "DND5E.SizeTitanAbbr",
        capacityMultiplier: 16,
        label: "DND5E.SizeTitan",
        token: 5
      }
    },
    skills: {
      cul: {
        ability: "int",
        fullKey: "culture",
        label: "DND5E.SkillCul"
      },
      eng: {
        ability: "int",
        fullKey: "engineering",
        label: "DND5E.SkillEng"
      }
    },
    toolIds: {
      alchemist: "Compendium.a5e-for-dnd5e.gear.Item.d8aj2xoatccd71ce",
      bagpipes: "Compendium.a5e-for-dnd5e.gear.Item.5aovzjcwvodkwrsf",
      book: "Compendium.a5e-for-dnd5e.gear.Item.6j9cmaz3hsi291xx",
      brewer: "Compendium.a5e-for-dnd5e.gear.Item.ruq1b4eccxrfve48",
      calligrapher: "Compendium.a5e-for-dnd5e.gear.Item.popojwgmea9u6cfb",
      card: "Compendium.a5e-for-dnd5e.gear.Item.nzk5o2pu6bk18d67",
      carpenter: "Compendium.a5e-for-dnd5e.gear.Item.zn52h9g28j8i3v0j",
      cartographer: "Compendium.a5e-for-dnd5e.gear.Item.sohtdauxox9im0vr",
      casaba: "Compendium.a5e-for-dnd5e.gear.Item.p19fsr4yoziebffl",
      castanet: "Compendium.a5e-for-dnd5e.gear.Item.r6sackopm7addnxn",
      chess: "Compendium.a5e-for-dnd5e.gear.Item.he9uuzw9c3kagb2d",
      cobbler: "Compendium.a5e-for-dnd5e.gear.Item.5fqpvkdozs1udo7y",
      cook: "Compendium.a5e-for-dnd5e.gear.Item.1zqyltv6xs3hqrqk",
      dice: "Compendium.a5e-for-dnd5e.gear.Item.8immo7012y7uj9u7",
      disg: "Compendium.a5e-for-dnd5e.gear.Item.3906eejw1gtmziv1",
      drum: "Compendium.a5e-for-dnd5e.gear.Item.3sli49o1u8f23qqy",
      dulcimer: "Compendium.a5e-for-dnd5e.gear.Item.xpqiy7mlahmq42b4",
      flute: "Compendium.a5e-for-dnd5e.gear.Item.xlgxl1qcmsjtixxu",
      forg: "Compendium.a5e-for-dnd5e.gear.Item.uwrm02lk6beqqt92",
      glassblower: "Compendium.a5e-for-dnd5e.gear.Item.j741azczxb9ra2q6",
      harp: "Compendium.a5e-for-dnd5e.gear.Item.paxo8qi1p7cpxq5w",
      herb: "Compendium.a5e-for-dnd5e.gear.Item.3muu012tsfb455sa",
      horn: "Compendium.a5e-for-dnd5e.gear.Item.t6l6qmq7859oi3dp",
      jeweler: "Compendium.a5e-for-dnd5e.gear.Item.6dhgvjxr4576sezp",
      leatherworker: "Compendium.a5e-for-dnd5e.gear.Item.ombmsvzr7bnx38eg",
      lute: "Compendium.a5e-for-dnd5e.gear.Item.lw3bie3xa3nboxeq",
      lyre: "Compendium.a5e-for-dnd5e.gear.Item.jin34erfica7m99s",
      maraca: "Compendium.a5e-for-dnd5e.gear.Item.fdt78se95ctirerh",
      mason: "Compendium.a5e-for-dnd5e.gear.Item.5vxexhyg8bwwdu64",
      navg: "Compendium.a5e-for-dnd5e.gear.Item.e5ziykzhb3h9e62n",
      ocarina: "Compendium.a5e-for-dnd5e.gear.Item.wlpyvif2btl5wwbd",
      painter: "Compendium.a5e-for-dnd5e.gear.Item.iuf2hbfemzd67b5s",
      panflute: "Compendium.a5e-for-dnd5e.gear.Item.tgftb52fb09tsd2q",
      pois: "Compendium.a5e-for-dnd5e.gear.Item.0egxwnp3fyh6lelv",
      potter: "Compendium.a5e-for-dnd5e.gear.Item.oqpbg1y0wef7fxlw",
      sew: "Compendium.a5e-for-dnd5e.gear.Item.gqei4i287bd3smhh",
      // shawm: 'G3cqbejJpfB91VhP',
      smith: "Compendium.a5e-for-dnd5e.gear.Item.t08r0mi814lydsa3",
      thief: "Compendium.a5e-for-dnd5e.gear.Item.3k3o90tq7gclpuem",
      tinker: "Compendium.a5e-for-dnd5e.gear.Item.nqa44aajmgbqb52d",
      trombone: "Compendium.a5e-for-dnd5e.gear.Item.xo0aa0wgz5d71sp3",
      viol: "Compendium.a5e-for-dnd5e.gear.Item.krj29v7tofmzee1a",
      weaver: "Compendium.a5e-for-dnd5e.gear.Item.x5mi878038wdrcad",
      woodcarver: "Compendium.a5e-for-dnd5e.gear.Item.ejhqlyqql29ptoay"
    },
    specialTimePeriods: {
      stance: "a5e-for-dnd5e.Stance"
    },
    spellProgression: {
      martial: "a5e-for-dnd5e.Maneuver.Progression.martial",
      herald: "a5e-for-dnd5e.Maneuver.Progression.herald",
      scholar: "a5e-for-dnd5e.Maneuver.Progression.scholar",
      wielder: "a5e-for-dnd5e.Maneuver.Progression.wielder"
    },
    spellcastingTypes: {
      leveled: {
        progression: {
          herald: {
            label: "a5e-for-dnd5e.Maneuver.Progression.herald",
            divisor: 2
          }
        }
      },
      maneuvers: {
        label: "a5e-for-dnd5e.Maneuver.Label",
        progression: {
          martial: {
            label: "a5e-for-dnd5e.Maneuver.Progression.martial"
          },
          scholar: {
            label: "a5e-for-dnd5e.Maneuver.Progression.scholar"
          },
          wielder: {
            label: "a5e-for-dnd5e.Maneuver.Progression.wielder"
          }
        }
      }
    },
    defaultArtwork: {
      Item: {
        [moduleTypes.culture]: modulePath + "assets/icons/subtypes/culture.svg",
        [moduleTypes.destiny]: modulePath + "assets/icons/subtypes/destiny.svg",
        [moduleTypes.maneuver]:
          modulePath + "assets/icons/subtypes/maneuver.svg"
      }
    }
  }
};

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
A5E_CONFIG.A5E.newItemProperties = {
  weapon: {
    breaker: {label: "a5e-for-dnd5e.WeaponProperty.Breaker"},
    compounding: {label: "a5e-for-dnd5e.WeaponProperty.Compounding"},
    defensive: {label: "a5e-for-dnd5e.WeaponProperty.Defensive"},
    mounted: {label: "a5e-for-dnd5e.WeaponProperty.Mounted"},
    parrying: {label: "a5e-for-dnd5e.WeaponProperty.Parrying"},
    vicious: {label: "a5e-for-dnd5e.WeaponProperty.Vicious"}
  },
  [moduleTypes.maneuver]: {
    mastered: {label: "a5e-for-dnd5e.Maneuver.Mastered"}
  }
};

A5E_CONFIG.DND5E.featureTypes = {
  culture: {
    label: "DND5E.Feature.Culture"
  },
  destiny: {
    label: "DND5E.Feature.Destiny"
  },
  class: {
    subtypes: {
      /** Adept */
      practicedTechnique: "DND5E.ClassFeature.PracticedTechnique",
      focusFeature: "DND5E.ClassFeature.FocusFeature",
      /** Artificer */
      fieldDiscovery: "DND5E.ClassFeature.FieldDiscovery",
      /** Bard */
      battleHymn: "DND5E.ClassFeature.BattleHymn",
      /** Berserker */
      developedTalent: "DND5E.ClassFeature.DevelopedTalent",
      furiousCritical: "DND5E.ClassFeature.FuriousCritical",
      /** Cleric */
      faithSign: "DND5E.ClassFeature.FaithSign",
      /** Druid */
      natureSecret: "DND5E.ClassFeature.NatureSecret",
      /** Fighter */
      soldieringKnack: "DND5E.ClassFeature.SoldieringKnack",
      /** Herald */
      divineLesson: "DND5E.ClassFeature.DivineLesson",
      /** Marshal */
      warLesson: "DND5E.ClassFeature.WarLesson",
      /** Ranger */
      explorationKnack: "DND5E.ClassFeature.ExplorationKnack",
      /** Rogue */
      skillTrick: "DND5E.ClassFeature.SkillTrick",
      /** Savant */
      cleverScheme: "DND5E.ClassFeature.CleverScheme",
      savantTrick: "DND5E.ClassFeature.SavantTrick",
      /** Sorcerer */
      arcaneInnovation: "DND5E.ClassFeature.ArcaneInnovation",
      /** Warlock (note: Eldritch Invocation is base 5e) */
      secretArcana: "DND5E.ClassFeature.SecretArcana",
      /** Wizard */
      electiveStudy: "DND5E.ClassFeature.ElectiveStudy",
      /** Witch */
      magicalMystery: "DND5E.ClassFeature.MagicalMystery"
    }
  }
};

/**
 * Weapon Handling
 */
A5E_CONFIG.DND5E.weaponProficiencies = {
  rare: "DND5E.WeaponRareProficiency"
};

A5E_CONFIG.DND5E.weaponProficienciesMap = {
  rareM: "rare",
  rareR: "rare"
};

A5E_CONFIG.DND5E.weaponTypes = {
  rareM: "DND5E.WeaponRareM",
  rareR: "DND5E.WeaponRareR"
};

A5E_CONFIG.DND5E.weaponIds = {
  /** New to a5e */
  bastardsword: "Compendium.a5e-for-dnd5e.gear.Item.njbevv8xrgswtyue",
  brassknuckles: "Compendium.a5e-for-dnd5e.gear.Item.mr4mo0pjube2aes9",
  compositebow: "Compendium.a5e-for-dnd5e.gear.Item.7l5v4m7j55pmc1wf",
  duelingdagger: "Compendium.a5e-for-dnd5e.gear.Item.sb8oo04tylbdb607",
  garotte: "Compendium.a5e-for-dnd5e.gear.Item.1puyfz1yekdum26e",
  punchingdagger: "Compendium.a5e-for-dnd5e.gear.Item.bsvbebbgfnzhh743",
  saber: "Compendium.a5e-for-dnd5e.gear.Item.bbowllkalbhk2ndg",
  scythe: "Compendium.a5e-for-dnd5e.gear.Item.zyhm36efl89xfdac",
  spearthrower: "",
  throwingdagger: "Compendium.a5e-for-dnd5e.gear.Item.waqd98z0mqohxxz2",
  assassinsgauntlet: "Compendium.a5e-for-dnd5e.gear.Item.7v5mvcgc8uubb3l7",
  bootdagger: "Compendium.a5e-for-dnd5e.gear.Item.bxm4y00kg8qrugz1",
  carbine: "Compendium.a5e-for-dnd5e.gear.Item.dm04nej52elzjlfx",
  doubleweapon: "Compendium.a5e-for-dnd5e.gear.Item.PEWE0X0UegElDRld",
  gearedslingshot: "Compendium.a5e-for-dnd5e.gear.Item.f270hnmd1wlu9mb0",
  mercurialmaul: "Compendium.a5e-for-dnd5e.gear.Item.ky37gm57e3li890a",
  ratchetingcrossbow: "Compendium.a5e-for-dnd5e.gear.Item.o5jeeze2r4k167r2",
  revolver: "Compendium.a5e-for-dnd5e.gear.Item.j3wur37dct9v10we",
  ringblade: "Compendium.a5e-for-dnd5e.gear.Item.cydwjacfp6rb0jue",
  shotgun: "Compendium.a5e-for-dnd5e.gear.Item.mpzk2e533e6uymn4",
  spikedchain: "Compendium.a5e-for-dnd5e.gear.Item.pkt8vntx40q4xeny",
  swordpistol: "Compendium.a5e-for-dnd5e.gear.Item.mv682vbjut9nizx1"
  /** Overriding base system references */
};

/**
 * Shields
 */
A5E_CONFIG.DND5E.shieldIds = {
  light: "Compendium.a5e-for-dnd5e.gear.Item.xy2bn4687azmkadw",
  shield: "Compendium.a5e-for-dnd5e.gear.Item.19oc64en7c6kmk1w",
  heavy: "Compendium.a5e-for-dnd5e.gear.Item.al5bt63sprk6hkxv",
  tower: "Compendium.a5e-for-dnd5e.gear.Item.udvqt7222qrr3ibu"
};

/**
 * List of books available as sources.
 * @enum {string}
 */
A5E_CONFIG.DND5E.sourceBooks = {
  "Adventurer's Guide": "Level Up: Advanced 5th Edition by EN Publishing",
  "Trials & Treasures": "Level Up: Advanced 5th Edition by EN Publishing",
  "Monstrous Menagerie": "Level Up: Advanced 5th Edition by EN Publishing",
  "Gate Pass Gazette": "Level Up: Advanced 5th Edition by EN Publishing",
  "Dungeon Delver's Guide": "Level Up: Advanced 5th Edition by EN Publishing"
};

export default A5E_CONFIG;
