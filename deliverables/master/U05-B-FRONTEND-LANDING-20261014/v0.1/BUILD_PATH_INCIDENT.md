# 隔离构建输出路径核查

2026-10-14 10:53:50 +08:00只读核查：Client隔离profile沿用其它示例的buildPath，已承认本次误写 `/private/tmp/lantern-pilot-v02-build/web-mobile`；此通用目录此前未登记文件身份，原内容是否需要恢复及完整性未知，不擅自行覆盖恢复。

灯光示例已登记的实际产物在另一个独立子目录 `lantern-pilot-v02-web-mobile`。按其2026-10-12 evidence/build/editor-reimport-build-result.json逐SHA核对index.html、src/settings.json、main/import/0a/0aa55be6f.json，3/3与登记一致；因此不能称已登记灯光产物被毁或需要从它覆盖恢复。检查范围仅登记的3文件，不扩张为整个目录完整证明。

Client已被要求停止写其它目录，保留本次误写产物为证据，修自有隔离profile显式buildPath/outputName并重新构建，再验实际输出路径/时间/hash。未修改或恢复其它示例目录。
