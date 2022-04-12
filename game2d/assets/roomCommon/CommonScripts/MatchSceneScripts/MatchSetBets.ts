import { timeStamp } from "console";
import Message from "../Utils/Message";
import MessageData, { GameType } from "../Utils/MessageData";
import MessageForRoom from "../Utils/MessageForRoom";
import MessageManager from "../Utils/MessageManager";
import MessageType from "../Utils/MessageType";
import MyEvent from "../Utils/MyEvent";
import MatchingScene from "./MatchingScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchSetBets extends cc.Component {
    /** 点击该元素的时候需要弹出来的窗口 */
    static betsPopup: cc.Node = null;

    static iscanChanageBets: boolean = false;

    @property(cc.SpriteFrame)
    yoyoBet: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    gameBet: cc.SpriteFrame = null;

    show() {
        const modelGameNames = ['ludo','dominoe'];
        if ((modelGameNames.indexOf(MessageData.gameName) >= 0) && MessageData.gameType == GameType.room && MatchSetBets.iscanChanageBets) {
            MatchSetBets.betsPopup && (MatchSetBets.betsPopup.active = true);
        }
    }
    close() {
        MatchSetBets.betsPopup && (MatchSetBets.betsPopup.active = false);
    }

}