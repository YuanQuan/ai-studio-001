# Scene/Prefab 与资源修改

## 受控文件转换

Editor API已可用时可优先借助版本相容的序列化与保存API，但不要求为了操作文件先取得Editor截图。直接脚本处理Creator JSON数组时：

- 保存原始文件及hash，明确要删的根节点、组件、属性及资产UUID。以对象类型/稳定ID/明确关系定位，不靠易漂移行号。
- 引用是 `__id__` 指向顶层数组索引。递归检查每个嵌套引用；删数组对象后必须重映射所有保留对象中的引用。父子节点、组件归属、PrefabInfo/实例/覆盖目标均需检查。不能只过滤数组或简单删一个node而留下其他关系。
- 保留Scene自身、Controller、Prefab与SpriteFrame的实际UUID；Creator资产引用通过 `__uuid__` 表示，子资源UUID也须保留。不要重建`.meta`、移动保留资源或批量删除Library。
- 清空旧序列化属性后才移除对应代码property/消费者。脚本路线可直接验证落盘文件，再通过实际引擎导入/构建确认没有unknown property/missing引用；不再以Inspector清空和Editor保存作为唯一合法手段。
- 对需剔除的缺失TMX/旧Prefab实例，先查父子/组件/实例关系，完整移除相关对象及引用；不得吞异常使场景“看似成功”。不保留为了让验证通过而制造的假资源。

## 静态检查器

Node可运行 `scripts/check-scene-links.mjs --scene <文件> [--keep-uuid <UUID>] [--forbid-uuid <UUID>]`；keep/forbid参数可重复。检查JSON顶层数组、对象ID索引界限、显式需要保留/移除的UUID。返回0只代表这些静态条件通过；返回1表示检查未过，2表示参数/文件错误。

本工具不校验引擎组件schema、完整对象关系语义、压缩UUID等价性、资产可解析性或版本兼容，不做自动变更。类型不匹配、Prefab覆盖、对象关系不一致以及missing资产仍须独立检查和Creator实际导入/构建/运行。不得将工具输出当成Scene引擎解析PASS。

## 资源退役

根据活动Scene、Prefab、脚本、构建配置及开发工具查路径与UUID引用。历史文档字符串单独归档，不当运行依赖，也不因历史引用命中就删除历史。多功能共享或未知归属资产保持原样并升级。既有工作树删除先按清单核账，不能算作本Task新产出。

在脚本转换/引用检查及相关Creator导入、构建、运行确认后再正式清理获授权旧专属资源。删除资源时一并处理其合法身份文件；仍需资源的`.meta`/UUID、批准图像与源文件保持完整。已删除资产造成旧场景无法加载时，可在批准范围内通过确定的对象图转换脱链，但完成前不得宣布资源清理已通过。

官方接口参考：[场景脚本](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/scene-script.html)。这是Editor场景进程能力；没有可用Editor进程时不声称API已调用或保存成功。
