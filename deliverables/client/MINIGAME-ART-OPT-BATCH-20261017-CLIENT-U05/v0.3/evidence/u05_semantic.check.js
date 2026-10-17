const { spawnSync } = require('node:child_process');
const command = '/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/bin/tsc';
const args = [
  '--noEmit', '--skipLibCheck', '--target', 'ES2018', '--module', 'ES2015', '--moduleResolution', 'node',
  '--lib', 'ES2018,DOM', '--experimentalDecorators', '--strict', 'false',
  'apps/client/temp/declarations/cc.custom-macro.d.ts', 'apps/client/temp/declarations/cc.d.ts',
  'apps/client/temp/declarations/jsb.d.ts', 'apps/client/temp/declarations/cc.env.d.ts',
  'apps/client/assets/labs/u05/milk_tea_lab.ts', 'apps/client/assets/labs/u05/u05_accessibility.ts',
];
const result = spawnSync(command, args, { cwd: process.cwd(), encoding: 'utf8' });
const output = `${result.stdout || ''}${result.stderr || ''}`;
const u05Errors = output.split(/\r?\n/).filter(line => /milk_tea_lab\.ts|u05_accessibility\.ts/.test(line));
if (result.error) throw result.error;
if (u05Errors.length) {
  console.error(u05Errors.join('\n'));
  process.exit(1);
}
console.log('PASS: TypeScript semantic analysis reports no diagnostics in either U05 source file.');
if (result.status !== 0) console.log(`NOTE: enclosing dependency check exits ${result.status}; non-U05 diagnostics remain (including viewport_adapter.ts).`);
