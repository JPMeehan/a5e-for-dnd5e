import { promises as fs } from 'fs';
import path from 'path';
import { Folder } from '../utils.mjs';
import yaml from 'js-yaml';
import ReferenceFolder from '../ReferenceFolder.mjs';

const targetPack = 'combat-maneuvers';
const packPath = path.join('src', 'packs', targetPack);

const yamlPack = await fs.readdir(packPath);

const basic = { name: 'Basic Maneuvers', type: '' };

const traditions = [
  {
    name: 'Adamant Mountain',
    type: 'adamantMountain',
  },
  {
    name: 'Arcane Artillery',
    type: 'arcaneArtillery',
  },
  {
    name: 'Arcane Knight',
    type: 'arcaneKnight',
  },
  {
    name: 'Awakened Mind',
    type: 'awakenedMind',
  },
  {
    name: 'Beast Unity',
    type: 'beastUnity',
  },
  {
    name: 'Biting Zephyr',
    type: 'bitingZephyr',
  },
  {
    name: 'Comedic Jabs',
    type: 'comedicJabs',
  },
  {
    name: 'Cutting Omen',
    type: 'cuttingOmen',
  },
  {
    name: 'Eldritch Blackguard',
    type: 'eldritchBlackguard',
  },
  {
    name: 'Gallant Heart',
    type: 'gallantHeart',
  },
  {
    name: 'Grinding Cog',
    type: 'grindingCog',
  },
  {
    name: "Mirror's Glint",
    type: 'mirrorsGlint',
  },
  {
    name: 'Mist and Shade',
    type: 'mistAndShade',
  },
  {
    name: 'Rapid Current',
    type: 'rapidCurrent',
  },
  {
    name: "Razor's Edge",
    type: 'razorsEdge',
  },
  {
    name: 'Sanctified Steel',
    type: 'sanctifiedSteel',
  },
  {
    name: 'Sanguine Knot',
    type: 'sanguineKnot',
  },
  {
    name: 'Selfless Sentinel',
    type: 'selflessSentinel',
  },
  {
    name: 'Spirited Steed',
    type: 'spiritedSteed',
  },
  {
    name: 'Tempered Iron',
    type: 'temperedIron',
  },
  {
    name: 'Tooth and Claw',
    type: 'toothAndClaw',
  },
  {
    name: 'Unending Wheel',
    type: 'unendingWheel',
  },
  {
    name: "Viper's Fangs",
    type: 'vipersFangs',
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
    data.folder = folderStruct[folderName][data.system.degree - 1];
  } else data.folder = folderStruct[basic.name];
  await fs.writeFile(
    path.join(packPath, d),
    yaml.dump(data, { indent: 2 }),
    'utf-8'
  );
}
