const { ccclass, property } = cc._decorator;

@ccclass
export default class MainTipPopup extends cc.Component {
    public static I: MainTipPopup;
    tipLabel: cc.Label;
    yesLabel: cc.Label;
    noLabel: cc.Label;
    yesBtn: cc.Node;
    noBtn: cc.Node;
    yesBtnFunc: Function;
    noBtnFunc: Function;
    onLoad() {
        this.tipLabel = this.node.getChildByName('TipString').getComponent(cc.Label);
        this.yesLabel = this.node.getChildByName('YesLabel').getComponent(cc.Label);
        this.noLabel = this.node.getChildByName('NoLabel').getComponent(cc.Label);
        this.yesBtn = this.node.getChildByName('YesBtn');
        this.noBtn = this.node.getChildByName('NoBtn');
        MainTipPopup.I = this.node.getComponent(MainTipPopup);
        this.node.active = false;
    }
    onEnable() {
    }

    ShowTip(tipLabel: string, yesLabel: string, noLabel: string, yesBtn: Function, noBtn: Function) {

        this.yesBtn.off(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
        this.noBtn.off(cc.Node.EventType.TOUCH_END, this.noBtnFunc, this.node);
        
        this.tipLabel.string = tipLabel;
        this.yesLabel.string = yesLabel;
        this.noLabel.string = noLabel;
        this.yesBtnFunc = yesBtn;
        this.noBtnFunc = noBtn;
        this.yesBtn.on(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
        this.noBtn.on(cc.Node.EventType.TOUCH_END, this.noBtnFunc, this.node);
        this.node.active = true;
    }
    CloseTip() {
        this.node.active = false;
        this.tipLabel.string = '';
        this.yesLabel.string = '';
        this.noLabel.string = '';
        this.yesBtn.off(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
        this.noBtn.off(cc.Node.EventType.TOUCH_END, this.noBtnFunc, this.node);
        this.yesBtnFunc = null;
        this.noBtnFunc = null;
    }
}
