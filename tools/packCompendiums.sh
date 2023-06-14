$moduleName = "a5e-for-dnd5e"
fvtt package workon $moduleName --type "Module"
fvtt package pack -n $1 --id ./src/packs/$1 --od ./$moduleName/packs