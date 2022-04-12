import MessageType from "../../../CommonScripts/Utils/MessageType";
import MyEvent from "../../../CommonScripts/Utils/MyEvent";
import VoiceManager from "./VoiceManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceSocket {

    static isMonitor = false;
    static monitorNode: cc.Node;
    // static isMkOpen = false;
    static Init() {
        //socket消息；
        if (this.isMonitor) return;
        this.isMonitor = true;
        this.monitorNode = new cc.Node();
        MyEvent.I.on(MessageType.MESSAGE_UPDATA_VOLUME_INDICATION, this.messageFunc.bind(this), this.monitorNode);
    }
    static messageFunc(mData) {
        this.setPlayerSpeakAction(mData.data.speakers);
    }
    static setPlayerSpeakAction(speakers) {
        if (VoiceManager.voiceController) {
            for (let i = 0; i < speakers.length; i++) {
                const element = speakers[i];
                if (element.volume > 0)
                    VoiceManager.voiceController.speak(element.uid);
            }
        }

    }

}
