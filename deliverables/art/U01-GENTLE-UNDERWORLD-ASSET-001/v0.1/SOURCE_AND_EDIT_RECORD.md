# U01 温和地府元素｜来源与实际修订记录 v0.1

## 来源和许可边界

- 制作基线为已获 Gate2 v0.3 用户批准的 `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`，SHA-256 `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`。旧 `process_notes.md` 记录四张原图来自项目 Codex `generated_images`，由本地 bggg 原版脚本组装。旧 PSD 与四张导出均未覆盖。
- 已批 `deliverables/art/UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001/v0.1/RIGHTS_AND_SOURCE.md` 登记用户原话“我拥有原图及商用改编权”。2026-10-07 查阅 OpenAI 公开 [Terms of Use—Content](https://openai.com/policies/terms-of-use/) 与 [Service Terms §6](https://openai.com/policies/service-terms/)；这些说明用户与 OpenAI 间的公开权利安排及图像能力条款，**不构成**用户特定账户合同、第三方权利或相似性的独立证明。本轮 Art 目视核五处新增对象与既有项目画面，未发现可辨识外部作品仿制；这只是初筛。
- 本批没有新增 imagegen、网络图片、图库素材、第三方字体、商标或游戏截图。五个对象由 `source_build/make_local_art.js` 中手写 SVG 路径独立绘出，SVG 原件在 `source_build/editable_strokes/`，透明全画布层在 `source_build/local_layers/`；“忘川”由逐笔路径绘制，未载入字体字形。本地 bggg 脚本 `LICENSE` 为 MIT License（BGGG 2026），只作本地 PSD 制作工具；脚本 SHA-256 `AF7217E0F3DAD1EDAF7EB4017C717CC49C6CE45D35BE88A00C0D2F284B390EBD`。本地 Node/sharp 0.35.4 渲染 SVG，Pillow 12.3.0 与 NumPy 做源回读、投影和像素核验；这些工具未进入游戏运行包。

## 实际制作

1. 首图前 Gate1 方案为 `USER_APPROVED`；同批 `PREFLIGHT_PLAN.md` SHA-256 `7BACECFC1B18A14033B2C27213B565CF4211AA169D5BABAC468F821C95AA76F0`，Art、Tech 两份预签均 `APPROVED`。然后才开始本批图片。
2. 对旧 PSD 进行独立 raw-channel 回读，确认 2172×724、原四个栅格层；四层 RGBA 分别与旧 `psd_full_canvas_layers/` 逐像素一致。旧天空最右 1px 透明、L04 alpha bbox `(0,79,2172,724)` 均按原样保留。
3. 第一轮画面自审发现左景石略直立、桥心纹像 X，于已批对象盒内把景石改为低矮横向园景石、桥纹改成三瓣莲；花梗加少量深青前叶遮脚，木匾字保留。第一轮预览的原始二进制在预览脚本重跑时被同名覆盖，**不能作为可核旧版图件**；`review/second_pass_*.png` 保存的是完成上述定向修订后、母版组装前的检查图。第一轮反馈只按本记录追溯，不在最终审核包中冒称有可读原图。
4. `source_build/build_psd_and_exports.py` 将旧 PSD 回读出的四层与五个局部透明层交给本地 `bggg-creator-image2psd/scripts/image2psd.py assemble`，按 L01、L02、L03、GU-01a、GU-01b、GU-03、GU-04、L04、GU-02 的底到顶顺序组装。新 PSD 为九个独立栅格层；四个旧栅格原位保存，五个对象各有独立层。原旧 PSD 未被修改。
5. 从**保存后的新 PSD 独立回读九层**，按原四语义合出 `exports/` 四张 2172×724 RGBA；用这四张同尺度重组 `review/overall_from_psd.png`，再按现行控制器公式与分层视差生成 30 张静态手机投影和总览 `review/portrait_viewports.png`。具体文件哈希、对象 SVG/透明图、差异范围见 `CUT_MANIFEST.json`。

## 差异和已知限制

- L01、L02 导出 PNG 与旧版 SHA-256 完全一致；L03 仅 GU-01a/b、GU-03、GU-04 的闭区间候选盒内有 2957 个 RGBA 差异像素，L04 仅 GU-02 盒内有 344 个差异像素。方案坐标例如 x920–948 按**两端都包含**；计算机记录的 bbox 为右/下不包含，因此 L03 有 7 个变化像素位于方案右端点 x948/x165，仍在获批范围内。四张边缘 alpha 与旧版逐像素相同；L04 四边 RGBA 也逐像素相同。
- 四张语义导出先合成与九个 PSD 栅格逐层先合成的 8 位 alpha 整数舍入顺序有差异：同尺度重组相对 PSD 内嵌平面最大每色道 1，561 个色道值不同，且仅在批准局部区域；不是逐像素完全一致。两种图分别保存在 `review/overall_from_psd.png` 与 `review/psd_stored_preview.png`，不得把这个限制写成零差。
- 30 张静态艺术投影均为全不透明合成，未见透明露底；投影**未绘制悬浮控件**，不代表 Creator 真正运行、UI 遮挡、采样器边缘、内存、Draw Call 或目标手机验收。这些保持 `NOT_TESTED`，待 Gate2 后正式接入再核。
- PSD 的九层可独立隐藏、移动和重导；新增 SVG 承载路径/笔触可编辑性。没有在 Photoshop/Photopea GUI 中打开或实操编辑，本批可编辑性核验限于 PSD 格式解析、层通道独立回读和文件重组；不把栅格层冒充 PSD 原生矢量或原生文字层。
