import MessageData from "./MessageData";
import MessageManager from "./MessageManager";
import MessageType from "./MessageType";
import MyEvent from "./MyEvent";
import NDB from "./NDBTS";

export default class MessageForSingle {


    //获取用户信息;
    public static getUserInfo(callback) {
    }

    /**获取信息
     * @param callback roomInfo --- 
     * gameRoomId = roomInfo['room_id'];
     * shareUrl = roomInfo['share_url'];
     */
    public static getInfo(callback) {
    }



    /**加入房间;*/
    public static async joinGame(data, func?: Function) {
        // MessageManager.httpResult('post', MessageType.SINGLE_JOIN_GAME, data, (res) => {
        //     func && func();
        // });
        // let result = await NDB.run("lobbyGameOver", MessageData.extra)
        // func && func(result);
    }
    /**退出房间; */
    public static exitRoomGame() {

    }

    //获取当前状态;
    public static getStatus(roomId) {
        // let data = {};
        // MyEvent.I.emit('emit_status', { statusData: data });
        let url = `v1/${MessageData.gameName}/chatroom/${MessageData.gameSource_Id}/?game_id=${roomId}`;
        MessageManager.httpResult('get', url, {}, (data) => {
            console.log("data is ",data);
            MyEvent.I.emit(MessageType.MESSAGE_CHATROOM_STATUS, { statusData: data });
        });
    }

    public static async playAgain(func?: Function) {
        let result = await NDB.run("lobbyGameOver", MessageData.extra)
        func && func(result);
    }
}