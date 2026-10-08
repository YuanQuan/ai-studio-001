# 站酷快乐体官方上游核验（本任务本地证据）

- 官方授权文本：`ZCOOLKuaiLe-OFL.txt`，来自 `https://github.com/google/fonts/blob/main/ofl/zcoolkuaile/OFL.txt`，本地下载 URL `https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolkuaile/OFL.txt`；SHA-256 `538078469839B4A2E7AD22BEF4EBE41681A4E53749BB2A072144024F1D6D703D`。文本载明 SIL Open Font License 1.1，字体产出的图片不是字体软件本身。
- 官方字体本地核验副本：`ZCOOLKuaiLe-Regular.ttf`，来自 `https://github.com/googlefonts/zcool-kuaile/tree/main/fonts/ttf` 的同名文件，下载 URL `https://raw.githubusercontent.com/googlefonts/zcool-kuaile/main/fonts/ttf/ZCOOLKuaiLe-Regular.ttf`；1,514,968 bytes，SHA-256 `812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D`；字体家族 `ZCOOL KuaiLe`。
- 旧聚合站文件：`../../../v0.1/source/font_candidates/wordshub_requested/ZCOOL-KuaiLe.ttf`，1,669,784 bytes，SHA-256 `302D8DEE7D2CB7D25D6BC89399E43513D2CAFD031862BD46BCE47F573C68807E`；字体家族 `HappyZcool-2016`。两文件字节不相同。以 Pillow 96 px 分别栅格化 U+73B0“现”、U+70E4“烤”、U+7CD6“糖”，三字像素散列也均不同，不能把旧聚合站文件视为已比对的官方同源字形。
- 新“现”可用此官方 OFL 文件渲成栅格图，再由 Art 对旧“烤”的字效做同牌局部协调；若协调导致字形造型/风格不符，在样张阶段修订，不由 Tech 预签宣称视觉通过。旧“糖”“烤”若继承原 PSD 字层，应记录原像素与本次字层来源，不将旧聚合站字体再次用于新渲染。
- 本地字体仅用于授权核验与制作，不放入客户端或游戏包；本目录 `.gitignore` 忽略 TTF/OTF，禁止随项目 Git 提交字体文件。若将来确需分发字体软件，须按 OFL 包含完整版权和许可文本。
