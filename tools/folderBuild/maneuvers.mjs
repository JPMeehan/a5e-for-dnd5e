import { promises as fs } from 'fs';
import path from 'path';
import { Folder } from '../utils.mjs';
import yaml from 'js-yaml';
import ReferenceFolder from '../ReferenceFolder.mjs';

const targetPack = 'maneuvers';
const packPath = path.join('src', 'packs', targetPack);

const yamlPack = await fs.readdir(packPath);

const basic = { name: 'Basic Maneuvers', type: '' };

const traditions = [
  {
    name: 'Adamant Mountain',
    type: 'adm',
  },
  {
    name: 'Arcane Artillery',
    type: 'arcart',
  },
  {
    name: 'Arcane Knight',
    type: 'arckn',
  },
  {
    name: 'Awakened Mind',
    type: 'awm',
  },
  {
    name: 'Beast Unity',
    type: 'bu',
  },
  {
    name: 'Biting Zephyr',
    type: 'btz',
  },
  {
    name: 'Comedic Jabs',
    type: 'coj',
  },
  {
    name: 'Cutting Omen',
    type: 'cutom',
  },
  {
    name: 'Eldritch Blackguard',
    type: 'elb',
  },
  {
    name: 'Gallant Heart',
    type: 'gh',
  },
  {
    name: 'Grinding Cog',
    type: 'grc',
  },
  {
    name: "Mirror's Glint",
    type: 'mgl',
  },
  {
    name: 'Mist and Shade',
    type: 'mas',
  },
  {
    name: 'Rapid Current',
    type: 'rc',
  },
  {
    name: "Razor's Edge",
    type: 'rze',
  },
  {
    name: 'Sanctified Steel',
    type: 'sst',
  },
  {
    name: 'Sanguine Knot',
    type: 'sk',
  },
  {
    name: 'Selfless Sentinel',
    type: 'ssn',
  },
  {
    name: 'Spirited Steed',
    type: 'ss',
  },
  {
    name: 'Tempered Iron',
    type: 'tpi',
  },
  {
    name: 'Tooth and Claw',
    type: 'tac',
  },
  {
    name: 'Unending Wheel',
    type: 'uwh',
  },
  {
    name: "Viper's Fangs",
    type: 'vif',
  },
];

async function createFolders() {
  const outerFolders = traditions.concat(basic);
  const innerFolders = [
    {
      name: '1st Degree',
      color: '#a27ebc',
    },
    {
      name: '2nd Degree',
      color: '#926fac',
    },
    {
      name: '3rd Degree',
      color: '#83609d',
    },
    {
      name: '4th Degree',
      color: '#75528d',
    },
    {
      name: '5th Degree',
      color: '#66447e',
    },
  ];
  for (const o of outerFolders) {
    const outer = new Folder(o.name);
    if (outer.name === basic.name) outer.color = '#228B22';
    let filename =
      'folders_' + outer.name.replace(' ', '_') + '_' + outer._id + '.yml';
    await fs.writeFile(
      path.join(packPath, filename),
      yaml.dump(outer.toObject, { indent: 2 }),
      { flag: 'w' }
    );
    if (outer.name === basic.name) continue;
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
  await fs.access(path.join('tools', 'referenceFolders', targetPack + '.yml'));
} catch {
  await createFolders();
}

const folderStruct = traditions.reduce((acc, curr) => {
  acc[curr.name] = Array.from('12345');
  return acc;
}, {});

folderStruct[basic.name] = '';

const folders = new ReferenceFolder(targetPack);

await folders.prepFolders();

for (const [id, f] of Object.entries(folders.compendium)) {
  if (!f.parent) {
    if (f.name === basic.name) folderStruct[basic.name] = id;
    continue;
  }
  const parentName = folders.getFolderName(id, 1);
  const currentName = f.name;
  const index = parseInt(currentName[0]) - 1;
  folderStruct[parentName][index] = id;
}

for (const d of yamlPack) {
  const read_file = await fs.readFile(path.join(packPath, d));
  const data = yaml.load(read_file);
  if (data.type === 'Item') continue;
  const folderName = traditions.find((f) => f.type === data.system.tradition);
  if (folderName) {
    data.folder = folderStruct[folderName.name][data.system.degree - 1];
  } else data.folder = folderStruct[basic.name];
  await fs.writeFile(
    path.join(packPath, d),
    yaml.dump(data, { indent: 2 }),
    'utf-8'
  );
}
