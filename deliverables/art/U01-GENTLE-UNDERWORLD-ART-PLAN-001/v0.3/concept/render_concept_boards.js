// Gate1-only visual communication. Never use these rendered pixels as production assets.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const here = __dirname;
const repo = path.resolve(here, '../../../../..');
const base = path.join(repo, 'deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png');
const source = path.join(repo, 'deliverables/art/U01-GENTLE-UNDERWORLD-ASSET-001/v0.3/source_build/editable_strokes');
const xml = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const b64 = b => `data:image/png;base64,${b.toString('base64')}`;
async function crop(left, top, width, height) {
  return b64(await sharp(base).extract({left, top, width, height}).png().toBuffer());
}
function letterPaths(key) {
  const src = fs.readFileSync(path.join(source, `U01_PROP_FENGDU_LETTERS_${key}.svg`), 'utf8');
  const paths = [...src.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
  // U+9146 酆 is ⿰豐阝. The old concept skeleton compressed the right 邑/阝
  // until it nearly vanished at plaque size. Make its top bend, outward bowl,
  // and long vertical unmistakable; do the same for 都's right 阝.
  if (key === 'feng') return [
    'M2 5 L13 5 M3 2 L3 10 M7 2 L7 10 M11 2 L11 10 M2 11 L13 11 M3 14 L12 14 L12 20 L3 20 Z M5 23 L12 23 M5 24 L3 28 M10 24 L12 28 M2 29 L13 29',
    'M17 3 L27 3 L22 11 Q27 14 27 18 Q27 23 22 25 M17 3 L17 29'
  ];
  if (key === 'du') return [paths[0],
    'M17 3 L27 3 L22 11 Q27 14 27 18 Q27 23 22 25 M17 3 L17 29'];
  return [paths[0], paths[2]];
}
function svgShell(w,h,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#141c2e"/>${body}</svg>`;
}
function glyphs(cx,cy,scale,style) {
  const keys=['feng','du','cheng']; let out='';
  keys.forEach((key,i)=>{
    const cfg={
      A:{w:1.55,c:'#f5dfb4',cap:'round',join:'round',shadow:'#7b6170',dx:20,sx:.60,sy:.52,skew:0},
      B:{w:3.45,c:'#f6e0b8',cap:'round',join:'round',shadow:'#744c50',dx:22,sx:.62,sy:.53,skew:0},
      C:{w:2.20,c:'#f3d5a2',cap:'square',join:'bevel',shadow:'#59475c',dx:21,sx:.59,sy:.54,skew:-11},
      D:{w:2.65,c:'#e9d6bb',cap:'butt',join:'miter',shadow:'#414757',dx:21,sx:.60,sy:.50,skew:0}
    }[style];
    const ds=letterPaths(key); const x=cx+(2036+i*cfg.dx-1970)*scale, y=cy+(259-215)*scale;
    let transform=`translate(${x} ${y}) scale(${cfg.sx*scale} ${cfg.sy*scale})`;
    if(cfg.skew) transform += ` skewX(${cfg.skew})`;
    out+=`<g transform="${transform}">`;
    for(const d of ds){
      out+=`<path d="${d}" transform="translate(.65 .7)" fill="none" stroke="${cfg.shadow}" stroke-width="${cfg.w+1.0}" stroke-linecap="${cfg.cap}" stroke-linejoin="${cfg.join}" opacity=".75"/>`;
      out+=`<path d="${d}" fill="none" stroke="${cfg.c}" stroke-width="${cfg.w}" stroke-linecap="${cfg.cap}" stroke-linejoin="${cfg.join}"/>`;
    }
    if(style==='C') out+=`<path d="M2 5 L13 5 M3 14 L12 14 M3 29 L13 29" fill="none" stroke="#fff0ce" stroke-width=".45" opacity=".8"/>`;
    out+='</g>';
  });
  return out;
}
async function letteringBoard(){
  const img=await crop(1970,215,170,110);
  const cards=[
    {x:42,y:112,k:'A',title:'A  FLOWING',desc:'light / open / gentle'},
    {x:666,y:112,k:'B',title:'B  ROUNDED',desc:'soft / warm / carved'},
    {x:42,y:502,k:'C',title:'C  BRUSH',desc:'rhythm / angled / warm'},
    {x:666,y:502,k:'D',title:'D  STONE',desc:'square / calm / quiet'}
  ];
  let s=`<text x="42" y="48" fill="#f5e7d3" font-family="sans-serif" font-size="27" font-weight="700">FENGDU LETTERING OPTIONS</text><text x="43" y="77" fill="#bac3d2" font-family="sans-serif" font-size="17">Gate1 concept only · project-authored path skeleton · not a font file or production cut</text>`;
  for(const c of cards){
    s+=`<rect x="${c.x}" y="${c.y}" width="592" height="355" rx="13" fill="#263147" stroke="#667993" stroke-width="1.5"/>`;
    s+=`<image href="${img}" x="${c.x+35}" y="${c.y+15}" width="510" height="330"/>`;
    s+=glyphs(c.x+35,c.y+15,3,c.k);
    s+=`<rect x="${c.x+30}" y="${c.y+273}" width="525" height="69" rx="7" fill="#172137" opacity=".92"/>`;
    s+=`<text x="${c.x+48}" y="${c.y+301}" fill="#fff0d3" font-family="sans-serif" font-size="23" font-weight="700">${xml(c.title)}</text>`;
    s+=`<text x="${c.x+49}" y="${c.y+326}" fill="#bac8db" font-family="sans-serif" font-size="17">${xml(c.desc)}</text>`;
  }
  s+=`<text x="42" y="912" fill="#f5e7d3" font-family="sans-serif" font-size="22" font-weight="700">1:1 SOURCE-SCALE CHECK</text>`;
  s+=`<text x="42" y="935" fill="#bac3d2" font-family="sans-serif" font-size="15">For plaque legibility only; final phone views still require the produced PSD and cut.</text>`;
  cards.forEach((c,i)=>{
    const x=42+i*308,y=948;
    s+=`<rect x="${x}" y="${y}" width="284" height="127" rx="8" fill="#263147" stroke="#667993"/>`;
    s+=`<image href="${img}" x="${x+8}" y="${y+8}" width="170" height="110"/>`;
    s+=glyphs(x+8,y+8,1,c.k);
    s+=`<text x="${x+193}" y="${y+69}" fill="#fff0d3" font-family="sans-serif" font-size="32" font-weight="700">${c.k}</text>`;
  });
  const svg=svgShell(1300,1090,s);
  fs.writeFileSync(path.join(here,'lettering_options.svg'),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(here,'lettering_options.png'));
}
async function directionBoard(){
  const bridge=await crop(950,385,300,190), banner=await crop(620,300,250,250);
  let s=`<text x="35" y="45" fill="#f5e7d3" font-family="sans-serif" font-size="26" font-weight="700">BRIDGE PLAQUE + BANNER DIRECTION</text><text x="35" y="73" fill="#bac3d2" font-family="sans-serif" font-size="16">Gate1 sketch over approved scene · not a PSD sample or production image</text>`;
  s+=`<rect x="30" y="107" width="650" height="480" rx="12" fill="#283448" stroke="#7385a2"/><image href="${bridge}" x="55" y="134" width="600" height="380"/>`;
  // The bridge proposal is an independent low stone plaque, aligned to the arch. Coordinates remain in existing box.
  s+=`<g transform="translate(55 134) scale(2)">`;
  s+=`<path d="M83 47 Q134 39 188 47 L186 68 Q134 74 84 68 Z" fill="#273448" opacity=".6" transform="translate(1 3)"/>`;
  s+=`<path d="M83 47 Q134 39 188 47 Q192 54 186 68 Q135 74 84 68 Q81 58 83 47 Z" fill="#607385" stroke="#303d53" stroke-width="2.3"/>`;
  s+=`<path d="M88 49 Q136 42 184 49 M89 66 Q135 70 181 66" fill="none" stroke="#b6a693" stroke-width="1.3" opacity=".48"/>`;
  s+=`<path d="M100 50 L100 47 M170 50 L170 47" fill="none" stroke="#788da0" stroke-width="2"/>`;
  const oldBridgeLetters=fs.readFileSync(path.join(source,'U01_PROP_BRIDGE_SIGN_letters.svg'),'utf8');
  let letterGroups=oldBridgeLetters.slice(oldBridgeLetters.indexOf('<g '),oldBridgeLetters.lastIndexOf('</svg>'));
  letterGroups=letterGroups.replaceAll('translate(1045 432)','translate(95 47)').replaceAll('translate(1072 432)','translate(122 47)').replaceAll('translate(1098 432)','translate(148 47)').replaceAll('#fae5ba','#d9d4c3').replaceAll('#c69b68','#6d7180');
  s+=letterGroups;
  s+=`</g>`;
  s+=`<rect x="710" y="107" width="455" height="480" rx="12" fill="#283448" stroke="#7385a2"/><image href="${banner}" x="742" y="134" width="390" height="390"/>`;
  s+=`<g transform="translate(742 134) scale(1.56)">`;
  s+=`<path d="M80 33 Q78 105 79 209" fill="none" stroke="#72566a" stroke-width="5" stroke-linecap="round"/><path d="M80 34 Q94 32 111 35" fill="none" stroke="#caa775" stroke-width="3" stroke-linecap="round"/><path d="M72 210 Q80 205 88 210 L91 213 L69 213 Z" fill="#657187" stroke="#36465c" stroke-width="1.5"/>`;
  s+=`<path d="M85 37 Q97 40 101 37 Q98 62 103 83 Q98 100 94 117 Q90 105 86 112 Q91 87 86 67 Z" fill="#dbe3d9" stroke="#667e91" stroke-width="1.4" opacity=".94"/>`;
  s+=`<path d="M101 39 Q108 42 116 39 Q112 62 115 81 Q111 92 110 100 Q107 90 103 97 Q106 71 101 39 Z" fill="#aabfd0" stroke="#627a90" stroke-width="1.2" opacity=".88"/>`;
  s+=`<path d="M83 39 Q93 43 104 39" fill="none" stroke="#e2bc88" stroke-width="3"/><circle cx="82" cy="33" r="4" fill="#c9a56f"/>`;
  s+=`</g>`;
  s+=`<rect x="55" y="528" width="600" height="42" rx="6" fill="#172137" opacity=".92"/><text x="73" y="555" fill="#f3e0c6" font-family="sans-serif" font-size="18">Low blue-gray stone relief · follows bridge curve</text>`;
  s+=`<rect x="742" y="528" width="390" height="42" rx="6" fill="#172137" opacity=".92"/><text x="760" y="555" fill="#f3e0c6" font-family="sans-serif" font-size="18">Two short, soft guide ribbons</text>`;
  const svg=svgShell(1195,617,s);
  fs.writeFileSync(path.join(here,'bridge_banner_direction.svg'),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(here,'bridge_banner_direction.png'));
}
(async()=>{await letteringBoard();await directionBoard();})().catch(e=>{console.error(e);process.exitCode=1;});
