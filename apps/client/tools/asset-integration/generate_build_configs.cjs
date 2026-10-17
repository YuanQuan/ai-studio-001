#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SCENE_UUID = '01e65005-5a46-45a1-9a16-820ac4b919ae';
const SCENES = [{ url: 'db://assets/UnitSamples.scene', uuid: SCENE_UUID }];
const BUNDLE_ROOTS = [
  ['world', 'db://assets/bundles/world'],
  ['tourist', 'db://assets/bundles/tourist'],
  ['shops', 'db://assets/bundles/shops'],
  ['dialogue', 'db://assets/units/dialogue'],
  ['milk-tea', 'db://assets/bundles/milk_tea'],
];

function buildOptions(stageRoot, platform) {
  const miniGame = platform === 'wechatgame' || platform === 'bytedance-mini-game';
  const suffix = path.basename(stageRoot);
  const compressionType = miniGame ? 'subpackage' : 'merge_dep';
  return {
    platform,
    taskName: `MINIGAME-ART-OPT-INTEGRATE-CLIENT-${platform}`,
    name: 'bai-gui-night-market-demo',
    buildPath: path.join(stageRoot, 'build-output'),
    outputName: `${suffix}-${platform}`,
    debug: false,
    scenes: SCENES,
    startScene: SCENE_UUID,
    mainBundleCompressionType: compressionType,
    packages: {},
    server: '',
    engineModulesConfigKey: 'defaultConfig',
    buildMode: 'normal',
    mangleProperties: false,
    md5Cache: false,
    skipCompressTexture: false,
    sourceMaps: false,
    overwriteProjectSettings: {
      includeModules: {
        'gfx-webgl2': 'on',
        physics: 'inherit-project-setting',
        'physics-2d': 'inherit-project-setting',
      },
      macroConfig: { cleanupImageCache: 'inherit-project-setting' },
    },
    nativeCodeBundleMode: 'both',
    polyfills: { asyncFunctions: true },
    experimentalEraseModules: false,
    startSceneAssetBundle: false,
    bundleConfigs: BUNDLE_ROOTS.map(([name, root]) => ({
      root,
      name,
      priority: 1,
      compressionType,
      isRemote: false,
      output: true,
    })),
    inlineEnum: true,
    useBuiltinServer: false,
    md5CacheOptions: { excludes: [], includes: [], replaceOnly: [], handleTemplateMd5Link: true },
    mainBundleIsRemote: false,
    useSplashScreen: true,
    bundleCommonChunk: false,
    packAutoAtlas: false,
    wasmCompressionMode: false,
    binGroupConfig: { threshold: 16, enable: false },
    logDest: path.join(stageRoot, 'evidence', `creator-${platform}.log`),
  };
}

function generate(stageRoot) {
  const resolved = path.resolve(stageRoot);
  if (!fs.existsSync(path.join(resolved, 'STAGING_INPUT_MANIFEST.json'))) {
    throw new Error(`缺少staging输入manifest：${resolved}`);
  }
  const output = path.join(resolved, 'build-configs');
  fs.mkdirSync(path.join(resolved, 'evidence'), { recursive: true });
  fs.mkdirSync(output, { recursive: true });
  const platforms = ['web-mobile', 'wechatgame', 'bytedance-mini-game'];
  const files = [];
  for (const platform of platforms) {
    const filename = `${platform}.json`;
    const destination = path.join(output, filename);
    const content = `${JSON.stringify(buildOptions(resolved, platform), null, 2)}\n`;
    fs.writeFileSync(destination, content);
    files.push({ path: path.relative(resolved, destination), sha256: require('node:crypto').createHash('sha256').update(content).digest('hex') });
  }
  console.log(JSON.stringify({ stageRoot: resolved, configDir: output, configs: files }, null, 2));
}

if (require.main === module) {
  const stageRoot = process.argv[2];
  if (!stageRoot) { console.error('usage: generate_build_configs.cjs <staging-project-root>'); process.exit(2); }
  try { generate(stageRoot); } catch (error) { console.error(`config generation failed: ${error.stack || error}`); process.exitCode = 1; }
}
module.exports = { buildOptions, generate };
