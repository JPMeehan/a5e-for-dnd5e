fvtt package workon a5e --type "System"
rm -rf ./src/packs-origin/*
for FILE in ../../systems/a5e/packs/*.db 
do 
    echo ${FILE:24}
    db=${FILE:24:${#FILE}-27}
    [[ $db = 'monsters' ]] && t='Actor' || t='Item'
    # echo $t
    fvtt package unpack -n $db --out ./src/packs-origin/$db --in ../../systems/a5e/packs/$db --nedb -t $t
done

# fvtt package unpack -n $1 --outputDirectory ./src/packs/$1
# python ./tools/buildReferenceFolder.py $1