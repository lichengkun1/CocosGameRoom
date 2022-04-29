
/*
    消息号管理
*/

import MessageData from "./MessageData";
import MessageManager from "./MessageManager";

export default class MessageType {
    public static GETUSERINFO = `v1/${MessageData.gameName}/user/mine/`;    //获取个人信息;
    public static STICKER = 'v1/sticker/';                                  //发送表情;
    public static ASSETS = 'v1/wallet/assets/';                             //用户资产接口;
    public static PLAYPOCKER = `v1/${MessageData.gameName}/play_poker/`     //出牌;


    public static SINGLE_JOIN_GAME = `v1/${MessageData.gameName}/single/join` 

    public static ADDSHEEP = 'v1/sf/fire/';
    public static QUICKEN = 'v1/sf/quicken/';

    /**所有的socket消息 */
    public static readonly MESSAGE_MAIN_SOCKET = 'emit_message';

    /**所有的socket消息 */
    public static readonly MESSAGE_SWITCH_ROOM = 'switch_room';
    /**获取app与服务器websocket状态; */
    public static readonly MESSAGE_REQUEST_WS_STATUS = 'request_ws_status';
    /**获取app与服务器websocket状态; */
    public static readonly MESSAGE_TASK_COMPLETE = 'task_complete';

    public static readonly GROUP_INFO = 'group_info';
    
    /**语音消息 */
    public static readonly MESSAGE_UPDATA_VOLUME_INDICATION = "updateVolumeIndication"
    /**表情信息 */
    public static readonly MESSAGE_EMOJI_ON_MIC = "emoji_on_mic"
    /**游戏匹配时 */
    public static readonly MESSAGE_MATCHING = "game_matching"
    /**游戏进行中消息 */
    public static readonly MESSAGE_PLAYER = "game_playing"
    /**游戏结束消息 */
    public static readonly MESSAGE_COMPLETED = "game_completed"
    /**房间状态 */
    public static readonly MESSAGE_CHATROOM_STATUS = "emit_status"
    /**麦位信息 */
    public static readonly MESSAGE_MIC_USERS = "mic_users"
    



}