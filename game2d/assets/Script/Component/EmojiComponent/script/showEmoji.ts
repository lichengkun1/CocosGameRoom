import Message from "../../../../Script/CommonScripts/Utils/Message";
import MessageData from "../../../../Script/CommonScripts/Utils/MessageData";
import MessageManager from "../../../../Script/CommonScripts/Utils/MessageManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class showEmoji extends cc.Component {
    @property(cc.JsonAsset)                                 //emoji表情映射json；
    emojiJson: cc.JsonAsset = null;

    emojiNode: cc.Node = null;
    onEnable() {
        let code = Number(MessageManager.getUrlParameterValue('vcode'));
        if (code >= 13100) {
            this.node.active = true;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.node.active = false;
        }
        this.emojiNode = cc.find("Canvas/emojiBG");
    }

    showEmojiBG() {
        this.emojiNode.active = true;
        let targetY = -288.916;
        if(MessageData.gameName === 'sf') {
            targetY = -365;
        }
        cc.tween(this.emojiNode).to(0.2, { position: cc.v3(145, targetY, 0) }).start();
        cc.find("Canvas/showBtn").active = false;
        this.scheduleOnce(this.closeEmojiBg, 3);
    }

    closeEmojiBg() {
        this.unschedule(this.closeEmojiBg);
        let targetY = -288.916;
        if(MessageData.gameName == 'sf') {
            targetY = -365;
        }
        cc.tween(this.emojiNode).to(0.2, { position: cc.v3(515, targetY, 0) }).call(() => {
            this.emojiNode.active = false;
            cc.find("Canvas/showBtn").active = true;
        }).start();
    }
    //发送emoji;
    sendEmoji(event, custom) {
        if (custom == 'show') {
            Message.sendEmoji('show');
        } else {
            MessageData.isCanSendEmoji = false;
            const emojiObjs = Object.values(this.emojiJson.json) as {name: string,image: string,svga: string,svga_o: string}[];
            console.log('emojiObjs is ',emojiObjs);
            const targetEmoji = emojiObjs.find(item => item.name === custom);
            Message.sendEmoji(custom, targetEmoji.svga);
            setTimeout(() => {
                if (this.node && this.node.active) {
                    MessageData.isCanSendEmoji = true;
                }
            }, 1000);
        }
        this.closeEmojiBg();
    }

}
