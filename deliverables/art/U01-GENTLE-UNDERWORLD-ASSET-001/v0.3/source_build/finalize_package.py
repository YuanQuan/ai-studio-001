"""Finalize formal U01 v0.3 Art deliverable and file check after consultation."""
from __future__ import annotations
import hashlib,json
from pathlib import Path
REPO=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent.parent
TASK='U01-GENTLE-UNDERWORLD-ASSET-001'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,o):Path(p).write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def main():
    task=load(REPO/'tasks'/TASK/'TASK.json')
    req=task['deliverables']
    assert len(req)==26 and len(set(req))==26
    assert 'Client' in (OUT/'CUT_COLLABORATION_RECORD.md').read_text(encoding='utf-8')
    for p in req:
        if p.endswith('/DELIVERABLE.json') or p.endswith('/ART_FILE_CHECK.json'):continue
        assert (REPO/p).is_file() and (REPO/p).stat().st_size>0,p
    b=load(OUT/'source_build'/'build_validation.json')
    v=load(OUT/'source_build'/'viewport_validation.json')
    states=[item for key,row in v.items() if key!='intermediate_motion_samples' for item in row.values()]
    assert len(states)==30 and all(x['nonopaque_pixels']==0 for x in states)
    cuts=load(OUT/'CUT_MANIFEST.json')
    assert len(cuts['base_layers'])==4 and len(cuts['independent_props'])==6
    assert cuts['master']['raster_layer_count']==24
    assert all(sha(REPO/x['file'])==x['sha256'] for x in cuts['base_layers']+cuts['independent_props'])
    assert sha(REPO/cuts['master']['file'])==cuts['master']['sha256']
    acc=[
      {'criterion':'Gate1 批准及首图前 Art/Tech 同 SHA 双签；桥牌样张双复核后扩批','result':'PASS','evidence':'tasks/U01-GENTLE-UNDERWORLD-ART-PLAN-001/ARTIFACT_APPROVAL.json；v0.3/ART_PREFLIGHT.json、TECH_PREFLIGHT.json、ART_SAMPLE_REVIEW.json、TECH_SAMPLE_REVIEW.json'},
      {'criterion':'旧四层逐像素保留；六件独立可编辑、独立透明 PNG 和原笔触','result':'PASS','evidence':'v0.3/CUT_MANIFEST.json；source_build/build_validation.json；PSD_EDITABILITY_REPORT.md'},
      {'criterion':'同尺度整体/细节及 30 张五比例静态视窗核对','result':'PASS','evidence':'v0.3/review/overall_from_psd.png、local_detail_board.png、portrait_viewports.png；source_build/viewport_validation.json'},
      {'criterion':'Art/Tech/Client 切图协作、逐文件核验并供 Gate2 审核','result':'PASS','evidence':'v0.3/CUT_COLLABORATION_RECORD.md、USER_REVIEW_PACKET.md、CUT_MANIFEST.json、ART_FILE_CHECK.json'},
      {'criterion':'真实 Creator 悬浮控件遮挡、图集/显存/帧时与目标机','result':'NOT_TESTED','evidence':'本轮仅美术；v0.3/VISUAL_ANCHOR_CHECK.md 和 USER_REVIEW_PACKET.md 明示后续接入再验'}
    ]
    obj={'task_id':TASK,'owner':'art','summary':'依据获批 v0.2 制作方案完成 U01 六件温和地府独立美术挂件 v0.3；24 层 PSD、四原层、六独立透明 PNG、同尺度重组和 30 竖屏静态状态，送用户 Gate2 审核。','artifacts':req,'acceptance_results':acc,'assumptions':['挂件可在美术母版/独立 PNG 层级移位；现行 Client 四节点未实现运行时单件移动。','幡 pivot 依据真实杆脚从 Gate1 候选 (720,499) 收敛为 (700,499)，脚座较 Gate1 候选底线低 2px，见 SOURCE_AND_EDIT_RECORD.md。'],'risks':['PSD 为 24 个独立栅格层，无原生文件夹组或文字对象；SVG 旁存供路径再编辑。','十张 2172×724 RGBA8 原图理论展开约 59.99 MiB；实际 Creator 图集、GPU 内存、Draw Call、悬浮控件遮挡和目标机效果未测试。','Gate2 用户尚未批准具体 v0.3 实图，Client 不得正式接入。'],'status':'READY_FOR_REVIEW'}
    save(OUT/'DELIVERABLE.json',obj)
    assert all((REPO/p).is_file() and (REPO/p).stat().st_size>0 for p in req if not p.endswith('/ART_FILE_CHECK.json'))
    check={'task_id':TASK,'reviewer':'art','decision':'APPROVED','findings':[
      {'severity':'INFO','message':f'执行 Agent 核正式 Task 26/26 Required 全部实存非空、唯一索引；DELIVERABLE 26 条与 Task Required 一一对应。最终 PSD SHA-256 {b["new_psd_sha256"]}，24 栅格层，四原层同像素，六独立 props 的路径/哈希/alpha/pivot 与 CUT_MANIFEST 一致。'},
      {'severity':'INFO','message':f'四原层、六挂件全画布 RGBA；四旧层与批准旧 PSD 逐像素相同、L04 边缘不变；30/30 静态视窗合成无透明露底；整体与 PSD 存储预览最大色道差 {b["psd_stored_max_channel_delta"]}。'},
      {'severity':'INFO','message':'桥牌样张先经 Art/Tech 实图复核；后扩六件。Art、Tech、Client 切图协作与视觉边界记录在 CUT_COLLABORATION_RECORD.md。右匾字片、路牌箭头及桥牌文字见审阅图；幡 pivot 与候选底线差异已披露。'},
      {'severity':'MINOR','message':'本文件核对只证明文件、映射、同尺度静态重组及已有验证记录；不是用户 Gate2 效果判断。真实 Creator 悬浮控件、目标机、纹理内存及帧时未测，不以此替代后续接入验证。'}
    ],'next_action':'依本组织 Agent 自行切图流程，将 v0.3 实际 PSD、十张 PNG、同尺度重组、细节、五比例静态视窗及限制直接交用户独立 Gate2 审核；用户批准前不正式接入 Client。'}
    save(OUT/'ART_FILE_CHECK.json',check)
    assert all((REPO/p).is_file() and (REPO/p).stat().st_size>0 for p in req)
    print(json.dumps({'required_count':len(req),'all_exist':True,'psd_sha256':b['new_psd_sha256'],'packet_sha256':sha(OUT/'USER_REVIEW_PACKET.md')},ensure_ascii=False))
if __name__=='__main__':main()
