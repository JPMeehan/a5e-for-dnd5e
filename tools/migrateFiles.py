import os
import json
import sys
import re

targetPack = sys.argv[1]
origin = os.path.join(".\src", "packs-origin", targetPack)
packPath = os.path.join(".\src", "packs", targetPack)
packList = os.listdir(origin)

# dnd5e item types = ["weapon", "equipment", "consumable", "tool", "loot", "background", "class", "subclass", "spell", "feat", "backpack"]
#   a5e item types = ["feature", "maneuver", "object", "spell", "background", "culture", "destiny"]

def flattenSource(source: str | dict) -> str:
    if type(source) == str:
        return source if source != "" else "A5E Adventurer's Guide"
    else:
        return source["name"]

def abbr(word: str) -> str:
    match word:
        case "abjuration":
            return "abj"
        case "conjuration":
            return "con"
        case "divination":
            return "div"
        case "enchantment":
            return "enc"
        case "evocation":
            return "evo"
        case "illusion":
            return "ill"
        case "necromancy":
            return "nec"
        case "transmutation":
            return "trs"
        case "meleeWeaponAttack":
            return "mwak"
        case "rangedWeaponAttack":
            return "rwak"
        case "meleeSpellAttack":
            return "msak"
        case "rangedSpellAttack":
            return "rsak"
        case "savingThrow":
            return "save"
        case "abilityCheck":
            return "abil"
        case "temporaryHealing":
            return "temphp"
        case "spellLevel":
            return "level"
        case "fiveFeet":
            return "5"
        case "short":
            return "30"
        case "medium":
            return "60"
        case "long":
            return "120"
        case _:
            return word

def fixUUIDrefs(s: str) -> str:
    s = s.replace("Compendium.a5e.a5e-spells", "Compendium.a5e-for-dnd5e.spells")
    s = s.replace("Compendium.a5e.a5e-rare-spells", "Compendium.a5e-for-dnd5e.spells")
    return s

"""ACTION TEMPLATES - activatedEffect | action
"activatedEffect": {
    "activation": {
        "type": "",
        "cost": null,
        "condition": ""
    },
    "duration": {
        "value": "",
        "units": ""
    },
    "cover": null,
    "crewed": false,
    "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
    },
    "range": {
        "value": null,
        "long": null,
        "units": ""
    },
    "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": ""
    },
    "consume": {
        "type": "",
        "target": null,
        "amount": null
    }
},
"action": {
    "ability": null,
    "actionType": null,
    "attackBonus": "",
    "chatFlavor": "",
    "critical": {
        "threshold": null,
        "damage": ""
    },
    "damage": {
        "parts": [],
        "versatile": ""
    },
    "formula": "",
    "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
    }
}
"""
""" EXAMPLE A5E ACTION
{
    "name": "Burning Hands",
    "activation": {
        "cost": 1,
        "type": "action",
        "reactionTrigger": ""
    },
    "duration": {
        "unit": "instantaneous",
        "value": ""
    },
    "ranges": {
        "Z7f8aeFVZFoYaQM4": {
            "range": "self"
        }
    },
    "area": {
        "shape": "cone",
        "length": "15",
        "placeTemplate": false
    },
    "target": {
        "quantity": "",
        "type": ""
    },
    "rolls": {
        "unsR1rjY4mpqI7TB": {
            "canCrit": false,
            "damageType": "fire",
            "formula": "3d6",
            "name": "",
            "type": "damage",
            "scaling": {
                "mode": "spellLevel",
                "formula": "1d6"
            }
        }
    },
    "prompts": {
        "rdGYF9zI83Xqelou": {
            "ability": "dex",
            "onSave": "Half damage",
            "saveDC": {
                "type": "spellcasting",
                "bonus": ""
            },
            "type": "savingThrow"
        }
    },
    "consumers": {
        "Xlu0D0ThDnWXJx9H": {
        "mode": "variable",
        "spellLevel": 1,
        "points": 2,
        "type": "spell"
    }
}
"""

def migrateAction(action: dict, system: dict) -> bool:
    activation = {
        "activation": {
            "type": action.get("activation", {}).get("type", ""),
            "cost": action.get("activation", {}).get("cost"),
            "condition": action.get("activation", {}).get("reactionTrigger", "")
        },
        "duration": {
            "value": action.get("duration", {}).get("value", ""),
            "units": action.get("duration", {}).get("unit", "")
        },
        "cover": None,
        "crewed": False,
        "target": {
            "value": None,
            "width": None,
            "units": "",
            "type": ""
        },
        "range": {
            "value": None,
            "long": None,
            "units": ""
        },
        "uses": {
            "value": None,
            "max": "",
            "per": None,
            "recovery": ""
        },
        "consume": {
            "type": "",
            "target": None,
            "amount": None
        },
        "ability": None,
        "actionType": None,
        "attackBonus": "",
        "chatFlavor": "",
        "critical": {
            "threshold": None,
            "damage": ""
        },
        "damage": {
            "parts": [],
            "versatile": ""
        },
        "formula": "",
        "save": {
            "ability": "",
            "dc": None,
            "scaling": "spell"
        }
    }
    updateTarget(activation["target"], action)
    rangeProp = "value"
    for r in action.get("ranges",{}):
        arange = action["ranges"][r]["range"]
        if arange == "self":
            continue
        activation["range"][rangeProp] = abbr(arange)
        if rangeProp == "value":
            rangeProp = "long"
        else:
            print("More than 2 ranges")
    for p in action.get("prompts",{}):
        activation["actionType"] = actionType(abbr(action["prompts"][p]["type"]), activation["actionType"])
        if activation["actionType"] == 'abil':
            activation["ability"] = action["prompts"][p]["ability"]
        if activation["actionType"] == 'save':
            activation["save"]["ability"] = action["prompts"][p]["ability"]
    system.update(activation)
    processRolls(action.get("rolls", {}), action,  system)
    if system.get("properties",{}).get("ver") or system.get("properties",{}).get("mnt"):
        dmg: dict = system["damage"]
        dmg["versatile"] = dmg["parts"].pop(1)[0]
    return True

def processRolls(rolls: dict, action: dict, system: dict):
    if len(rolls) == 0:
        return False
    for r in rolls:
        match rolls[r]["type"]:
            case "attack":
                system["actionType"] = actionType(abbr(rolls[r]["attackType"]), system["actionType"])
                system["attackBonus"] = rolls[r].get("bonus", "")
            case "damage":
                formula = re.sub("@\w+.mod","@mod",  rolls[r]["formula"]) 
                if "damageType" not in rolls[r]:
                    print("No damage type found in", action["name"])
                    continue
                system["damage"]["parts"].append([formula, rolls[r]["damageType"]])
                if "scaling" in system and "scaling" in rolls[r]:
                    system["scaling"]["formula"] = rolls[r]["scaling"]["formula"]
                    system["scaling"]["mode"] = abbr(rolls[r]["scaling"]["mode"])
                # do stuff
            case "healing":
                system["actionType"] = actionType("heal", system["actionType"])
                formula = re.sub("@\w+.mod","@mod",  rolls[r]["formula"]) 
                system["damage"]["parts"].append([formula, abbr(rolls[r].get("healingType", "healing"))])
            case "abilityCheck":
                system["actionType"] = actionType("abil", system["actionType"])
            case _:
                print(rolls[r]["type"], action["name"])
    return True

def actionType(new: str, old: str) -> str:
    # if old != None:
    #     print (new, old)
    match old:
        case None | "save" | "util" | "other":
            return new
        case "mwak" | "msak" | "rwak" | "rsak":
            return old
        case "abil" | "heal":
            if new in ["mwak", "msak", "rwak", "rsak"]:
                return new
            else:
                return old
        case _:
            return new

def updateTarget(t, action: dict) -> None:
    area = action.get("area", {})
    match area.get("shape", ""):
        case "circle" | "cylinder":
            t["type"] = "cylinder"
            t["value"] = area["radius"]
            t["units"] = "ft"
            return
        case "cone":
            t["type"] = "cone"
            t["value"] = area["length"]
            t["units"] = "ft"
            return
        case "cube" | "square":
            t["type"] = area["shape"]
            t["value"] = area["width"]
            t["units"] = "ft"
            return
        case "line":
            t["type"] = "line"
            t["value"] = area["length"]
            t["width"] = area["width"]
            t["units"] = "ft"
            return
        case "sphere":
            t["type"] = "sphere"
            t["value"] = area["radius"]
            t["units"] = "ft"
            return
    targetType: str = action.get("target", {}).get("type", "")
    match targetType: # self, creature, object, creatureObject, other, and none
        case 'self' | 'creature' | 'object':
            t["type"] = targetType
            t["value"] = action.get("target", {}).get("quantity")
        case 'creatureObject':
            t["type"] = 'enemy'
            t["value"] = action.get("target", {}).get("quantity")

""" NPC TEMPLATE
"""
# Turns the npc into an npc
def migrateMonster(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

""" ITEM TEMPLATES
"base": {
    "actions": {},
    "description": "",
    "favorite": false,
    "secretDescription": "",
    "source": {
        "name": "",
        "link": "",
        "publisher": ""
    },
    "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recharge": {
        "formula": "1d6",
        "threshold": "6"
        }
    }
    },
"schema": {
    "schema": {
        "version": null,
        "lastMigration": null
    }
}
"""

""" FEATURE
"templates": [
    "base",
    "schema"
],
"concentration": false,
"featureType": "",
"prerequisite": ""
"""
# Turns the feature into a class, subclass, or feat
def migrateFeature(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

""" MANEUVER
"templates": [
    "base",
    "schema"
],
"degree": 0,
"exertionCost": 0,
"isStance": false,
"prerequisite": "",
"tradition": ""
"""
# Turns the maneuver into a maneuver
def migrateManeuver(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

""" OBJECTS
"templates": [
    "base",
    "schema"
],
"ammunitionProperties": [],
"armorCategory": "",
"armorProperties": [],
"attuned": false,
"broken": false,
"bulky": false,
"craftingComponents": "",
"equipped": false,
"materialProperties": [],
"objectType": "",
"plotItem": false,
"price": 0,
"proficient": true,
"quantity": 1,
"rarity": "common",
"requiresAttunement": false,
"shieldCategory": "",
"unidentified": false,
"unidentifiedDescription": "",
"unidentifiedName": "",
"weaponProperties": [],
"weight": 0
"""
# Turns the object into a backpack, consumable, equipment, loot, tool, or weapon
def migrateObject(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"]),
        "quantity": system["quantity"],
        "weight": system["weight"],
        "price": splitPrice(system["price"]),
        "attunement": 0,
        "equipped": False,
        "rarity": system["rarity"],
        "identified": True
    }
    backpack = { # No data properties to pull from
        "capacity": {
            "type": "weight",
            "value": None, 
            "weightless": False
        },
        "currency": {
            "cp": 0,
            "sp": 0,
            "ep": 0,
            "gp": 0,
            "pp": 0
        },
        "type": "backpack"
    }
    equipment = {
        "armor": {
            "type": system["armorCategory"] if not system["shieldCategory"] else "shield",
            "value": baseAC(system["ac"]["baseFormula"]),
            "dex": system["ac"]["maxDex"]
        },
        "baseItem": "", # Need to do some CONFIG work...
        "speed": {
            "value": None,
            "conditions": ""
        },
        "strength": system["ac"]["minStr"],
        "stealth": False, # Still missing from the source data as of A5E 14.10
        "proficient": None,
        "type": "equipment"
    }
    consumable = {
        "consumableType": "potion",
        "uses": {
            "autoDestroy": False
        },
        "type": "consumable"
    }
    tool = { # No data properties to pull from
        "toolType": "",
        "baseItem": "",
        "ability": "int",
        "chatFlavor": "",
        "proficient": 0,
        "bonus": "",
        "type": "tool"
    }
    weapon = {
        "weaponType": weaponType(system),
        "baseItem": getBaseItem(system),
        "properties": weaponProperties(system, o5e["description"]),
        "proficient": True,
        "type": "weapon"
    }
    mountable = {
        "armor": {
          "value": None
        },
        "hp": {
          "value": None,
          "max": None,
          "dt": None,
          "conditions": ""
        }
    }
    match system["objectType"]:
        case "ammunition":
            o5e.update(consumable)
            o5e["consumableType"] = "ammo"
        case "armor":
            o5e.update(mountable)
            o5e.update(equipment)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "clothing":
            o5e.update(mountable)
            o5e.update(equipment)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "consumable":
            o5e.update(consumable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "container":
            o5e.update(backpack)
        case "jewelry":
            o5e.update(mountable)
            o5e.update(equipment)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "miscellaneous":
            o5e.update(mountable)
            o5e.update(equipment)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "shield":
            o5e.update(mountable)
            o5e.update(equipment)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "tool":
            o5e.update(tool)
        case "weapon":
            o5e.update(weapon)
            o5e.update(mountable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case _:
            o5e["type"] = "loot"
    
    return o5e

def splitPrice(price: str) -> dict:
    if type(price) == int:
        return {"value": price, "denomination": "gp"}
    s = price.split(' ')
    p = {
        "value": int(s[0].replace(',','')),
        "denomination": s[1] if len(s) == 2 else "gp"
    }
    return p

def baseAC(formula: str) -> int:
    try:
        foo = int(formula)
    except ValueError:
        foo =  0
    return foo


def weaponType(system: dict) -> str:
    wepRange: str = ""
    for a in system["actions"]:
        action: dict = system["actions"][a]
        for r in action.get("rolls", {}):
            roll: dict = system["actions"][a]["rolls"][r]
            match abbr(roll.get("attackType")):
                case "mwak":
                    wepRange = "M"
                case "rwak":
                    wepRange = "R"
    
    if not wepRange:
        return ""

    if "simple" in system["weaponProperties"]:
        return "simple" + wepRange
    else:
        return "martial" + wepRange

def getBaseItem(system: dict) -> str:
    return ""

"""A5E Weapon Properties
A5E.weaponProperties = {
  burn: 'A5E.WeaponPropertyBurn',
  breaker: 'A5E.WeaponPropertyBreaker',
  compounding: 'A5E.WeaponPropertyCompounding',
  defensive: 'A5E.WeaponPropertyDefensive',
  dualWielding: 'A5E.WeaponPropertyDualWielding',
  finesse: 'A5E.WeaponPropertyFinesse',
  flamboyant: 'A5E.WeaponPropertyFlamboyant',
  handMounted: 'A5E.WeaponPropertyHandMounted',
  heavy: 'A5E.WeaponPropertyHeavy',
  inaccurate: 'A5E.WeaponPropertyInaccurate',
  loading: 'A5E.WeaponPropertyLoading',
  mounted: 'A5E.WeaponPropertyMounted',
  muzzleLoading: 'A5E.WeaponPropertyMuzzleLoading',
  parrying: 'A5E.WeaponPropertyParrying',
  parryingImmunity: 'A5E.WeaponPropertyParryingImmunity',
  quickdraw: 'A5E.WeaponPropertyQuickdraw',
  range: 'A5E.WeaponPropertyRange',
  rebounding: 'A5E.ObjectPropertyRebounding',
  reach: 'A5E.WeaponPropertyReach',
  rifled: 'A5E.WeaponPropertyRifled',
  scatter: 'A5E.WeaponPropertyScatter',
  shock: 'A5E.WeaponPropertyShock',
  simple: 'A5E.WeaponPropertySimple',
  stealthy: 'A5E.ObjectPropertyStealthy',
  storage: 'A5E.ObjectPropertyStorage',
  thrown: 'A5E.WeaponPropertyThrown',
  triggerCharge: 'A5E.WeaponPropertyTriggerCharge',
  trip: 'A5E.WeaponPropertyTrip',
  twoHanded: 'A5E.WeaponPropertyTwoHanded',
  versatile: 'A5E.WeaponPropertyVersatile',
  vicious: 'A5E.WeaponPropertyVicious'
};
"""

def weaponProperties(system: dict, description: dict) -> dict:
    props: dict = system["weaponProperties"]
    p = dict()
    """Renames
    Missing o5e: Firearm, Focus, Reload, Special
    """
    if "dualWielding" in props:
        p.update({'lgt': True})
    if "finesse" in props:
        p.update({'fin': True})
    if "heavy" in props:
        p.update({'hvy': True})
    if "loading" in props:
        p.update({'lod': True})
    if "range" in props:
        p.update({"amm": True})
    if "reach" in props:
        p.update({'rch': True})
    if "rebounding" in props:
        p.update({'ret': True})
    if "thrown" in props:
        p.update({'thr': True})
    if "twoHanded" in props:
        p.update({'two': True})
    if "versatile" in props:
        p.update({"ver": True})
    """A5E Specific
    burn, breaker, compounding, defensive, flamboyant, handMounted, inaccurate, 
        mounted, muzzleLoading, parrying, parryingImmunity, quickdraw, 
        rifled, scatter, shock, stealthy, storage, triggerCharge, trip, vicious
    """
    s = "<hr>"
    if "burn" in props:
        s += "<p><b>Burn:</b> The fire fusil only deals a base of 1 fire damage, but the target also catches on fire. It takes 1d10 fire damage at the start of each of its turns, and can end this damage by using its action to extinguish the flames.</p>"
    if "breaker" in props:
        s += "<p><b>Breaker:</b> This weapon deals double damage to unattended objects, such as doors and walls. If this property only applies to a specific type of material, such as wood, it is stated in parenthesis after this property.</p>"
        # This weapon deals double damage to unattended objects, such as doors and walls. If this property only applies to a specific type of material, such as wood, it is stated in parenthesis after this property.
    if "compounding" in props:
        p.update({"cmp": True})
        s += "<p><b>Compounding:</b> You use only your Strength modifier for attack and damage rolls made with this weapon.</p>"
    if "defensive" in props:
        s += "<p><b>Defensive:</b> This weapon is designed to be used with a shield of the stated degree or lighter (light, medium, or heavy). When you make an attack with this weapon and are using a shield designed for it, you can use a bonus action to either make an attack with your shield or increase your Armor Class by 1 until the start of your next turn.</p>"
    if "flamboyant" in props:
        s += "<p><b>Flamboyant:</b> Creatures have disadvantage on saving throws made to resist being distracted by this weapon, and you have advantage on Intimidation or Performance checks made with the use of it.</p>"
    if "handMounted" in props:
        s += "<p><b>Hand-Mounted:</b> This weapon is affixed to your hand. You can do simple activities such as climbing a ladder while wielding this weapon, and you have advantage on saving throws made to resist being disarmed. You cannot use a hand that is wielding a hand-mounted weapon to do complex tasks like picking a pocket, using thieves’ tools to bypass a lock, or casting spells with seen components.</p>"
    if "inaccurate" in props:
        s += "<p><b>Inaccurate:</b> Grenades do not add your ability score modifier to damage.</p><p>When you throw a grenade, choose a creature or an unoccupied 5-ft. space. (If the creature occupies more than one 5-ft. space, choose one of the squares it occupies.) Make an attack roll against AC 10. If the attack misses, the grenade veers off course, missing by 5 ft. in a random direction, or 10 ft. if the target area was at long range. Each creature in a 5-ft. radius of where the grenade lands must succeed a DC 12 Dexterity save or else take 3d6 bludgeoning damage.</p><p>If you targeted a creature and the attack roll is a critical hit, the grenade directly strikes that creature. The grenade does double damage to that creature without allowing a save. Other creatures in the area are affected normally.</p>"
    if "mounted" in props:
        p.update({"mnt": True})
        s += "<p><b>Mounted:</b> This weapon deals the damage listed in parenthesis when you are wielding it while mounted.</p>"
    if "muzzleLoading" in props:
        p.update({"fir": True})
        s += "<p><b>Muzzle Loading:</b> After each shot, it takes an action or bonus action to reload the weapon.</p><p>Sometimes irregular packing of a barrel causes the weapon not to function properly. Whenever you roll a natural 1 on an attack roll with a firearm, the gun misfires – nothing happens, and the gun remains loaded. Clearing the barrel requires an action, and makes the gun safe to use. You can continue using the misfired gun without clearing the barrel, but attacks with the weapon have disadvantage , and if you roll a second natural 1, the weapon has a mishap and explodes. It is destroyed and deals its base damage die to you (e.g., 2d8 with a musket).</p><p>Magical guns never misfire or have mishaps.</p>"
    if "parrying" in props:
        s += "<p><b>Parrying:</b> When you are wielding this weapon and you are not using a shield, once before your next turn you can gain an expertise die to your AC against a single melee attack made against you by a creature you can see. You cannot use this property while incapacitated , paralyzed , rattled , restrained , or stunned.</p>"
    if "parryingImmunity" in props:
        s += "<p><b>Parrying Immunity:</b> Attacks with this weapon ignore the parrying property and Armor Class bonuses from shields.</p>"
    if "quickdraw" in props:
        s += "<p><b>Quickdraw:</b> If you would normally only be able to draw one of these weapons on a turn, you may instead draw a number equal to the number of attacks you make. </p>"
    if "rifled" in props:
        s += "<p><b>Rifled:</b> Rifling extends the range a firearm can accurately hit a target. You can spend an action to aim down the weapon’s sight, and choose a creature you can see. Until you stop aiming, quadruple the weapon’s short and long ranges for the purpose of attacking that target.</p><p>Each turn thereafter you can spend an action or bonus action to continue aiming at the same target or switch to another target you can see. If you move or take damage, your aim is ruined and you have to start over again.</p>"
    if "scatter" in props:
        s += "<p><b>Scatter:</b> If you are wielding a shotgun and have advantage on an attack roll and both rolls hit the target, the weapon deals an extra 1d10 damage. If you have disadvantage, if one attack roll hits but the other misses, the target takes 1d4 damage. This graze damage is not increased by anything else (not ability modifiers, feats, smite spells, sneak attack, etc.), though resistances and vulnerabilities still apply.</p>"
    if "shock" in props:
        s += "<p><b>Shock:</b> When you attack a creature wearing metal armor with a lightning fusil, you have advantage on the attack roll.</p>"
    if "stealthy" in props:
        s += "<p><b>Stealthy:</b> This armor or weapon has been disguised to look like a piece of clothing or other normal item. A creature observing the item only realizes that it is armor or a weapon with a DC 15 Investigation check (made with disadvantage if the armor is being worn at the time or the weapon is sheathed).</p>"
    if "storage" in props:
        s += "<p><b>Storage:</b> This piece contains a hidden compartment the size of a small vial. On weapons, this compartment may have a release that allows liquid placed in the compartment, such as poison, to flow out and coat the blade or head. You can use a bonus action to release the liquid stored in a weapon.</p>"
    if "triggerCharge" in props:
        s += "<p><b>Trigger Charge:</b> An arcane fusil requires no ammunition, but you cannot simply shoot it by pulling the trigger. The planarite takes a moment to gather the necessary energy. To charge the fusil, you spend a bonus action and pull back a firing hammer. At the start of your next turn, the fusil is charged, and can be used for a single attack. </p><p>The shot of an arcane fusil is either a pellet of flame that engulfs a target hit, or a shaft of crackling lightning.</p><p>Once fired, you cannot charge a fusil again on the same turn. It can only be fired every other turn.</p><p>If you charge a fusil but do not fire it on your next turn, the weapon suffers a misfire. Similar to a muzzle-loading weapon, you can clear the barrel by spending an action, but until you do the weapon has disadvantage on attacks. If you suffer a second misfire without clearing the barrel, the fusil explodes and deals its base damage die to you.</p>"
    if "trip" in props:
        s += "<p><b>Trip:</b> When used with a combat maneuver that trips a creature or the Knockdown attack, this weapon increases your Maneuver DC by 1. If the target is mounted, your Maneuver DC is instead increased by 2.</p>"
    if "vicious" in props:
        s += "<p><b>Vicious:</b> A vicious weapon scores a critical hit on a roll of 19 or 20. If you already have a feature that increases the range of your critical hits, your critical hit range increases by 1 (maximum 17–20).</p>"
    if len(s) > 5:
        description["value"] += s
    
    return p

""" SPELL
"templates": [
    "base",
    "schema"
],
"components": {
    "vocalized": false,
    "seen": false,
    "material": false
},
"concentration": false,
"level": 0,
"materials": "",
"materialsConsumed": false,
"prepared": false,
"prerequisite": "",
"ritual": false,
"schools": {
    "primary": "abjuration",
    "secondary": []
}
"""
# Turns the spell into a spell
def migrateSpell(system: dict) -> dict:
    o5e = {
        # "templates": ["activatedEffect", "action"],
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"]),
        "level": system["level"],
        "school": abbr(system["schools"]["primary"]),
        "components": {
            "vocal": system["components"]["vocalized"],
            "somatic": system["components"]["seen"],
            "material": system["components"]["material"],
            "ritual": system["ritual"],
            "concentration": system["concentration"]
        },
        "materials": {
            "value": system["materials"],
            "consumed": system["materialsConsumed"],
            "cost": 0,
            "supply": 0
        },
        "preparation": {
            "mode": "prepared",
            "prepared": False
        },
        "scaling": {
            "mode": "none",
            "formula": None
        }
    }
    for a in system["actions"]:
        migrateAction(system["actions"][a], o5e)
    return o5e

""" BACKGROUND
"templates": [
    "schema"
],
"defaultASI": "",
"includesASI": true,
"description": "",
"equipment": {},
"feature": "",
"proficiencies": {
    "languages": {
        "count": 0,
        "fixed": [],
        "options": []
    },
    "skills": {
        "count": 2,
        "fixed": [],
        "options": []
    },
    "tools": {
        "count": 0,
        "fixed": [],
        "options": ""
    }
}
"""
# Turns the background into a background
def migrateBackground(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

""" CULTURE
"templates": [
"schema"
],
"description": "",
"features": {},
"proficiencies": {
    "languages": {
        "count": 0,
        "fixed": [],
        "options": []
    }
}
"""
# Turns the culture into a background
def migrateCulture(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

""" DESTINY
"templates": [
    "schema"
],
"description": "",
"sourceOfInspiration": "",
"inspirationFeature": "",
"fulfillmentFeature": ""
"""
# Turns the destiny into a background
def migrateDestiny(system: dict) -> dict:
    o5e = {
        "description": {
            "value": fixUUIDrefs(system["description"]),
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

for p in packList:
    with open(os.path.join(origin,p), "r", encoding='utf-8') as read_file:
        data = json.load(read_file)
        if "core" in data["flags"]:
            data["flags"].pop("core")
        print(data["name"])
        match data["type"]: # a5e type
            case "npc":
                data["system"] = migrateMonster(data["system"])
            case "feature":
                data["system"] = migrateFeature(data["system"])
                data["type"] = data["system"]["type"]
                data["system"].pop("type")
            case "maneuver":
                data["system"] = migrateManeuver(data["system"])
            case "object":
                data["system"] = migrateObject(data["system"])
                data["type"] = data["system"]["type"]
                data["system"].pop("type")
            case "spell":
                data["flags"]["a5e-for-dnd5e"] = {
                    "secondarySchools" : data["system"]["schools"]["secondary"],
                    "rareSpell": targetPack == "rareSpells"
                }
                data["system"] = migrateSpell(data["system"])
            case "background":
                data["system"] = migrateBackground(data["system"])
            case "culture":
                data["system"] = migrateCulture(data["system"])
                data["type"] = "background"
            case "destiny":
                data["system"] = migrateDestiny(data["system"])
                data["type"] = "background"
    # if data["name"] != "Adderwort Roots":
    #     continue
    # print(data)
    # break
    match targetPack:
        case "rareSpells":
            packPath = os.path.join(".\src", "packs", "spells")
        case "adventuringGear" | "magicItems":
            packPath = os.path.join(".\src", "packs", "equipment")
    if not os.path.exists(packPath):
        os.mkdir(packPath)
    with open(os.path.join(packPath,p), "w", encoding='utf-8') as writeFile:
        writeFile.write(json.dumps(data, indent=2, ensure_ascii=False))
