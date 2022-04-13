
import { GameConfig } from "../../../gameConfig";
import BgmSettings from "../../../roomCommon/CommonScripts/bgmSettings";
import MatchingScene from "../../../roomCommon/CommonScripts/MatchSceneScripts/MatchingScene";
import MatchSetBets from "../../../roomCommon/CommonScripts/MatchSceneScripts/MatchSetBets";
import timeManager from "../../../roomCommon/CommonScripts/MatchSceneScripts/timeManager";
import MessageData, { GameCoinType, GameType } from "../../../roomCommon/CommonScripts/Utils/MessageData";
import MessageForRoom from "../../../roomCommon/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../roomCommon/CommonScripts/Utils/MessageManager";
import MessageSoundManager from "../../../roomCommon/CommonScripts/Utils/MessageSoundManager";
import MyEvent from "../../../roomCommon/CommonScripts/Utils/MyEvent";
import NDB from "../../../roomCommon/CommonScripts/Utils/NDBTS";
import ResourcesManager from "../../../roomCommon/CommonScripts/Utils/ResourcesManager";
import TopUINode from "../../../roomCommon/Component/RoomTop/scripts/TopUINode";
import Ludo_BetsConfig from "../game/Ludo_BetsConfig";
import Global from "../Global/Ludo_GlobalGameData";
import Ludo_GameMode from "../ModeSceneScripts/Ludo_GameMode";

import Ludo_MKPreLoad from "../Utils/Ludo_MKPreLoad";
import Ludo_BetsIcon from "./Ludo_BetsIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ludo_Matching extends cc.Component {

    // @property(cc.Node)
    // playerArr: cc.Node[] = [];

    // @property(cc.SpriteFrame)
    // headIcon: cc.SpriteFrame = null;

    // @property({ type: cc.AudioClip })
    // readyclip: cc.AudioClip = null;

    // @property(cc.Node)
    // Rectangle: cc.Node = null;

    // @property(cc.Prefab)
    // depositPrefab: cc.Prefab = null;

    // @property(cc.Prefab)
    // exitMatchingPrefab: cc.Prefab = null;

    // @property(cc.SpriteFrame)
    // followed: cc.SpriteFrame = null;

    // @property(cc.SpriteFrame)
    // follow: cc.SpriteFrame = null;

    // @property(cc.Prefab)
    // betPrefab: cc.Prefab = null;

    // @property(cc.Label)
    betLabel: cc.Label = null;
    // @property(cc.Node)
    betType: cc.Node = null;
    modeLabel: cc.Label = null;
    // @property(cc.Node)
    // changBetType: cc.Node = null;
    // @property(cc.SpriteFrame)
    yoyoBet: cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    gameBet: cc.SpriteFrame = null;
    // @property(cc.Node)
    // @property(cc.JsonAsset)
    // langJson: cc.JsonAsset = null;

    // @property(cc.Prefab)
    // popLayer: cc.Prefab = null;

    // @property(cc.SpriteFrame)
    // gameShowBg: cc.SpriteFrame = null;

    // @property(cc.SpriteFrame)
    // coinShowBg: cc.SpriteFrame = null;

    // @property(cc.Node)
    // assetBG: cc.Node = null;

    private isUpdate: boolean = false;               //是否开启update;
    // private joinBtn: cc.Node = null;                 //加入游戏btn;
    // private exitBtn: cc.Node = null;                 //离开游戏btn；
    private playerDataArr: number[] = [];            //当前匹配玩家数据;
    private match_time: number = 0;                  //倒计时时间;
    private countTimeDT: number = 0;                 //倒计时基准;
    // private countLabel: cc.Label = null;             //倒计时label;
    private isChangeScene: boolean = false;          //是否在切换场景;
    private playersIdArr: number[] = [];             //玩家id数组;
    private playerPosArr: number[][] = [[-154, -40], [154, -40], [-154, -200], [154, -200]];            //匹配界面用户发送表情时候的显示坐标；
    // private countTimeBG: cc.Node = null;              //倒计时背景;
    // private userHead: cc.Node = null;                 //用户头像;
    // private username: cc.Label = null;                //用户昵称;
    // private coinLabel: cc.Label = null;               //用户的金币数量;
    // private rankLabel: cc.Label = null;               //用户排名;
    // private firstLabel: cc.Label = null;              //第一名昵称;
    private isLoadChangeScene: boolean = false;       //是否在切换场景;
    // private joinLabel: cc.Label = null;               //加入游戏;
    // private exitLabel: cc.Label = null;               //离开游戏;
    private timeOutNum: number = -1;                  //10倒计时判断;
    private isReceiveMatchMessage: boolean = false;   //是否有接收到过socket消息;
    private isAotuStr: string = 'no';                 //是否是自动join的消息;
    private isFristReveiveMessage: boolean = false;   //是否为第一次打点;
    private isSendStatusEvent: boolean = false;       //是否打了当前状态的点;
    private isSendJoinEvent: boolean = false;         //是否打了join的点;
    private isCanChangeScene: boolean = false;
    private selfAsset = null;                         //用户信息;

    private musicInterval: number = 0.3;
    private time: number = 0;

    onLoad() {
        Global.enterGameScene = false;
        MessageManager.setNetworkConfiguration();
        if (Global.isFirstLoad) {
            Global.isFirstLoad = false;
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


    initNode() {
        let betsNode = cc.find("Canvas/betsNode")
        let betIcon = betsNode.getChildByName("betsIcon")
        let betLabel = betIcon.getChildByName("betLabel")
        this.betLabel = betLabel.getComponent(cc.Label);
        this.betType = cc.find("Canvas/betsNode/betsIcon/betType")
        this.modeLabel = cc.find("Canvas/betsNode/betsIcon/modeLabel").getComponent(cc.Label);
        console.log("++++++++++++++++++++++++", Ludo_GameMode.piceNum);

        if (Ludo_GameMode.piceNum == 2) {
            this.modeLabel.string = MessageData.lang.quick ? MessageData.lang.quick : 'QUICK';
        } else {
            this.modeLabel.string = MessageData.lang.classical ? MessageData.lang.classical : 'CLASSICAL';
        }
        // this.changBetType = cc.find("Canvas/")
        let bet = cc.find("Canvas/betsNode").getComponent(MatchSetBets);
        this.yoyoBet = bet.yoyoBet;
        this.gameBet = bet.gameBet;
        // this.langJson
    }
    start() {
        /** 预加载游戏场景的地图 */
        this.preloadMap();
        Global.isGotoMatchScene = true;
        cc.view.enableAntiAlias(true);
        cc.game.setFrameRate(48);
        this.init();
        this.initNode();
        this.getUserinfo();
        this.getGameCoin();
        this.loadScene();
        if (MessageSoundManager.audioEngineOn) {
            MessageSoundManager.playBGEngine('GamesRes/sound/hallMusic',(id: number) => {
                console.log('大厅的背景音乐id is ',id);
                if(Global.enterGameScene) {
                    // 已经进入到游戏场景了直接停止该音频
                    cc.audioEngine.stop(id);
                }
            });
        }
        // MessageForRoom.getGameResource();
        //发送获取APP与服务器链接情况;
        // MKMessageManager.socketSend(MKMessageType.REQUEST_WS_STATUS);
        //匹配界面的打点；
        this.firstLoding();
    }

    preloadMap() {
        ResourcesManager.loadDragonBonesRes('chengbaocheckerboard/background_chengbao',() => {
            console.log('预加载游戏地图完成');
        });
        ResourcesManager.loadSpriteAtlas('isLandCheckerboard/island_checkerboardPlist',() => {
            console.log('预加载地图图片完成');
        });
    }

    //游戏页面加载完成打点；
    firstLoding() {
        if (Global.isCanAutoJoinGame) {
            timeManager.I.startUpdate();
            let isAuto: string = 'no';
            if (this.getIsAutoJoin()) {
                isAuto = 'yes';
            }
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";

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

    //当前接收的消息是否是自动join的消息打点；
    gameJoinComplete() {
        this.isFristReveiveMessage = false;
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
        let obj = {
            eventName: "game_join_complete",
            type: `${GameConfig.gameName}${gameType}`,
            source: MessageData.gameSource,
            is_match_auto: this.isAotuStr,
            time: timeManager.I.getNowTime()
        }
        NDB.sendAutoJoinEvent(obj);
    }

    init() {

        Global.countTimeIsZero = false;
    }

    //消息监听;
    eventDispatchFunc() {
        //监听服务器广播;
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //当前房间状态； emit_status
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //余额不足;
        MyEvent.I.on('insufficientBalance', this.insufficientBalanceFunc.bind(this), this.node);
        //切换回前台；
        MyEvent.I.on('onAndroidResume', this.onAndroidResumeFunc.bind(this), this.node);
        //退出游戏匹配;
        MyEvent.I.on('exitMatching', this.exitMatchingFunc.bind(this), this.node);
        //没有座位，不能上麦;
        MyEvent.I.on('no_mic', this.noMicFunc.bind(this), this.node);

        MyEvent.I.on('replayMusic',this.replayMusic,this);
    }

    private replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && MessageSoundManager.audioEngineOn) {
            MessageSoundManager.pauseMusic();
            MessageSoundManager.resumeMusic();
        }
    }

    //获取个人信息；
    getUserinfo() {
        //先获取个人信息，然后获取房间信息，然后获取游戏信息;
        if (Global.userInfo) {
            this.setUserInfo(Global.userInfo);
            this.getRoomInfo();
        } else {
            MessageForRoom.getUserInfo((userInfo) => {
                Global.userInfo = userInfo;
                Global.userId = Number(userInfo.userId);
                this.getRoomInfo();
                this.setUserInfo(userInfo);
            });
        }
    }

    //获取游戏币数据，并显示;
    getGameCoin() {
        // MessageManager.httpIAPResult('get', ludo_MKMessageType.ASSETS, {}, (data) => {
        //     console.log('ASSETS:');
        //     console.log(data);
        //     if (this.coinLabel && data && data.diamond) {
        //         this.selfAsset = data;
        //         if (Global.roomBetsType === 'coin') {
        //             this.coinLabel.string = String(data.coin);
        //             this.assetBG.getComponent(cc.Sprite).spriteFrame = this.coinShowBg;
        //         } else {
        //             this.coinLabel.string = String(data.diamond);
        //             this.assetBG.getComponent(cc.Sprite).spriteFrame = this.gameShowBg;
        //         }
        //     }
        // });
    }

    //设置自己的信息显示;
    setUserInfo(data) {
        // let avatar = data.avatar;
        // let name = data.userName;
        // let uid = data.userId;
        // MKResourcesManager.loadHeadImag(avatar, uid, 2, (res: cc.Texture2D) => {
        //     if (this.node && this.node.active) {
        //         res.packable = false;
        //         this.userHead.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
        //         this.userHead.scaleX = 64 / this.userHead.width;
        //         this.userHead.scaleY = 64 / this.userHead.height;
        //     }
        // });
        // this.username.string = Global.subNickName(name, 10);
    }

    //获取房间信息;
    getRoomInfo() {
        if (MessageData.gameRoomId) {
            this.eventDispatchFunc();
            this.getGameRoomStatus();
        } else {
            MessageForRoom.getRoomInfo((roomInfo) => {
                console.log('getRoomInfo:');
                console.log(roomInfo);
                this.eventDispatchFunc();
                this.getGameRoomStatus();
            });
        }
    }

    //设置赌注信息;
    setBetsInfo(data) {
        this.betType.active = true;
        if (!this.betLabel) {
            let betLabel = cc.find("Canvas/betsNode/betsIcon/betLabel")
            if (betLabel)
                this.betLabel = betLabel.getComponent(cc.Label);
        }
        this.betLabel.node.active = true;
        const activated = data.activated;
        Ludo_GameMode.roomModeData = data;
        console.log(data.model, "+++++++++++++++++++++++++++");
        if (data.model == 'classical') {
            Ludo_GameMode.piceNum = 4;
            this.modeLabel.string = MessageData.lang.classical ? MessageData.lang.classical : 'CLASSICAL';
        } else {
            Ludo_GameMode.piceNum = 2;
            this.modeLabel.string = MessageData.lang.quick ? MessageData.lang.quick : 'QUICK';
        }

        if (activated) {
            console.log('ludo是否可以修改',data.is_modify);
            if (data.is_modify) {
                // this.changBetType.active = true;
                MatchSetBets.iscanChanageBets = true;
                if (Global.isCanShowBetsText) {
                    Global.isCanShowBetsText = false;
                    // this.setBetPop.active = true;
                    // cc.tween(this.setBetPop)
                    //     .to(1, { opacity: 180 })
                    //     .to(1, { opacity: 255 })
                    //     .to(1, { opacity: 180 })
                    //     .to(1, { opacity: 255 })
                    //     .to(1, { opacity: 180 })
                    //     .call(() => {
                    //         this.setBetPop.active = false;
                    //     })
                    //     .start();
                    // let betLabel = this.setBetPop.getChildByName('betLabel');
                    // let uiLang = MessageManager.getUrlParameterValue('ui_lang');
                    // if (uiLang === 'id') {
                    //     // let lb = betLabel.getComponent(cc.Label);
                    //     // lb.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                    //     // betLabel.width = 160;
                    //     // this.setBetPop.height = 85;
                    //     // lb.string = this.langJson.json[uiLang].setbet;
                    // } else {
                    //     betLabel.on(cc.Node.EventType.SIZE_CHANGED, () => {
                    //         this.setBetPop.width = betLabel.width + 40;
                    //     });
                    //     if (this.langJson.json[uiLang]) {
                    //         Global.lang_json = this.langJson.json[uiLang];
                    //         betLabel.getComponent(cc.Label).string = this.langJson.json[uiLang].setbet;
                    //     }
                    // }

                }
            }
            Ludo_BetsIcon.I.setBetsIcon();
            Global.bets_list = data.bets_list;
            Global.roomBetsType = data.coin_type;
            if (Global.roomBetsType === 'diamond') {
                MessageData.game_coinType = GameCoinType.game_coin;
                this.betType.getComponent(cc.Sprite).spriteFrame = this.gameBet;
            } else if (Global.roomBetsType === 'coin') {
                MessageData.game_coinType = GameCoinType.coin;
                this.betType.getComponent(cc.Sprite).spriteFrame = this.yoyoBet;

            }
            Global.roomBets = data.bets;
            // Ludo_GameMode.piceNum=Global.roomBets;
            this.betLabel.string = String(Global.roomBets);

            TopUINode.I.updateTopUI();

        }
    }

    //获取当前房间配置和状态;
    getGameRoomStatus(flag = true) {
        //说明已经获取过配置数据了;
        if (Global.betsConfig && flag) {
            this.setBetsInfo(Global.betsConfig);
            if (!this.isReceiveMatchMessage) {
                MessageForRoom.getStatus(MessageData.gameRoomId);
            }
        } else {
            Ludo_BetsConfig.getRoomConfig(MessageData.gameRoomId, (configData) => {
                
                if (configData && configData.data && this.node && this.node.active) {
                    let data = configData.data;
                    this.setBetsInfo(data);
                    if (!this.isReceiveMatchMessage) {
                        MessageForRoom.getStatus(MessageData.gameRoomId);
                    }
                }
            }, {}, 'get');
        }
    }

    //游戏状态首次更新完成;
    sendStatusComplete(flag: boolean, nowStatus, mType: string = 'http') {
        this.isSendStatusEvent = true;
        if (Global.isCanAutoJoinGame) {
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
                if (flag && (Global.roomBetsType === 'diamond' || auto_join == 'true')) {
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

    //更新现在的状态;
    updateStatus(event) {
        if (this.isReceiveMatchMessage) {
            return;
        }
        let data = event.statusData;
        if (data && data.ludo_equipment && data.ludo_equipment.game_ludo_board) {
            //获取用户当前使用的视盘;
            Global.godModeGameBoard = data.ludo_equipment.game_ludo_board;
        }
        let keys = Object.keys(data);
        if (keys.length == 0 || data.status == "completed") {
            this.startTimeOut();
            // this.joinBtn.active = true;
            // this.exitBtn.active = false;
            // this.joinBtn.getComponent(cc.Button).interactable = true;
            this.sendStatusComplete(true, 'lack');
        }
        //如果是匹配状态;
        if (data.status == "playing") {
            MessageManager.isPushmessage = true;
            this.setMatchingShow(data, 'playing');
            this.sendStatusComplete(false, 'gaming');
            if (this.isChangeScene) {
                return;
            }
            this.changeScene(data);
        } else if (data.status == "matching") {
            this.startTimeOut();
            this.setMatchingShow(data, 'matching');
            let players = data.players;
            let keys = Object.keys(players);
            if (keys.length < 4) {
                this.sendStatusComplete(true, 'lack');
            } else {
                this.sendStatusComplete(false, 'full');
            }
        }
    }

    //服务器消息处理;
    messageFunc(data) {
        let method = data.data.method;
        switch (method) {
            case 'emoji_on_mic':        //表情;
                let displayId = data.data.data.user.display_id;
                let msg = data.data.data.msg;
                let name = data.data.data.emoji_name;
                let num = data.data.data.emoji_random_number;
                this.setEmojiShow(displayId, msg, name, num);
                break;
            case 'ludo_matching':
                let mData = data.data.data;
                this.setMatchingShow(mData, 'matching');
                this.getNowGameStatus(data, method);
                break;
            case 'ludo_playing':
                if (MessageData.gameType == GameType.single) {
                    if (data.data.data.action == "start") {
                        Global.gameRoomId = data.data.channel.id
                        MessageData.gameid = data.data.channel.id
                        MessageData.gameSource_Id = data.data.data.source_id;
                    } else {
                        return;
                    }
                } else {
                    MessageData.gameSource_Id = data.data.data.source_id;
                    MessageData.gameid = data.data.channel.id;
                    Global.gameRoomId = data.data.channel.id
                }
                this.stopTimeOut();
                MessageManager.isPushmessage = true;
                let eData = data.data.data;
                this.setMatchingShow(eData, 'playing');
                this.getNowGameStatus(data, method);
                if (!this.isChangeScene) {
                    this.changeScene(data);
                }
                break;
            case 'ludo_bets_config':                //当改变房间配置的时候，socket回调；
                let bData = data.data.data;
                this.setBetsChange(bData);
                break;
            case 'response_ws_status':              //网络波动逻辑；
                this.request_ws_status(data);
                break;
        }
    }

    //设置bets更改;
    setBetsChange(bData) {
        Ludo_GameMode.roomModeData = bData;
        Global.roomBetsType = bData.coin_type;
        if (bData.model == 'classical') {
            Ludo_GameMode.piceNum = 4;
            this.modeLabel.string = MessageData.lang.classical ? MessageData.lang.classical : 'CLASSICAL';
        } else {
            Ludo_GameMode.piceNum = 2;
            this.modeLabel.string = MessageData.lang.quick ? MessageData.lang.quick : 'QUICK';
        }
        console.log("---------------------->>>>Ludo_GameMode.piceNum :", Ludo_GameMode.piceNum);

        if (Global.roomBetsType === 'diamond') {
            MessageData.game_coinType = GameCoinType.game_coin;
            this.betType.getComponent(cc.Sprite).spriteFrame = this.gameBet;
        } else if (Global.roomBetsType === 'coin') {
            MessageData.game_coinType = GameCoinType.coin;
            this.betType.getComponent(cc.Sprite).spriteFrame = this.yoyoBet;
        }

        Global.roomBets = bData.bets;
        this.betLabel.string = String(Global.roomBets);
        MatchingScene.I.automaticExitJoin();
        TopUINode.I.updateTopUI();
        // for (let i = 0; i < 4; i++) {
        //     this.playerDataArr[i] = null;
        //     this.playerArr[i].getChildByName('follow').active = false;
        //     this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
        //     let playerName = this.playerArr[i].getChildByName('playerName').getComponent(cc.Label);
        //     let headSprite = this.playerArr[i].getChildByName('playerHead');
        //     playerName.string = `Player ${i + 1}`;
        //     headSprite.active = false;
        //     this.hideSelfAction(this.playerArr[i]);
        // }
        // this.joinBtn.active = true;
        // this.joinBtn.getComponent(cc.Button).interactable = true;
        // this.exitBtn.active = false;
        //停止倒计时;
        // this.stopCountDwon();
        MatchingScene.I.stopCountDown();
    }

    //当有人发送表情的时候，设置表情的显示;
    /*
        @param      displayId    发送表情人的ID
        @param      msg          表情内容
    */
    setEmojiShow(displayId, msg, name, num) {
        //获取发送表情的用户在第几个;
        let index = this.playerDataArr.indexOf(displayId);
        if (index >= 0) {
            // Message.showEmoji(this.playerPosArr[index], [106, 106], msg, name, num);
        }
    }

    //设置匹配玩家数据;
    setMatchingShow(data, type) {
        let players = data.players;
        let keys = Object.keys(players);
        this.isReceiveMatchMessage = true;
        let selfIsJoin = false;
        console.log('+++++++++++++++++++++++++++++++++++');
        console.log(data);
        for (let i = 0, len = 4; i < len; i++) {
            let key = keys[i];

            if (players[key]) {
                //数据中的用户id；
                let playerId = players[key].id;
                let ludo_equipment = players[key].ludo_equipment;
                if (ludo_equipment) {
                    Ludo_MKPreLoad.preLoadRes(ludo_equipment);
                }
                if (playerId == Global.userId) {
                    selfIsJoin = true;
                    // this.showSelfAciton(this.playerArr[i]);
                    if (this.isFristReveiveMessage && Global.isCanAutoJoinGame && this.getIsAutoJoin()) {
                        this.gameJoinComplete();
                    }
                } else {
                    // this.hideSelfAction(this.playerArr[i]);
                }
                this.playersIdArr[i] = playerId;
                //如果当前id与保存的id一致，说明是已经显示了的，不需要处理;
                if (playerId == this.playerDataArr[i]) {
                    continue;
                }
                //将头像数据赋值;
                this.playerDataArr[i] = playerId;
                //去除该头像的点击事件;
                // this.playerArr[i].off(cc.Node.EventType.TOUCH_START);
                //点击头像显示用户信息;
                // this.playerArr[i].on(cc.Node.EventType.TOUCH_START, () => {
                // MessageManager.showPlayerInfo(playerId);
                // }, this);
                //设置nickName;
                // let nickName = players[key].name;
                // let playerName = this.playerArr[i].getChildByName('playerName').getComponent(cc.Label);
                // playerName.string = Global.subNickName(nickName);
                //头像数据；
                // let avatar = players[key].avatar;
                // let headSprite = this.playerArr[i].getChildByName('playerHead').getComponent(cc.Sprite);
                // headSprite.node.active = true;
                // headSprite.spriteFrame = this.headIcon;
                // MKResourcesManager.loadHeadImag(avatar, playerId, 2, (headSpriteFrame: cc.Texture2D, uid) => {
                //     if (this.node && this.node.active && uid == this.playerDataArr[i]) {
                //         headSpriteFrame.packable = false;
                //         headSprite.spriteFrame = new cc.SpriteFrame(headSpriteFrame);
                //         headSprite.node.scaleX = 96 / headSprite.node.width;
                //         headSprite.node.scaleY = 96 / headSprite.node.height;
                //     }
                // });

                // if (playerId == Global.userId) {
                // this.playerArr[i].getChildByName('follow').active = false;
                // this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                // this.playerArr[i].getChildByName('followAction').active = false;
                // } else {
                // let follow = this.playerArr[i].getChildByName('follow');
                //     follow.active = false;
                //     if (Global.followedObj[playerId] == undefined) {
                //         MessageForRoom.isFollowedPlayer(playerId, (pid, flag) => {
                //             if (this.node && this.node.active && pid == this.playerDataArr[i]) {
                //                 follow.active = true;
                //                 if (flag) {
                //                     follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                //                     this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                //                     this.playerArr[i].getChildByName('followAction').active = false;
                //                 } else {
                //                     follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                //                     follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                //                         event.stopPropagation();
                //                         MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                //                             if (this.node && this.node.active) {
                //                                 if (playerId == uid && flag) {
                //                                     let followAction = this.playerArr[i].getChildByName('followAction');
                //                                     Global.setChangeSpriteFrameAction(follow, followAction);
                //                                     follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                //                                     this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                //                                 }
                //                             }
                //                         });
                //                     }, this);
                //                 }
                //             }
                //         });
                //     } else if (Global.followedObj[playerId] == false) {
                //         follow.active = true;
                //         follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                //         follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                //             event.stopPropagation();
                //             MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                //                 if (this.node && this.node.active) {
                //                     if (playerId == uid && flag) {
                //                         follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                //                         this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                //                         let followAction = this.playerArr[i].getChildByName('followAction');
                //                         Global.setChangeSpriteFrameAction(follow, followAction);
                //                     }
                //                 }
                //             });
                //         }, this);
                //     } else if (Global.followedObj[playerId]) {
                //         follow.active = true;
                //         follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                //         this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                //         this.playerArr[i].getChildByName('followAction').active = false;
                //     }
                // }
            } else {
                this.playerDataArr[i] = null;
                // this.playerArr[i].getChildByName('follow').active = false;
                // this.playerArr[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                // let playerName = this.playerArr[i].getChildByName('playerName').getComponent(cc.Label);
                // let headSprite = this.playerArr[i].getChildByName('playerHead');
                // playerName.string = `Player ${i + 1}`;
                // headSprite.active = false;
                // this.hideSelfAction(this.playerArr[i]);
            }
        }

        let number = 0;
        for (let i = 0, len = this.playerDataArr.length; i < len; i++) {
            if (this.playerDataArr[i] && this.playerDataArr[i] > 0) {
                number++;
            }
        }

        if (type == 'matching') {
            // if (selfIsJoin) {
            //     this.joinBtn.active = false;
            //     this.exitBtn.active = true;
            //     this.exitBtn.getComponent(cc.Button).interactable = true;
            //     this.exitLabel.node.color = cc.color(51, 51, 51, 255);
            // } else {
            //     Global.countTimeIsZero = false;
            //     this.joinBtn.active = true;
            //     this.joinBtn.getComponent(cc.Button).interactable = true;
            //     this.exitBtn.active = false;
            //     if (number == 4) {
            //         MessageForRoom.takeChangeRoom(true);
            //     }
            // }
        } else if (type == 'playing') {
            if (selfIsJoin) {
                console.log('自己已经加入切换房间');
                MessageForRoom.takeChangeRoom(false);
            } else {
                console.log('自己没有加入切换房间');
                MessageForRoom.takeChangeRoom(true);
            }
        }

        if (number >= 2) {
            let countdown_duration = data.countdown_duration;
            this.playCountDown(countdown_duration);
        } else {
            this.stopCountDwon();
        }

        if (number == 4 && !selfIsJoin) {
            // this.joinBtn.active = false;
            // this.exitBtn.active = true;
            // this.exitBtn.getComponent(cc.Button).interactable = false;
            // this.exitLabel.node.color = cc.color(108, 108, 108, 255);
        }
    }

    //获取当前房间信息; 
    getNowGameStatus(data, method) {
        if (!this.isSendStatusEvent && Global.isCanAutoJoinGame) {
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

    //显示自己的动作;
    showSelfAciton(node: cc.Node) {
        let actionNode = node.getChildByName('actionNode');
        let icon_me = node.getChildByName('icon_me');
        icon_me.active = true;
        let scale1 = cc.scaleTo(0.5, 1.1);
        let scale2 = cc.scaleTo(0.5, 1);
        actionNode.active = true;
        actionNode.runAction(cc.repeatForever(cc.sequence(scale1, scale2)));
        // icon_me.runAction(cc.repeatForever(cc.sequence(scale1,scale2)));
    }

    hideSelfAction(node: cc.Node) {
        let actionNode = node.getChildByName('actionNode');
        let icon_me = node.getChildByName('icon_me');
        icon_me.active = false;
        actionNode.active = false;
        actionNode.stopAllActions();
    }

    //加载场景;
    loadScene() {
        if (Global.gameSceneIsLoad) {
            return;
        }
        cc.director.preloadScene('ludo_GameScene', (completedCount, totalCount, item) => {
            let comple = Math.floor(completedCount / totalCount * 100);
            if (comple == 100) {
                Global.gameSceneIsLoad = true;
                this.loadChangeScene();
            }
        }, (error) => {
        });
    }

    //切换场景;
    changeScene(data) {
        // this.Rectangle.active = true;
        MessageManager.socketDatas.push(data);
        // this.joinBtn.active = false;
        // this.exitBtn.getComponent(cc.Button).interactable = false;
        // this.exitLabel.node.color = cc.color(108, 108, 108, 255);
        let playerNum: number = 0;
        let selfIsJoin: boolean = false;
        for (let i = 0, len = this.playerDataArr.length; i < len; i++) {
            if (this.playerDataArr[i] > 0) {
                playerNum++;
                if (this.playerDataArr[i] == Global.userId) {
                    selfIsJoin = true;
                }
            }
        }
        if (selfIsJoin) {
            switch (playerNum) {
                case 2:
                    Global.nowGameType = Global.gameType.twoModel;
                    break;
                case 3:
                    Global.nowGameType = Global.gameType.threeModel;
                    break;
                case 4:
                    Global.nowGameType = Global.gameType.FourModel;
                    break;
            }
        } else {
            Global.nowGameType = Global.gameType.GodModel;
        }

        this.isCanChangeScene = true;
        this.loadChangeScene();
    }

    //实际切换场景;
    loadChangeScene() {
        if (this.isLoadChangeScene) {
            return;
        }
        if (this.isCanChangeScene) {
            this.isLoadChangeScene = true;
            this.scheduleOnce(() => {
                cc.audioEngine.stopMusic();
                cc.director.loadScene("ludo_GameScene");
            }, 1)
        }
    }

    //加入游戏回调;
    hallJoinGame_callback() {
        MessageForRoom.joinRoomGame(2, true);
    }

    //离开游戏回调；
    hallExitGame_callback() {
        // let exitmatchingPrefab = cc.instantiate(this.exitMatchingPrefab);
        // this.node.addChild(exitmatchingPrefab);
    }

    //显示排行榜；
    showRanking_callback() {
        NDB.openWebView('http://a.fslk.co/activity4/togo_game_leader_board/index.html?type=ludo');
        // NDB.openWebView('http://a.fslk.co/games/DragonBonesProject/staging/web-mobile/index.html');
        let obj = {
            eventName: "room_game_ranking",
            from: 'room_game_lightbox',
        }
        NDB.sendEvent(obj);
    }

    //邀请玩家加入游戏;
    invite_callback() {
        let shareText: string = MessageData.lang.play_game_tips ? MessageData.lang.play_game_tips : MessageData.langEnglish.play_game_tips + Global.shareUrl;
        let shareUrl = 'http://static.funshareapp.com/atlas_op_common_file/1592385472898792.png';
        MessageManager.shareGameOrImage(shareText, shareUrl, (event) => {
        });
    }

    //设置bets回调;
    changeBets_callback() {
        // let node = cc.instantiate(this.betPrefab);
        // this.node.addChild(node);
    }

    //商城回调;
    store_callback() {
        MessageManager.goStore();
    }

    exitMatchingFunc() {
        MessageForRoom.exitRoomGame();
    }

    //余额不足的界面;
    insufficientBalanceFunc() {
        // let pNode = cc.instantiate(this.depositPrefab);
        // this.node.addChild(pNode);
    }

    //添加金币回调;
    addCoin_callback() {
        MessageManager.buyGameCion();
    }

    //添加规则页面;
    addRule_callback() {
        // ResourcesManager.loadPrefab('prefab/rulePrefab', (pNode) => {
        //     if (this.node && this.node.active) {
        //         this.node.addChild(pNode);
        //     }
        // });
    }

    //开始倒计时;
    playCountDown(match_duration) {
        this.stopTimeOut();
        this.match_time = match_duration;
        if (this.match_time > 0) {
            this.isUpdate = true;
            // this.countLabel.node.active = true;
            // this.countLabel.string = String(this.match_time);
            // this.countTimeBG.active = true;
        } else {
            this.isUpdate = false;
        }
    }

    //停止倒计时;
    stopCountDwon() {
        // this.isUpdate = false;
        // this.countLabel.node.active = false;
        // this.countTimeBG.active = false;
        // this.startTimeOut();
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

    //切换会前台;
    onAndroidResumeFunc() {
        this.getGameCoin();
        this.getGameRoomStatus(false);

        const bgmNode = cc.find("Canvas/bgm");
        const bgmComp = bgmNode.getComponent(BgmSettings);

        if(bgmComp.bgmOffNode.active) {
            MessageSoundManager.audioEngineOn = false;
        }
        if(bgmComp.bgmOnNode.active){
            MessageSoundManager.audioEngineOn = true;
        }

        MessageSoundManager.updateMusic();
    }

    //是否是应该自动join;
    getIsAutoJoin() {
        let source = MessageData.gameSource;
        if (source.match('gaming_') || source.match('trending_') || source.match('quickly_match_games')
            || source.match('suggest_switch_match_') || source.match('channel_popup_') || source.match('popup_chatroom_')) {
            return true;
        }

        let auto_join = MessageManager.getUrlParameterValue('auto_join');
        if (auto_join == 'true') {
            return true;
        }
        return false;
    }

    //没有麦味了;
    noMicFunc() {
        // let node = cc.instantiate(this.popLayer);
        // node.getComponent(popLayer).setLayerType('nomic');
        // this.node.addChild(node);
    }

    //网络波动;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            this.getGameRoomStatus(false);
        }
    }

    onDestroy() {
        //监听服务器广播;
        MyEvent.I.remove('emit_message', this.node);
        //当前房间状态； emit_status
        MyEvent.I.remove('emit_status', this.node);
        //余额不足提醒;
        MyEvent.I.remove('insufficientBalance', this.node);
        //切换会前台;
        MyEvent.I.remove('onAndroidResume', this.node);
        // 停止音频
        console.log('停止音频');
        cc.audioEngine.stopMusic();
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {

            //@ts-ignore
            if(cc.sys.__audioSupport.context && cc.sys.__audioSupport.context['suspend']) {
                //@ts-ignore
                cc.sys.__audioSupport.context.suspend();
            }
        }
    }

    update(dt) {
        if (this.isUpdate) {
            this.countTimeDT += dt;
            if (this.countTimeDT >= 1) {
                // MessageSoundManager.playLoadEffect(this.readyclip);
                this.countTimeDT = 0;
                // this.countLabel.string = String(--this.match_time);
                if (this.match_time == 0) {
                    this.isUpdate = false;
                    Global.countTimeIsZero = true;
                }
            }
        }
        this.time += dt;
    }
}
