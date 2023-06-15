import os
import json
import sys
import utils

targetPack = sys.argv[1]
packPath = os.path.join(".\src", "packs", targetPack)
packList = os.listdir(packPath)

class Folder:
    def __init__(self, name: str, color: str, parentFolder: str) -> None:
        name = name
        color = color
        flags = {}
        sort = 0
        sorting = 'a'
        _type = 'item'
        folder = parentFolder
        _id = utils.randomID()
        _key = '!folders!' + _id
        
    def __repr__(self) -> str:
        return repr(vars(self))

class encoder(json.JSONEncoder):
    def default(self, o):
        d: dict = o.__dict__
        if "_type" in d:
            d["type"] = d["_type"]
            d.pop("_type")
        return d

for p in packList:
    with open(os.path.join(packPath,p), "r") as read_file:
        data = json.load(read_file)