import os
import json
import sys

targetPack = sys.argv[1]
origin = os.path.join(".\src", "packs-origin", targetPack)
packPath = os.path.join(".\src", "packs", targetPack)
packList = os.listdir(origin)

# dnd5e item types = ["weapon", "equipment", "consumable", "tool", "loot", "background", "class", "subclass", "spell", "feat", "backpack"]
#   a5e item types = ["feature", "maneuver", "object", "spell", "background", "culture", "destiny"],

def flattenSource(source):
    if type(source) == str:
        return source if source != "" else "A5E Adventurer's Guide"
    else:
        return source["name"]

def abbr(word):
    match word:
        case "abjuration":
            return "abj"
        case "conjuration":
            return "conj"
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

def migrateAction(action, o5e) -> bool:
    return True

def migrateMonster(system: dict) -> dict:
    o5e = {
        "description": {
            "value": system["description"],
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
            "value": system["description"],
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
            "value": system["description"],
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
            "value": system["description"],
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"]),
        "quantity": system["quantity"],
        "weight": system["weight"],
        "price": {
            "value": system["price"],
            "denomination": "gp"
        },
        "attunement": 0,
        "equipped": system["equipped"],
        "rarity": system["rarity"],
        "identified": True
    }
    backpack = {
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
        "templates": ["activatedEffect", "action", "mountable"],
        "armor": {
            "type": "light",
            "value": None,
            "dex": None
        },
        "baseItem": "",
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
        "templates": ["activatedEffect", "action"],
        "consumableType": "potion",
        "uses": {
            "autoDestroy": False
        },
        "type": "consumable"
    }
    tool = {
        "toolType": "",
        "baseItem": "",
        "ability": "int",
        "chatFlavor": "",
        "proficient": 0,
        "bonus": "",
        "type": "tool"
    }
    weapon = {
        "templates": ["activatedEffect", "action", "mountable"],
        "weaponType": "simpleM",
        "baseItem": "",
        "properties": {},
        "proficient": True,
        "type": "weapon"
    }
    match system["objectType"]:
        case "ammunition":
            o5e.update(consumable)
        case "armor":
            o5e.update(equipment)
        case "clothing":
            o5e.update(equipment)
        case "consumable":
            o5e.update(consumable)
        case "container":
            o5e.update(backpack)
        case "jewelry":
            o5e.update(equipment)
        case "miscellaneous":
            o5e.update(equipment)
        case "shield":
            o5e.update(equipment)
        case "tool":
            o5e.update(tool)
        case "weapon":
            o5e.update(weapon)
        case _:
            o5e["type"] = "loot"
    
    return o5e

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
        "templates": ["activatedEffect", "action"],
        "description": {
            "value": system["description"],
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
            "value": system["description"],
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
            "value": system["description"],
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
            "value": system["description"],
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
    }
    return o5e

for p in packList:
    with open(os.path.join(origin,p), "r") as read_file:
        data = json.load(read_file)
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
                data["system"] = migrateSpell(data["system"])
            case "background":
                data["system"] = migrateBackground(data["system"])
            case "culture":
                data["system"] = migrateCulture(data["system"])
                data["type"] = "background"
            case "destiny":
                data["system"] = migrateDestiny(data["system"])
                data["type"] = "background"
    print(data)
    break
    # with open(os.path.join(packPath,p), "r") as writeFile:
    #     writeFile.write(json.dumps(data, indent=2))
