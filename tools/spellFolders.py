import os
import json
import utils
import buildReferenceFolder

targetPack = "spells"
packPath = os.path.join(".\src", "packs", targetPack)
packList = os.listdir(packPath)

class Folder:
    def __init__(self, name: str, color: str | None = None, parentFolder: str | None = None) -> None:
        self.name = name
        self.color = color
        self.flags = {}
        self.sort = 0
        self.sorting = 'a'
        self._type = 'Item'
        self.folder = parentFolder
        self._id = utils.randomID()
        self._key = '!folders!' + self._id
        
    def __repr__(self) -> str:
        return repr(vars(self))

class encoder(json.JSONEncoder):
    def default(self, o):
        d: dict = o.__dict__
        if "_type" in d:
            d["type"] = d["_type"]
            d.pop("_type")
        return d

def createFolders():
    outerFolders = ["Spells", "Rare Spells"]
    innerFolders = ["Cantrip", "1st level", "2nd level", "3rd level", "4th level", "5th level", "6th level", "7th level", "8th level", "9th level"]
    for o in outerFolders:
        outer = Folder(o)
        print(outer)
        filename = outer.name.replace(' ', '_') + '_' + outer._id + ".json"
        with open(os.path.join(packPath,filename), "w") as writeFile:
            writeFile.write(json.dumps(outer, indent=2, cls=encoder))
        for i in innerFolders:
            inner = Folder(i, parentFolder=outer._id)
            print(inner)
            filename = inner.name.replace(' ', '_') + '_' + inner._id + ".json"
            with open(os.path.join(packPath,filename), "w") as writeFile:
                writeFile.write(json.dumps(inner, indent=2, cls=encoder))
    buildReferenceFolder.build(targetPack)

if not os.path.exists(os.path.join("tools", "referenceFolders", "spells.json")):
    createFolders()

spells: list[str] = list('0123456789')
rareSpells: list[str] = list('0123456789')

folders = utils.prepFolders(targetPack)



for f in folders:
    if folders[f]["parent"] != None:
        parentName: str = utils.folderName(folders, f, 1)
        currentName: str = folders[f]["name"]
        level: int = int(currentName[0]) if currentName != 'Cantrip' else 0
        if parentName == 'Spells':
            spells[level] = f
        else:
            rareSpells[level] = f

for p in packList:
    with open(os.path.join(packPath,p), "r") as read_file:
        data = json.load(read_file)
        if data["type"] != 'spell':
            continue
        if data["flags"]["a5e-for-dnd5e"].get("rareSpell"):
            data["folder"] = rareSpells[data["system"]["level"]]
        else:
            data["folder"] = spells[data["system"]["level"]]
    print(data["folder"])
    break