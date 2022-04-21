
import MessageManager from "../../../../Script/CommonScripts/Utils/MessageManager";
import Card from "../../Game/Card/Card";
import CardManager, { CardColor } from "../../Game/Card/CardManager";
import GlobalGameData from "../../GlobalGameData";
import { GameData } from "../Game/GameData";
import { logManager } from "../LogManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class GetServerData {
    static UserId = -1;
    static UserName = "userName";
    static UserAvatar = "";
    static UserHeadImage: cc.SpriteFrame = null;
    static UserMoney: number = 0;

    static OtherId = -1;
    static OtherName = "player2";
    static OtherAvatar = "";
    static OtherHeadImage: cc.SpriteFrame = null;

    public static readonly PLAY = 'v1/uno/play';                             //打牌
    public static readonly GAMEINFO = "v1/uno/game/info";                    //获取游戏信息
    public static readonly AGENT = "v1/uno/game/comeback"

    /**游戏开始断点
     * @param gameName 游戏名称
     */
    public static GameStart(gameName: string = 'UNO'): void {
        console.log("-------game_start");
        logManager.sendLog({eventName: 'game_start',type: `UNO${logManager.roomType}`,bets: 'game'});
        
    }
    /** 游戏结束断点
     * @param gameName 游戏名称
     * @param gameResult 设置返回结果 win(胜利)/lose(失败)/draw(平局)
     */
    public static GameEnd(gameName: string = 'UNO', gameResult: string): void {
        logManager.sendLog({eventName: 'game_end',type: `UNO${logManager.roomType}`,bets: 'game',result: gameResult});
        
    }

    /** 获取游戏信息
     * @param success 获取成功
     * @param err 获取失败
     */
    public static SendMessage(gameid: string, success: Function = null, err: Function = null): void {
        let url = GetServerData.GAMEINFO + "?" + "game_id=" + gameid + "&source=chatroom&source_id=" + GlobalGameData.roomId
        console.log("获取游戏信息");
        MessageManager.httpResult('get', url, {}, (res) => {
            console.log(res);
            if (res) {
                success && success(res);
            } else {
                err && err();
            }

        });
    }
    static isSendPlayCardHttp = false;
    /** 打牌
     * @param success 获取成功
     * @param err 获取失败
     */
    public static PlayCard(card: Card, success: Function = null, err: Function = null): void {
        if (GetServerData.isSendPlayCardHttp) {
            err && err()
            return;
        }
        GetServerData.isSendPlayCardHttp = true;
        let carddata = CardManager.I.GetCardData(card.cardid);
        let color = "";
        if (carddata.color == CardColor.red) {
            color = "red"
        } else if (carddata.color == CardColor.yellow) {
            color = "yellow"
        } else if (carddata.color == CardColor.blue) {
            color = "blue"
        } else if (carddata.color == CardColor.green) {
            color = "green"
        }
        let postmessage
        if (color == "") {
            postmessage = {
                "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
                "action": "play", //enum(play, draw, draw4, draw6, skip)
                "poker": card.cardid, //牌: 1~108
            }
        } else {
            postmessage = {
                "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
                "action": "play", //enum(play, draw, draw4, draw6, skip)
                "color": color, //换色: enum(blue, red, yellow, green)
                "poker": card.cardid, //牌: 1~108
            }
        }

        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendPlayCardHttp = false;
            if (res.status == 'OK') {
                success && success();
            } else {
                err && err();
            }
        });
    }
    static isSendPlayColorHttp = false;
    /** 打牌
    * @param success 获取成功
    * @param err 获取失败
    */
    public static PlayColor(cardColor: CardColor, success: Function = null, err: Function = null): void {
        if (GetServerData.isSendPlayColorHttp) {
            err && err();
            return;
        }
        GetServerData.isSendPlayColorHttp = true;
        // let carddata = CardManager.I.GetCardType(card.cardid);
        let color = "";
        if (cardColor == CardColor.red) {
            color = "red"
        } else if (cardColor == CardColor.yellow) {
            color = "yellow"
        } else if (cardColor == CardColor.blue) {
            color = "blue"
        } else if (cardColor == CardColor.green) {
            color = "green"
        }
        let postmessage = {
            "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
            "action": "choice_color", //enum(play, draw, draw4, draw6, skip)
            "color": color, //换色: enum(blue, red, yellow, green)
        }
        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendPlayColorHttp = false;
            if (res.status == 'OK') {
                success && success();
            } else {
                err && err();
            }
        });
    }

    static isSendDrawCardHttp = false;
    static isDrawCardHttp = false;
    /**抓牌 */
    public static DrawCard(success: Function = null, err: Function = null): void {
        if (GetServerData.isSendDrawCardHttp) {
            return;
        }
        if (this.isDrawCardHttp) {
            return;
        }
        GetServerData.isSendDrawCardHttp = true;
        let postmessage = {
            "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
            "action": "draw", //enum(play, draw, draw4, draw6, skip)
        }
        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendDrawCardHttp = false;
            if (res.status == 'OK') {
                GetServerData.isDrawCardHttp = true;
                success && success();
            } else {
                err && err();
            }
        });
    }
    static isSendDraw4CardHttp = false;

    /**抓牌 */
    public static Draw4Card(success: Function = null, err: Function = null): void {
        if (GetServerData.isSendDraw4CardHttp) return;
        GetServerData.isSendDraw4CardHttp = true;
        let postmessage = {
            "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
            "action": "draw4", //enum(play, draw, draw4, draw6, skip)
        }
        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendDraw4CardHttp = false;
            if (res.status == 'OK') {
                success && success();
            } else {
                err && err();
            }
        });
    }

    static isSendDraw6CardHttp = false;
    /**抓牌 */
    public static Draw6Card(success: Function = null, err: Function = null): void {
        if (GetServerData.isSendDraw6CardHttp) return;
        GetServerData.isSendDraw6CardHttp = true;
        let postmessage = {
            "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
            "action": "draw6", //enum(play, draw, draw4, draw6, skip)
        }
        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendDraw6CardHttp = false;
            if (res.status == 'OK') {
                success && success();
            } else {
                err && err();
            }
        });
    }
    static isSendSkipCardHttp = false;
    /**抓牌 */
    public static SkipCard(success: Function = null, err: Function = null): void {
        if (GetServerData.isSendSkipCardHttp) return;
        GetServerData.isSendSkipCardHttp = true;
        let postmessage = {
            "game_id": GameData.gameid, //不为空表示回到指定的游戏中, 否则开始进入匹配中
            "action": "skip", //enum(play, draw, draw4, draw6, skip)
        }
        MessageManager.httpResult('post', GetServerData.PLAY, postmessage, (res) => {
            GetServerData.isSendSkipCardHttp = false;
            if (res.status == 'OK') {
                success && success();
            } else {
                err && err();
            }
        });
    }


    static isSendAgentHttp = false;

    public static Agent(success: Function = null, err: Function = null): void {
        if (GetServerData.isSendAgentHttp) return;
        GetServerData.isSendAgentHttp = true;
        let postData = {
            game_id: GameData.gameid,
            mode: "4p",
            bet_type: "diamond"
        }
        MessageManager.httpResult('post', GetServerData.AGENT, postData, (data) => {
            GetServerData.isSendAgentHttp = false;
            console.log(data);
            if (data.status == 'OK') {
                success && success(data);
            } else {
                err && err(data);
            }
        });
    }
}
