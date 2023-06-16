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
        "equipped": system["equipped"],
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
    equipment = { # No data properties to pull from
        "armor": {
            "type": system["armorCategory"] if not system["shieldCategory"] else "shield",
            "value": None,
            "dex": None
        },
        "baseItem": "", # Need to do some CONFIG work...
        "speed": {
            "value": None,
            "conditions": ""
        },
        "strength": None,
        "stealth": False,
        "proficient": True,
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
        "baseItem": "",
        "properties": {},
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
            o5e.update(equipment)
            o5e.update(mountable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "clothing":
            o5e.update(equipment)
            o5e.update(mountable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "consumable":
            o5e.update(consumable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "container":
            o5e.update(backpack)
        case "jewelry":
            o5e.update(equipment)
            o5e.update(mountable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "miscellaneous":
            o5e.update(equipment)
            o5e.update(mountable)
            for a in system["actions"]:
                migrateAction(system["actions"][a], o5e)
        case "shield":
            o5e.update(equipment)
            o5e.update(mountable)
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
        "denomination": s[1]
    }
    return p

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
    with open(os.path.join(origin,p), "r") as read_file:
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
    if data["type"] != "weapon":
        continue
    print(data)
    # break
    # match targetPack:
    #     case "rareSpells":
    #         packPath = os.path.join(".\src", "packs", "spells")
    #     case "adventuringGear" | "magicItems":
    #         packPath = os.path.join(".\src", "packs", "equipment")
    # if not os.path.exists(packPath):
    #     os.mkdir(packPath)
    # with open(os.path.join(packPath,p), "w") as writeFile:
    #     writeFile.write(json.dumps(data, indent=2, ensure_ascii=False))
