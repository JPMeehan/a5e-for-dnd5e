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
        return source
    else:
        return source["name"]

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

def migrateSpell(system: dict) -> dict:
    o5e = {
        "description": {
            "value": system["description"],
            "chat": "",
            "unidentified": ""
        },
        "source": flattenSource(system["source"])
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
        match data["type"]:
            case "npc":
                data["system"] = migrateMonster(data["system"])
            case "feature":
                data["system"] = migrateFeature(data["system"])
            case "maneuver":
                data["system"] = migrateManeuver(data["system"])
            case "object":
                data["system"] = migrateObject(data["system"])
            case "spell":
                data["system"] = migrateSpell(data["system"])
            case "background":
                data["system"] = migrateBackground(data["system"])
            case "culture":
                data["system"] = migrateCulture(data["system"])
            case "destiny":
                data["system"] = migrateDestiny(data["system"])
    print(data)
    break
    # with open(os.path.join(packPath,p), "r") as writeFile:
    #     writeFile.write(json.dumps(data, indent=2))
