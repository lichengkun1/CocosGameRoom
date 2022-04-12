import MessageSoundManager from "./Utils/MessageSoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BgmSettings extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    public bgmOnNode: cc.Node = null;
    public bgmOffNode: cc.Node = null;

    onLoad () {
        this.bgmOnNode = this.node.getChildByName('bgmOn');
        this.bgmOffNode = this.node.getChildByName('bgmOff');
        console.log('audioEngineOn is ',MessageSoundManager.audioEngineOn);
        this.setBgmNodeByTag();
    }

    onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_END,this.tapBgmSettings,this);
    }

    onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_END,this.tapBgmSettings,this);
    }

    public tapBgmSettings(): void {
        MessageSoundManager.audioEngineOn = !MessageSoundManager.audioEngineOn;
        console.log('audioEnginOn is ',MessageSoundManager.audioEngineOn);
        if(MessageSoundManager.audioEngineOn) {
            this.bgmOnNode.active = true;
            this.bgmOffNode.active = false;
        } else {
            this.bgmOnNode.active = false;
            this.bgmOffNode.active = true;
        }
        this.updateMusic();
    }
    public updateMusic(): void {
        MessageSoundManager.updateMusic();

    }

    public bgmOnActive(tag: boolean) {
        this.bgmOnNode.active = tag;
    }

    public bgmOffActive(tag: boolean) {
        this.bgmOffNode.active = tag;
    }

    setBgmNodeByTag(): void {
        if(MessageSoundManager.audioEngineOn) {
            this.bgmOnNode.active = true;
            this.bgmOffNode.active = false;
        } else {
            this.bgmOnNode.active = false;
            this.bgmOffNode.active = true;
        }
    }

    start () {

    }

    // update (dt) {}
}
