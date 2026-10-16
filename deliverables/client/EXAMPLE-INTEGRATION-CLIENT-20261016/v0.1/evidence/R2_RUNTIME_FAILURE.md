# r2 运行失败记录

Master 在实际运行 r2 时发现，U00 导出显示 far_l SpriteFrame UUID 为旧值 `13252d37…@f9941`，桥左/右为旧值 `232fc449…` / `91356d07…`。原因是三个 prototype 的 `path` 仍指向旧文件名；`loadFrames()` 与 U01 的 `PROTOTYPE_PATHS` 均根据 `proto.path` 调用 `resources.load()`，不会读取仅用于导出的 `clientPath`。

r2 构建和日志予以保留。修复将三个实际 `path` 更新为获批 dark-base 与 clean bridge 文件名；r3 编译包包含新路径，并预期实际 SpriteFrame UUID 分别为 `d37c4dd2-997c-41ca-b297-c6f3025e7c33@f9941`、`f9728158-941b-4856-ab10-c2693bc98ba0@f9941`、`82838513-3eb1-4bbe-ab6d-610a0ca59a34@f9941`。这些 UUID 仍需 Master 在 r3 IAB 运行中确认。
