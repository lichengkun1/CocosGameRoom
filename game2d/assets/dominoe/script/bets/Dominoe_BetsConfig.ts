

import MessageData, { GameType } from "../../../Script/CommonScripts/Utils/MessageData";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import Global from "../../script/Utils/Dominoe_GlobalGameData";
const { ccclass, property } = cc._decorator;

const betsUrl = 'v1/dominoe/bets/config/chatroom/';

@ccclass
export default class Dominoe_BetsConfig {

    //获取房间配置;
    public static getRoomConfig(roomId: string, cb: Function, res = {}, getway: string = 'post') {
        if(roomId === '') return;
        if (MessageData.gameType == GameType.single) return;
        let url = betsUrl + roomId;
        MessageManager.httpResult(getway, url, res, (data) => {
            console.log('多米诺房间赌金配置',data);
            cb && cb(data);
        });
    }

    //获取游戏配置;
    static getGameBetsConfig(roomId: string) {
        this.getRoomConfig(roomId, (configData) => {
            if (configData && configData.data) {
                let data = configData.data;
                console.log('data is ',data);
                Global.betsConfig = data;
                
            }
        });
    }
}