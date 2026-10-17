# CLI/API 备选配置记录

用户已明确授权配置。独立环境 `/Users/yuanquan/.codex/tools/imagegen-venv` 已安装 OpenAI SDK 3.33.0、Pillow 13.0.0；内置 imagegen CLI 的图片编辑 dry-run 通过，未修改 CLI 源码。当前进程及 macOS 用户会话均未配置 `OPENAI_API_KEY`；实时连通性、额度与模型权限未测试，未发 API 请求。

## 本机密钥设置

先在 [OpenAI API Keys](https://platform.openai.com/api-keys) 创建自己的密钥。在本机 macOS 终端（zsh）逐行执行：

```zsh
read -rs "u04_api_key?粘贴 API Key（不回显）："
launchctl setenv OPENAI_API_KEY "$u04_api_key"
unset u04_api_key
```

完成后回复“已配置”。密钥不会回显或写入命令历史，不要发到聊天。后续工具可从该 macOS 用户会话变量取值，仅传给 API 子进程；当前 Codex 进程不会自动继承修改。此配置不保证重启后保留，不修改用户全局 shell 配置。

环境变量用法依据：[OpenAI Docs quickstart](https://developers.openai.com/api/docs/quickstart)。安装成功不代表账户密钥与模型权限已验证。

## 生产连续性与复盘

原内置请求未知结果仍保守占用 1/48，本轮新增调用 0，剩余 47。无新图、PSD或切片，现行正式资源未改，Gate2仍DRAFT。主Art、Art-B、Tech保持BLOCKED。恢复前须核CLI备选与原同批预签差异；SDK默认重试2次，预算必须覆盖潜在实际HTTP重试，不能把CLI启动次数等同API尝试次数；原MT未知请求不盲重发。

本轮完成依赖安装、导入和离线参数检查，剩余依赖为用户持有的API密钥。净配置耗时未单独计时。Master在用户回复“已配置”后仅检查变量是否存在，不输出值，再恢复原范围内Art/Tech执行；复核点为首个CLI真实调用前。审批、质量与总预算继续生效。
