import { GetServerData } from "../../../uno/Scripts/Common/Server/GetServerData";
import MessageData, { GameType } from "./MessageData";
import MessageType from "./MessageType";
import MyEvent from "./MyEvent";
import NDB from "./NDBTS";

export default class MessageManager {

    public static NET_USER_CONST_PATH = 'https://user.funshareapp.com/';                   //个人信息请求；
    public static NET_API_CONST_PATH = 'https://api.funshareapp.com/';                     //截图等功能请求；
    public static NET_IAP_CONST_PATH = 'http://iap.funshareapp.com/';                     //金币相关接口；
    public static NET_CONST_PATH = 'https://game.funshareapp.com/';                        //正式环境http地址；
    public static CHAT_API_CONST_PATH = 'https://chatroom.funshareapp.com/';               //聊天室的请求；
    public static TRACE_BUG_PATH = 'https://game.funshareapp.com/'

    public static ACTIVITY_CONST_PATH = 'https://activity.funshareapp.com/';

    public static socketDatas: Array<any> = new Array<any>();
    public static isPushmessage = false;

    static Init() {
        MessageManager.setNetworkConfiguration();
        MessageData.gameSource = MessageManager.getUrlParameterValue('source');
        MessageType.GETUSERINFO = `v1/${MessageData.gameName}/user/mine/`;    //获取个人信息;
        MessageType.PLAYPOCKER = `v1/${MessageData.gameName}/play_poker/`     //出牌;
        MessageType.SINGLE_JOIN_GAME = `v1/${MessageData.gameName}/single/join`;


    }

    /**测试和正式环境自动区分;*/
    public static setNetworkConfiguration() {
        let source = window.location.href;
        if (source.match('prod')) {
            this.NET_CONST_PATH = 'https://game.funshareapp.com/';                    //正式环境http地址；
            this.NET_USER_CONST_PATH = 'https://user.funshareapp.com/';               //个人信息请求；
            this.NET_API_CONST_PATH = 'https://api.funshareapp.com/';                 //截图等功能请求；
            this.NET_IAP_CONST_PATH = 'https://iap.funshareapp.com/';                 //金币相关接口；
            this.CHAT_API_CONST_PATH = 'https://chatroom.funshareapp.com/';           //聊天室的请求；
            this.TRACE_BUG_PATH = 'https://game.funshareapp.com/';
            this.ACTIVITY_CONST_PATH = 'https://activity.funshareapp.com/';
            
        } else {
            this.NET_CONST_PATH = 'http://test_game-http-server.gateway.funshareapp.com/';                //测试环境http地址;
            this.NET_USER_CONST_PATH = 'http://user.funshareapp.com/';               //个人信息请求；
            this.NET_API_CONST_PATH = 'https://api.funshareapp.com/';                 //截图等功能请求；
            this.NET_IAP_CONST_PATH = 'http://test_iap-http.gateway.funshareapp.com/';                 //金币相关接口；
            this.CHAT_API_CONST_PATH = 'http://chatroom.funshareapp.com/';           //聊天室的请求；
            this.TRACE_BUG_PATH = 'http://ldy_game-http.gateway.funshareapp.com/';
            this.ACTIVITY_CONST_PATH = 'http://activity.funshareapp.com/';

        }
        // this.NET_CONST_PATH = 'http://test_game-http-server.gateway.funshareapp.com/';                //测试环境http地址;
        // this.NET_USER_CONST_PATH = 'http://user.funshareapp.com/';               //个人信息请求；
        // this.NET_API_CONST_PATH = 'https://api.funshareapp.com/';                 //截图等功能请求；
        // this.NET_IAP_CONST_PATH = 'http://test_iap-http.gateway.funshareapp.com/';                 //金币相关接口；
        // this.CHAT_API_CONST_PATH = 'http://chatroom.funshareapp.com/';   

    }

    /**获取页面参数值;*/
    public static getUrlParameterValue(name) {
        let href = window.location.href;
        var query = href.substring(1);
        var vars = query.split("?");
        if (!vars[1]) {
            return '';
        }
        var argment = vars[1].split("&");
        for (var i = 0; i < argment.length; i++) {
            var pair = argment[i].split("=");
            if (pair[0] == name) { return pair[1]; }
        }
        return '';
    }
    /*
          通过http获取数据；
          * @method {String} get,post,put,del
          * @url {String} 请求url
          * @params {sendData} 发送参数
      */
    public static async httpResult(method, url, sendData = {}, callback, number = 2) {
        let sendUrl = `${this.NET_CONST_PATH}${url}`;
        console.log('sendUrl:' + sendUrl);
        let result = await NDB.request(method, sendUrl, sendData);
        if (result.err_code && Number(result.err_code) == 500 && number > 0) {
            //返回500，再次请求;
            //console.log('返回500，再次请求');
            number = number - 1;
            this.httpResult(method, url, sendData, callback, number);
            return;
        }
        callback && callback(result);
    }

    /**
     * 偶现问题打点定位
     * @param  {string} method 'post' || 'get'
     * @param  {string} url 请求url
     * @param  {Object} sendData={}
     * @param  {Function} callback
     * @param  {number} number=2
     */
    public static async httpResultByHost(method, url, sendData = {}, callback, number = 2) {
        let sendUrl = `${this.TRACE_BUG_PATH}${url}`;
        console.log('偶现问题sendUrl:' + sendUrl);
        let result = await NDB.request(method, sendUrl, sendData);
        if (result.err_code && Number(result.err_code) == 500 && number > 0) {
            //返回500，再次请求;
            //console.log('返回500，再次请求');
            number = number - 1;
            this.httpResult(method, url, sendData, callback, number);
            return;
        }
        callback && callback(result);
    }

    /**
     * 发送bug定位信息
     * @param  {string} gameName 游戏名称
     * @param  {string} error 错误码
     * @param  {string} error_msg 定位信息
     */
    public static async sendBugTraceByMessage(gameName: string,error: string,error_msg: string) {
        console.log('发送消息');
        await this.httpResultByHost('post','v1/base/bug/trace',{
            game: gameName,
            error,
            error_msg,
        },() => {});
    }
    /**获取资产的接口 */
    public static async httpIAPResult(method, url, sendData = {}, callback) {
        let sendUrl = `${this.NET_IAP_CONST_PATH}${url}`;
        if(url.indexOf('v1/leaderboard') >= 0) {
            sendUrl = `${this.ACTIVITY_CONST_PATH}${url}`;
        }
        let result = await NDB.request(method, sendUrl, sendData);
        callback && callback(result);
    }

    /**发送socket数据
    @param messageType 消息号
    @param sendData 需要发送数据
    */
    public static socketSend(messageType, sendData = {}) {
        NDB.run('onSocketSend', { method: messageType, data: sendData });
    }

    /**派发收到的socket消息;*/
    public static emitSocketMessage(message) {
        console.log('message is ',message);
        const method: string = message.method;
        if (method == "switch_room") {
            MyEvent.I.emit(MessageType.MESSAGE_SWITCH_ROOM, { data: message });
        }
        if (method == "updateVolumeIndication") {
            MyEvent.I.emit(MessageType.MESSAGE_UPDATA_VOLUME_INDICATION, { data: message });
        }
        if (method == "emoji_on_mic") {
            MyEvent.I.emit(MessageType.MESSAGE_EMOJI_ON_MIC, { data: message });
        }
        if (method === 'response_ws_status') {
            console.log('message is ',message);
            MyEvent.I.emit(MessageType.MESSAGE_REQUEST_WS_STATUS, { data: message });
        }
        if(method==='task_complete'){
            MyEvent.I.emit(MessageType.MESSAGE_TASK_COMPLETE, { data: message });

        }
        if (MessageData.switch_room_id) {
            if (MessageData.gameType == GameType.single
                && message
                && message.channel
                && message.channel.type == MessageData.gameName
                && message.data
                && message.data.source_id
                && MessageData.switch_room_id != message.data.source_id) {
                console.log("===================>不是本局消息<===================");
                return;
            }
        }
        MyEvent.I.emit(MessageType.MESSAGE_MAIN_SOCKET, { data: message });
        if (this.isPushmessage) {
            let method = message.method;
            if (method && method == MessageData.gameName + '_playing' || method == MessageData.gameName + '_completed') {
                if (MessageData.gameName == 'ludo') {
                    this.socketDatas.push(message.data);
                } else {
                    this.socketDatas.push(message);
                }
            }
        }

        if (method == `${MessageData.gameName}_matching`) {
            MyEvent.I.emit(MessageType.MESSAGE_MATCHING, { data: message });
        }
        if (method == `${MessageData.gameName}_playing`) {
            MyEvent.I.emit(MessageType.MESSAGE_PLAYER, { data: message });
        }
        if (method == `${MessageData.gameName}_completed`) {
            MyEvent.I.emit(MessageType.MESSAGE_COMPLETED, { data: message });
        }

        if (method == `uno_match`) {
            MyEvent.I.emit(MessageType.MESSAGE_MATCHING, { data: message });
        }
        if (method == `uno_play`) {
            MyEvent.I.emit(MessageType.MESSAGE_PLAYER, { data: message });
        }
        if (method == `uno_completed`) {
            MyEvent.I.emit(MessageType.MESSAGE_COMPLETED, { data: message });
        }

        if(method == `group_info`) {
            console.log('group_info');
            MyEvent.I.emit(MessageType.GROUP_INFO,{data: message});
        }

        if (method === 'mic_users') {
            MyEvent.I.emit(MessageType.MESSAGE_MIC_USERS, { data: message });
        }

    }
    /** 获取首条socket消息*/
    public static getFirstSocket() {
        if (this.socketDatas.length > 0)
            return this.socketDatas[0];
        else
            return null;
    }
    /** 删除首条socket消息*/
    public static deleteFirstSocket() {
        if (this.socketDatas[0]) {
            this.socketDatas.splice(0, 1);
        }

    }
    /** 清除收到的socket消息*/
    public static clearSocketDatas() {
        this.socketDatas = new Array<any>();
        this.socketDatas.length = 0;
    }
    //获取最后的消息;
    public static getLastMessage() {
        // console.log("最后的消息",this.socketDatas);
        let len = this.socketDatas.length;
        return this.socketDatas[len - 1];
    }

    public static async httpUserResult(method, url, sendData = {}, callback) {
        let sendUrl = `${this.NET_USER_CONST_PATH}${url}`;
        let result = await NDB.request(method, sendUrl, sendData);
        callback && callback(result);
    }

    public static async httpTestUserResult(method, url, sendData = {}, callback) {
        let sendUrl = url;
        let result = await NDB.request(method, sendUrl, sendData);
        console.log('result is ',result);
        callback && callback(result);
    }

    public static async httpAPIResult(method, url, sendData = {}, callback) {
        let sendUrl = `${this.NET_API_CONST_PATH}${url}`;
        let result = await NDB.request(method, sendUrl, sendData);
        // return result;
        callback && callback(result);
    }

    //通知APP显示用户头像；
    public static showPlayerInfo(uid) {
        NDB.showPlayerInfo(uid);
    }

    //获取排行榜数据;
    public static getRankData(callback) {
        let url = 'v1/leaderboard/game/ranks/?type=game_dmn_day';
        MessageManager.httpIAPResult('get', url, {}, (data) => {
            callback(data);
        });
    }

    /**强制更新游戏;*/
    public static updateGame() {
        // NDB.openDeepLink('yoyo://start_activity/play_store');  //market://details?id=com.fun.share
        window.location.href = 'market://details?id=com.fun.share';
    }

    /**跳转道具商城;*/
    public static goStore() {
        NDB.openDeepLink('yoyo://start_activity/store?title_tab=game_tools');
    }

    /**显示toast;*/
    public static showToast(showStr: string) {
        NDB.toast({ msg: showStr, long: true });
    }
    //购买游戏币;
    public static buyGameCion() {
        NDB.openDeepLink('yoyo://start_activity/recharge?tab=game_coin&from=ludo');
    }

    public static async shareGameOrImage(shareText, imgUrl, callback) {
        let result = await NDB.shareGameOrImage(shareText, imgUrl);
        callback && callback(result);
    }

    public static async renderTextureShare(callback) {
        let result = await NDB.renderTextureShare();
        callback && callback(result);
        let newData = result['result']['filePath'];
        let shareText: string = 'Come to join this chatroom and play incredible game!  ' + MessageData.shareUrl;
        let resultShare = await NDB.shareGameOrImage(shareText, newData);
    }

    public static subNickName(nameStr: string, subCount: number = 8) {
        if (nameStr.length > subCount) {
            nameStr = nameStr.substring(0, subCount) + '...';
        }
        return nameStr;
    }

    //设置切换纹理的动作;
    public static setChangeSpriteFrameAction(node1: cc.Node, node2: cc.Node) {
        let scaleF0 = cc.scaleTo(0.3, 0.9);
        let scaleF1 = cc.scaleTo(0.4, 1.1);
        let scaleF2 = cc.scaleTo(0.2, 0.9);
        let scaleF3 = cc.scaleTo(0.2, 1);
        let callfunc = cc.callFunc(() => {
            let ro = cc.rotateBy(0.6, 180);
            let deTime = cc.delayTime(0.4);
            let hi = cc.fadeOut(0.2);
            let call = cc.callFunc(() => {
                node2.active = false;
            });
            node2.active = true;
            node2.runAction(cc.sequence(cc.spawn(ro, cc.sequence(deTime, hi)), call));
        });
        node1.runAction(cc.sequence(scaleF0, callfunc, scaleF1, scaleF2, scaleF3));
    }

    public static getStatus(roomId: string,callback: Function) {
        GetServerData.SendMessage('',(res: any) => {
            callback && callback(res);
        });
    }
}