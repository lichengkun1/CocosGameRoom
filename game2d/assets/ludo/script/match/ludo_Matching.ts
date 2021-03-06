
import { GameConfig } from "../../../gameConfig";

import { resourceManager } from "../../../Script/common/managers/resourceManager";
import BgmSettings from "../../../Script/CommonScripts/bgmSettings";
import MatchingScene from "../../../Script/CommonScripts/MatchSceneScripts/MatchingScene";
import MatchSetBets from "../../../Script/CommonScripts/MatchSceneScripts/MatchSetBets";
import timeManager from "../../../Script/CommonScripts/MatchSceneScripts/timeManager";
import MessageData, { GameCoinType, GameType } from "../../../Script/CommonScripts/Utils/MessageData";
import MessageForRoom from "../../../Script/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MessageSoundManager from "../../../Script/CommonScripts/Utils/MessageSoundManager";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";
import TopUINode from "../../../Script/Component/RoomTop/scripts/TopUINode";

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

    private isUpdate: boolean = false;               //????????????update;
    // private joinBtn: cc.Node = null;                 //????????????btn;
    // private exitBtn: cc.Node = null;                 //????????????btn???
    private playerDataArr: number[] = [];            //????????????????????????;
    private match_time: number = 0;                  //???????????????;
    private countTimeDT: number = 0;                 //???????????????;
    // private countLabel: cc.Label = null;             //?????????label;
    private isChangeScene: boolean = false;          //?????????????????????;
    private playersIdArr: number[] = [];             //??????id??????;
    private playerPosArr: number[][] = [[-154, -40], [154, -40], [-154, -200], [154, -200]];            //??????????????????????????????????????????????????????
    // private countTimeBG: cc.Node = null;              //???????????????;
    // private userHead: cc.Node = null;                 //????????????;
    // private username: cc.Label = null;                //????????????;
    // private coinLabel: cc.Label = null;               //?????????????????????;
    // private rankLabel: cc.Label = null;               //????????????;
    // private firstLabel: cc.Label = null;              //???????????????;
    private isLoadChangeScene: boolean = false;       //?????????????????????;
    // private joinLabel: cc.Label = null;               //????????????;
    // private exitLabel: cc.Label = null;               //????????????;
    private timeOutNum: number = -1;                  //10???????????????;
    private isReceiveMatchMessage: boolean = false;   //?????????????????????socket??????;
    private isAotuStr: string = 'no';                 //???????????????join?????????;
    private isFristReveiveMessage: boolean = false;   //????????????????????????;
    private isSendStatusEvent: boolean = false;       //??????????????????????????????;
    private isSendJoinEvent: boolean = false;         //????????????join??????;
    private isCanChangeScene: boolean = false;
    private selfAsset = null;                         //????????????;

    private musicInterval: number = 0.3;
    private time: number = 0;

    onLoad() {
        Global.enterGameScene = false;
        MessageManager.setNetworkConfiguration();
        // toastManager.addToast(`resources_ludo/ludo_matchingScene_Res/TipPopup`,GameConfig.gameName,Layers.TOASTLAYERONE,PanelType.TOAST_WITHBTN,ToastBtnType.TWO).then((res: ToastPanel) => {
        //     console.timeEnd('??????????????????');
        //     res.yesBtnEvent = () => {
        //         console.log('yes');
        //         res.confirmBtnEvent();
        //     }
        //     res.noBtnEvent = () => {
        //         console.log('no');
        //         res.confirmBtnEvent();
        //     }
        // });
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
        /** ?????????????????????????????? */
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
            MessageSoundManager.playBGEngine(`resources_${GameConfig.gameName}/sound/hallMusic`,(id: number) => {
                console.log('?????????????????????id is ',id);
                if(Global.enterGameScene) {
                    // ???????????????????????????????????????????????????
                    cc.audioEngine.stop(id);
                }
            });
        }
        // MessageForRoom.getGameResource();
        //????????????APP????????????????????????;
        // MKMessageManager.socketSend(MKMessageType.REQUEST_WS_STATUS);
        //????????????????????????
        this.firstLoding();
    }

    preloadMap() {
        // resourceManager.
        if(GameConfig.gameName === 'ludo') {
            resourceManager.loadAssetInBundle(`resources_${GameConfig.gameName}/store/chengbaocheckerboard/background_chengbao_ske`,null,GameConfig.gameName).then(() => {
                console.log('???????????????????????????');
            });
            resourceManager.loadAssetInBundle(`resources_${GameConfig.gameName}/store/isLandCheckerboard/island_checkerboardPlist`,null,GameConfig.gameName).then(() => {
                console.log('???????????????????????????');
            });
        }
    }

    //?????????????????????????????????
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

    //????????????????????????????????????join??????????????????
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

    //????????????;
    eventDispatchFunc() {
        //?????????????????????;
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //????????????????????? emit_status
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //????????????;
        MyEvent.I.on('insufficientBalance', this.insufficientBalanceFunc.bind(this), this.node);
        //??????????????????
        MyEvent.I.on('onAndroidResume', this.onAndroidResumeFunc.bind(this), this.node);
        //??????????????????;
        MyEvent.I.on('exitMatching', this.exitMatchingFunc.bind(this), this.node);
        //???????????????????????????;
        MyEvent.I.on('no_mic', this.noMicFunc.bind(this), this.node);

        MyEvent.I.on('replayMusic',this.replayMusic,this);
    }

    private replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && MessageSoundManager.audioEngineOn) {
            MessageSoundManager.pauseMusic();
            MessageSoundManager.resumeMusic();
        }
    }

    //?????????????????????
    getUserinfo() {
        //???????????????????????????????????????????????????????????????????????????;
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

    //?????????????????????????????????;
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

    //???????????????????????????;
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

    //??????????????????;
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

    //??????????????????;
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
            console.log('ludo??????????????????',data.is_modify);
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

    //?????????????????????????????????;
    getGameRoomStatus(flag = true) {
        //????????????????????????????????????;
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

    //??????????????????????????????;
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

    //?????????????????????;
    updateStatus(event) {
        if (this.isReceiveMatchMessage) {
            return;
        }
        let data = event.statusData;
        if (data && data.ludo_equipment && data.ludo_equipment.game_ludo_board) {
            //?????????????????????????????????;
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
        //?????????????????????;
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

    //?????????????????????;
    messageFunc(data) {
        let method = data.data.method;
        switch (method) {
            case 'emoji_on_mic':        //??????;
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
            case 'ludo_bets_config':                //?????????????????????????????????socket?????????
                let bData = data.data.data;
                this.setBetsChange(bData);
                break;
            case 'response_ws_status':              //?????????????????????
                this.request_ws_status(data);
                break;
        }
    }

    //??????bets??????;
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
        //???????????????;
        // this.stopCountDwon();
        MatchingScene.I.stopCountDown();
    }

    //??????????????????????????????????????????????????????;
    /*
        @param      displayId    ??????????????????ID
        @param      msg          ????????????
    */
    setEmojiShow(displayId, msg, name, num) {
        //???????????????????????????????????????;
        let index = this.playerDataArr.indexOf(displayId);
        if (index >= 0) {
            // Message.showEmoji(this.playerPosArr[index], [106, 106], msg, name, num);
        }
    }

    //????????????????????????;
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
                //??????????????????id???
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
                //????????????id????????????id??????????????????????????????????????????????????????;
                if (playerId == this.playerDataArr[i]) {
                    continue;
                }
                //?????????????????????;
                this.playerDataArr[i] = playerId;
                //??????????????????????????????;
                // this.playerArr[i].off(cc.Node.EventType.TOUCH_START);
                //??????????????????????????????;
                // this.playerArr[i].on(cc.Node.EventType.TOUCH_START, () => {
                // MessageManager.showPlayerInfo(playerId);
                // }, this);
                //??????nickName;
                // let nickName = players[key].name;
                // let playerName = this.playerArr[i].getChildByName('playerName').getComponent(cc.Label);
                // playerName.string = Global.subNickName(nickName);
                //???????????????
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
                console.log('??????????????????????????????');
                MessageForRoom.takeChangeRoom(false);
            } else {
                console.log('??????????????????????????????');
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

    //????????????????????????; 
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

    //?????????????????????;
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

    //????????????;
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

    //????????????;
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

    //??????????????????;
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

    //??????????????????;
    hallJoinGame_callback() {
        MessageForRoom.joinRoomGame(2, true);
    }

    //?????????????????????
    hallExitGame_callback() {
        // let exitmatchingPrefab = cc.instantiate(this.exitMatchingPrefab);
        // this.node.addChild(exitmatchingPrefab);
    }

    //??????????????????
    showRanking_callback() {
        NDB.openWebView('http://a.fslk.co/activity4/togo_game_leader_board/index.html?type=ludo');
        // NDB.openWebView('http://a.fslk.co/games/DragonBonesProject/staging/web-mobile/index.html');
        let obj = {
            eventName: "room_game_ranking",
            from: 'room_game_lightbox',
        }
        NDB.sendEvent(obj);
    }

    //????????????????????????;
    invite_callback() {
        let shareText: string = MessageData.lang.play_game_tips ? MessageData.lang.play_game_tips : MessageData.langEnglish.play_game_tips + Global.shareUrl;
        let shareUrl = 'http://static.funshareapp.com/atlas_op_common_file/1592385472898792.png';
        MessageManager.shareGameOrImage(shareText, shareUrl, (event) => {
        });
    }

    //??????bets??????;
    changeBets_callback() {
        // let node = cc.instantiate(this.betPrefab);
        // this.node.addChild(node);
    }

    //????????????;
    store_callback() {
        MessageManager.goStore();
    }

    exitMatchingFunc() {
        MessageForRoom.exitRoomGame();
    }

    //?????????????????????;
    insufficientBalanceFunc() {
        // let pNode = cc.instantiate(this.depositPrefab);
        // this.node.addChild(pNode);
    }

    //??????????????????;
    addCoin_callback() {
        MessageManager.buyGameCion();
    }

    //??????????????????;
    addRule_callback() {
        // ResourcesManager.loadPrefab('prefab/rulePrefab', (pNode) => {
        //     if (this.node && this.node.active) {
        //         this.node.addChild(pNode);
        //     }
        // });
    }

    //???????????????;
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

    //???????????????;
    stopCountDwon() {
        // this.isUpdate = false;
        // this.countLabel.node.active = false;
        // this.countTimeBG.active = false;
        // this.startTimeOut();
    }

    //10S????????????
    startTimeOut() {
        this.stopTimeOut();
        this.timeOutNum = window.setTimeout(() => {
            if (this.node && this.node.active) {
                // 10???????????? ????????????
                console.log('10??????????????????????????????');
                MessageForRoom.takeChangeRoom(true);
            }
        }, 10000);
    }

    //??????10s?????????;
    stopTimeOut() {
        if (this.timeOutNum >= 0) {
            window.clearTimeout(this.timeOutNum);
            this.timeOutNum = -1;
        }
    }

    //???????????????;
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

    //?????????????????????join;
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

    //???????????????;
    noMicFunc() {
        // let node = cc.instantiate(this.popLayer);
        // node.getComponent(popLayer).setLayerType('nomic');
        // this.node.addChild(node);
    }

    //????????????;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            this.getGameRoomStatus(false);
        }
    }

    onDestroy() {
        //?????????????????????;
        MyEvent.I.remove('emit_message', this.node);
        //????????????????????? emit_status
        MyEvent.I.remove('emit_status', this.node);
        //??????????????????;
        MyEvent.I.remove('insufficientBalance', this.node);
        //???????????????;
        MyEvent.I.remove('onAndroidResume', this.node);
        // ????????????
        console.log('????????????');
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
