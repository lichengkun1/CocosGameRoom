// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MKMessageManager from "../../MatchingScene/Scripts/Utils/MKMessageManager";
import NDB from "../../MatchingScene/Scripts/Utils/NDBTS";
import VoiceController from "./VoiceController";
import VoiceSocket from "./VoiceSocket";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceManager {

    static voiceController: VoiceController = null;
    static isMKOpen: boolean = true;
    static isVoiceOpen: boolean = true;

    /**加入语音房间 */
    static async JoinVoiceRoom(gameID: string, sdk: string, func?: Function) {
        if (!sdk) {
            sdk = "zego";
        }
        console.log("JoinVoiceRoom  加入语音房间", gameID);
        const result: any = await NDB.run("joinChannel", { "channelId": gameID, "sdk": sdk })//agora
        if (result.result) {
            if (VoiceManager.isMKOpen)
                this.OpenInVoice();
            else
                this.CloseInVoice();
            if (VoiceManager.isVoiceOpen)
                this.OpenOutVoice();
            else
                this.CloseOutVoice();
        }

    }
    /**离开语音房间 */
    static LeaveVoiceRoom() {
        NDB.run("leaveChannel");
    }
    /**开启输入语音 */
    static OpenInVoice() {
        NDB.run("openAudioMic", { "open": true })

    }
    /**关闭输入语音 */
    static CloseInVoice() {
        NDB.run("openAudioMic", { "open": false })

    }
    /**开启输出语音 */
    static OpenOutVoice() {
        NDB.run("muteAudioStream", { "mute": false })
    }
    /**关闭输出语音 */
    static CloseOutVoice() {
        NDB.run("muteAudioStream", { "mute": true })
    }
    public static IsSupport() {
        const vcode: number = Number(MKMessageManager.getUrlParameterValue('vcode'));
        if ((vcode >= 16300 && cc.sys.os === cc.sys.OS_ANDROID) || (vcode >= 13800 && cc.sys.os === cc.sys.OS_IOS)) {
            return true;
        } else {
            return false;
        }
    }
}
