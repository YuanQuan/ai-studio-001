# U00 v0.3 Client Owner 自检

| 核查项 | 结果 | 证据/说明 |
|---|---|---|
| 六店ID、顺序、脚点与用户输入一致 | PASS | `USER_LAYOUT_INPUT.json` 和 Gallery baseline 对照一致。 |
| 六店缩放均为0.4，稳定ID和顺序不变 | PASS | Gallery仅替换六个X/Y数值；缩放常量和`SHOP_IDS`未修改。 |
| 恢复、重进和导出沿用同一基线 | PASS | Master实测调后恢复、离页重进恢复新基线；390导出六店参数与用户输入逐项匹配，见`evidence/RUNTIME_MANIFEST.json`及`evidence/iab/baseline-export.json`。 |
| 只改授权源码/其他资源字节完整性 | PASS | `RESOURCE_INTEGRITY_CHECK.json`覆盖198项，只有授权Gallery有差异，其余197项不变。 |
| Creator TypeScript静态编译 | PASS | Creator 3.8.8随附编译器，退出码0。 |
| Creator 3.8.8 Web-Mobile构建 | PASS | 唯一一次隔离CLI构建 exit36并有Finished标记；149文件、25,935,219字节。构建日志中的worker SIGTERM诊断如实保留。 |
| HTTP实际构建入口 | PASS | 既有4174服务经loopback no-proxy GET/HEAD均200，index.html和main/index.js响应hash与本轮产物一致；见`evidence/HTTP_R1_CHECK.json`。 |
| 内置浏览器运行 | PASS | 390×844初值/导出/恢复/重进和720×1280逐店画面通过；console warn/error为空。RUNTIME manifest绑定主脚本hash与build。 |
| 真机、目标设备性能、Library逐UUID回读 | NOT_TESTED | 未执行。 |

坐标数值修改已获用户授权，Artifact仍待专业Review和用户审核。Owner自检不代表正式QA或任务DONE。
