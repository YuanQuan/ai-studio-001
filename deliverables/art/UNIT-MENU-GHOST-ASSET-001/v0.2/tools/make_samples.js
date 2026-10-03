// Original v0.2 editable representative SVG poses. No v0.1 source or pixels read.
// Both same-version preflights are checked before any source or image is written.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
for(const name of ['ART_PREFLIGHT.json','TECH_PREFLIGHT.json']){
  const g=JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
  if(g.task_id!=='UNIT-MENU-GHOST-ASSET-001'||g.decision!=='APPROVED')throw new Error(`Gate failed: ${name}`);
}
const defs=`<defs>
<linearGradient id="cream" x1=".25" y1="0" x2=".7" y2="1"><stop stop-color="#fffaf0"/><stop offset=".53" stop-color="#fff2df"/><stop offset=".8" stop-color="#e8eefa"/><stop offset="1" stop-color="#b4c6e6"/></linearGradient>
<linearGradient id="tail" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="#e5eafa"/><stop offset="1" stop-color="#a0b9db"/></linearGradient>
<linearGradient id="blush" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8a5a2" stop-opacity=".72"/><stop offset="1" stop-color="#f9c1ad" stop-opacity="0"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d1975d"/><stop offset=".4" stop-color="#ab6639"/><stop offset="1" stop-color="#633925"/></linearGradient>
<linearGradient id="woodLeg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#985633"/><stop offset="1" stop-color="#51352b"/></linearGradient>
</defs>`;
const P=(d,attr='')=>`<path d="${d}" ${attr}/>`;
const E=(x,y,rx,ry,attr='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${attr}/>`;
const face=(kind,dy=0)=>{
 const y=dy;
 let cheeks=E(165,105+y,10,7,'fill="url(#blush)"')+E(210,108+y,8,6,'fill="url(#blush)"');
 if(kind==='happy')return cheeks+P(`M169 ${88+y}q8 -10 16 0 M196 ${89+y}q8 -9 15 0`,'fill="none" stroke="#20284e" stroke-width="4.4" stroke-linecap="round"')+P(`M190 ${105+y}q11 19 24 0q-9 6-24 0Z`,'fill="#ca5b62" stroke="#20284e" stroke-width="3" stroke-linejoin="round"')+P(`M194 ${113+y}q8 3 14 0`,'fill="none" stroke="#f8b6a7" stroke-width="3"');
 if(kind==='sad')return cheeks+P(`M169 ${83+y}q8 -4 16 6 M195 ${91+y}q7 -8 14 -5`,'fill="none" stroke="#20284e" stroke-width="3" stroke-linecap="round"')+E(178,100+y,4.5,7.5,'fill="#20284e"')+E(204,101+y,3.8,6.3,'fill="#20284e"')+P(`M188 ${119+y}q12 -10 23 3`,'fill="none" stroke="#20284e" stroke-width="3.4" stroke-linecap="round"');
 return cheeks+E(177,92+y,5.5,8.5,'fill="#20284e"')+E(205,94+y,4.3,7.2,'fill="#20284e"')+E(179,89+y,1.6,2,'fill="#ffffff"')+E(206,91+y,1.4,1.8,'fill="#ffffff"')+P(`M187 ${113+y}q12 10 24-2`,'fill="none" stroke="#20284e" stroke-width="3.3" stroke-linecap="round"');
};
const outline='fill="url(#cream)" stroke="#172348" stroke-width="5.5" stroke-linejoin="round"';
const arm=(x,y,mode)=>{if(mode==='up')return P(`M${x} ${y+25}Q${x-13} ${y-5} ${x+2} ${y-15}Q${x+17} ${y-26} ${x+23} ${y-6}Q${x+26} ${y+7} ${x+19} ${y+30}`,'fill="url(#cream)" stroke="#172348" stroke-width="5" stroke-linejoin="round"');
if(mode==='forward')return P(`M${x-8} ${y}Q${x+22} ${y-7} ${x+43} ${y+7}Q${x+50} ${y+18} ${x+38} ${y+24}Q${x+20} ${y+23} ${x-5} ${y+23}`,'fill="url(#cream)" stroke="#172348" stroke-width="5" stroke-linejoin="round"');
if(mode==='down')return P(`M${x} ${y}Q${x+24} ${y+6} ${x+18} ${y+33}Q${x+16} ${y+47} ${x+2} ${y+42}Q${x-10} ${y+30} ${x-8} ${y+8}`,'fill="url(#cream)" stroke="#172348" stroke-width="5" stroke-linejoin="round"');
return P(`M${x} ${y}Q${x+22} ${y+3} ${x+31} ${y+19}Q${x+38} ${y+37} ${x+18} ${y+39}Q${x} ${y+31} ${x-4} ${y+18}`,'fill="url(#cream)" stroke="#172348" stroke-width="5" stroke-linejoin="round"');};
const silhouettes={
 move:'M152 24 C183 18 215 38 225 70 C236 99 222 129 211 144 C208 157 215 175 203 187 C189 200 168 192 154 176 C142 197 120 209 102 191 C85 207 59 197 48 180 C26 187 16 174 27 159 C39 145 63 143 72 125 C80 102 91 80 107 53 C120 33 135 26 152 24Z',
 run:'M154 32 C185 18 220 40 233 67 C246 96 236 118 224 137 C219 151 225 167 212 178 C197 193 175 183 159 165 C148 188 125 201 107 182 C82 197 60 188 54 170 C27 175 11 160 21 148 C34 132 61 134 76 116 C96 89 108 53 130 41 C139 36 146 33 154 32Z',
 happy:'M153 20 C185 16 219 36 228 70 C238 106 222 132 208 145 C208 163 210 177 198 188 C181 201 161 190 150 174 C136 199 112 202 99 184 C75 202 52 188 47 169 C28 174 19 163 31 148 C47 134 64 135 76 112 C90 82 101 49 128 29 C136 23 145 21 153 20Z',
 sad:'M153 37 C185 35 213 57 219 87 C226 112 214 142 202 154 C206 171 204 185 193 193 C176 202 162 190 149 182 C135 199 112 202 98 186 C75 198 53 189 44 172 C27 177 19 166 32 151 C53 139 66 134 75 117 C95 85 107 58 131 43 C139 39 146 37 153 37Z',
 sit:'M156 55 C188 48 219 67 224 96 C232 124 211 149 201 157 C201 171 211 182 198 190 C178 199 158 184 144 182 C128 196 112 195 94 184 C73 188 50 183 42 169 C24 175 16 164 27 152 C43 140 62 146 78 132 C91 106 112 68 139 58 C146 56 151 55 156 55Z'
};
function ghost(kind){
 let d=silhouettes[kind],isSit=kind==='sit',isRun=kind==='run';
 let backArm=arm(isRun?97:104,isSit?138:125,isRun?'forward':kind==='happy'?'up':kind==='sad'?'down':'rest');
 let foregroundArm=arm(isRun?184:178,isSit?135:120,kind==='happy'?'up':isRun?'forward':kind==='sad'?'down':'rest');
 let body=P(d,outline);
 let shadow=P(isSit?'M46 162 Q80 170 96 166 Q126 184 151 171 Q180 186 201 167 Q204 187 189 187 Q171 183 151 177 Q130 191 107 181 Q82 194 58 177Z':'M42 160 Q61 159 77 145 Q105 175 129 167 Q157 183 181 164 Q198 174 207 161 Q208 190 188 188 Q165 183 153 175 Q135 195 107 188 Q82 197 57 180Z','fill="url(#tail)" opacity=".59"');
 let folds=P(isSit?'M75 159 Q89 171 108 169 M103 174 Q127 181 141 169 M155 171 Q174 179 193 164':'M54 168 Q75 177 89 169 M94 185 Q111 190 122 177 M137 177 Q156 185 167 172','fill="none" stroke="#9eb5d8" stroke-width="2.5" opacity=".65" stroke-linecap="round"');
 let shine=P('M122 53 Q143 31 169 34 M91 96 Q99 73 110 62','fill="none" stroke="#ffffff" stroke-width="4.5" opacity=".7" stroke-linecap="round"');
 let wing=P(isRun?'M53 151 Q27 148 22 158 Q44 163 57 160':'M54 151 Q28 146 26 159 Q41 164 59 161','fill="none" stroke="#758fb8" stroke-width="2.3" opacity=".55"');
 let tilt=kind==='run'?-5:kind==='sad'?3:kind==='happy'?-2:0;
 return `<g id="ghost_${kind}" transform="rotate(${tilt} 153 130)">${backArm}${body}${shadow}${folds}${shine}${wing}${foregroundArm}${face(kind,isSit?17:kind==='sad'?6:0)}</g>`;
}
const bench=`<g id="BENCH_01">
<g id="BENCH_BACK"><path d="M20 75 L33 60 Q35 55 44 55 L283 55 Q292 56 295 62 L301 79 L292 95 L28 95Z" fill="url(#wood)" stroke="#422a2e" stroke-width="5" stroke-linejoin="round"/><path d="M38 65 Q150 59 282 66" fill="none" stroke="#f0bd7c" stroke-width="4" opacity=".65"/><path d="M38 80 Q120 74 208 79 Q260 82 288 78" fill="none" stroke="#70442f" stroke-width="3" opacity=".65"/></g>
<g id="BENCH_FRONT"><path d="M55 93 L84 96 L80 142 Q69 148 57 142Z M238 96 L268 92 L272 143 Q260 150 247 143Z" fill="url(#woodLeg)" stroke="#3d2c31" stroke-width="5" stroke-linejoin="round"/><path d="M34 91 Q159 99 292 91 L288 108 Q159 115 37 106Z" fill="#885233" stroke="#422c2e" stroke-width="4" stroke-linejoin="round"/><path d="M45 99 Q143 103 258 100" fill="none" stroke="#c0814b" stroke-width="3" opacity=".65"/></g></g>`;
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`;
const poses=['move','run','happy','sad','sit'];
const sourceDir=path.join(root,'source'),previewDir=path.join(root,'preview');fs.mkdirSync(sourceDir,{recursive:true});fs.mkdirSync(previewDir,{recursive:true});
const ghostMaster=svg(256,224,`<defs>${poses.map(k=>`<g id="pose_${k}">${ghost(k)}</g>`).join('')}</defs><use href="#pose_move"/>`);
const benchMaster=svg(320,160,bench);
fs.writeFileSync(path.join(sourceDir,'ghost_sample_master.svg'),ghostMaster);
fs.writeFileSync(path.join(sourceDir,'bench_sample_master.svg'),benchMaster);
async function run(){
 const files=['source/ghost_sample_master.svg','source/bench_sample_master.svg'];
 for(const k of poses){let b=await sharp(Buffer.from(svg(256,224,ghost(k)))).png().toBuffer();let rel=`preview/${k}.png`;fs.writeFileSync(path.join(root,rel),b);files.push(rel);}
 const bb=await sharp(Buffer.from(benchMaster)).png().toBuffer();fs.writeFileSync(path.join(previewDir,'bench.png'),bb);files.push('preview/bench.png');
 const hashes={};for(const rel of files){hashes[rel]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex');}
 fs.writeFileSync(path.join(root,'SAMPLE_EXPORT_MANIFEST.json'),JSON.stringify({taskId:'UNIT-MENU-GHOST-ASSET-001',version:'v0.2',scope:'six-key-pose-samples-only',ghostCanvas:[256,224],benchCanvas:[320,160],files:hashes},null,2));
 process.stdout.write(`ghost=${path.join(previewDir,'move.png')}\nbench=${path.join(previewDir,'bench.png')}\n`);
}
run().catch(e=>{console.error(e);process.exit(1)});
