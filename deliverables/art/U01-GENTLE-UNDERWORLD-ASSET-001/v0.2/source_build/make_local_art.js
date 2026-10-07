// U01 v0.1: original editable vector strokes for five approved small additions.
// SVG paths are the artwork source; only transparent full-canvas raster results
// are assembled into the continuing PSD.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = __dirname;
const source = path.join(root, 'editable_strokes');
const raster = path.join(root, 'local_layers');
fs.mkdirSync(source, { recursive: true });
fs.mkdirSync(raster, { recursive: true });

function svg(body, defs='') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2172" height="724" viewBox="0 0 2172 724">
<defs>${defs}</defs>${body}</svg>`;
}

const flowerDefs = `
<radialGradient id="petal"><stop offset="0" stop-color="#e29b89"/><stop offset=".48" stop-color="#b76e80"/><stop offset="1" stop-color="#633f69"/></radialGradient>
<linearGradient id="leaf" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#67999a"/><stop offset=".47" stop-color="#397277"/><stop offset="1" stop-color="#173e52"/></linearGradient>
<filter id="soft"><feGaussianBlur stdDeviation=".55"/></filter>`;
const flowerLeft = svg(`
<g stroke-linecap="round" stroke-linejoin="round">
  <path d="M930 477 C931 467 931 459 932 451 M943 477 C941 464 942 455 941 447"
    fill="none" stroke="#173e51" stroke-width="3.3"/>
  <path d="M930 477 C931 467 931 459 932 451 M943 477 C941 464 942 455 941 447"
    fill="none" stroke="#64998c" stroke-width="1.15" opacity=".8"/>
  <path d="M930 464 Q922 456 921 460 Q922 467 930 468 Q926 466 922 461"
    fill="url(#leaf)" stroke="#173d52" stroke-width=".85"/>
  <path d="M940 465 Q947 457 948 459 Q947 468 941 470"
    fill="url(#leaf)" stroke="#173d52" stroke-width=".85"/>
  <path d="M933 454 Q926 452 927 445 Q930 442 933 447 Q935 441 940 443 Q942 450 935 453 Z"
    fill="#693f65" opacity=".55" filter="url(#soft)"/>
  <path d="M932 452 C927 449 926 446 929 443 C932 442 933 447 933 450
           C932 444 935 440 938 440 C941 443 938 449 934 451
           C938 447 942 447 944 450 C941 454 937 455 934 453
           C930 455 927 453 925 450 C928 448 930 450 932 452 Z"
    fill="url(#petal)" stroke="#593c65" stroke-width=".8"/>
  <path d="M929 446 Q931 449 933 450 M936 443 Q935 447 934 449 M939 450 Q936 451 934 452"
    fill="none" stroke="#f1b18e" stroke-width=".75" opacity=".65"/>
  <circle cx="933.5" cy="451" r="1.45" fill="#f2bd92" opacity=".9"/>
  <path d="M941 448 Q938 446 940 442 Q942 441 943 445 Q945 442 947 445 Q947 448 943 450 Z"
    fill="url(#petal)" stroke="#593c65" stroke-width=".7"/>
  <circle cx="943" cy="447" r=".85" fill="#efd09f"/>
  <path d="M925 473 Q928 468 933 471 Q936 467 941 472 Q945 468 948 473
           Q942 477 938 475 Q933 479 928 475 Z"
    fill="#173e4d" opacity=".88"/>
  <path d="M927 472 Q930 470 933 473 M940 473 Q943 470 946 472"
    fill="none" stroke="#4c807d" stroke-width=".85" opacity=".65"/>
</g>`, flowerDefs);

const flowerRight = svg(`
<g stroke-linecap="round" stroke-linejoin="round" transform="translate(50.04 0) scale(.96 1)">
  <path d="M1234 478 C1234 468 1235 458 1234 449 M1246 477 C1245 464 1247 454 1246 446"
    fill="none" stroke="#183c50" stroke-width="3.1"/>
  <path d="M1234 478 C1234 468 1235 458 1234 449 M1246 477 C1245 464 1247 454 1246 446"
    fill="none" stroke="#639488" stroke-width="1.1" opacity=".8"/>
  <path d="M1234 467 Q1227 459 1225 461 Q1227 469 1233 471"
    fill="url(#leaf)" stroke="#173d52" stroke-width=".85"/>
  <path d="M1245 467 Q1250 460 1252 462 Q1251 470 1246 471"
    fill="url(#leaf)" stroke="#173d52" stroke-width=".85"/>
  <path d="M1234 450 C1229 447 1227 444 1231 441 C1234 441 1234 447 1235 448
           C1234 443 1237 439 1240 440 C1243 443 1239 447 1237 449
           C1241 445 1244 446 1246 449 C1243 452 1239 452 1237 451
           C1233 453 1230 452 1229 449 Z"
    fill="url(#petal)" stroke="#5c3b61" stroke-width=".8"/>
  <path d="M1231 444 Q1233 446 1235 449 M1239 441 Q1238 445 1236 448 M1242 449 Q1239 450 1237 450"
    fill="none" stroke="#eeb098" stroke-width=".7" opacity=".68"/>
  <circle cx="1236" cy="449" r="1.35" fill="#f0c092"/>
  <path d="M1246 449 C1242 447 1242 444 1245 442 Q1248 442 1248 445 Q1251 444 1252 447 Q1250 451 1246 449 Z"
    fill="url(#petal)" stroke="#593c65" stroke-width=".65"/>
  <circle cx="1247" cy="447" r=".8" fill="#efd09f"/>
  <path d="M1225 473 Q1229 469 1234 473 Q1238 469 1242 474
           Q1247 469 1251 474 Q1249 478 1244 476 Q1236 479 1232 475 Q1228 477 1225 473 Z"
    fill="#173d4d" opacity=".87"/>
  <path d="M1228 473 Q1231 470 1234 473 M1245 474 Q1248 471 1251 473"
    fill="none" stroke="#4d7c78" stroke-width=".75" opacity=".62"/>
</g>`, flowerDefs);

const carving = svg(`
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <!-- three separate curved petals, a small calyx, and one flowing water cut -->
  <path d="M1091 456 Q1087 451 1091 446 Q1095 451 1091 456 Z
           M1090 457 Q1084 456 1082 450 Q1087 450 1090 457 Z
           M1093 457 Q1098 455 1100 450 Q1095 451 1093 457 Z
           M1084 458 Q1091 461 1098 458
           M1078 462 Q1085 459 1091 461 Q1098 464 1106 460"
    stroke="#23384e" stroke-width="2.4" opacity=".8"/>
  <path d="M1091 455 Q1088 450 1091 445 Q1094 450 1091 455 Z
           M1089 456 Q1084 454 1082 449 Q1087 450 1089 456 Z
           M1093 456 Q1097 454 1100 449 Q1095 450 1093 456 Z
           M1084 457 Q1091 460 1098 457
           M1077 461 Q1085 458 1091 460 Q1099 463 1105 459"
    stroke="#94aaa6" stroke-width=".95" opacity=".78"/>
  <path d="M1080 460 Q1082 459 1084 459 M1100 458 L1103 457"
    stroke="#c5b8a2" stroke-width=".65" opacity=".4"/>
</g>`);

const waystone = svg(`
<defs>
 <linearGradient id="stone" x1=".08" y1=".04" x2=".84" y2=".94"><stop stop-color="#748c9b"/><stop offset=".4" stop-color="#4c687a"/><stop offset="1" stop-color="#223d55"/></linearGradient>
 <linearGradient id="moss" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7caa8d"/><stop offset=".6" stop-color="#47746c"/><stop offset="1" stop-color="#294e58"/></linearGradient>
 <filter id="haze"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>
<g stroke-linecap="round" stroke-linejoin="round" transform="translate(14.2 0) scale(.9 1)">
 <ellipse cx="142" cy="483" rx="22" ry="5" fill="#061f36" opacity=".4" filter="url(#haze)"/>
 <path d="M120 477 Q122 470 128 466 Q134 460 145 461
          Q157 461 163 469 Q165 475 161 480 Q150 485 135 483 Q124 482 120 477 Z"
   fill="url(#stone)" stroke="#172e47" stroke-width="1.8"/>
 <path d="M124 472 Q131 461 146 463 Q155 463 160 469 Q150 466 137 468 Q130 472 127 479"
   fill="#a3afb0" opacity=".17"/>
 <path d="M123 478 Q136 482 153 480 M152 463 Q158 465 161 470"
   fill="none" stroke="#a8b8b0" stroke-width="1.0" opacity=".38"/>
 <path d="M135 475 Q139 474 142 470 Q145 474 150 474
          M142 470 Q140 468 141 466 Q143 467 143 469 Q145 467 147 467
          M137 477 Q143 478 149 476"
   fill="none" stroke="#213d52" stroke-width="1.55" opacity=".7"/>
 <path d="M135 474 Q139 473 142 469 Q145 473 150 473
          M141 468 L141 466 M144 468 L147 466 M137 476 Q143 477 149 475"
   fill="none" stroke="#9fbdb3" stroke-width=".65" opacity=".65"/>
 <path d="M120 475 Q127 473 130 479 Q137 478 140 483 Q130 485 121 481 Z
          M152 482 Q157 474 164 474 Q164 481 155 484 Z"
   fill="url(#moss)" stroke="#173f48" stroke-width=".8"/>
 <path d="M119 479 Q124 476 129 480 M155 481 Q160 476 164 476"
   fill="none" stroke="#9bb78e" stroke-width=".8" opacity=".7"/>
 <path d="M116 479 Q120 476 124 478 Q125 482 130 484 Q122 485 116 482 Z
          M159 481 Q165 476 168 478 Q168 483 160 484 Z"
   fill="#1f5061" opacity=".72"/>
</g>`);

const plaque = svg(`
<defs>
 <filter id="grain"><feGaussianBlur stdDeviation=".4"/></filter>
</defs>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
 <!-- 手写“忘”：深色微偏移如浅刻，米金双层笔触保留不均匀粗细。 -->
 <g transform="translate(.7 1)" stroke="#452d31" opacity=".72">
  <path d="M2051 255 L2052 257 M2044 260 Q2052 259 2061 260
    M2047 261 Q2046 265 2048 266 Q2055 266 2060 265
    M2049 270 Q2047 273 2047 275 M2053 269 Q2054 273 2057 275
    M2061 270 Q2063 272 2063 274" stroke-width="2.8"/>
  <path d="M2069 259 Q2070 267 2067 273 M2076 258 Q2076 267 2075 274
    M2083 257 Q2082 266 2084 275" stroke-width="3"/>
 </g>
 <g stroke="#d5b78a">
  <path d="M2051 255 L2052 257 M2044 260 Q2052 259 2061 260
    M2047 261 Q2046 265 2048 266 Q2055 266 2060 265
    M2049 270 Q2047 273 2047 275 M2053 269 Q2054 273 2057 275
    M2061 270 Q2063 272 2063 274" stroke-width="1.6"/>
  <path d="M2069 259 Q2070 267 2067 273 M2076 258 Q2076 267 2075 274
    M2083 257 Q2082 266 2084 275" stroke-width="1.8"/>
 </g>
 <g stroke="#f1d4a2" opacity=".63" filter="url(#grain)">
  <path d="M2045 259.7 Q2052 258.8 2060 259.7 M2048 265.1 Q2054 265.4 2058 264.6
    M2068.5 259 Q2069 266 2067 270 M2075.5 258 Q2076 265 2075 270
    M2082.5 257 Q2082 265 2083.5 272" stroke-width=".7"/>
 </g>
</g>`);

const works = [
  ['gu01_left_flower', flowerLeft],
  ['gu01_right_flower', flowerRight],
  ['gu02_bridge_carving', carving],
  ['gu03_waystone', waystone],
  ['gu04_plaque_lettering', plaque],
];

async function main() {
  for (const [name, content] of works) {
    const src = path.join(source, name + '.svg');
    const dst = path.join(raster, name + '.png');
    fs.writeFileSync(src, content, 'utf8');
    await sharp(Buffer.from(content)).png().toFile(dst);
    console.log(name + ' -> ' + dst);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
