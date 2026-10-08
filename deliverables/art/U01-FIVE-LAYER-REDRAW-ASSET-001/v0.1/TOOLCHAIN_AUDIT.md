# U01 五层重绘资源｜本机工具链审计 v0.1

审计时间：2026-10-08 14:58 +08:00。结论：**BLOCKED，尚不能开始首张正式图片**。本机没有找到项目指定的 `bggg-creator-image2psd` skill，也没有查证可直接保存完整多图层 PSD 的本机绘图方案；Art/Tech 同批次首图前预签尚未通过。本审计不代表图片、PSD 或导出已完成。

## 核查范围与结果

- 检查当前 macOS 的 `~/.codex/skills`、`~/.codex/plugins`、`~/.codex/vendor_imports`、`~/.claude`、`~/.cursor`、`~/.config`、`~/Downloads`、`/Applications`、`~/Applications` 与当前游戏仓库及 Studio 仓库；未找到可调用的 `bggg-creator-image2psd/SKILL.md` 或 `scripts/image2psd.py`。文件名搜索仅找到旧交付的 bggg 预览、摘要、引用记录，未找到 skill 本体。
- 旧资源生产脚本如 `deliverables/art/U01-GENTLE-UNDERWORLD-ASSET-001/v0.3/source_build/build_full.py` 指向 `C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py`。这是旧 Windows 环境路径，当前 macOS 无法据此调用；旧交付未把原版脚本归档为本项目的可执行 skill。
- 本机未找到 Photoshop、Krita、GIMP 应用或命令。`magick`、`convert` 可调用，但没有据此确认可创建并保存符合项目要求的完整可编辑多图层 PSD；不将其作为未经验证的替代生产链。
- 仓库存在旧 `moonlit_four_layers.ora`、已批四层 PSD 和 PNG，可作历史源和视觉基线；它们不能证明本机能制作本批 3840×1024 的五层新 PSD。
- 已读取 `imagegen` skill；其产出为位图，不提供本批所要求的多图层 PSD 保存能力。此工具不能绕过项目指定转换工具与首图前双签。

## 处理边界

依据 `AGENTS.md`、`agents/art/DECISIONS.md` 和 `rules/visual_production_contract.md`，若不能原生保存多图层 PSD，应使用指定 skill 转换并记录源图、预览和可编辑范围。当前两条实际可验证路径均缺失。未下载或安装新技能，未写替代转换器，未生成新图、PSD、PNG 或透明掩膜。解除阻塞需先取得并核验项目指定 skill，或由 Master 组织有真实 PSD 能力的生产方案及受影响审批/预签，再由 Art/Tech 对同一批次确认。
