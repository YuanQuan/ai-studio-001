# U04 脸部断线与重影二次返工流程

- 用户准确v0.2再次CHANGES_REQUESTED，证据`deliverables/master/U04-EXPRESSION-EDGE-REVISION-20261017/v0.2/USER_REVISION_AUTHORIZATION.json`；旧v0.2图包、身份与Review保留。现行Art v0.3为DRAFT/制作，旧v0.2 Approval REJECTED。前轮Tech/Producer内部接受仅是历史，不证明本轮视觉问题已修。
- 本轮目标九态AC四态、AJ sad、AD三态、XJ surprised；先核原候选/语义层/base/front，清旧线后连续局部重建。AJ sad代表先行，同批Art/Tech预签后出图；最多4新增imagegen计历史32/48，0CLI，新法最多两轮，45分钟或原6小时较早停工复核。Client正式导入锁。
- Art已实际读取新Task/Auth和AJ源/base/front/语义层，Task IN_PROGRESS；Tech本轮首Required `deliverables/tech_lead/U04-EXPRESSION-EDGE-REVISION-20261017/v0.2/DIAGNOSIS.md` 已实存，Task IN_PROGRESS；Producer已实写本报告，Task IN_PROGRESS。
- Master转报Art本轮逐层诊断：AJ sad原1254候选缩至256的新右眉连续；v0.2 base保留旧眉黑碎段（native x150..160,y85..94），face新眉周边半透明皮色/灰alpha叠后双线，front圈区近透明。上一轮“正常AA”解释不成立；新法清base旧碎线并从原候选重提实色新眉与必要发交叉局部层。Art正式诊断文件待落盘。
- `2026-10-17T08:12:57Z` Art v0.3预案与Tech v0.2同批SHA绑定预签实存，首AJ sad代表样放行；Tech指出AJ base旧黑段多数被face alpha255遮住，不能把清隐藏段当可见改善，必须实证复合画面单线连续。见`deliverables/tech_lead/U04-EXPRESSION-EDGE-REVISION-20261017/v0.2/REVISION_PRESIGN.json`。
- AJ sad首样已产`deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/review/sample_aj_sad/SAMPLE_CHECK.json`：从原1254候选重提局部连续眉/发交叉，face变更1759像素，先验ROI外0，新增生成0；当前`ART_SAMPLE_PENDING_VISUAL_TECH_CHECK`，不得扩九态或称PASS。
- Tech向Master实际报告AJ sad round2代表PASS并放行同法扩其余九圈态：face差异2563px，bbox native[108,22,204,91]、ROI外0；眉线/竖发交叉连续，肤色带已改连续深色，实际尺度无先前灰断/双线，眼嘴保留。Master看×6与100%对照认可改善。Art `SAMPLE_CHECK.json`仍是生成时pending中间状态，Tech本轮`deliverables/tech_lead/U04-EXPRESSION-EDGE-REVISION-20261017/v0.2/TECH_CHECK.json`已正式记录代表PASS，Art生成时pending报告待更新；不启动AJ第三轮，新增imagegen0。
- Master已实际查看AC四态、AD三态、XJ surprised与happy的1×/4×中间对照，判断可见改善，证据`deliverables/master/U04-EXPRESSION-EDGE-REVISION-20261017/v0.2/INTERMEDIATE_TARGET_OBSERVATION.json`；`CURRENT_PROTECTION_CHECK.json`核v0.1/v0.2及165原始/Client保护SHA未变。此中间观察不代替最终Gate2。
- **AC分支停工更正**：Master最初将front清理视为第2轮允许范围的判断已撤回；Tech按规则73复核，AC候选face已两轮，剩face坐标x22..30,y85..101可见灰缝，front旧肤色归因已被坐标反证、根因未确证，front清理尚未执行，Art映射assert中止无输出。第三次调参须停，AC分支BLOCKED，0新增生成。其余态进展保留，但整体v0.3验收第3项不能PASS，不送全成功Gate2；待Art具体差异与最小下一步。
- **坐标反证**：Tech复算front相对face偏移(+24,+45)，目标front local x0..8,y38..59为真实深色发丝，并非旧肤色；Art先前肤色观察来自另一坐标。已撤回“front旧肤色导致灰缝/可安全清front”的推断，AC灰缝根因未确证。保持只读诊断，不能误删真发；无新增编辑输出。
- **证据图坐标修正（待独立核）**：Art发现4×诊断拼图把front误置face原点，正确应(+24,+45)；仅修拼图，实际资产/U00未变。Master在正确三层happy与U00观察前发连续，原“竖缝”可能是诊断图假象。Tech正独立核source/native/U00对应，Art维持BLOCKED；若确认第二轮资产实际合格，可更正流程结果，保留本判断链且不做第三次编辑。
- **独立复核解除AC阻塞**：Tech按正确base+face(48,95)+front(72,140)native实链核source crop RGBA差0、U00 ROI差0；正确拼图前发连续，原竖缝是front错位的诊断图假象。历史BLOCKED和误诊记录保留；第二轮资产实际成立，没有第三次资产修改，Art恢复IN_PROGRESS继续最终包。此时尚未Gate2审核，Client仍锁。
- **准确包重绑中**：Tech终核发现AD继承base源与native约467px可见差异；本轮眉线ROI修复结论与此独立。Master派Art/Tech补AD五态native768三层验证PSD，按现有切片@nativeoffset确定性组装；原12份fullPSD保留并披露差异，不改PNG/旧v0.2 base，不增生成或修图轮。Manifest/map/packet将重绑最终SHA。Art从暂定USER_REVIEW退回IN_PROGRESS，v0.3 Approval暂DRAFT，待准确包核完再送。

## 准确v0.3送审状态（2026-10-17T08:43:05Z）
- Master `ART_PACKAGE_IDENTITY.json`已重绑准确包：247资源引用；manifest SHA `4bb0fc9474634d35c98bf2088d7751a26a302d41de56e68854bbaab93b21b83d`，审核包SHA `062b2b7730b1f39ab44e07b2ab38d227a78ab79a3787d5dc4353d7dcbd02c587`，Art DELIVERABLE SHA `ef6b2a539aa50b4b3676b2f2f773fce00c71a59c6330d2024f5798cd48ac51ea`。AD追加native三层PSD作为真实切片编辑/重组参照，原fullPSD历史保留并披露继承差异。Art四验收PASS，准确v0.3 USER_REVIEW、用户决定空。
- Tech本轮四Required及验收经Master `TECH_SUPPORT_ACCEPTANCE.json`内部接受，Task DONE/Approval PROFESSIONAL_REVIEW；运行与QA未做。新增imagegen0，历史32/48未清零，0CLI。Client未导入、UUID无。
