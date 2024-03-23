import { promises as fs } from 'fs';
import path from 'path';
import { Folder } from '../utils.mjs';
import yaml from 'js-yaml';
import ReferenceFolder from '../ReferenceFolder.mjs';

const targetPack = 'origins';
const packPath = path.join('src', 'packs', targetPack);

const yamlPack = await fs.readdir(packPath);

const outerFolders = [
  { name: 'Heritages', type: 'race' },
  { name: 'Cultures', type: 'a5e-for-dnd5e.culture' },
  { name: 'Backgrounds', type: 'background' },
  { name: 'Destinies', type: 'a5e-for-dnd5e.destiny' },
];

async function createFolders() {
  for (const o of outerFolders) {
    const outer = new Folder(o.name);
    let filename =
      'folders_' + outer.name.replace(' ', '_') + '_' + outer._id + '.yml';
    await fs.writeFile(
      path.join(packPath, filename),
      yaml.dump(outer.toObject, { indent: 2 }),
      { flag: 'w' }
    );
  }
  await ReferenceFolder.build(targetPack);
}
try {
  await fs.access(path.join('tools', 'referenceFolders', targetPack + '.yml'));
} catch {
  await createFolders();
}

const folders = new ReferenceFolder(targetPack);

await folders.prepFolders();

const folderArray = Object.entries(folders.compendium);

const folderStruct = outerFolders.reduce((a, c) => {
  const targetFolder = folderArray.find((f) => f[1].name === c.name);
  a[c.name] = targetFolder[0];
  return a;
}, {});

for (const d of yamlPack) {
  const read_file = await fs.readFile(path.join(packPath, d));
  const data = yaml.load(read_file);
  if (data.type === 'Item') continue;
  if (!data.system) {
    console.log(d);
    continue;
  }

  const targetFolder = outerFolders.find((f) => f.type === data.type);
  if (!targetFolder) {
    console.log(d);
    continue;
  }
  data.folder = folderStruct[targetFolder.name];
  await fs.writeFile(
    path.join(packPath, d),
    yaml.dump(data, { indent: 2 }),
    'utf-8'
  );
}
