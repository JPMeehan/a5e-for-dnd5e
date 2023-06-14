import os
import json
import sys

targetPack = sys.argv[1]
origin = os.path.join(".\src", "packs-origin", targetPack)
packPath = os.path.join(".\src", "packs", targetPack)
packList = os.listdir(origin)

def migrateSpell(d):
    return d


for p in packList:
    with open(os.path.join(packPath,p), "r") as read_file:
        data = json.load(read_file)