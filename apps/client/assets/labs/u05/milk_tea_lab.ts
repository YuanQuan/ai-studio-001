import { _decorator, Color, Component, Graphics, Label, Node, UITransform, Vec3, EventMouse, view, sys, Input, input, JsonAsset, resources } from 'cc';
import {
  DEFAULT_PROGRESS, DIMENSIONS, DIMENSION_NAMES, LabConfig, Progress, Run, STORAGE_KEY,
  VALIDATION_KEY, chooseStage, expireRun, isUnlocked, makeRun, normalizeProgress, remainingSeconds,
  selectIngredient, settleWin, submitCup, undoIngredient, stagesFor, reconcileUnlocks,
} from './milk_tea_state';

const { ccclass } = _decorator;
const PANEL = new Color(19, 34, 51), TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199), BLUE = new Color(108, 193, 224), GOLD = new Color(246, 189, 109);

@ccclass('U05MilkTeaLab')
export class U05MilkTeaLab extends Component {
  private root: Node | null = null;
  private config: LabConfig | null = null;
  private configLoaded = false;
  private progress: Progress = { ...DEFAULT_PROGRESS };
  private tierIndex = 0;
  private run: Run | null = null;
  private validation = { enabled: false, stage: 1, unlockGrowth: false, level: 1, soul: 0, spirit: 0 };
  private status = '';
  private statusColor = TEXT;
  private recipeOpen = false;
  private dirty = true;
  private lastClockSecond = -1;
  private warnedStorage = false;
  private readonly actions = new Map<Node, () => void>();
  private readonly modalActions = new Set<Node>();
  private down: Node | null = null;
  private resize: (() => void) | null = null;
  private onExit: (() => void) | null = null;
  private timerLabel: Label | null = null;
  private overlayActive = false;
  private lastTouchAt = 0;
  public setExitHandler(handler: () => void): void { this.onExit = handler; }

  protected onLoad(): void {
    this.readProgress(); this.readValidation();
    this.root = new Node('U05MilkTeaLab'); this.node.addChild(this.root);
    this.root.addComponent(UITransform).setContentSize(view.getVisibleSize());
    this.resize = () => { if (this.root?.isValid) this.root.getComponent(UITransform)?.setContentSize(view.getVisibleSize()); this.dirty = true; };
    view.on('canvas-resize', this.resize, this);
    input.on(Input.EventType.MOUSE_DOWN, this.mouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.mouseUp, this);
    input.on(Input.EventType.TOUCH_START, this.touchStart, this);
    input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
    this.render();
    this.loadConfig();
  }

  private loadConfig():void {if(!this.status.startsWith('损坏'))this.status='';resources.load('u05_milk_tea/config', JsonAsset, (error, asset) => {if (!this.isValid) { if(asset)resources.release('u05_milk_tea/config',JsonAsset); return; }if (error || !asset?.json) { this.status='配置加载失败，请检查资源后重试'; this.statusColor=GOLD; this.dirty=true; return; }this.config = asset.json as LabConfig; this.configLoaded = true; this.reconcileProgress(); this.dirty = true;});}

  protected update(): void {
    if (this.run?.status === 'playing') {
      const next = expireRun(this.run, this.now());
      if (next !== this.run) { this.run = next; this.recipeOpen=false; this.status = '时间到，本局失败'; this.statusColor = GOLD; this.dirty = true; }
      const second = remainingSeconds(this.run, this.now());
      if (this.run.status==='failed') this.recipeOpen=false;
      if (second !== this.lastClockSecond) { this.lastClockSecond = second ?? -1; if(this.timerLabel)this.timerLabel.string=second===null?'不限时':`剩余 ${second} 秒`; }
    }
    if (this.dirty) this.render();
  }

  protected onDestroy(): void {
    view.off('canvas-resize', this.resize!, this);
    input.off(Input.EventType.MOUSE_DOWN, this.mouseDown, this);
    input.off(Input.EventType.MOUSE_UP, this.mouseUp, this);
    input.off(Input.EventType.TOUCH_START, this.touchStart, this);
    input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
    this.actions.clear(); this.modalActions.clear(); this.down = null; if(this.configLoaded)resources.release('u05_milk_tea/config',JsonAsset); this.configLoaded=false; this.root = null; this.run = null;
  }

  private now(): number { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
  private readProgress(): void {
    try { const value = sys.localStorage?.getItem(STORAGE_KEY); if (value) this.progress = normalizeProgress(JSON.parse(value)); else this.progress={...DEFAULT_PROGRESS}; }
    catch { this.progress = { ...DEFAULT_PROGRESS }; this.status = '损坏：隔离示例存档已恢复默认进度'; this.statusColor = GOLD; }
  }
  private readValidation(): void {
    try {
      const raw = sys.localStorage?.getItem(VALIDATION_KEY);
      if (raw) { const value = JSON.parse(raw); this.validation = { enabled: !!value.enabled, stage: value.stage === 2 ? 2 : 1, unlockGrowth: !!value.unlockGrowth, level: Number(value.level)||1, soul: Number(value.soul)||0, spirit: Number(value.spirit)||0 }; }
    } catch { this.validation = { enabled: false, stage: 1, unlockGrowth: false, level: 1, soul: 0, spirit: 0 }; }
  }
  private writeProgress(): void {
    try { sys.localStorage?.setItem(STORAGE_KEY, JSON.stringify(this.progress)); }
    catch { this.warnedStorage = true; }
  }
  private writeValidation(): void {
    try { sys.localStorage?.setItem(VALIDATION_KEY, JSON.stringify(this.validation)); } catch { /* current session remains usable */ }
  }

  private draw(parent: Node, name: string, x: number, y: number, w: number, h: number, color = PANEL): Node {
    const node = new Node(name); parent.addChild(node); node.setPosition(x, y); node.addComponent(UITransform).setContentSize(w, h);
    const g = node.addComponent(Graphics); g.fillColor = color; g.roundRect(-w/2, -h/2, w, h, 12); g.fill(); g.strokeColor = BLUE; g.lineWidth = 2; g.roundRect(-w/2, -h/2, w, h, 12); g.stroke();
    return node;
  }
  private text(parent: Node, value: string, x: number, y: number, size: number, color = TEXT, w = 650, h = 48): Label {
    const node = new Node('Text'); parent.addChild(node); node.setPosition(x, y); node.addComponent(UITransform).setContentSize(w, h);
    const l = node.addComponent(Label); l.string = value; l.fontSize = size; l.lineHeight = size + 6; l.color = color; l.overflow = Label.Overflow.SHRINK; l.horizontalAlign = Label.HorizontalAlign.CENTER; l.verticalAlign = Label.VerticalAlign.CENTER; return l;
  }
  private button(parent: Node, value: string, x: number, y: number, w: number, h: number, action: () => void, enabled = true): Node {
    const node = this.draw(parent, `Button_${value}`, x, y, w, h, enabled ? PANEL : new Color(17, 27, 39));
    this.text(node, value, 0, 0, Math.min(28, h * .65), enabled ? TEXT : MUTED, w - 12, h - 8);
    if (enabled) { this.actions.set(node, action); if(this.overlayActive)this.modalActions.add(node); }
    return node;
  }
  private paint(node: Node, pressed: boolean): void {
    const size = node.getComponent(UITransform)?.contentSize, g = node.getComponent(Graphics); if (!size || !g) return;
    g.clear(); g.fillColor = pressed ? BLUE : PANEL; g.roundRect(-size.width/2,-size.height/2,size.width,size.height,12); g.fill(); g.strokeColor=BLUE; g.lineWidth=2; g.roundRect(-size.width/2,-size.height/2,size.width,size.height,12); g.stroke();
  }
  private mouseDown(event: EventMouse): void { if(event.getButton()!==EventMouse.BUTTON_LEFT||Date.now()-this.lastTouchAt<500)return; this.down=this.hit(event.getUILocation()); }
  private mouseUp(event: EventMouse): void { if(event.getButton()!==EventMouse.BUTTON_LEFT||Date.now()-this.lastTouchAt<500)return; const target=this.hit(event.getUILocation()); if(target&&target===this.down)this.actions.get(target)?.(); this.down=null; }
  private touchStart(event:any):void{this.lastTouchAt=Date.now();this.down=this.hit(event.getUILocation());}
  private touchEnd(event:any):void{this.lastTouchAt=Date.now();const target=this.hit(event.getUILocation());if(target&&target===this.down)this.actions.get(target)?.();this.down=null;}
  private hit(point: {x:number;y:number}): Node | null {
    const candidates=this.overlayActive?this.modalActions:this.actions.keys();
    for(const node of candidates){if(!node.isValid)continue;const transform=node.getComponent(UITransform);if(!transform||!node.activeInHierarchy)continue;const local=transform.convertToNodeSpaceAR(new Vec3(point.x,point.y,0));const size=transform.contentSize;if(Math.abs(local.x)<=size.width/2&&Math.abs(local.y)<=size.height/2)return node;}
    return null;
  }

  private render(): void {
    if (!this.root?.isValid) return; this.dirty = false; this.actions.clear(); this.modalActions.clear(); this.root.destroyAllChildren(); this.timerLabel=null;this.overlayActive=false;
    if (!this.config && this.status.startsWith('配置加载失败')) { this.text(this.root,this.status,0,0,19,GOLD,620,90);this.button(this.root,'重试加载',0,-75,170,48,()=>this.loadConfig());this.button(this.root,'返回菜单',0,-136,170,48,()=>this.leave());return; }
    if (!this.config) { this.text(this.root,'正在载入奶茶配置…',0,0,22,TEXT);this.button(this.root,'返回菜单',0,-90,170,48,()=>this.leave());return; }
    const size = view.getVisibleSize(), safe = sys.getSafeAreaRect(false); const top = Math.min(size.height/2, safe.y+safe.height-size.height/2), bottom=Math.max(-size.height/2,safe.y-size.height/2);
    const xscale = Math.min(1,(size.width-24)/660); this.root.setScale(xscale,xscale,1);
    const titleY=top-38; this.text(this.root,'U05 奶茶店',0,titleY,30,GOLD,650,48);
    if (this.warnedStorage) this.status='浏览器不支持写入：本次进度只保留在当前页面';
    const tierId=Array.from(new Set(this.config.difficulty_stages.map(stage=>stage.tier_id)))[this.tierIndex];
    const tierStages=stagesFor(this.config,tierId);
    const tier={tier_id:tierId,display_name:['简单','中等','困难','地狱','噩梦'][this.tierIndex],stages:tierStages,recipe_dims:tierStages[0]?.recipe_dims??3};
    if (!this.run) this.renderSelection(tier, top, bottom);
    else this.renderGame(tier, top, bottom);
  }
  private renderSelection(tier: any, top: number, bottom: number): void {
    const y=top-105;
    const normalProgress=this.readSessionProgress();
    this.text(this.root,`熟练度 ${normalProgress.xp}　已通关 ${normalProgress.cleared.length}/5 档`,0,y,19,MUTED,650,40);
    this.text(this.root,`选择难度　${tier.display_name}`,0,y-58,26,GOLD,650,42);
    const tierW=122, gap=7, start=-((tierW+gap)*4)/2;
    Array.from(new Set(this.config!.difficulty_stages.map(stage=>stage.tier_id))).forEach((id,index)=>{
      const label=['简单','中等','困难','地狱','噩梦'][index];
      const unlocked=this.validation.enabled || isUnlocked(this.config!,normalProgress,id,this.growthInputs(),false);
      this.button(this.root,unlocked?label:'锁 '+label,start+index*(tierW+gap),y-120,tierW,58,()=>{this.tierIndex=index;this.status='';this.dirty=true;},unlocked);
    });
    const activeProgress=this.readSessionProgress();
    const currentStage=chooseStage(this.config!,tier.tier_id,activeProgress.xp,this.validation.enabled?this.validation.stage:null);
    const stage=`本局阶段：${currentStage.stage_no}${this.validation.enabled?'（验证设置）':''}`;
    this.text(this.root,stage,0,y-180,18,MUTED,650,34);
    const nextUnlock=this.config!.unlock_conditions.find(item=>item.tier_id===(['EASY','MEDIUM','HARD','HELL','NIGHTMARE'][Math.min(4,this.tierIndex+1)]));
    const prevName=['简单','中等','困难','地狱','噩梦'][Math.max(0,this.tierIndex)];
    if(nextUnlock&&!this.progress.unlocked.includes(nextUnlock.tier_id))this.text(this.root,this.unlockSummary(nextUnlock,prevName),0,y-220,24,MUTED,650,58);
    this.draw(this.root,'CupPreview',0,y-360,250,180,new Color(37,60,72));
    this.draw(this.root,'CupBody',0,y-365,82,112,new Color(241,225,194));
    this.draw(this.root,'TeaLayer',0,y-385,70,48,new Color(185,129,76));
    this.draw(this.root,'CupTop',0,y-306,92,10,new Color(227,216,197));
    this.draw(this.root,'Straw',25,y-287,8,46,new Color(239,143,117));
    this.text(this.root,'● ● ●',0,y-414,18,new Color(66,49,41),100,26);
    this.text(this.root,'本档饮品备选',0,y-472,24,MUTED,300,36);
    this.button(this.root,'开始制作',0,bottom+210,300,70,()=>this.beginRun(tier),!!this.config && !!tier.stages.length);
    this.button(this.root,'返回菜单',0,bottom+126,210,56,()=>this.leave());
    this.button(this.root,this.toggleValidation?'关闭验证设置':'示例验证设置',0,bottom+58,230,46,()=>{this.toggleValidation=!this.toggleValidation;this.overlayActive=this.toggleValidation;this.dirty=true;});
    if (this.toggleValidation) this.renderValidation();
    this.text(this.root,this.status,0,bottom+20,16,this.statusColor,660,34);
  }
  private unlockSummary(condition:any,previousName:string):string{const parts=[`${previousName}通关`];if(condition.xp_enabled)parts.push(`熟练度 ${condition.xp_min}`);if(condition.level_enabled)parts.push(`店长等级 ${condition.level_min}`);if(condition.soul_enabled)parts.push(`魂 ${condition.soul_min}`);if(condition.spirit_enabled)parts.push(`魄 ${condition.spirit_min}`);return `下一档解锁：${previousName}通关\n${parts.slice(1).join('＋')}`;}
  private toggleValidation=false;
  private renderValidation(): void {
    this.overlayActive=true;
    const y=0;
    this.draw(this.root,'ValidationPanel',0,y,620,480,new Color(13,26,40));
    this.text(this.root,'示例验证设置',0,y+190,24,GOLD,590,38);
    this.text(this.root,'仅影响当前示例会话，不会写入正常进度',0,y+150,15,MUTED,590,30);
    this.button(this.root,this.validation.enabled?'验证模式：开':'验证模式：关',-150,y+92,220,46,()=>{this.validation.enabled=!this.validation.enabled;this.writeValidation();this.sessionProgress=null;this.dirty=true;});
    this.button(this.root,`阶段 ${this.validation.stage}`,145,y+92,180,46,()=>{this.validation.stage=this.validation.stage===1?2:1;this.writeValidation();this.dirty=true;});
    this.button(this.root,'重置隔离存档',0,y+34,200,46,()=>{this.progress={...DEFAULT_PROGRESS};this.sessionProgress=null;this.writeProgress();this.status='U05 隔离进度已重置';this.dirty=true;});
    this.button(this.root,`等级 ${this.validation.level}`, -205,y-32,130,40,()=>{this.validation.level=this.validation.level>=3?1:this.validation.level+1;this.writeValidation();this.reconcileProgress();this.dirty=true;});
    this.button(this.root,`魂 ${this.validation.soul}`, -65,y-32,110,40,()=>{this.validation.soul=(this.validation.soul+1)%4;this.writeValidation();this.reconcileProgress();this.dirty=true;});
    this.button(this.root,`魄 ${this.validation.spirit}`, 75,y-32,110,40,()=>{this.validation.spirit=(this.validation.spirit+1)%8;this.writeValidation();this.reconcileProgress();this.dirty=true;});
    this.button(this.root,'完成设置',0,y-100,180,48,()=>{this.toggleValidation=false;this.overlayActive=false;this.dirty=true;});
  }

  private renderGame(tier:any,top:number,bottom:number):void {
    const run=this.run!; const y=top-106; const seconds=remainingSeconds(run,this.now());
    this.text(this.root,`${tier.display_name}　${run.stage.stage_no}/2 阶段　${Math.min(run.orderIndex+1,run.orders.length)}/${run.orders.length} 杯`,0,y,20,GOLD,650,38);
    this.timerLabel=this.text(this.root,seconds===null?'不限时':`剩余 ${seconds} 秒`,0,y-46,23,seconds!==null&&seconds<20?GOLD:TEXT,600,38);
    const recipe=run.orders[Math.min(run.orderIndex,run.orders.length-1)];
    this.draw(this.root,'OrderPanel',0,y-142,620,120,new Color(27,44,58));
    this.text(this.root,recipe.drink_name,0,y-111,22,GOLD,580,34);
    const ingredientMap=new Map((this.config?.ingredients??[]).map(item=>[item.ingredient_id,item.name]));
    const ids:any={TEA:recipe.tea_id,MILK:recipe.milk_id,TOPPING:recipe.topping_id,SWEET:recipe.sweet_id,ICE:recipe.ice_id};
    const hint=Object.keys(run.optionPool).map(dim=>`${DIMENSION_NAMES[dim]}：${ingredientMap.get(ids[dim])??'—'}`).join('　');
    if(run.stage.recipe_dims===3) this.text(this.root,hint,0,y-157,16,TEXT,590,38);
    const dims=Object.keys(run.optionPool); const sectionTop=y-232; const sectionBottom=bottom+260;
    const rowGap=Math.max(63,Math.min(92,(sectionTop-sectionBottom)/dims.length));
    dims.forEach((dim,index)=>{
      const rowY=sectionTop-index*rowGap;
      this.text(this.root,`${DIMENSION_NAMES[dim]}　${run.selected[dim]?`已选 ${run.optionPool[dim].find((o:any)=>o.ingredient_id===run.selected[dim])?.name}`:'请选择'}`,0,rowY,24,MUTED,620,36);
      const options=run.optionPool[dim], gap=8, w=Math.min(136,(620-gap*(options.length-1))/options.length);
      const left=-(w*options.length+gap*(options.length-1))/2;
      options.forEach((item:any,itemIndex:number)=>this.button(this.root,item.name,left+w/2+itemIndex*(w+gap),rowY-39,w,46,()=>this.choose(dim,item.ingredient_id)));
    });
    this.button(this.root,'撤销一项',-205,bottom+143,150,50,()=>this.undo(),Object.keys(run.selected).length>0);
    this.button(this.root,this.recipeOpen?'收起配方':'查看配方',0,bottom+143,170,50,()=>{this.recipeOpen=!this.recipeOpen;this.dirty=true;});
    this.button(this.root,'确认交杯',205,bottom+143,150,50,()=>this.submit(),run.status==='playing'&&Object.keys(run.optionPool).every(dim=>!!run.selected[dim]));
    this.button(this.root,'退出本局',0,bottom+79,180,46,()=>this.confirmExit(),!this.recipeOpen);
    if(this.recipeOpen){this.overlayActive=true;this.draw(this.root,'RecipeOverlay',0,0,Math.min(610,view.getVisibleSize().width-32),260,new Color(24,41,58));this.text(this.root,recipe.drink_name,0,84,22,GOLD,570,38);const ingredientMap=new Map((this.config?.ingredients??[]).map(item=>[item.ingredient_id,item.name]));const ids:any={TEA:recipe.tea_id,MILK:recipe.milk_id,TOPPING:recipe.topping_id,SWEET:recipe.sweet_id,ICE:recipe.ice_id};this.text(this.root,DIMENSIONS.filter(dim=>ids[dim]).map(dim=>`${DIMENSION_NAMES[dim]}：${ingredientMap.get(ids[dim])}`).join('\n'),0,0,24,TEXT,560,150);this.button(this.root,'继续制作',0,-98,190,48,()=>{this.recipeOpen=false;this.dirty=true;});}
    if(run.status==='won'||run.status==='failed'||run.status==='exited'){this.overlayActive=true;this.renderResult(bottom);}
    this.text(this.root,this.status,0,bottom+26,24,this.statusColor,660,42);
  }
  private renderResult(bottom:number):void{
    const won=this.run!.status==='won';this.draw(this.root,'ResultOverlay',0,0,560,310,new Color(13,26,40));
    this.text(this.root,won?'三杯完成！':'本局结束',0,92,30,GOLD,520,48);
    if(won){this.text(this.root,`本地示例熟练度 +${this.lastXp}`,0,42,18,TEXT,500,34);this.button(this.root,'再玩一局',0,-42,190,54,()=>this.retry());this.button(this.root,'返回菜单',0,-112,190,54,()=>this.leave());}
    else {this.button(this.root,'重试本档',-110,-78,190,54,()=>this.retry());this.button(this.root,'返回菜单',110,-78,190,54,()=>this.leave());}
  }
  private lastXp=0;

  private sessionProgress:Progress|null=null;
  private readSessionProgress():Progress{return this.validation.enabled?(this.sessionProgress??reconcileUnlocks(this.config!,this.progress,this.growthInputs(),true)):this.progress;}
  private growthInputs(){return {level:this.validation.level,soul:this.validation.soul,spirit:this.validation.spirit,growthEnabled:this.validation.unlockGrowth};}
  private reconcileProgress():void{if(!this.config)return;if(this.validation.enabled){this.sessionProgress=reconcileUnlocks(this.config,this.readSessionProgress(),this.growthInputs(),true);return;}this.progress=reconcileUnlocks(this.config,this.progress,this.growthInputs(),false);this.writeProgress();}
  private beginRun(tier:any):void{
    const progress=this.readSessionProgress();
    if(!this.validation.enabled&&!isUnlocked(this.config!,progress,tier.tier_id,this.growthInputs(),false)){this.status='此难度尚未解锁';this.statusColor=GOLD;this.dirty=true;return;}
    const stage=chooseStage(this.config!,tier.tier_id,progress.xp,this.validation.enabled?this.validation.stage:null);
    this.run=makeRun(this.config!,stage,this.now()); this.status='';this.statusColor=TEXT;this.recipeOpen=false;this.lastClockSecond=-1;this.dirty=true;
  }
  private choose(dim:string,id:string):void{if(!this.run)return;this.run=selectIngredient(this.run,dim,id,this.now());if(this.run.status==='failed'){this.recipeOpen=false;this.status='时间到，本局失败';this.statusColor=GOLD;}this.dirty=true;}
  private undo():void{if(!this.run)return;const dimension=[...DIMENSIONS].reverse().find(dim=>!!this.run?.selected[dim]);if(dimension)this.run=undoIngredient(this.run,dimension,this.now());this.dirty=true;}
  private submit():void{
    if(!this.run)return;const result=submitCup(this.run,this.now());this.run=result.run;
    if(result.result==='expired')this.recipeOpen=false;
    this.statusColor=result.result==='wrong'?GOLD:TEXT;
    this.status=result.result==='incomplete'?'请先选齐所有原料':result.result==='wrong'?'配方不对，请重做当前这杯':result.result==='expired'?'时间到，本局失败':result.result==='won'?'正确！本局完成':'正确，下一杯！';
    if(result.result==='won'){this.recipeOpen=false;const base=this.readSessionProgress();const settled=settleWin(this.config!,base,this.run,this.growthInputs(),this.validation.enabled);const next=reconcileUnlocks(this.config!,settled.progress,this.growthInputs(),false);this.run=settled.run;this.lastXp=settled.xpAdded;if(this.validation.enabled){this.sessionProgress=next;}else{this.progress=next;this.writeProgress();}}
    this.dirty=true;
  }
  private confirmExit():void{if(!this.run)return;this.recipeOpen=false;this.run={...this.run,status:'exited'};this.status='离开后本局不计熟练度';this.statusColor=GOLD;this.dirty=true;}
  private retry():void{const tierId=Array.from(new Set(this.config!.difficulty_stages.map(stage=>stage.tier_id)))[this.tierIndex];const stages=stagesFor(this.config!,tierId);const tier={tier_id:tierId,stages};this.run=null;this.beginRun(tier);}
  private leave():void{this.run=null;this.recipeOpen=false;this.status='';this.actions.clear();this.modalActions.clear();this.onExit?.();}
}
