import MKEventDispatch from "../../MatchingScene/Scripts/Utils/MKEventDispatch";
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
        MKEventDispatch.I.on('emit_message', this.messageFunc.bind(this), this.monitorNode);
    }
    static messageFunc(mData) {
        if (mData.data.method == 'updateVolumeIndication') {
            this.setPlayerSpeakAction(mData.data.speakers);
        }

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
