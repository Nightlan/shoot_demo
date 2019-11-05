
/*
    游戏主页面
*/

// 篮板坐标及大小
const bbX: number = 1/4
const bbY: number = 1/5
const bbW: number = 1/2
const bbH: number = 1/5

// 篮球坐标及大小
const btbX: number = 1/2
const btbY: number = 9/10
const btbW: number = bbW * 1/2
const btbH: number = bbW * 1/2

class GameUI extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }
    private backboard: egret.Bitmap
    private basketball: egret.Bitmap
    private bktOrgX: number
    private bktOrgY: number

    public show(): void {
        // 背景
        let bg = Tool.createBitmapByName("bg_png");
        this.addChild(bg);
        let stageW = this.parent.stage.stageWidth;
        let stageH = this.parent.stage.stageHeight;
        bg.width = stageW;
        bg.height = stageH;

        // 篮板
        this.backboard = Tool.createBitmapByName("backboard_png");
        this.addChild(this.backboard);
        this.backboard.x = bbX * stageW
        this.backboard.y = bbY * stageH
        this.backboard.width = bbW * stageW
        this.backboard.height = bbH * stageH

        // 篮球
        this.basketball = Tool.createBitmapByName("basketball_png");
        this.addChild(this.basketball);
        this.basketball.anchorOffsetX = this.basketball.width / 2;
        this.basketball.anchorOffsetY = this.basketball.width / 2;
        this.bktOrgX = this.basketball.x = btbX * stageW
        this.bktOrgY = this.basketball.y = btbY * stageH
        this.basketball.touchEnabled = true;
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
   
    }

    private shooting: boolean = false
    private touch: boolean = false
    private controlPos: egret.Point = new egret.Point()
    private targetPos: egret.Point = new egret.Point()

    private mouseDown(evt:egret.TouchEvent){
        if (this.touch) {
            return;
        }
        this.touch = true
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    private mouseMove(evt:egret.TouchEvent){
        if( this.touch ){
            this.targetPos.x = evt.stageX 
            this.targetPos.y = evt.stageY
        }
    }

    private mouseUp(evt:egret.TouchEvent){
        if (this.shooting || !this.touch) {
            return;
        }
        this.touch = false;
        this.targetPos.x = evt.stageX
        this.targetPos.y = evt.stageY
        this.controlPos.x = (this.basketball.x + this.targetPos.x) / 2
        this.controlPos.y = 0
        this.shooting = true
        let iDirection: number
        iDirection = this.targetPos.x > this.basketball.x ? 30 : -30
        var funcChange = ():void=>{
            this.basketball.rotation += iDirection;
        }
        egret.Tween.get(this, { onChange:funcChange, onChangeObj:this })
         .to({factor: 1}, 2000).call(this.moveOver, this);
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    public get factor():number {
        return 0;
    }

    public set factor(value:number) {
        this.basketball.x = (1 - value) * (1 - value) * this.basketball.x + 
         2 * value * (1 - value) * this.controlPos.x + 
         value * value * this.targetPos.x;
        this.basketball.y = (1 - value) * (1 - value) * this.basketball.y +
         2 * value * (1 - value) * this.controlPos.y + 
         value * value * this.targetPos.y;
    }

    private moveOver():void {
        this.shooting = false;
        this.basketball.x = this.bktOrgX
        this.basketball.y = this.bktOrgY
    }

}