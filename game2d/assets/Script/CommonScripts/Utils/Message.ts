import { GameConfig } from "../../../gameConfig";
import { getUrlParameterValue } from "../../common/utils/util";
import LoadScene from "../../LoadSceneScripts/LoadScene";
import MessageData, { GameType } from "./MessageData";
import MessageForRoom from "./MessageForRoom";
import MessageForSingle from "./MessageForSingle";
import MessageManager from "./MessageManager";
import MessageType from "./MessageType";
import MyEvent from "./MyEvent";
import NDB from "./NDBTS";

export enum JoinErrorType {
    no_money = 'no_money',
    timeout = 'timeout',
    others = 'others'
}

export default class Message {
    public static joinGame(data?, func?: Function) {
        if (MessageData.gameType == GameType.room) {
            MessageForRoom.joinRoomGame(2, true);
        } else {
            console.log('join single game...');
            MessageForSingle.joinGame(data, func);
        }
    }
    public static exitGame() {
        if (MessageData.gameType == GameType.room) {
            MessageForRoom.exitRoomGame();
        } else {

        }
    }

    public static getUserInfo(func: Function) {
        if (MessageData.gameType == GameType.room) {
            MessageForRoom.getUserInfo(func);
        } else {
            MessageForRoom.getUserInfo(func);
        }
    }

    public static getCoinNum(func: Function) {
        MessageManager.httpIAPResult('get', MessageType.ASSETS, {}, (data) => {
            console.log("金币数据是",data);
            if (data) {
                func(data.coin, data.diamond, data.crystal);
            }
        });
    }

    public static getRankData(func: Function) {
        MessageManager.getRankData(func);
    }

    //发送表情；
    public static sendEmoji(type: string, svga?: string) {
        if (type == 'show') {
            NDB.gameRoom('show_bottom_emoji', null, null);
        } else {
            NDB.gameRoom('send_emoji', type, null, svga);
        }
    }
    //显示表情;
    public static showEmoji(pos: number[], size: number[], msg: string) {
        console.log('服务器下发的表情url msg is ',msg);
        // http://a.fslk.co/games/Bullfight/prod/web-mobile/index.html?lang=en&vcode=1&ui_lang=en
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        let posX = 0;
        if (lang == 'ar' || lang == 'ur') {
            posX = -pos[0];
        } else {
            posX = pos[0];
        }
        let newPos;
        // @ts-ignore
        if(GameConfig.gameName === 'sf') {
            let vcode = getUrlParameterValue('vcode');
            if (Number(vcode) < 17300) {
                newPos = [(posX + 375) + 2, (375 - pos[1]) + 2 + 20];
            }
            else {
                console.log(cc.find("hightNode"));
                newPos = [(posX + 375) + 2, (LoadScene.height / 2 - pos[1]) - 35];
            }
        }
        let proportion = document.body.clientWidth;
        size = [size[0] / 750 * proportion, size[1] / 750 * proportion];
        newPos = [newPos[0] / 750 * proportion - size[0] / 2, newPos[1] / 750 * proportion - size[1] / 2];
        NDB.showEmoji(newPos, size, msg);
    }
    public static getStatus(roomId) {
        // if (MessageData.gameType == GameType.single) {
        //     MessageForSingle.getStatus(roomId);
        // }else{
        MessageForRoom.getStatus(roomId);
        // }
    }
    /**加入游戏失败 */
    public static joinErrPoint(errorType: JoinErrorType) {
        MessageData.isFirstSendJoinRoomGamePoint = false;
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
        let obj = {
            eventName: "game_not_start",
            name: MessageData.gameName + gameType,
            reason: errorType
        }
        NDB.sendAutoJoinEvent(obj);

    }
}
