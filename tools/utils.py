import os
import json
import random

def prepFolders(pack: str) -> dict:
    with open(os.path.join(".", "tools", "referenceFolders", pack + ".json")) as read_file:
        folders = json.load(read_file)
    return folders

def folderName(folderDict: dict, id: str, depth = 0) -> str:
    f = folderDict[id]
    if f["parent"] == None or depth == 0:
        return f["name"]
    elif depth > 0:
        return folderName(folderDict,  f["parent"], depth - 1)
    else: # For -1, to find the root
        return folderName(folderDict, f["parent"], depth)
    
def randomID(length = 16):
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    id = ""
    while len(id) < length:
        id += random.choice(chars)
    return id

def uuid(pack: str,id: str) -> str:
    return '.'.join(["Compendium","chaosos-5e-content",pack,"Item",id])

def expandSource(src: str) -> str:
    match src:
        case "Homebrew" | "Homebrew/DMG" | "Infuse Item":
            return src
        case "PHB":
            return "Player's Handbook"
        case "XGE":
            return "Xanathar's Guide to Everything"
        case "TCE":
            return "Tasha's Cauldron of Everything"
        case "SCAG":
            return "Sword Coast Adventurer's Guide"
        case "VRGR":
            return "Van Richten's Guide to Ravenloft"
        case "FTD":
            return "Fizban's Tome of Dragons"
        case "EGW":
            return "Explorer's Guide to Wildemount"
        case "DSotDQ":
            return "Dragonlance: Shadow of the Dragon Queen"
        case "UACDD" | "UAD" | "UAF" | "UAGH" | "UARAR" | "UAS" | "UA":
            return "Unearthed Arcana"
        case _:
            return ""
        
def subclassHeader(classID: str):
    match classID:
        case "artificer":
            return "Artificer Specialist Feature"
        case "barbarian":
            return "Path Feature"
        case "bard":
            return "Bard College Feature"
        case "cleric":
            return "Divine Domain Feature"
        case "druid":
            return "Druid Circle Feature"
        case "fighter":
            return "Martial Archetype Feature"
        case "monk":
            return "Monastic Tradition Feature"
        case "paladin":
            return "Sacred Oath Feature"
        case "ranger":
            return "Ranger Archetype Feature"
        case "rogue":
            return "Roguish Archetype Feature"
        case "sorcerer":
            return "Sorcerous Origin Feature"
        case "warlock":
            return "Otherworldly Patron Feature"
        case "wizard":
            return "Arcane Tradition Feature"
        case _:
            return "Item Grant"