import { ToastBtnType } from "../managers/toastManager";
import { debugLog } from "../utils/util";
import BasePanel from "./basePanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ToastPanel extends BasePanel {

    public toastBtnType: ToastBtnType = ToastBtnType.TWO;

    private popBG: cc.Sprite = null;
    private noBtn: cc.Sprite = null;
    private yesBtn: cc.Sprite = null;
    private confirmBtn: cc.Sprite = null;

    private textLabel: cc.Label = null;

    private noLabel: cc.Label = null;
    private yesLabel: cc.Label = null;
    private confirmLabel: cc.Label = null;

    __preload(): void {
        this.openFilter = true;
        super.__preload();
    }

    onLoad () {

        const bindBtnEvent = (btn: cc.Button,callbackName: string) => {
            if(this.toastBtnType === ToastBtnType.NONE) return;

            const clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'toastPanel';
            clickEventHandler.handler = callbackName;
            btn.clickEvents.length = 0;
            btn.clickEvents.push(clickEventHandler);
        }

        const setBtnList = (b: boolean) => {
            this.yesBtn.node.active = this.toastBtnType != ToastBtnType.NONE ? b : false;
            this.noBtn.node.active = this.toastBtnType != ToastBtnType.NONE ? b : false;
            this.yesLabel.node.active = this.toastBtnType != ToastBtnType.NONE ? b : false;
            this.noLabel.node.active = this.toastBtnType != ToastBtnType.NONE ? b : false;
            
            this.confirmBtn.node.active = this.toastBtnType != ToastBtnType.NONE ? !b : false;
            this.confirmLabel.node.active = this.toastBtnType != ToastBtnType.NONE ? !b : false;
            debugLog('绑定按钮事件');
            bindBtnEvent(this.yesBtn.node.getComponent(cc.Button),'yesBtnEvent');
            bindBtnEvent(this.noBtn.node.getComponent(cc.Button),'noBtnEvent');
            bindBtnEvent(this.confirmBtn.node.getComponent(cc.Button),'confirmBtnEvent');
        }

        switch(this.toastBtnType) {
            case ToastBtnType.ONE:
                setBtnList(false);
                break;
            case ToastBtnType.TWO:
                setBtnList(true);
                break;
            case ToastBtnType.NONE:
                setBtnList(false);
                break;
        }
        
    }

    confirmBtnEvent() {
        this.node.active = false;
        this.node.destroy();
        
    }

    public yesBtnEvent() {

    }

    noBtnEvent() {

    }

    start () {

    }

    // update (dt) {}
}
