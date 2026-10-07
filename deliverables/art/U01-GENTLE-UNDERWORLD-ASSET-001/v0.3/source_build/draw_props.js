// Original, path-only illustration source for U01 v0.3. No font or external image.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = __dirname;
const W = 2172, H = 724;
function svg(body) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`; }
function g(x,y,body) { return `<g transform="translate(${x} ${y})">${body}</g>`; }
function pathStroke(d, color='#f6e4b8', width=2.7, extra='') { return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`; }
function pathFill(d, color) { return `<path d="${d}" fill="${color}"/>`; }
function line(x1,y1,x2,y2,c='#f6e4b8',w=2.6) { return pathStroke(`M${x1} ${y1} L${x2} ${y2}`,c,w); }
function glyph(name) {
  const c='#fae5ba', h='#c69b68';
  let s='';
  const add=(d,w=2.6)=>{s+=pathStroke(d,c,w)+pathStroke(d,h,.55,'transform="translate(.45 .65)" opacity=".38"');};
  if(name==='奈'){
    add('M11 2 Q10 9 8 11 M3 9 Q11 7 20 8 M11 8 Q8 14 2 16 M11 8 Q15 14 22 16');
    add('M5 18 L18 18 M4 22 L20 22 M11 22 L11 29 M7 25 L3 29 M15 25 L20 29',2.35);
  } else if(name==='何'){
    add('M7 2 Q5 9 2 12 M5 9 L5 29 M10 5 L21 5 M19 5 L19 27 Q19 29 16 28');
    add('M10 11 L16 11 L16 22 L10 22 Z',2.15);
  } else if(name==='桥'){
    add('M5 2 L5 29 M1 9 L9 9 M5 11 Q3 18 1 21 M6 15 L9 18');
    add('M13 5 Q18 4 21 2 M10 10 L23 10 M15 10 Q13 16 10 18 M18 10 Q20 16 24 18');
    add('M14 19 Q14 25 10 29 M20 19 L20 29',2.35);
  } else if(name==='黄'){
    add('M3 4 L21 4 M8 1 L8 8 M16 1 L16 8 M4 9 L20 9 M6 9 L6 21 M18 9 L18 21 M6 15 L18 15 M6 21 L18 21');
    add('M9 23 L4 29 M15 23 L21 29',2.25);
  } else if(name==='泉'){
    add('M10 2 L14 2 M5 6 L19 6 L19 18 L5 18 Z M5 12 L19 12');
    add('M12 19 L12 29 M9 22 Q7 27 2 29 M15 21 Q18 26 23 28 M2 21 L8 21 M17 22 L22 19',2.2);
  } else if(name==='路'){
    add('M2 5 L10 5 L10 14 L2 14 Z M6 14 L6 27 M2 19 L10 19 M2 26 L11 28',2.2);
    add('M16 2 Q14 7 11 9 M15 6 L22 6 Q20 12 13 15 M12 10 Q17 15 23 16 M13 20 L22 20 L22 28 L13 28 Z',2.15);
  } else if(name==='酆'){
    add('M2 5 L13 5 M3 2 L3 10 M7 2 L7 10 M11 2 L11 10 M2 11 L13 11 M3 14 L12 14 L12 20 L3 20 Z M5 23 L12 23 M7 21 L7 28 M3 29 L13 29',1.8);
    add('M16 3 L23 3 L20 10 L23 15 L19 20 M16 3 L16 29 M16 12 L20 10',1.8);
  } else if(name==='都'){
    add('M2 5 L13 5 M7 2 L7 14 M2 12 L14 12 M12 2 Q10 11 2 16 M3 18 L12 18 L12 28 L3 28 Z M3 23 L12 23',2.0);
    add('M17 3 L23 3 L20 10 L23 15 L19 20 M17 3 L17 29',2.0);
  } else if(name==='城'){
    add('M2 10 L10 10 M6 3 L6 28 M2 27 L11 23',2.15);
    add('M13 7 L21 7 M13 7 L13 20 Q12 26 10 28 M16 12 L21 12 M17 3 Q17 18 23 27 M22 10 Q21 18 15 25',2.0);
  }
  return s;
}
const defs=`<defs><linearGradient id="wood" x2=".1" y2="1"><stop stop-color="#ad8162"/><stop offset=".45" stop-color="#79536b"/><stop offset="1" stop-color="#46394f"/></linearGradient><linearGradient id="edge" x2="0" y2="1"><stop stop-color="#d6ab78"/><stop offset="1" stop-color="#705167"/></linearGradient></defs>`;
const items={
 'U01_PROP_BRIDGE_SIGN_ties':svg(g(0,4,`<path d="M1052 416 Q1049 423 1052 435 M1123 417 Q1128 424 1122 435" fill="none" stroke="#382f47" stroke-width="5" stroke-linecap="round"/>${pathStroke('M1052 416 Q1049 424 1052 434 M1123 417 Q1127 424 1122 434','#d6ad74',2.2)}<circle cx="1052" cy="417" r="3.3" fill="#b48561" stroke="#423448" stroke-width="1.3"/><circle cx="1123" cy="417" r="3.3" fill="#b48561" stroke="#423448" stroke-width="1.3"/>`)),
 'U01_PROP_BRIDGE_SIGN_board':svg(defs+g(-1,0,`<path d="M1030 431 Q1086 426 1143 431 L1145 459 Q1086 466 1029 459 Z" fill="#262b40" opacity=".48" transform="translate(2 4)"/><path d="M1029 428 Q1085 425 1145 429 L1146 458 Q1085 463 1028 458 Z" fill="url(#wood)" stroke="#3c3248" stroke-width="2.2"/><path d="M1033 432 Q1088 428 1141 433 L1141 454 Q1085 459 1033 454 Z" fill="none" stroke="url(#edge)" stroke-width="1.7" opacity=".85"/><path d="M1042 436 Q1078 433 1107 435 M1116 437 L1134 438 M1039 451 Q1086 455 1136 451" fill="none" stroke="#ba8e72" stroke-width=".9" opacity=".37"/><circle cx="1042" cy="442" r="1.8" fill="#d3ae7e"/><circle cx="1131" cy="442" r="1.8" fill="#d3ae7e"/>`)),
 'U01_PROP_BRIDGE_SIGN_letters':svg(`<g transform="translate(1045 432) scale(.75 .72)">${glyph('奈')}</g><g transform="translate(1072 432) scale(.75 .72)">${glyph('何')}</g><g transform="translate(1098 432) scale(.75 .72)">${glyph('桥')}</g>`)
};
function lantern(id,x,y,k){
 const t=`translate(${x} ${y}) scale(${k})`;
 const defs=`<defs><radialGradient id="halo"><stop stop-color="#ffe5a0" stop-opacity=".38"/><stop offset=".55" stop-color="#f6b864" stop-opacity=".15"/><stop offset="1" stop-color="#f6b864" stop-opacity="0"/></radialGradient><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#f9dfaa"/><stop offset=".55" stop-color="#f5bb74"/><stop offset="1" stop-color="#9e7181"/></linearGradient></defs>`;
 return {
  [`${id}_glow`]:svg(defs+`<g transform="${t}"><ellipse cx="22" cy="25" rx="21" ry="27" fill="url(#halo)"/></g>`),
  [`${id}_shade`]:svg(defs+`<g transform="${t}"><path d="M10 15 Q11 5 22 4 Q33 5 34 15 L32 40 Q26 45 18 43 L12 40 Z" fill="url(#paper)" stroke="#6d5c75" stroke-width="1.9"/><path d="M12 15 Q22 12 33 15 M13 38 Q22 42 31 38 M22 5 Q20 23 22 42" fill="none" stroke="#ffe9bc" stroke-width="1.1" opacity=".63"/><path d="M14 14 Q16 8 21 8 M27 9 Q31 12 32 18" fill="none" stroke="#fff1cb" stroke-width="1.2" opacity=".7"/></g>`),
  [`${id}_tail`]:svg(`<g transform="${t}"><path d="M18 43 Q22 47 27 43 M20 46 Q19 51 17 55 M25 46 Q26 51 28 54" fill="none" stroke="#d5a377" stroke-width="1.5" stroke-linecap="round"/><circle cx="22" cy="46" r="1.5" fill="#ffe3a6"/></g>`)
 };
}
function extraItems(){
 let a={...lantern('U01_PROP_LANTERN_A',771,165,1),...lantern('U01_PROP_LANTERN_B',1260,186,.82)};
 a['U01_PROP_SOUL_BANNER_pole']=svg(`<path d="M700 343 L700 498" stroke="#252d49" stroke-width="6" stroke-linecap="round"/><path d="M700 343 L700 498" stroke="#b18a71" stroke-width="3.2" stroke-linecap="round"/><circle cx="700" cy="340" r="5" fill="#d5b183" stroke="#3e3a52" stroke-width="1.8"/><path d="M691 498 Q700 493 710 499 L713 503 L688 503 Z" fill="#463e57" stroke="#827080" stroke-width="1.5"/>`);
 a['U01_PROP_SOUL_BANNER_cloth']=svg(`<defs><linearGradient id="cloth" x2="1" y2="1"><stop stop-color="#c6d3cf"/><stop offset=".45" stop-color="#f5e9ce"/><stop offset="1" stop-color="#9ca8b7"/></linearGradient></defs><path d="M703 350 Q720 353 742 348 Q739 375 741 406 Q736 436 738 458 Q719 464 706 458 Q711 431 705 402 Z" fill="url(#cloth)" stroke="#456177" stroke-width="2"/><path d="M709 359 Q721 361 738 357 M709 374 Q721 377 738 371 M711 449 Q723 451 736 448" stroke="#798da2" stroke-width="1.3" fill="none" opacity=".65"/><path d="M738 359 Q737 391 739 421" stroke="#d2bfa3" stroke-width="1.6" fill="none" opacity=".8"/>`);
 a['U01_PROP_SOUL_BANNER_knot']=svg(`<path d="M698 354 Q701 359 704 354 L709 359 L704 363 L702 372 L697 370 L699 361 L693 359 Z" fill="#c49772" stroke="#54485b" stroke-width="1.4"/><path d="M700 363 Q698 373 695 378" fill="none" stroke="#d4a880" stroke-width="1.5"/>`);
 a['U01_PROP_SOUL_BANNER_foot']=svg(`<ellipse cx="700" cy="499" rx="17" ry="4" fill="#15223b" opacity=".32"/><path d="M690 496 Q700 492 711 496 L716 503 L686 503 Z" fill="#4d5266" stroke="#9e8f84" stroke-width="1.5"/>`);
 a['U01_PROP_ROAD_SIGN_pole']=svg(`<ellipse cx="864" cy="509" rx="18" ry="4" fill="#17223d" opacity=".28"/><path d="M862 416 L862 505" fill="none" stroke="#343246" stroke-width="9" stroke-linecap="round"/><path d="M862 418 L862 503" fill="none" stroke="#967367" stroke-width="5" stroke-linecap="round"/><path d="M852 501 Q864 496 876 502 L880 509 L848 509 Z" fill="#485067" stroke="#978678" stroke-width="1.6"/>`);
 a['U01_PROP_ROAD_SIGN_board']=svg(defs+`<path d="M835 379 Q864 375 907 380 L910 415 Q870 419 834 414 Z" fill="#222a40" opacity=".36" transform="translate(2 3)"/><path d="M834 377 Q869 373 910 379 L911 413 Q872 419 834 413 Z" fill="url(#wood)" stroke="#393449" stroke-width="2.4"/><path d="M838 381 Q870 377 906 383 L907 408 Q869 412 839 409 Z" fill="none" stroke="#d0a778" stroke-width="1.5" opacity=".8"/><path d="M840 386 Q864 383 882 385 M842 406 Q871 409 905 405" fill="none" stroke="#c09370" stroke-width=".9" opacity=".35"/>`);
 a['U01_PROP_ROAD_SIGN_letters']=svg(`<g transform="translate(841 385) scale(.65 .64)">${glyph('黄')}</g><g transform="translate(859 385) scale(.65 .64)">${glyph('泉')}</g><g transform="translate(877 385) scale(.65 .64)">${glyph('路')}</g>`);
 a['U01_PROP_ROAD_SIGN_arrow']=svg(`<path d="M895 396 L905 396 M901 392 L905 396 L901 400" fill="none" stroke="#f2d4a2" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`);
 a['U01_PROP_FENGDU_LETTERS_feng']=svg(`<g transform="translate(2039 259) scale(.62 .52)">${glyph('酆')}</g>`);
 a['U01_PROP_FENGDU_LETTERS_du']=svg(`<g transform="translate(2058 259) scale(.62 .52)">${glyph('都')}</g>`);
 a['U01_PROP_FENGDU_LETTERS_cheng']=svg(`<g transform="translate(2077 259) scale(.62 .52)">${glyph('城')}</g>`);
 return a;
}
async function main(){
  const name=process.argv[2]||'sample';
  if(name==='full'){
    const p=path.join(root,'..','TECH_SAMPLE_REVIEW.json');
    const review=JSON.parse(fs.readFileSync(p,'utf8'));
    if(review.decision!=='APPROVED') throw Error('Tech sample review not approved');
    Object.assign(items,extraItems());
  } else if(name!=='sample') throw Error('mode must be sample or full');
  const dir=path.join(root,'editable_strokes'); const out=path.join(root,'parts');
  fs.mkdirSync(dir,{recursive:true}); fs.mkdirSync(out,{recursive:true});
  const produced=[];
  for(const [id, source] of Object.entries(items)){
    const sp=path.join(dir,id+'.svg'), pp=path.join(out,id+'.png');
    fs.writeFileSync(sp,source);
    await sharp(Buffer.from(source)).png().toFile(pp);
    produced.push({id,svg:sp,png:pp});
  }
  fs.writeFileSync(path.join(root,'draw_runtime.json'),JSON.stringify({date:new Date().toISOString(),node:process.version,sharp:sharp.versions.sharp,vips:sharp.versions.vips,rsvg:sharp.versions.rsvg,produced},null,2));
  process.stdout.write(JSON.stringify(produced));
}
main().catch(e=>{process.stderr.write(String(e.stack));process.exit(1)});




