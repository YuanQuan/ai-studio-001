# Cocos Creator 3.8.8 工程环境

## 标准小游戏模板默认版本

- Cocos Creator：`3.8.8`
- Cocos Engine 官方 tag：`3.8.8`
- Engine commit：`411f98df047c25902f93440d4b22925c2fb65461`
- 原生 external（仅未来原生平台自定义引擎需要）：`v3.8.8-2`

新 Cocos 小游戏默认固定到 3.8.8；不得自动跟随新版本升级。升级必须由对应游戏单独做兼容性影响评审并形成项目决策。

## 默认策略

优先使用 Cocos Creator 3.8.8 内置引擎，不把完整 Cocos Engine 源码提交到每个游戏仓库。

只有确实需要修改引擎内部实现时，才运行：

```bash
bash tooling/cocos/bootstrap-cocos-engine.sh
```

源码默认放到 `.cocos/engine/3.8.8/cocos-engine`，属于可重建的本地工具依赖。

如需要安装自定义引擎 npm 依赖：

```bash
INSTALL_ENGINE_DEPS=1 bash tooling/cocos/bootstrap-cocos-engine.sh
```

Cocos Engine 3.8.8 要求 Node.js `>=18.0.0`。

## 编辑器要求

拉取 `cocos-engine` 源码不能替代 Cocos Creator 编辑器。项目创建、Scene/Prefab 编辑、Physics2D 接线与 Web/小游戏构建仍需要安装 Cocos Creator 3.8.8（推荐通过 Cocos Dashboard 管理）。
