// New original v0.2 representative art. Does not read or reuse v0.1 SVG/PNG.
// Gate: both same-version preflight approvals must exist before writing images.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
for (const name of ['ART_PREFLIGHT.json','TECH_PREFLIGHT.json']) {
  const gate = JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
  if (gate.task_id !== 'UNIT-MENU-BASE-ASSET-001' || gate.decision !== 'APPROVED') throw new Error(`Gate failed: ${name}`);
}
const W=3072,H=1024,X0=768,X1=2304;
let seed=77641; const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const f=n=>Number(n).toFixed(1);
const attrs=o=>Object.entries(o).map(([k,v])=>`${k}="${v}"`).join(' ');
const pathEl=(d,o={})=>`<path d="${d}" ${attrs(o)}/>`;
const rect=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs(o)}/>`;
const ellipse=(cx,cy,rx,ry,o={})=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attrs(o)}/>`;
const line=(x1,y1,x2,y2,o={})=>`<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" ${attrs(o)}/>`;
const defs=`<defs>
<linearGradient id="sky" x2="0" y2="1"><stop stop-color="#091a3b"/><stop offset=".55" stop-color="#183e70"/><stop offset="1" stop-color="#42699d"/></linearGradient>
<linearGradient id="far" x2="0" y2="1"><stop stop-color="#173861"/><stop offset="1" stop-color="#466b9e"/></linearGradient>
<linearGradient id="mid" x2="0" y2="1"><stop stop-color="#18305a"/><stop offset="1" stop-color="#355f98"/></linearGradient>
<linearGradient id="near" x2="0" y2="1"><stop stop-color="#152b54"/><stop offset="1" stop-color="#36577e"/></linearGradient>
<linearGradient id="street" x2="0" y2="1"><stop stop-color="#a4a5b0"/><stop offset=".58" stop-color="#737f96"/><stop offset="1" stop-color="#546983"/></linearGradient>
<linearGradient id="stone" x2=".12" y2=".04" x1=".95" y1="1"><stop stop-color="#b6b4bc"/><stop offset=".38" stop-color="#9295aa"/><stop offset="1" stop-color="#536984"/></linearGradient>
<linearGradient id="river" x2="0" y2="1"><stop stop-color="#163e77"/><stop offset=".45" stop-color="#0e3270"/><stop offset="1" stop-color="#092757"/></linearGradient>
<linearGradient id="bank" x2="0" y2="1"><stop stop-color="#7389a0"/><stop offset="1" stop-color="#344d71"/></linearGradient>
<radialGradient id="moonGlow"><stop stop-color="#fff0b2" stop-opacity=".8"/><stop offset=".45" stop-color="#f9d995" stop-opacity=".28"/><stop offset="1" stop-color="#f2d594" stop-opacity="0"/></radialGradient>
<radialGradient id="moon"><stop stop-color="#fffbe4"/><stop offset=".66" stop-color="#fae6b8"/><stop offset="1" stop-color="#dfbc83"/></radialGradient>
<linearGradient id="mist" x2="0" y2="1"><stop stop-color="#7fa5cd" stop-opacity="0"/><stop offset=".5" stop-color="#98b6db" stop-opacity=".32"/><stop offset="1" stop-color="#b5c3dc" stop-opacity="0"/></linearGradient>
<clipPath id="sampleClip">${rect(X0,0,X1-X0,H)}</clipPath>
<mask id="waterCut"><rect x="768" y="0" width="1536" height="1024" fill="white"/><path d="M1404 604 Q1536 592 1668 604 L1690 850 L1382 850Z" fill="black"/></mask>
</defs>`;
const g={};
// Night sky and varied cloud bands. Right-shifted moon is original, not copied from reference.
let sky=rect(X0,0,X1-X0,550,{fill:'url(#sky)'});
for(let i=0;i<46;i++){const x=X0+rand()*1536,y=18+rand()*330,r=.6+rand()*2.0;sky+=ellipse(f(x),f(y),f(r),f(r),{fill:'#dbe7ff',opacity:f(.23+rand()*.47)});}
function cloud(x,y,s,opacity){return `<g opacity="${opacity}">${pathEl(`M${x} ${y+18*s} C${x+42*s} ${y+13*s} ${x+44*s} ${y-5*s} ${x+92*s} ${y+5*s} C${x+128*s} ${y-20*s} ${x+157*s} ${y+3*s} ${x+198*s} ${y+12*s} C${x+237*s} ${y+6*s} ${x+250*s} ${y+23*s} ${x+285*s} ${y+25*s} C${x+231*s} ${y+34*s} ${x+194*s} ${y+30*s} ${x+156*s} ${y+32*s} C${x+102*s} ${y+39*s} ${x+46*s} ${y+31*s} ${x} ${y+18*s}Z`,{fill:'#809ac3'})}${pathEl(`M${x+28*s} ${y+20*s}Q${x+140*s} ${y+8*s} ${x+251*s} ${y+25*s}`,{fill:'none',stroke:'#b0bde0','stroke-width':2*s,opacity:'.35'})}</g>`;}
sky+=cloud(805,120,0.68,.38)+cloud(1330,70,0.86,.32)+cloud(1870,178,.74,.39)+cloud(1015,305,.49,.24);
sky+=ellipse(1742,130,160,160,{fill:'url(#moonGlow)'});
sky+=ellipse(1742,130,64,64,{fill:'url(#moon)',stroke:'#fff1ca','stroke-width':'4'});
for(let i=0;i<11;i++){let x=1710+rand()*80,y=94+rand()*73,r=3+rand()*10;sky+=ellipse(f(x),f(y),f(r),f(r*.69),{fill:'#d5b883',opacity:'.25'});}
sky+=pathEl('M1680 144 Q1740 125 1806 147',{fill:'none',stroke:'#fff7da','stroke-width':2,opacity:'.37'});
g.UB_SKY=sky;
// Painterly layered mountain profiles with unequal peaks and hand-cut facets.
let dist='';
const mountain=(d,fill,stroke,opacity=1)=>pathEl(d,{fill,stroke,'stroke-width':3,opacity});
dist+=mountain('M768 515 L768 407 Q810 395 850 368 Q920 292 967 278 Q1012 310 1045 367 Q1090 328 1115 324 Q1170 354 1230 390 Q1300 302 1367 250 Q1420 294 1452 365 Q1530 317 1598 341 Q1645 307 1713 278 Q1770 302 1801 357 Q1884 276 1942 247 Q1980 290 2035 352 Q2090 319 2144 358 Q2232 331 2304 390 L2304 560 L768 560Z','url(#far)','#253f72',.8);
dist+=mountain('M768 535 Q835 512 878 469 Q940 432 993 375 Q1019 344 1040 382 Q1087 435 1130 438 Q1197 392 1255 413 Q1300 362 1343 310 Q1385 350 1422 425 Q1467 373 1507 403 Q1558 437 1590 417 Q1662 350 1710 346 Q1745 387 1768 444 Q1841 373 1912 322 Q1940 365 1994 412 Q2070 378 2112 408 Q2210 389 2304 435 L2304 584 L768 584Z','url(#mid)','#162d59',.85);
dist+=mountain('M768 565 Q842 526 912 531 Q978 507 1032 479 Q1104 485 1147 509 Q1200 466 1252 490 Q1310 473 1361 449 Q1400 476 1451 495 Q1508 483 1552 504 Q1604 462 1655 478 Q1727 465 1790 496 Q1859 451 1929 467 Q2023 475 2067 505 Q2152 468 2219 508 L2304 500 L2304 597 L768 597Z','url(#near)','#172c50',.97);
// Multiple soft horizontal mist layers, irregular to avoid a single flat strip.
for(const [y,h,o] of [[426,38,.55],[468,44,.47],[505,31,.38]]){dist+=pathEl(`M768 ${y+13} Q1000 ${y-11} 1240 ${y+8} T1740 ${y+3} T2304 ${y+10} L2304 ${y+h} Q1950 ${y+h-8} 1600 ${y+h+1} Q1160 ${y+h-4} 768 ${y+h}Z`,{fill:'url(#mist)',opacity:o});}
for(let i=0;i<22;i++){let x=790+rand()*1480,y=448+rand()*92,w=24+rand()*95;dist+=line(x,y,x+w,y-4+rand()*9,{stroke:'#aac0dc','stroke-width':1.2,opacity:f(.08+rand()*.17)});}
g.UB_DISTANCE=dist;
// Water: organic dark blue bands, small overlapping horizontal strokes and luminous broken reflection.
let water=rect(X0,780,1536,244,{fill:'url(#river)'});
water+=pathEl('M1400 604 Q1536 588 1672 604 L1692 836 Q1536 823 1380 836Z',{fill:'url(#river)'});
water+=pathEl('M1450 640 Q1536 630 1620 643 M1430 699 Q1527 678 1642 706 M1406 759 Q1536 737 1669 757',{fill:'none',stroke:'#6995c1','stroke-width':4,opacity:'.38'});
water+=pathEl('M768 823 Q930 814 1075 830 Q1260 812 1400 829 Q1550 813 1700 830 Q1900 810 2050 829 Q2165 812 2304 825',{fill:'none',stroke:'#4877ab','stroke-width':10,opacity:'.37'});
for(let i=0;i<225;i++){let x=768+rand()*1536,y=805+rand()*215,w=14+rand()*65;water+=pathEl(`M${f(x)} ${f(y)}q${f(w*.38)} ${f(-3-rand()*2)} ${f(w)} ${f(rand()*3-1)}`,{fill:'none',stroke:i%7===0?'#8ba9c5':'#5080af','stroke-width':f(.8+rand()*2.3),opacity:f(.15+rand()*.4),'stroke-linecap':'round'});}
for(let i=0;i<42;i++){const y=805+i*5.4,x=1570+(rand()-.5)*(20+i*7),w=5+rand()*(12+i*.45);water+=pathEl(`M${f(x)} ${f(y)}q${f(w*.45)} ${f(-rand()*2)} ${f(w)} ${f(rand()*2)}`,{fill:'none',stroke:i%3?'#f4d9a0':'#fff0c3','stroke-width':f(1+rand()*2.9),opacity:f(.34+rand()*.52),'stroke-linecap':'round'});}
g.UB_WATER=water;
// Ground: stone street, slight perspective and irregular translucent paving blocks.
let ground=pathEl('M768 566 Q1120 574 1290 574 L1785 574 Q2055 566 2304 572 L2304 783 L768 783Z',{fill:'url(#street)',stroke:'#71819c','stroke-width':5});
ground+=pathEl('M768 574 Q1300 585 1800 575 Q2110 572 2304 575',{fill:'none',stroke:'#c6bdc2','stroke-width':5,opacity:'.52'});
// Nonuniform joints, influenced by perspective but individually varied.
for(let row=0;row<5;row++){let y=594+row*36,x=768+(row%2?18:0);while(x<2304){let w=64+rand()*125;ground+=pathEl(`M${f(x)} ${f(y)}q${f(w*.4)} ${f(rand()*3-1)} ${f(w)} ${f(rand()*2-1)}`,{fill:'none',stroke:'#435875','stroke-width':f(1+rand()*1.25),opacity:f(.35+rand()*.2)});ground+=line(x+rand()*6,y,x+8+rand()*8,y+31,{stroke:'#556a86','stroke-width':f(.9+rand()*1.3),opacity:'.38'});x+=w;}}
for(let i=0;i<75;i++){let x=770+rand()*1530,y=592+rand()*174;ground+=pathEl(`M${f(x)} ${f(y)}l${f(9+rand()*22)} ${f(-1-rand()*3)}`,{fill:'none',stroke:i%4?'#b5b1ba':'#425b7b','stroke-width':f(.6+rand()*.9),opacity:f(.14+rand()*.28)});}
g.UB_GROUND=`<g mask="url(#waterCut)">${ground}</g>`;
// Shore wall separated from foreground water, with loose stone courses and low moss tufts.
let bank=rect(X0,762,1536,74,{fill:'url(#bank)',stroke:'#1f3554','stroke-width':4});
for(let row=0;row<3;row++){let y=772+row*21,x=768+(row%2?31:0);while(x<2304){let w=50+rand()*70;bank+=pathEl(`M${f(x)} ${f(y)}L${f(x+w)} ${f(y-1+rand()*3)} M${f(x)} ${f(y)}l${f(-2+rand()*5)} 18`,{fill:'none',stroke:'#293f60','stroke-width':f(1.4+rand()*.8),opacity:'.64'});x+=w;}}
bank+=rect(X0,831,1536,6,{fill:'#172f52'});
for(let i=0;i<28;i++){let x=785+rand()*1500,y=823+rand()*13;bank+=pathEl(`M${f(x)} ${f(y)}q${f(4+rand()*5)} ${f(-5-rand()*5)} ${f(7+rand()*10)} 0`,{fill:'none',stroke:'#4d786d','stroke-width':2,opacity:'.42'});}
g.UB_BANK=`<g mask="url(#waterCut)">${bank}</g>`;
// Bridge body with transparent real arch opening; shallow face leaves a visible walkable deck.
let bridge='';
const body='M1242 644 Q1350 622 1402 570 Q1470 513 1536 507 Q1603 515 1670 570 Q1724 622 1830 644 L1830 802 L1660 802 L1660 735 Q1645 673 1594 652 Q1536 631 1478 652 Q1427 673 1412 735 L1412 802 L1242 802 Z';
bridge+=pathEl(body,{fill:'url(#stone)',stroke:'#243b5d','stroke-width':6,'fill-rule':'evenodd'});
// Carve actual arch via mask rather than opaque dark paint.
const mask=`<mask id="archMask"><rect x="1200" y="480" width="670" height="350" fill="white"/><path d="M1412 803 L1412 735 Q1427 673 1478 652 Q1536 631 1594 652 Q1645 673 1660 735 L1660 803Z" fill="black"/></mask>`;
bridge=mask+`<g mask="url(#archMask)">`+bridge;
// Stone courses curve over arch, with bespoke irregular offsets.
for(let row=0;row<4;row++){let y=646+row*35,x=1260+(row%2)*31;while(x<1820){let w=52+rand()*63;bridge+=pathEl(`M${f(x)} ${f(y+rand()*5)}q${f(w*.48)} ${f(-5+rand()*8)} ${f(w)} ${f(1+rand()*3)}`,{fill:'none',stroke:'#405572','stroke-width':2.2,opacity:'.64'});bridge+=line(x+4,y+1,x+1+rand()*8,y+29,{stroke:'#465c77','stroke-width':1.6,opacity:'.55'});x+=w;}}
bridge+=pathEl('M1252 650 Q1380 629 1436 564 Q1490 525 1536 520 Q1584 526 1638 564 Q1696 630 1820 650',{fill:'none',stroke:'#d7c7b4','stroke-width':7,opacity:'.56'});
bridge+='</g>';
// Walkable stone deck top: legible broad surface with side ramps, not a hairline.
bridge+=pathEl('M1218 640 Q1340 622 1402 556 Q1477 490 1536 490 Q1597 496 1670 556 Q1742 623 1852 640 L1838 674 Q1714 663 1653 589 Q1590 543 1536 541 Q1480 541 1418 589 Q1354 663 1232 674Z',{fill:'#9ea9ba',stroke:'#314767','stroke-width':5});
bridge+=pathEl('M1231 645 Q1360 626 1422 562 Q1490 509 1536 509 Q1590 514 1654 563 Q1720 625 1839 645',{fill:'none',stroke:'#d8cbb8','stroke-width':5,opacity:'.72'});
for(let i=0;i<17;i++){let x=1260+i*34,y=610-100*Math.sin(Math.PI*(x-1242)/588);bridge+=pathEl(`M${f(x)} ${f(y)}l${f(-9+rand()*18)} 35`,{fill:'none',stroke:'#53677e','stroke-width':1.5,opacity:'.57'});}
g.UB_BRIDGE_BACK=bridge;
// Low parapets and rounded stone finials follow both slopes. Kept narrow to show deck.
let bridgeFront='';
for(let side=0;side<2;side++){let pts=side?[[1542,529],[1600,542],[1660,578],[1723,619],[1797,647]]:[[1276,647],[1349,619],[1412,578],[1472,542],[1530,529]];
  bridgeFront+=pathEl('M'+pts.map(p=>p.join(' ')).join(' L'),{fill:'none',stroke:'#354867','stroke-width':12,'stroke-linecap':'round','stroke-linejoin':'round'});
  bridgeFront+=pathEl('M'+pts.map(p=>[p[0],p[1]-5].join(' ')).join(' L'),{fill:'none',stroke:'#c8c3bc','stroke-width':6,'stroke-linecap':'round','stroke-linejoin':'round'});
  for(const [x,y] of pts){bridgeFront+=rect(x-7,y-15,14,31,{rx:4,fill:'#778ba6',stroke:'#273d5f','stroke-width':2});bridgeFront+=ellipse(x,y-17,8,6,{fill:'#d3cabe',stroke:'#344866','stroke-width':2});}
}
// Arch ring stones emphasize the open portal without closing it.
bridgeFront+=pathEl('M1399 791 L1399 734 Q1418 661 1472 639 Q1536 612 1600 639 Q1654 664 1673 734 L1673 791',{fill:'none',stroke:'#2b4160','stroke-width':21});
bridgeFront+=pathEl('M1403 789 L1403 733 Q1421 667 1474 646 Q1536 620 1598 646 Q1652 668 1669 733 L1669 789',{fill:'none',stroke:'#b5adb0','stroke-width':12});
for(let i=0;i<13;i++){let theta=Math.PI-(i/12)*Math.PI,x=1536+133*Math.cos(theta),y=751-113*Math.sin(theta);bridgeFront+=line(x,y,x+7*Math.cos(theta),y-10*Math.sin(theta),{stroke:'#50617d','stroke-width':2,opacity:'.7'});}
g.UB_BRIDGE_FRONT=bridgeFront;
// Far and near shore posts: stone, low and spaced, not continuous tall fence.
let railBack='',railFront='';
for(const [a,b] of [[768,1200],[1867,2304]]){
  railBack+=pathEl(`M${a} 574 Q${(a+b)/2} 568 ${b} 575`,{fill:'none',stroke:'#4b607c','stroke-width':9});
  railBack+=pathEl(`M${a} 570 Q${(a+b)/2} 564 ${b} 571`,{fill:'none',stroke:'#b4b2b7','stroke-width':4});
  for(let x=a+35;x<b;x+=91){railBack+=rect(x-5,555,11,27,{rx:3,fill:'#8794aa',stroke:'#394f70','stroke-width':2});railBack+=ellipse(x,554,8,6,{fill:'#c7c1bc',stroke:'#425571','stroke-width':2});}
  for(let x=a+42;x<b;x+=112){railFront+=rect(x-10,735,20,46,{rx:3,fill:'url(#stone)',stroke:'#243b5c','stroke-width':3});railFront+=ellipse(x,733,11,8,{fill:'#bcbabd',stroke:'#2b4160','stroke-width':3});}
  // Hanging dark chain between short foreground stone posts.
  for(let x=a+42;x<b-70;x+=112){railFront+=pathEl(`M${x+10} 753 Q${x+58} 777 ${x+102} 753`,{fill:'none',stroke:'#293853','stroke-width':3,opacity:'.82'});}
}
g.UB_RAIL_BACK=railBack;g.UB_RAIL_FRONT=railFront;
const order=['UB_SKY','UB_DISTANCE','UB_WATER','UB_GROUND','UB_BANK','UB_RAIL_BACK','UB_BRIDGE_BACK','UB_BRIDGE_FRONT','UB_RAIL_FRONT'];
const wrap=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}<g clip-path="url(#sampleClip)">${body}</g></svg>`;
const source=wrap(order.map(k=>`<g id="${k}">${g[k]}</g>`).join(''));
const srcPath=path.join(root,'source','street_center_sample_master.svg');
fs.mkdirSync(path.dirname(srcPath),{recursive:true});
fs.writeFileSync(srcPath,source,'utf8');
const out=path.join(root,'preview');fs.mkdirSync(out,{recursive:true});
const layers=path.join(root,'sample_layers');fs.mkdirSync(layers,{recursive:true});
async function run(){
  const full=await sharp(Buffer.from(source)).png().toBuffer();
  await sharp(full).extract({left:X0,top:0,width:1536,height:1024}).png().toFile(path.join(out,'sample_center.png'));
  await sharp(full).extract({left:1269,top:38,width:533,height:948}).resize(720,1280).png().toFile(path.join(out,'sample_phone_center.png'));
  for(const k of order){const s=wrap(`<g id="${k}">${g[k]}</g>`);const buf=await sharp(Buffer.from(s)).extract({left:X0,top:0,width:1536,height:1024}).png().toBuffer();await fs.promises.writeFile(path.join(layers,`${k}.png`),buf);}
  const files=[srcPath,path.join(out,'sample_center.png'),path.join(out,'sample_phone_center.png'),...order.map(k=>path.join(layers,`${k}.png`))];
  const m={taskId:'UNIT-MENU-BASE-ASSET-001',version:'v0.2',scope:'representative-sample-only',world:{width:W,height:H},crop:{x:X0,y:0,width:1536,height:1024},files:{}};
  for(const file of files){const b=fs.readFileSync(file);m.files[path.relative(root,file).replaceAll('\\','/')]=crypto.createHash('sha256').update(b).digest('hex');}
  fs.writeFileSync(path.join(root,'SAMPLE_EXPORT_MANIFEST.json'),JSON.stringify(m,null,2));
  process.stdout.write(`sample=${path.join(out,'sample_center.png')}\nphone=${path.join(out,'sample_phone_center.png')}\n`);
}
run().catch(e=>{console.error(e);process.exit(1)});
