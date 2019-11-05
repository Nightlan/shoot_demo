

/*
    登陆页面
*/


const login_buttom_url: string = "resource/assets/login.png"
const buttomXp: number = 1/5
const buttomYp: number = 3/4
const buttomWp: number = 3/5
const buttomHp: number = 1/10

class LoginUI extends egret.DisplayObjectContainer {

    private main: Main
    public constructor(m: Main) {
        super();
        this.main = m
    }

    public show(): void {
        let cover = Tool.createBitmapByName("cover_png");
        this.addChild(cover);
        let stageW = this.parent.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        cover.width = stageW;
        cover.height = stageH;
        
        let startButtom = Tool.createBitmapByName("start_png");
        this.addChild(startButtom);
        startButtom.touchEnabled = true
        startButtom.addEventListener(egret.TouchEvent.TOUCH_END,this.StartGame,this);
        startButtom.x = stageW * buttomXp;
        startButtom.y = stageH * buttomYp;
        startButtom.width = stageW * buttomWp;
        startButtom.height = stageH * buttomHp
    }

    private loginSuccess: boolean = false

    public async login() {
        await platform.login();
        const userInfo = await platform.getUserInfo(buttomXp, buttomYp, buttomWp, buttomHp, login_buttom_url);
        if (userInfo != null) {
            this.loginSuccess = true
        }
        return userInfo
    }

    private StartGame(event:egret.TouchEvent) {
        if (!this.loginSuccess){ // 没有授权前触发开始按钮
            return 
        }
        this.main.createGameScene()
    }
}