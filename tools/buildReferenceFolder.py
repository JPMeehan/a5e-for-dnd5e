import os
import json
import sys


def build(targetPack):
    packPath = os.path.join(".\src", "packs", targetPack)
    packList = os.listdir(packPath)

    # folderStruct = {"_id": {"name": "foobar", "parent": "_id"}}
    folderStruct = {}

    for p in packList:
        # print(p)
        with open(os.path.join(packPath,p), "r") as read_file:
            data = json.load(read_file)
            if 'type' not in data:
                continue
            if (data["type"] == "Item"):
                folderStruct[data["_id"]] = {"name": data["name"], "parent": data["folder"]}

    with open(os.path.join(".", "tools", "referenceFolders", targetPack + ".json"), "w") as write_file:
        write_file.write(json.dumps(folderStruct, indent=2))

if len(sys.argv) > 1:
    t = sys.argv[1]
    build(t)