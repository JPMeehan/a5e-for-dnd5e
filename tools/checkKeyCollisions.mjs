import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const packsPath = path.join('src', 'packs');

const packs = await fs.readdir(packsPath);
for (const pack of packs) {
  if (pack === '.gitattributes') continue;
  const docsPath = path.join(packsPath, pack);
  const docs = await fs.readdir(docsPath);
  const ids = new Set();
  for (const d of docs) {
    const read_file = await fs.readFile(path.join(docsPath, d), 'utf-8');
    const data = yaml.load(read_file);
    if (ids.has(data._id)) {
      console.log(data.name, 'already present in pack', docsPath);
    } else {
      ids.add(data._id);
    }
  }
}
