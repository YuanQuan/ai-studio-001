"""Generate factual Art package from saved PSD/export validation, no raster edits."""
from __future__ import annotations
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent
REPO=OUT.parents[3]
TASK='U01-GENTLE-UNDERWORLD-ASSET-001'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def rp(p):return str(Path(p).relative_to(REPO)).replace('\\','/')
def write(p,s):Path(p).write_text(s,encoding='utf-8')
def jd(p,obj):write(p,json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def main():
    b=json.loads((ROOT/'build_validation.json').read_text(encoding='utf-8'))
    v=json.loads((ROOT/'viewport_validation.json').read_text(encoding='utf-8'))
    runtime=json.loads((ROOT/'draw_runtime.json').read_text(encoding='utf-8'))
    psha=sha(OUT/'PREFLIGHT_PLAN.md')
    assert psha=='321f07caa3c3096c30ec809ff88c323eddf45d9409840c4a8d5e7eea5ea3ad4f'
    base=[]
    for x in b['base']:
        base.append({'file':rp(x['file']),'sha256':x['sha256'],'canvas':[2172,724],'mode':'RGBA','alpha_bbox_xyxy_exclusive':x['alpha_bbox'],'pixel_equal_approved_psd':True})
    props=[]
    for x in b['props']:
        props.append({'id':x['id'],'file':rp(x['file']),'sha256':x['sha256'],'canvas':[2172,724],'mode':'RGBA','alpha_bbox_xyxy_exclusive':x['alpha_bbox'],'pivot_xy':x['pivot'],'psd_layer_names':[x['id']+' '+name for name in x['source_part_names']],'source_svg_sha256':x['source_svg_sha256'],'source_part_files':[rp(p) for p in x['source_part_files']]})
    cuts={'task_id':TASK,'version':'v0.3','status':'CANDIDATE_AWAITING_GATE2_USER_APPROVAL','gate1_plan_user_approved':True,'gate2_specific_asset_user_approved':False,'art_tech_same_preflight_sha256':psha,'source_approved_psd':{'file':'deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd','sha256':b['approved_psd_sha256']},'master':{'file':rp(b['new_psd']),'sha256':b['new_psd_sha256'],'canvas':[2172,724],'raster_layer_count':b['layer_count'],'native_psd_group_folders':False,'independent_component_layers':True},'base_layers':base,'independent_props':props,'overall':{'file':rp(b['overall']),'sha256':b['overall_sha256'],'same_scale_from_psd_layers':True,'psd_stored_preview_max_channel_delta':b['psd_stored_max_channel_delta']},'review':{'detail_board':{'file':rp(OUT/'review'/'local_detail_board.png'),'sha256':sha(OUT/'review'/'local_detail_board.png')},'portrait_sheet':{'file':rp(OUT/'review'/'portrait_viewports.png'),'sha256':sha(OUT/'review'/'portrait_viewports.png')},'state_count':30,'intermediate_motion_samples':3,'minimum_alpha_all_30':min(x['minimum_composite_alpha'] for label,row in v.items() if label!='intermediate_motion_samples' for x in row.values())},'layer_order_bottom_to_top':b['layer_names'],'coordinate_convention':'左上原点；alpha bbox 左/上含、右/下不含；各件 PNG 均为全画布未 trim。','client_integration':'NOT_STARTED; USER_APPROVAL_REQUIRED'}
    jd(OUT/'CUT_MANIFEST.json',cuts)
    lines=['# U01 v0.3 来源与实际制作记录','',f'- 已批 Gate1 方案：`U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.2`，Producer 已登记 `USER_APPROVED`。首图前 Art/Tech 对同一预案 SHA-256 `{psha.upper()}` 分别签认；详见 `ART_PREFLIGHT.json` 与 `TECH_PREFLIGHT.json`。','- 旧场景唯一底本：`deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`，SHA-256 `'+b['approved_psd_sha256'].upper()+'`。保存的 PSD 四层经独立回读，与批准的四张 PNG 逐像素相同。没有使用被用户退回的 v0.2 花、莲纹、景石、忘川 PSD/PNG/SVG/笔触。','- 新六件由本批原创 path-only SVG 绘制；无外部图片、字体、模板或 `<text>` 调用。SVG 源和实际 alpha、pivot 对应关系在 `CUT_MANIFEST.json`。桥牌先作代表样张，Art 与 Tech 对实际 PSD/PNG/可读性/预算分别通过后扩展其余五件；见 `ART_SAMPLE_REVIEW.json`、`TECH_SAMPLE_REVIEW.json`。','- 本地工具：Node '+runtime['node']+'，sharp '+runtime['sharp']+'，libvips '+runtime['vips']+'，librsvg '+runtime['rsvg']+'；bundled Python/Pillow/NumPy 回读与核验；原版 bggg `image2psd.py assemble` 组装。sharp 本地许可标 Apache-2.0，bggg 本地许可 MIT。工具只用于制作，不进入游戏包；全部间接依赖许可和外部相似权利未独立逐项核清。',f'- 最终 PSD：`{rp(b["new_psd"])}`，SHA-256 `{b["new_psd_sha256"].upper()}`，{b["layer_count"]} 个栅格层；四原层与每个挂件分部均已从保存后的 PSD 回读核对。PSD 内无原生文件夹组或原生可编辑文字，独立层以稳定 ID 前缀成组；原始 SVG 路径旁存。',f'- 四旧层＋六件各自透明 PNG 在原点同尺度重组，整体 `review/overall_from_psd.png`；与 PSD 存储预览最大色道差 `{b["psd_stored_max_channel_delta"]}`，不同色道数 `{b["psd_stored_nonidentical_channel_count"]}`。对批准旧整体可见差异 {b["diff_pixels_from_approved"]} 像素，均在六件预案盒内。','- 30 张静态手机投影：五比例 × 中/左/右 × zoom1/1.8，所有合成像素 alpha 最小值 255、未露底；另有三张移动中间态。它们是 Art 投影，非 Creator 运行。悬浮控件遮挡、实际贴图/图集/性能和目标设备为 `NOT_TESTED`。','', '## 六件与实际 alpha 盒','', '| ID | PNG SHA-256 | alpha 盒（右下不含） | pivot |','|---|---|---|---|']
    for x in props:lines.append('| `'+x['id']+'` | `'+x['sha256'].upper()+'` | `'+str(x['alpha_bbox_xyxy_exclusive'])+'` | `'+str(x['pivot_xy'])+'` |')
    write(OUT/'SOURCE_AND_EDIT_RECORD.md','\n'.join(lines)+'\n')
    edit=['# U01 v0.3 PSD 可编辑性与独立性核验','','- `psd/u01_gentle_underworld_props.psd`：2172×724，24 个可单独显隐/移动的栅格层。旧 L01–L04 保留其原位像素；从保存后的 PSD 再读每层，与组装输入逐像素相同。','- 六件各有一张 2172×724 透明 PNG，可单件隐藏/整体移位；其 PSD 分部层名前缀为稳定 ID，同前缀多层组成逻辑挂件。桥牌分 `ties/board/letters`；路牌分 `pole/board/letters/arrow`；右匾三字各层；幡杆、布、结、脚座独立；两灯各分光晕、罩、短尾。','- PSD 写入器未创建原生 Photoshop 文件夹组；“挂件组”是同前缀独立栅格层集合，并有独立合成 PNG 与原始 SVG 路径。PSD 中没有原生矢量或文字对象。移动时可多选该 ID 前缀层；如仅用独立 PNG，可作为一张图整体移动。','- 读取器已核 24 层名称、次序、像素；脚本层级验证不是 Photoshop/Photopea GUI 的人工编辑测试。客户端独立节点与运行时移动能力未实现，`NOT_TESTED`。','', '| 挂件 | PSD 分部层数 | PNG alpha 盒 |','|---|---:|---|']
    for x in props:edit.append(f'| `{x["id"]}` | {len(x["psd_layer_names"])} | `{x["alpha_bbox_xyxy_exclusive"]}` |')
    write(OUT/'PSD_EDITABILITY_REPORT.md','\n'.join(edit)+'\n')
    anchors=['# U01 v0.3 视觉锚点核对','','| 锚点 | 结果 | 实际证据与边界 |','|---|---|---|','| 原月夜、柳、桥、河、灯与右牌楼 | PASS | 原 PSD 四层逐像素相同；`source_build/build_validation.json`、`review/overall_from_psd.png`。 |','| 两盏孔明灯、引魂幡温和非恐怖 | PASS | 米橙低亮纸灯、月白短幡，不含怪物/血/骷髅/符咒；`review/local_detail_board.png`。 |','| “黄泉路→”“奈何桥”“酆都城”位置和文字 | PASS | 路牌箭头向右、桥牌在两灯柱间且保留拱洞、右字片收在原木匾内；局部板和独立 PNG。字符路径由 Art 原创，实际手机阅读还需用户判断。 |','| 六件独立后移位能力 | PASS（美术源） | PSD 按稳定 ID 独立分部层；六张 RGBA 全画布单件切图；`PSD_EDITABILITY_REPORT.md`。运行时节点尚无。 |','| 五比例静态极限与露底 | PASS（静态投影） | 30 张 `review/viewports/` 均合成 alpha 最小 255；`source_build/viewport_validation.json`。左侧幡/路牌与远灯在横移途中出现，极端视窗不要求全部可见。 |','| 悬浮控件遮挡与实际 Creator/目标设备 | NOT_TESTED | 本轮没有 UI 控件叠层或 Creator 构建/运行；美术投影不能替代接入后验证。 |','']
    write(OUT/'VISUAL_ANCHOR_CHECK.md','\n'.join(anchors))
    print(json.dumps({'manifest':rp(OUT/'CUT_MANIFEST.json'),'source_record':rp(OUT/'SOURCE_AND_EDIT_RECORD.md'),'editability':rp(OUT/'PSD_EDITABILITY_REPORT.md'),'anchors':rp(OUT/'VISUAL_ANCHOR_CHECK.md')},ensure_ascii=False))
if __name__=='__main__':main()
