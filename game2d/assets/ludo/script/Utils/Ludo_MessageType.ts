
/*
    消息号管理
*/

export default class Ludo_MessageType{
    public static REQUEST_WS_STATUS = 'request_ws_status';              //获取app与服务器websocket状态;
    public static GETUSERINFO = 'v1/ludo/user/mine/';                   //获取个人信息;
    public static JIONGAME =   'v1/ludo/join/';                         //加入游戏；
    public static CANCELMATCH = 'v1/ludo/cancel/';                      //取消匹配;
    public static ROLLDICE = 'v1/ludo/roll/';                           //掷骰子;
    public static MOVEDICE = 'v1/ludo/move/';                           //移动棋子;
    public static STICKER = 'v1/sticker/';                              //发送表情;
    public static ASSETS = 'v1/wallet/assets/';                         //用户资产接口;
    public static REGRET = 'v1/ludo/regret/';                           //反悔功能;
    public static CONFIG = 'v1/ludo/bets/config/chatroom/';      
    public static AGENT = 'v1/ludo/robot/agent/'; 
    /** 废弃的接口 */
    public static TOOLS = 'v1/ludo/users/tools'; 
}