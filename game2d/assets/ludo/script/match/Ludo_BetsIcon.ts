import MatchSetBets from "../../../Script/CommonScripts/MatchSceneScripts/MatchSetBets";
import MessageData, { GameType } from "../../../Script/CommonScripts/Utils/MessageData";

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
