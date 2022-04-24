import NDB from "../../../Script/CommonScripts/Utils/NDBTS";
import GlobalGameData, { RoomType } from "../GlobalGameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LogManager {
    public roomType: string = 'Lobby';
    /**
     * 发送打点信息
     * @param  {Object} params 打点数据对象
     * @returns void
     */
    public sendLog(params: Object): void {
        let roomType = GlobalGameData.roomType === RoomType.ROOM ? "Room" : "Lobby";
        let data = Object.assign({
            name: `UNO${roomType}`,
        },params);
        NDB.sendAutoJoinEvent(data);
    }
}

export const logManager = new LogManager();
