fvtt package workon a5e-for-dnd5e --type "Module"
rm ./src/packs/$1/*.json
fvtt package unpack -n $1 --out ./src/packs/$1
python ./tools/buildReferenceFolder.py $1