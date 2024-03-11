import { promises as fs } from 'fs';
import path from 'path';
import { Folder } from './utils.mjs';
import yaml from 'js-yaml';
import ReferenceFolder from './ReferenceFolder.mjs';

const targetPack = 'gear';
const packPath = path.join('src', 'packs', targetPack);

const yamlPack = await fs.readdir(packPath);

const innerFolders = [
  { name: 'Containers', type: 'container' },
  { name: 'Consumables', type: 'consumable' },
  { name: 'Equipment', type: 'equipment' },
  { name: 'Armor', type: 'equipment' },
  { name: 'Shields', type: 'equipment' },
  { name: 'Tools', type: 'tool' },
  { name: 'Weapons', type: 'weapon' },
  { name: 'Loot', type: 'loot' },
];

async function createFolders() {
  const outerFolders = ['Mundane', 'Magic'];

  for (const o of outerFolders) {
    const outer = new Folder(o);
    let filename =
      'folders_' + outer.name.replace(' ', '_') + '_' + outer._id + '.yml';
    await fs.writeFile(
      path.join(packPath, filename),
      yaml.dump(outer.toObject, { indent: 2 }),
      { flag: 'w' }
    );
    for (const i of innerFolders) {
      const inner = new Folder(i.name, {
        parentFolder: outer._id,
      });
      filename =
        'folders_' + inner.name.replace(' ', '_') + '_' + inner._id + '.yml';
      await fs.writeFile(
        path.join(packPath, filename),
        yaml.dump(inner.toObject, { indent: 2 })
      );
    }
  }
  await ReferenceFolder.build(targetPack);
}
try {
  await fs.access(path.join('tools', 'referenceFolders', targetPack + '.yml'));
} catch {
  await createFolders();
}

// const spells = Array.from('0123456789');
// const rareSpells = Array.from('0123456789');

const mundane = innerFolders.reduce((acc, curr) => {
  acc[curr.name] = '';
  return acc;
}, {});
const magic = innerFolders.reduce((acc, curr) => {
  acc[curr.name] = '';
  return acc;
}, {});

const folders = new ReferenceFolder(targetPack);

await folders.prepFolders();

for (const [id, f] of Object.entries(folders.compendium)) {
  if (!f.parent) continue;
  const parentName = folders.getFolderName(id, 1);
  const currentName = f.name;
  const target = parentName === 'Mundane' ? mundane : magic;
  target[currentName] = id;
}

console.log(magic, mundane);

for (const d of yamlPack) {
  const read_file = await fs.readFile(path.join(packPath, d));
  const data = yaml.load(read_file);
  if (data.type === 'folder') continue;
  const target = data.system.rarity === 'mundane' ? mundane : magic;
  const inF = innerFolders.find((f) => f.type === data.type);
  if (inF.type === 'equipment') {
    switch (data.system.type.value) {
      case 'light':
      case 'medium':
      case 'heavy':
        data.folder = target['Armor'];
        break;
      case 'shield':
        data.folder = target['Shields'];
        break;
      default:
        data.folder = target['Equipment'];
    }
  } else data.folder = target[inF.name];
  await fs.writeFile(
    path.join(packPath, d),
    yaml.dump(data, { indent: 2 }),
    'utf-8'
  );
}
