const fs = require('node:fs');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/lib/typescript.js');
for (const file of ['apps/client/assets/labs/u05/milk_tea_lab.ts', 'apps/client/assets/labs/u05/u05_accessibility.ts']) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    console.error(file, errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, ' ')));
    process.exitCode = 1;
  } else console.log(`PASS transpile ${file}`);
}
