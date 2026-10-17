# Creator 3.8.8 本地分包配置依据

本轮只读核验，不表示目标构建已通过。

- 本机 `app.asar.unpacked/builtin/builder/@types/public/options.d.ts` 的 IBundleOptions：root为string根目录，name必填，priority/compressionType/isRemote/output可选；内置main根目录可任意字符串。`BundleCompressionTypes`明确subpackage为字符串。未证实数字0对应哪种模式，不依赖folder meta的0猜测。
- [官方3.8 CLI文档](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-in-command-line.html) 提供3.8.2+导出示例：bundleConfigs.root使用 `db://assets/resources`。本批建议五个准确db://目录；UUID或绝对目录root是否等价，本轮未证实。示例是独立Bundle构建，普通native构建是否正确应用本批覆盖仍须实际CLI证据。
- [官方3.8小游戏分包文档](https://docs.cocos.com/creator/3.8/manual/en/editor/publish/subpackage.html) 明确Build时主Bundle压缩选择小游戏分包；本地分包不勾远程。因此 `mainBundleCompressionType: "subpackage"` 有官方依据，可与五个自定义bundle同用；`mainBundleIsRemote:false`及各bundle `isRemote:false`。不要把Web目录视作native分包证明。
- 当前generate_build_configs.cjs已用准确db://目录、两小游戏平台subpackage、Web merge_dep、只UnitSamples场景、main非远程。静态方向一致，不表示平台插件接受全部字段或输出启动正确。

最终必须读取目标CLI实际options/exit36与Finished记录，确认game.json实际subpackages、主包启动桥/首场景、五包输出路径和依赖；逐UUID归属及重复、启动网络请求另核。主包被设计为分包时须确认启动代码正确加载，不能仅看生成目录存在。DevTools/真机与平台启动未执行时仍NOT_TESTED。官方页面上的平台大小限制未用于本轮结论。

Creator app.asar核心构建实现为.ccc，不从其二进制猜root语义。本轮只使用可读类型声明、官方导出实例和后续真实目标输出验证。
