import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const output = join(project, 'assets', 'demo', 'tilemaps', 'NightMarket.tmx');
mkdirSync(dirname(output), { recursive: true });
const kinds = ['tile_ground', 'tile_stone_road', 'tile_shore', 'tile_water'];
const firstGid = new Map(kinds.map((kind, i) => [kind, i + 1]));
const tilesets = kinds.map((kind, i) =>
  `  <tileset firstgid="${i + 1}" name="${kind}" tilewidth="256" tileheight="128" tilecount="1" columns="1">\n` +
  `    <image source="../scenes/${kind}.png" width="256" height="128"/>\n  </tileset>`
).join('\n');
const rows = [];
for (let row = 0; row < 15; row++) {
  const cells = [];
  for (let col = 0; col < 15; col++) {
    const x = (col - row) * 128;
    const edge = Math.min(row, col, 14 - row, 14 - col);
    const roadCenter = -250 + (row + col) * 18;
    const road = Math.abs(x - roadCenter) < 155 && row + col > 3 && row + col < 25;
    const kind = road ? 'tile_stone_road' : edge === 0 ? 'tile_water' : edge === 1 ? 'tile_shore' : 'tile_ground';
    cells.push(firstGid.get(kind));
  }
  rows.push(`      ${cells.join(',')}`);
}
const tmx = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<map version="1.4" tiledversion="1.4.3" orientation="isometric" renderorder="right-down" width="15" height="15" tilewidth="256" tileheight="128" infinite="0" nextlayerid="2" nextobjectid="1">\n` +
  `${tilesets}\n` +
  `  <layer id="1" name="Ground" width="15" height="15">\n` +
  `    <data encoding="csv">\n${rows.join(',\n')}\n    </data>\n` +
  `  </layer>\n</map>\n`;
writeFileSync(output, tmx);
console.log(`Wrote ${output}`);
