enum ButtonType {
    MKBtn,
    VoiceBtn
}
import VoiceManager from "./VoiceManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceBtn extends cc.Component {

    @property({ type: cc.Enum(ButtonType) })
    btnType: ButtonType = 0;

    @property(cc.SpriteFrame)
    openImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    closeImage: cc.SpriteFrame = null;

    isOpen = true;


    onEnable() {
        if (!VoiceManager.IsSupport()) {
            this.node.active = false;
        }
        if (this.btnType == ButtonType.MKBtn) {
            if (VoiceManager.isMKOpen) {
                this.node.getComponent(cc.Sprite).spriteFrame = this.openImage;
            } else {
                this.node.getComponent(cc.Sprite).spriteFrame = this.closeImage;
            }
        }
        if (this.btnType == ButtonType.VoiceBtn) {
            if (VoiceManager.isVoiceOpen) {
                this.node.getComponent(cc.Sprite).spriteFrame = this.openImage;
            } else {
                this.node.getComponent(cc.Sprite).spriteFrame = this.closeImage;
            }
        }
    }
    mkBtn() {
        if (VoiceManager.isMKOpen) {
            VoiceManager.CloseInVoice();
            this.node.getComponent(cc.Sprite).spriteFrame = this.closeImage;
            VoiceManager.isMKOpen = false;
        }
        else {
            VoiceManager.isMKOpen = true;
            VoiceManager.OpenInVoice();
            this.node.getComponent(cc.Sprite).spriteFrame = this.openImage;
        }

        // this.isOpen = !this.isOpen;
    }
    voiceBtn() {
        if (VoiceManager.isVoiceOpen) {
            VoiceManager.isVoiceOpen = false;
            VoiceManager.CloseOutVoice();
            this.node.getComponent(cc.Sprite).spriteFrame = this.closeImage;
        }
        else {
            VoiceManager.isVoiceOpen = true;
            VoiceManager.OpenOutVoice();
            this.node.getComponent(cc.Sprite).spriteFrame = this.openImage;
        }

        // this.isOpen = !this.isOpen;
    }
}
