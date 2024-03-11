import { promises as fs } from 'fs';
import path from 'path';
import { Folder } from '../utils.mjs';
import yaml from 'js-yaml';
import ReferenceFolder from '../ReferenceFolder.mjs';

const targetPack = 'spells';
const packPath = path.join('src', 'packs', targetPack);

const spellPack = await fs.readdir(packPath);

async function createFolders() {
  const outerFolders = ['Spells', 'Rare Spells'];
  const innerFolders = [
    {
      name: 'Cantrip',
      color: '#b18dcd',
    },
    {
      name: '1st Level',
      color: '#a27ebc',
    },
    {
      name: '2nd Level',
      color: '#926fac',
    },
    {
      name: '3rd Level',
      color: '#83609d',
    },
    {
      name: '4th Level',
      color: '#75528d',
    },
    {
      name: '5th Level',
      color: '#66447e',
    },
    {
      name: '6th Level',
      color: '#58366f',
    },
    {
      name: '7th Level',
      color: '#4a2960',
    },
    {
      name: '8th Level',
      color: '#3d1b52',
    },
    {
      name: '9th Level',
      color: '#300d44',
    },
  ];
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
        color: i.color,
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
  await fs.access(path.join('tools', 'referenceFolders', 'spells.yml'));
} catch {
  await createFolders();
}

const spells = Array.from('0123456789');
const rareSpells = Array.from('0123456789');

const folders = new ReferenceFolder(targetPack);

await folders.prepFolders();

for (const [id, f] of Object.entries(folders.compendium)) {
  if (!f.parent) continue;
  const parentName = folders.getFolderName(id, 1);
  const currentName = f.name;
  const level = currentName !== 'Cantrip' ? parseInt(currentName[0]) : 0;
  if (parentName === 'Spells') spells[level] = id;
  else rareSpells[level] = id;
}

for (const d of spellPack) {
  const read_file = await fs.readFile(path.join(packPath, d));
  const data = yaml.load(read_file);
  if (data.type !== 'spell') continue;
  if (data.flags['a5e-for-dnd5e']?.rareSpell) {
    data.folder = rareSpells[data.system.level];
  } else data.folder = spells[data.system.level];
  await fs.writeFile(
    path.join(packPath, d),
    yaml.dump(data, { indent: 2 }),
    'utf-8'
  );
}
