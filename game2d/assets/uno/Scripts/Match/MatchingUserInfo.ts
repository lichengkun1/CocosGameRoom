import { resourceManager } from "../../../Script/common/managers/resourceManager";
import BaseComp from "../../../Script/common/ui/baseComp";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchingUserInfo extends BaseComp {

    private iconRobot: cc.Sprite = null;
    private username: cc.Label = null;
    private coinNumber: cc.Label = null;

    private gameCoin: cc.Sprite = null;

    __preload(): void {
        this.openFilter = true;
        super.__preload();
    }

    onLoad () {
        // 初始化自己的金币值
        this.initMyGameCoin();
    }

    onEnable(): void {
        this.gameCoin.node.on(cc.Node.EventType.TOUCH_END,this.goRecharge,this);
        MyEvent.I.on('onAndroidResume',this.resume,this.node);
    }

    onDisable(): void {
        this.gameCoin.node.off(cc.Node.EventType.TOUCH_END,this.goRecharge,this);
        MyEvent.I.remove('onAndroidResume',this.resume);
    }

    resume() {
        this.initMyGameCoin();
    }

    goRecharge() {
        MessageManager.buyGameCion();
    }

    initMyGameCoin() {
        MessageManager.httpIAPResult('get','v1/wallet/assets/',{},(data: any) => {
            console.log('data is ',data);
            if(data.err_code > 400) {
                return;
            }

            const diamond = data.diamond;
            this.coinNumber.string = diamond + '';
        });
    }

    initUserInfo(userData) {
        this.username.string = userData.userName;

        resourceManager.loadRemoteAsset(userData.avatar).then((res: cc.Texture2D) => {
            let frame = new cc.SpriteFrame(res);
            this.iconRobot.spriteFrame = frame;
        });
        
    }

    start () {

    }

    // update (dt) {}
}
