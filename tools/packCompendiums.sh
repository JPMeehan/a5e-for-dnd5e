$moduleName = "a5e-for-dnd5e"
fvtt package workon $moduleName --type "Module"
fvtt package pack -n $1 --in ./src/packs/$1 --out ./$moduleName/packs