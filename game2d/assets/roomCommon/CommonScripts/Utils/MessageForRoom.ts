import timeManager from "../MatchSceneScripts/timeManager";
import MessageData, { GameType } from "./MessageData";
import MessageManager from "./MessageManager";
import MessageType from "./MessageType";
import MyEvent from "./MyEvent";
import NDB from "./NDBTS";

export default class MessageForRoom {

    //获取房间用户信息;
    public static async getUserInfo(callback) {
        let userInfo = await NDB.getUserInfo();
        callback && callback(userInfo['result']);
    }

    /**获取房间信息
     * @param callback roomInfo --- 
     * gameRoomId = roomInfo['room_id'];
     * shareUrl = roomInfo['share_url'];
     */
    public static async getRoomInfo(callback) {
        let roomInfo = await NDB.getRoomInfo();
        MessageData.gameRoomId = roomInfo['room_id'];
        MessageData.shareUrl = roomInfo['share_url'];
        callback && callback(roomInfo);
    }


    /**显示toast;*/
    public static showToast(showStr: string) {
        NDB.toast({ msg: showStr, long: true });
    }

    /**切换房间;*/
    public static changeRoom(gametype: string) {
        NDB.openDeepLink('yoyo://start_activity/change_game_room?data=' + gametype);
    }



    /**加入房间;*/
    public static joinRoomGame(number: number = 2, jionType: boolean, isAutoJoin?: string) {
        if (this.getIsAutoJoin() && MessageData.isCanAutoJoinGame) {
            let isAuto = 'no';
            if (isAutoJoin === 'yes') {
                isAuto = 'yes';
            }
            this.gameJoinEvent(isAuto);
        }
        MessageData.isFirstSendJoinRoomGamePoint = false;
        let testJoinurl = `${MessageManager.CHAT_API_CONST_PATH}v1/chatroom/${MessageData.gameRoomId}/game/guest/apply/?game_source=cocos`;
        MessageManager.httpTestUserResult('post', testJoinurl, {}, (data) => {
            if (data) {
                if (data.err_code == 81028 && number > 0) {
                    setTimeout(() => {
                        this.joinRoomGame(--number, jionType);
                    }, 3500);
                } else if (data.err_code == 81008 || data.err_code == 90018) {
                    MyEvent.I.emit('insufficientBalance', data);
                } else if (data.status == "OK") {
                    // data.err_code = 80002;
                    // MyEvent.I.emit('joinRoomGameErr',data);
                } else {
                    console.log('@加入房间失败',data);
                    if(data.err_code === 80002) {
                        // 弹窗 大区不匹配
                        console.log("加入的大区不匹配");
                    }
                    MyEvent.I.emit('joinRoomGameErr', data);
                }

                if(data.err_code === 50001) {
                    // 禁用
                    MyEvent.I.emit('errorPop','abanded');
                } else if(data.err_code === 50002) {
                    // 系统维护中
                    MyEvent.I.emit('errorPop','systemfix');
                } else if(data.err_code === 50003) {
                    MyEvent.I.emit('errorPop','downgrade');
                }
            }
        });
    }
    /**退出房间; */
    public static exitRoomGame() {
        let testExiturl = `${MessageManager.CHAT_API_CONST_PATH}v1/chatroom/${MessageData.gameRoomId}/game/guest/leave/?game_source=cocos`;
        MessageManager.httpTestUserResult('post', testExiturl, {}, (data) => {
            console.log('exit test:');
            console.log(data);
        });
    }

    /**房间模式下关注某个人；*/
    public static followedPlayer(pid, callback) {
        MessageManager.httpAPIResult('post', `v1/users/mine/follow/${pid}/?source=user_page`, {}, (fData) => {
            if (fData.status == 'OK') {
                callback && callback(pid, true);
            } else {
                callback && callback(pid, false);
            }
        });
    }
    //获取是否关注；
    public static isFollowedPlayer(pid, callback) {
        MessageManager.httpUserResult('get', `v1/users/${pid}/followed/`, {}, (data) => {
            callback && callback(pid, data.followed);
        });
    }
    /**是否是应该自动join */
    public static getIsAutoJoin() {
        if (MessageData.gameSource.match('gaming_') || MessageData.gameSource.match('trending_') || MessageData.gameSource.match('quickly_match_games')
            || MessageData.gameSource.match('suggest_switch_match_') || MessageData.gameSource.match('channel_popup_') || MessageData.gameSource.match('popup_chatroom_')) {
            return true;
        }
        return false;
    }

    /**触发join的打点*/
    static gameJoinEvent(isAuto: string) {
        if (MessageData.isFirstSendJoinRoomGamePoint) {
            MessageData.isFirstSendJoinRoomGamePoint = false;
            let nowTime = cc.director.getScene().getChildByName('Canvas').getComponent(timeManager).getNowTime();
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
            let obj = {
                eventName: "game_join_click",
                type: MessageData.gameName + gameType,
                from: MessageData.gameSource,
                is_match_auto: isAuto,
                time: nowTime
            }
            NDB.sendAutoJoinEvent(obj);
        }
    }

    //获取当前状态;
    public static getStatus(roomId) {
        // if (MessageData.gameType == GameType.single) return;

        let url = '';
        if (MessageData.gameType == GameType.single) {
            url = `v1/${MessageData.gameName}/chatroom/${MessageData.gameSource_Id}/`;
            if (!MessageData.gameSource_Id) {
                return;
            }
        }
        if (MessageData.gameType == GameType.room)
            url = `v1/${MessageData.gameName}/chatroom/${MessageData.gameSource_Id == '' ? roomId : MessageData.gameSource_Id}/`;

        // console.log('');
        MessageManager.httpResult('get', url, {}, (data) => {
            console.log('getStatus data is ',data);
            // 请求房间状态
            MyEvent.I.emit(MessageType.MESSAGE_CHATROOM_STATUS, { statusData: data });
        });
    }

    //预留加入游戏事件
    public static joinGame(roomId) {
        let url = `v1/${MessageData.gameName}/chatroom/${roomId}/`;
        MessageManager.httpResult('get', url, {}, (data) => {
            MyEvent.I.emit('emit_joinGame', { statusData: data });
        });
    }

    public static takeChangeRoom(isShow: boolean = true) {
        let show = 'show';
        if (isShow) {
            if (MessageData.isFirstShowChangeRoom) {
                MessageData.isFirstShowChangeRoom = false;
                show = 'first_show';
            }
        } else {
            show = 'hide'
        }
        NDB.gameRoom('change_room_icon', show, MessageData.gameName);
    }
}