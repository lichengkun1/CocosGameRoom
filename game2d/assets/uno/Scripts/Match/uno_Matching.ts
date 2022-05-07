import { GameConfig } from "../../../gameConfig";
import { debugLog, getUrlParameterValue, isProd, usernameSlice } from "../../../Script/common/utils/util";
import BgmSettings from "../../../Script/CommonScripts/bgmSettings";
import MatchingScene from "../../../Script/CommonScripts/MatchSceneScripts/MatchingScene";
import MatchSetBets from "../../../Script/CommonScripts/MatchSceneScripts/MatchSetBets";
import timeManager from "../../../Script/CommonScripts/MatchSceneScripts/timeManager";
import MessageData, { GameType } from "../../../Script/CommonScripts/Utils/MessageData";
import MessageForRoom from "../../../Script/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MessageSoundManager from "../../../Script/CommonScripts/Utils/MessageSoundManager";
import MessageType from "../../../Script/CommonScripts/Utils/MessageType";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";
import { GameData } from "../Common/Game/GameData";
import { logManager } from "../Common/LogManager";
import { PopupManager } from "../Common/Popup/PopupManager";
import { GetServerData } from "../Common/Server/GetServerData";
import SoundManager from "../Common/Sound/SoundManager";
import Socket from "../Game/Socket/Socket";
import GlobalGameData, { GamePlayerCount, LatestGameInfo, RoomType } from "../GlobalGameData";
import Player, { PlayerType } from "../Players/Player";
import PlayerManager from "../Players/PlayerManager";
import MatchingPlayers from "./MatchingPlayers";
import MatchingUserInfo from "./MatchingUserInfo";

const {ccclass, property} = cc._decorator;
const lobbyExtra = {extra: "bet_type=diamond&bet_limit=100&player_count=4"};

/**
 * 
 * 
 * uno 匹配
 * 
 */
@ccclass
export default class UNOMatching extends cc.Component {

    public static I: UNOMatching = null;
    /** 是否跳转场景了 */
    public static isJump: boolean = false;

    @property(cc.Node)
    joinBtn: cc.Node = null;
    @property(cc.Node)
    joinBtnDisable: cc.Node = null;

    @property(cc.Node)
    startBtn: cc.Node = null;
    @property(cc.Node)
    joinBtnBig: cc.Node = null;
    @property(cc.Node)
    joinBtnBigDisable: cc.Node = null;

    @property(MatchingUserInfo)
    matchingUserInfo: MatchingUserInfo = null;
    @property(MatchingPlayers)
    matchingPlayers: MatchingPlayers = null;

    @property(cc.Prefab)
    rulePrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    PlayerHeadImage: cc.SpriteFrame = null;

    @property(cc.Node)
    arrNode: cc.Node = null;

    private countDownLabel: cc.Label = null;
    private matchStatus: cc.Label = null;
    private betNumber: cc.Label = null;
    private bgNode: cc.Sprite = null;

    private static readonly ASSETS = 'v1/wallet/assets/';                            //获取资产（金币、钻石、游戏币）；
    private static readonly JOIN = 'v1/uno/join';                            //加入游戏；
    public static readonly LEAVE = 'v1/uno/leave';                           //离开游戏；
    private static timeInterval = null;
    public static JoinOK = false;
    public static readonly GAMECONFIG = "v1/uno/game/config";

    /** 是否是playAgain */
    public static PlayAgain = false;
    public static JoinIndex = 0;

    private countDownTotalTime: number = 15;
    private waitTime: number = 0;
    private joinLobbyTimes: number = 0;

    private yoyoBet: cc.SpriteFrame = null;
    private gameBet: cc.SpriteFrame = null;

    /** 加入成功 */
    private joinSuccess: boolean = false;

    public static isFirstEnter = true;

    private viewResolution: cc.Size = cc.size(0);

    private betLabel: cc.Label = null;

    private versionNode: cc.Node = null;

    private isLoadChangeScene: boolean = false;       //是否在切换场景;
    private timeOutNum: number = -1;                  //10倒计时判断;
    private isReceiveMatchMessage: boolean = false;   //是否有接收到过socket消息;
    private isAotuStr: string = 'no';                 //是否是自动join的消息;
    private isFristReveiveMessage: boolean = false;   //是否为第一次打点;
    private isSendStatusEvent: boolean = false;       //是否打了当前状态的点;
    private isSendJoinEvent: boolean = false;         //是否打了join的点;
    private isCanChangeScene: boolean = false;

    private match_time: number = 0;                  //倒计时时间;
    private countTimeDT: number = 0;                 //倒计时基准;
    private isUpdate: boolean = false;               //是否开启update;

    public static GameConfig = {
        bet: 100,
        time_limit: 240,
        turn_duration: 12
    }

    onLoad () {
        MessageData.extra = {extra: "bet_type=diamond&bet_limit=100&player_count=4"};
        GlobalGameData.enterGameScene = false;
        MessageManager.setNetworkConfiguration();
        PopupManager.LoadPopups();
        SoundManager.LoadSound();
        UNOMatching.I = this;
        Socket.Init();
        if(GlobalGameData.isFirstLoad) {
            GlobalGameData.isFirstLoad = false;
            let nowTime = new Date().getTime();
            let time = NDB.startTime;
            let t = ((nowTime - time) / 1000).toFixed(1);
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
            let obj = {
                eventName: "game_load_complete",
                name: `${GameConfig.gameName}${gameType}`,
                time: t
            }
            if (gameType == "Room") {
                NDB.sendAutoJoinEvent(obj);
            }
        }

        const bgmNode = cc.find("Canvas/bgm");
        const bgmComp = bgmNode.getComponent(BgmSettings);
        bgmComp.updateMusic = function() {
            if(MessageSoundManager.audioEngineOn) {
                MessageSoundManager.resumeMusic();
                bgmComp.bgmOnActive(true);
                bgmComp.bgmOffActive(false);
            } else {
                bgmComp.bgmOnActive(false);
                bgmComp.bgmOffActive(true);
                MessageSoundManager.updateMusic();
            }
        }
    }

    start () {
        GlobalGameData.isGotoMatchScene = true;
        cc.view.enableAntiAlias(true);
        cc.game.setFrameRate(48);

        this.initNode();
        this.getUserInfo();

        this.loadScene();
        if(MessageSoundManager.audioEngineOn) {
            MessageSoundManager.playBGEngine(`resources_${GameConfig.gameName}/sounds/BGMusic`,(id: number) => {

            });
        }

        this.firstLoading();
    }

    firstLoading() {
        if(GlobalGameData.isCanAutoJoinGame) {
            timeManager.I.startUpdate();
            let isAuto: string = 'no';
            if(this.getIsAutoJoin()) {
                isAuto = 'yes';
            }
            let gameType = getUrlParameterValue('is_lobby') == 'true' ? "Lobby" : "Room";
            let obj = {
                eventName: "game_loading_complete",
                type: `${GameConfig.gameName}${gameType}`,
                source: MessageData.gameSource,
                is_match_auto: isAuto,
                time: timeManager.I.getNowTime()
            }
            NDB.sendAutoJoinEvent(obj);
        }
    }

    getIsAutoJoin() {
        let source = MessageData.gameSource;
        if (source.match('gaming_') || source.match('trending_') || source.match('quickly_match_games')
            || source.match('suggest_switch_match_') || source.match('channel_popup_') || source.match('popup_chatroom_')) {
            return true;
        }

        let auto_join = getUrlParameterValue('auto_join');
        if (auto_join == 'true') {
            return true;
        }
        return false;
    }

    loadScene() {
        cc.director.preloadScene('uno_GameScene',(comp,total,item) => {
            let comple = Math.floor(comp / total * 100);
            if(comp == 100) {
                this.loadChangeScene();
            }
        },(err) => {
            console.log('err is ',err);
        });
    }

    initNode() {
        let betsNode = cc.find("Canvas/betsNode")
        let betIcon = betsNode.getChildByName("betsIcon")
        let betLabel = betIcon.getChildByName("betLabel")
        this.betLabel = betLabel.getComponent(cc.Label);
        // this.betType = cc.find("Canvas/betsNode/betsIcon/betType")
        // this.modeLabel = cc.find("Canvas/betsNode/betsIcon/modeLabel").getComponent(cc.Label);
        // console.log("++++++++++++++++++++++++", Ludo_GameMode.piceNum);

        // if (Ludo_GameMode.piceNum == 2) {
        //     this.modeLabel.string = MessageData.lang.quick ? MessageData.lang.quick : 'QUICK';
        // } else {
        //     this.modeLabel.string = MessageData.lang.classical ? MessageData.lang.classical : 'CLASSICAL';
        // }
        // this.changBetType = cc.find("Canvas/")
        let bet = cc.find("Canvas/betsNode").getComponent(MatchSetBets);
        this.yoyoBet = bet.yoyoBet;
        this.gameBet = bet.gameBet;
    }

    /** 设置自己的麦位 */
    private setSelfPosition(userData: {userId: number,avatar: string,username: string}) {
        if(GlobalGameData.roomType === RoomType.SINGLE) {
            this.matchingPlayers.setPlayerByIndex(userData,0);
            // 自动加入游戏
            
        }
    }


    wsStatus(data) {
        // if(data.)
        console.log('data is ',data);
        if(data.data.data.online) {
            // 重新连接上socket了
            if(GlobalGameData.roomType === RoomType.ROOM) {
                this.getRoomStatus();
            }
        }
        
    }

    replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os == cc.sys.OS_IOS && SoundManager.AudioSourceVolume === 1) {
            SoundManager.pauseMusic();
            SoundManager.resumeMusic();
        }
    }

    resume() {
        this.matchingUserInfo.initMyGameCoin();
        this.getRoomStatus();
    }
    
    /**
     * 获取房间最新状态
     */
    getRoomStatus() {
        // 获取房间状态
        GetServerData.getStatus(GlobalGameData.roomId,(res: LatestGameInfo) => {
            this.updateStatus(res);
        });
    }

    /**
     * 更新房间状态
     * @param  {LatestGameInfo} res 拉取的房间状态信息
     */
    updateStatus(res: LatestGameInfo) {
        console.log('res is ',res);
        // if(res)
        if(res.status == 'completed') {
            this.startTimeOut();
            this.sendStatusComplete(true,'lack');
        } else if(res.status == 'matching') {
            this.startTimeOut();
            // this.updateMatching({data: {data: {players: res.players,countdown: res.countdown}}});
            this.setMatchingShow(res,'matching');
            let players = res.players;
            let keys = Object.keys(players);
            if(keys.length < 4) {
                this.sendStatusComplete(true,'lack');
            } else {
                this.sendStatusComplete(false,'full');
            }
        } else if(res.status == 'playing') {
            /** 如果是playing状态的时候加入按钮隐藏 */
            // this.disableAllBtns();
            this.setMatchingShow(res,'playing');
            this.sendStatusComplete(false,'gaming');
            if(this.isCanChangeScene) {
                return
            }
            this.changeScene(res);

            let dataObj = {
                data: res
            }
            GameData.gameid = res.game_id;
            // 准备玩家数据，转换场景 
            UNOMatching.I.InitGameData(dataObj);
            UNOMatching.I.loadChangeScene();

        }
    }

    changeScene(data: LatestGameInfo) {
        data.players.forEach(item => {
            if(item.id == MessageData.userId) {
                GlobalGameData.isGod = false;
                return;
            }
        });
        // 是否是上帝模式
        this.isCanChangeScene = true;
        GlobalGameData.isGod = true;

        this.loadChangeScene();
    }

    setMatchingShow(data,type) {
        let players = data.players;
        let keys = Object.keys(players);
        this.isReceiveMatchMessage = true;
        let selfIsJoin = false;

        for(let i = 0,len = 4; i < len; i++) {
            let key = keys[i];
            if(players[key]) {
                let playerId = players[key].id;
                
                if(playerId == GlobalGameData.userId) {
                    selfIsJoin = true;
                    if(this.isFristReveiveMessage && GlobalGameData.isCanAutoJoinGame && this.getIsAutoJoin()) {
                        // this.gameJoinComplete();
                    }
                }
            }
        }
    }

    //游戏状态首次更新完成;
    sendStatusComplete(flag: boolean, nowStatus, mType: string = 'http') {
        this.isSendStatusEvent = true;
        if (GlobalGameData.isCanAutoJoinGame) {
            if (this.getIsAutoJoin() && !this.isSendJoinEvent) {
                this.isAotuStr = 'yes';
                this.isFristReveiveMessage = true;
                this.isSendJoinEvent = true;
                setTimeout(() => {
                    if (this.node && this.node.active) {
                        this.isAotuStr = 'no';
                    }
                }, 10000);
            }

            let isAuto = 'no';
            if (this.getIsAutoJoin()) {
                isAuto = 'yes';
                let auto_join = MessageManager.getUrlParameterValue('auto_join');
                if (flag && (GlobalGameData.roomBetsType === 'diamond' || auto_join == 'true')) {
                    MatchingScene.I.joinGame();
                }
            }
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
            let obj = {
                eventName: "game_status_complete",
                type: `${GameConfig.gameName}${gameType}`,
                source: MessageData.gameSource,
                is_match_auto: isAuto,
                status: nowStatus,
                messageType: mType,
                time: timeManager.I.getNowTime()
            }
            NDB.sendAutoJoinEvent(obj);
        }
    }

    public GetGameConfig() {
        this.betNumber.string = UNOMatching.GameConfig.bet + "";
    }

    //10S倒计时；
    startTimeOut() {
        this.stopTimeOut();
        this.timeOutNum = window.setTimeout(() => {
            if (this.node && this.node.active) {
                // 10秒倒计时 切换房间
                console.log('10秒倒计时到了切换房间');
                MessageForRoom.takeChangeRoom(true);
            }
        }, 10000);
    }

    //停止10s倒计时;
    stopTimeOut() {
        if (this.timeOutNum >= 0) {
            window.clearTimeout(this.timeOutNum);
            this.timeOutNum = -1;
        }
    }

     /**游戏加载完成断点
     * @param gameName 游戏名称
     */
    public GameLoad(gameName: string = 'UNO'): void {
        let oldtime = Number(localStorage.getItem("UNOPointTime"))
        let nowtime = Date.now();
        let lerptime = nowtime - oldtime;
        let time = (lerptime / 1000).toFixed(1);
        logManager.sendLog({eventName: "game_loading_complete",time});
        
    }

    setRoomOwner(tag: boolean) {
        this.joinBtn.active = tag;
        // this.startBtn.active = tag;
        this.joinBtnBig.active = !tag;
    }

    //初始化游戏信息，根据join的返回数据设置玩家信息
    InitGameData(message) {
        this.isCanChangeScene = true;
        console.log("初始化游戏信息,\nmessage : ", message);
        // 退出重进的时候将对局信息保存起来，防止如果用户从房间里面的匹配界面进到游戏页面没有消息的问题
        GameData.message = message;
        let index = 0;

        if(GameData.message.data.players.every(item => item.id !== MessageData.userId)) {
            GlobalGameData.isGod = true;
        } else {
            GlobalGameData.isGod = false;
        }

        const userfulPlayers = GameData.message.data.players.filter(item => item.id);
        GlobalGameData.playerCount = userfulPlayers.length === 2 ? GamePlayerCount.TWO : userfulPlayers.length === 3 ? GamePlayerCount.THREE : GamePlayerCount.FOUR;
        console.log('游戏开始重置所有的玩家头像数据');
        // this.matchingPlayers.resetAllPlayers();

        MatchingScene.I.setPlayersData(GameData.message.data.players,false);
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.id) continue;
            // if (element.user_id != PlayerManager.thisPlayer_user_id) {
            //     index++;
            // }
            this.CreatePlayer(element, i);
        }
    }

    private CreatePlayer(element: { id: number; name: string; avatar: string; poker_remain_count: number; poker_remain: number[]; status: string; rank: number; score: number; coin: number; }, index) {
        // let headImageNodeName = "Canvas/players/OtherPlayer" + index + "HeadImage";
        // let nameNodeName = "Canvas/players/name" + index;

        // let headImage = cc.find(headImageNodeName).getComponent(cc.Sprite);
        // let nameNode = cc.find(nameNodeName).getComponent(cc.Label);
        // let playernode = {
        //     headImage: headImage,
        //     nameNode: nameNode,
        // }

        // if(element.id == GlobalGameData.userId) {
        //     this.matchingPlayers.setTabMe(index);
        // }
        let player = new Player();
        player.user_id = element.id;
        player.user_name = element.name;
        // playernode.nameNode.string = usernameSlice(element.name,8);
        player.user_avatar = element.avatar;
        player.user_type = PlayerType.OtherPlayer;
        PlayerManager.SetPlayer(player.user_id, player);
        // playernode.headImage.spriteFrame = this.PlayerHeadImage;
        if (!player.user_headImage) {
            console.log(player.user_avatar, player.user_id);
        }
    }

    loadChangeScene() {
        debugLog('进入游戏 isLoadchangeScene is ',this.isLoadChangeScene,' canchangeScene is ',this.isCanChangeScene);
        if(this.isLoadChangeScene) {
            return;
        }

        if(this.isCanChangeScene) {
            this.isLoadChangeScene = true;
            this.scheduleOnce(() => {
                cc.audioEngine.stopMusic();
                cc.director.loadScene('uno_GameScene');
            })
        }
    }

    //当前接收的消息是否是自动join的消息打点；
    gameJoinComplete() {
        this.isFristReveiveMessage = false;
        let gameType = getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
        let obj = {
            eventName: "game_join_complete",
            type: `${GameConfig.gameName}${gameType}`,
            source: MessageData.gameSource,
            is_match_auto: this.isAotuStr,
            time: timeManager.I.getNowTime()
        }
        NDB.sendAutoJoinEvent(obj);
    }

    showRule() {
        PopupManager.ShowPopup("RulePopup");
    }

    

    getUserInfo() {
        if(GlobalGameData.userInfo) {
            this.getRoomInfo();
        }
        MessageForRoom.getUserInfo((userInfo) => {
            GlobalGameData.userInfo = userInfo;
            GlobalGameData.userId = +userInfo.userId;
            PlayerManager.thisPlayer_user_id = +userInfo.userId;
            this.getRoomInfo();
        });
    }

    private getRoomInfo() {
        if(MessageData.gameRoomId) {
            this.eventDispatchFunc();
            this.getRoomStatus();
        } else {
            MessageForRoom.getRoomInfo((roomInfo) => {
                this.eventDispatchFunc();
                this.getRoomStatus();
            });
        }
    }

    updateMatching(message: any) {
        console.log('matching message is ',message);
        const players = message.data.data.players;
        const countdown = message.data.data.countdown;
        if(GlobalGameData.roomType == RoomType.SINGLE) {
            return;
        }

        
    }

    public eventDispatchFunc() {
        //监听服务器广播;
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //当前房间状态； emit_status
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //切换回前台；
        MyEvent.I.on('onAndroidResume', this.resume.bind(this), this.node);
        //退出游戏匹配;
        MyEvent.I.on('exitMatching', this.exitMatchingFunc.bind(this), this.node);
        MyEvent.I.on('replayMusic',this.replayMusic,this);

        MyEvent.I.on(MessageType.MESSAGE_MATCHING,this.updateMatching.bind(this),this.node);
        // MyEvent.I.on(MessageType.MESSAGE_PLAYER,this.updatePlaying.bind(this),this.node);
        MyEvent.I.on(MessageType.MESSAGE_REQUEST_WS_STATUS,this.wsStatus.bind(this),this.node);

        // MyEvent.I.on(MessageType.MESSAGE_MATCHING,this.updateMatching.bind(this),this.node);
        // MyEvent.I.on(MessageType.MESSAGE_PLAYER,this.updatePlaying.bind(this),this.node);
        MyEvent.I.on(MessageType.MESSAGE_REQUEST_WS_STATUS,this.wsStatus.bind(this),this.node);
    }

    exitMatchingFunc() {
        MessageForRoom.exitRoomGame();
    }

    private messageFunc(data) {
        let method = data.data.method;
        switch(method) {
            case "uno_match":
                this.setMatchingShow(data.data.data,'matching');
                this.getNowGameStatus(data,method);
                // this.get
                break;
            case "uno_play":
                this.setMatchingShow(data.data.data,'playing');
                this.getNowGameStatus(data,method);
                if(MessageData.gameType == GameType.single) {
                    debugLog('大厅的unoplay data is ',data.data);
                } else {
                    debugLog('房间的unoplay data is ',data.data);
                }
                
                break;
        }
    }

    //获取当前房间信息; 
    getNowGameStatus(data, method) {
        if (!this.isSendStatusEvent && GlobalGameData.isCanAutoJoinGame) {
            if (method === 'ludo_playing') {
                this.sendStatusComplete(false, 'gaming', 'socket');
            } else if (method === "ludo_matching") {
                let players = data.data.data.players;
                let len = Object.keys(players).length;
                if (len === 4) {
                    this.sendStatusComplete(false, 'full', 'socket');
                } else {

                    this.sendStatusComplete(true, 'lack', 'socket');
                }
            }
        }
    }
}
