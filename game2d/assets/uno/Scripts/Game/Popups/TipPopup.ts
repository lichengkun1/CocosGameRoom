// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Popup } from "../../Common/Popup/Popup";
import { PopupManager } from "../../Common/Popup/PopupManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipPopup extends Popup {

    tipLabel: cc.Label;
    yesLabel: cc.Label;
    noLabel: cc.Label;
    yesBtn: cc.Node;
    noBtn: cc.Node;
    yesBtnFunc: Function;
    noBtnFunc: Function;
    onLoad() {
        this.tipLabel = this.node.getChildByName('textLabel').getComponent(cc.Label);
        this.yesLabel = this.node.getChildByName('yesLabel').getComponent(cc.Label);
        this.noLabel = this.node.getChildByName('noLabel').getComponent(cc.Label);
        this.yesBtn = this.node.getChildByName('yesBtn');
        this.noBtn = this.node.getChildByName('noBtn');
    }
    isLevel2Popup: boolean = true;
    Init(arg?: any) {
        this.ShowTip(arg.tipLabel, arg.yesLabel, arg.noLabel, arg.yesBtn, arg.noBtn);
    }

    changeBg(frame: cc.SpriteFrame) {
        const bgSprite = this.node.getChildByName('TipBG').getComponent(cc.Sprite);
        bgSprite.spriteFrame = frame;
    }

    changeYesBtnFrame(frame: cc.SpriteFrame) {
        const yesBtn = this.node.getChildByName('yesBtn').getComponent(cc.Sprite);
        yesBtn.spriteFrame = frame;
    }

    changeNoBtnFrame(frame: cc.SpriteFrame) {
        const noBtn = this.node.getChildByName('noBtn').getComponent(cc.Sprite);
        noBtn.spriteFrame = frame;
    }   
    
    onDisable(){
        this.CloseTip()
    }

    ShowTip(tipLabel: string, yesLabel: string, noLabel: string, yesBtn: Function, noBtn: Function,isReverse: boolean = false) {
        this.yesBtn.off(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
        this.noBtn.off(cc.Node.EventType.TOUCH_END, this.close, this.node);
        this.tipLabel.string = tipLabel;
        this.yesLabel.string = yesLabel;
        this.noLabel.string = noLabel;
        this.yesBtnFunc = yesBtn;
        this.noBtnFunc = noBtn;
        
        if(!isReverse) {
            this.yesBtn.on(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
            this.noBtn.on(cc.Node.EventType.TOUCH_END, this.close, this.node);
        } else {
            this.yesBtn.on(cc.Node.EventType.TOUCH_END, this.close, this.node);
            this.noBtn.on(cc.Node.EventType.TOUCH_END, this.yesBtnFunc, this.node);
        }
        this.node.active = true;
    }

    CloseTip() {
        this.tipLabel.string = '';
        this.yesLabel.string = '';
        this.noLabel.string = '';
        this.yesBtn.off(cc.Node.EventType.TOUCH_END, this.close, this.node);
        this.noBtn.off(cc.Node.EventType.TOUCH_END, this.close, this.node);
        this.yesBtnFunc = null;
        this.noBtnFunc = null;
    }
}
