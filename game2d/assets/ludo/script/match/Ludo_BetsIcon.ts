// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MatchSetBets from "../../../roomCommon/CommonScripts/MatchSceneScripts/MatchSetBets";
import MessageData, { GameType } from "../../../roomCommon/CommonScripts/Utils/MessageData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_BetsIcon extends cc.Component {

    static I: Ludo_BetsIcon;
    modeLabel: cc.Label = null;
    onEnable() {
        Ludo_BetsIcon.I = this.node.getComponent(Ludo_BetsIcon);
        this.setBetsIcon();
        if (MessageData.gameType == GameType.single) {
            this.node.getChildByName("betType").active = true;
            this.node.getChildByName("betLabel").getComponent(cc.Label).string = MessageData.bet_limit + "";
        }
    }
    setBetsIcon() {
        if (MessageData.gameType == GameType.room && MatchSetBets.iscanChanageBets) {
            this.node.getChildByName("betLabel").setPosition(-52, 0, 0);
            this.node.getChildByName("betType").setPosition(-97, 0, 0);
            this.node.getChildByName("icon").active = true;
        } else {
            this.node.getChildByName("icon").active = false;
            this.node.getChildByName("betLabel").setPosition(-40, 0, 0);
            this.node.getChildByName("betType").setPosition(-85, 0, 0);
        }
    }
}
