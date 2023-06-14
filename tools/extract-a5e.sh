fvtt package workon a5e --type "System"
rm -r ./src/packs-origin/*
for FILE in ../../systems/a5e/packs/*.db 
do 
    echo ${FILE:24}
    db=${FILE:24:${#FILE}-27}
    # echo $db
    fvtt package unpack -n $db --outputDirectory ./src/packs-origin/$db # --nedb --verbose
done

# fvtt package unpack -n $1 --outputDirectory ./src/packs/$1
# python ./tools/buildReferenceFolder.py $1