import MessageData, { GameType } from "../../../../Common/CommonScripts/Utils/MessageData";
import MessageManager from "../../../../Common/CommonScripts/Utils/MessageManager";
import Global from "../Global/Ludo_GlobalGameData";
import Ludo_MessageType from "../Utils/Ludo_MessageType";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_BetsConfig {

    //获取房间配置;
    public static getRoomConfig(roomId, cb, res = {}, getway = 'post') {
        if (MessageData.gameType == GameType.single) return;
        let url = Ludo_MessageType.CONFIG + roomId;
        console.log("获取金币配置的url is ",url);
        if (roomId = '') return;
        MessageManager.httpResult(getway, url, res, (data) => {
            cb && cb(data);
        });
    }
    //获取游戏配置;
    static getGameBetsConfig() {
        this.getRoomConfig(Global.gameRoomId, (configData) => {
            if (configData && configData.data) {
                let data = configData.data;
                console.log('data is ',data);
                Global.betsConfig = data;
                
            }
        });
    }
}