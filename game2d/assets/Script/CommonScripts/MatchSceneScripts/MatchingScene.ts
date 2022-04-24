import { GameConfig } from "../../../gameConfig";
import { debugLog } from "../../../Script/common/utils/util";

import Message, { JoinErrorType } from "../Utils/Message";
import MessageData, { GameType } from "../Utils/MessageData";
import MessageForRoom from "../Utils/MessageForRoom";
import MessageForSingle from "../Utils/MessageForSingle";
import MessageManager from "../Utils/MessageManager";
import MessageType from "../Utils/MessageType";
import MyEvent from "../Utils/MyEvent";
import NDB from "../Utils/NDBTS";
import MatchPlayer from "./MatchPlayer";
import MathcResData from "./MatchResData";
import MatchResData from "./MatchResData";
import MatchSetBets from "./MatchSetBets";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchingScene extends cc.Component {



    public static I: MatchingScene = null;

    //--------------------需动态修改的UI结点-----------------------
    public bgNode: cc.Node = null;
    public dragonBonesNode: cc.Node = null;
    public betsNode: cc.Node = null;
    public roomOwner: cc.Node = null;
    public roomJoinBtnNode: cc.Node = null;
    public roomStartBtnNode: cc.Node = null;
    public roomExitBtnNode: cc.Node = null;
    public roomVisitor: cc.Node = null;
    public visitorJoinBtnNode: cc.Node = null;
    public visitorExitBtnNode: cc.Node = null;
    public single: cc.Node = null;
    public singleJoinBtnNode: cc.Node = null;
    public singleExitBtnNode: cc.Node = null;
    public playerLayer: cc.Node = null;
    public tipPopupNode: cc.Node = null;
    public rulePopupNode: cc.Node = null;
    public RuleBtnNode: cc.Node = null;
    //-----------------------------------------------------------



    //---------------------TipPopup----------------------
    private textLabel: cc.Label = null;
    private yesLabel: cc.Label = null;
    private noLabel: cc.Label = null;
    private yesBtn: cc.Node = null;
    private noBtn: cc.Node = null;
    public waitingLabel: cc.Label = null;
    public countDownLabel: cc.Label = null;

    private joinPlayers: MatchPlayer[] = [];
    private allJoinPlayerID: number[] = [];

    private countDownTime = 15;
    private timeChronography = 0;
    public allCountDownTime = 15;

    private tipPopup: cc.Node = null;
    private isstartChronography = true;
    private isCountDownStart = false;


    public static isFirstPlayGame = true;
    public static isFirst = true;
    /** 房间的人是否已经满了 */
    private static isFull = false;
    /** 加入大厅的次数 */
    public static joinLobbyTimes = 0;

    onLoad() {
        
        MessageData.gameSource_Id = '';
        MatchingScene.I = this.node.getComponent(MatchingScene);
        this.init();
        if (!MatchingScene.isFirst) {
            if (MessageData.gameType == GameType.single) {
                console.log('play again');
                MessageForSingle.playAgain(() => { });
            }
        } else {
            if (MessageData.gameType == GameType.single) {
                NDB.run("loadLobbyDone", MessageData.extra);
            }
            MatchingScene.isFirst = false;
        }

        let dominoeBgNode = null
        if(GameConfig.gameName === 'dominoe') {
            dominoeBgNode = this.node.getChildByName('bg_dominoe');
        }

        let vcode = MessageManager.getUrlParameterValue('vcode');
        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'dominoe') {
            const bgNode = this.node.getChildByName('bg_dominoe');
            dominoeBgNode.active = true;
        }
    }

    private joinErr(data) {
        
        if (MessageData.gameType == GameType.room) {
            console.log("joinErr");
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = true;
                this.roomExitBtnNode.active = false;
            } else {
                this.visitorJoinBtnNode.active = true;
                this.visitorExitBtnNode.active = false;
            }
        }
        console.log(data, data.err_code);

        if (data && data.err_code == 81008) {
            this.stopChronography();
            this.matchingErr();
            Message.joinErrPoint(JoinErrorType.no_money);

            let titleString = '';
            let rechargeString = '';
            let okString = '';
            if(MessageData.gameName === 'dominoe') {
                titleString = MessageData.langDominoe.game_coins ? MessageData.langDominoe.game_coins : MessageData.langDominoeEnglish.game_coins;
                rechargeString = MessageData.langDominoe.recharge ? MessageData.langDominoe.recharge : MessageData.langDominoeEnglish.recharge;
                okString = MessageData.langDominoe.yes_lang ? MessageData.langDominoe.yes_lang : MessageData.langDominoeEnglish.yes_lang;
            } else {
                titleString = MessageData.lang.game_coins ? MessageData.lang.game_coins : MessageData.langEnglish.game_coins;
                rechargeString = MessageData.lang.recharge ? MessageData.lang.recharge : MessageData.langEnglish.recharge;
                okString = MessageData.lang.yes ? MessageData.lang.yes : MessageData.langEnglish.yes;
            }

            this.showTipPopup(titleString, rechargeString, okString, () => {
                this.closeTipPopup();
                MessageManager.buyGameCion();
            }, () => {
                this.closeTipPopup();
            })
        } else if (!(data && data.status == 'OK')) {
            Message.joinErrPoint(JoinErrorType.others);
        }
    }

    private joinErr2(data) {
        this.stopChronography();
        this.matchingErr();
        if (MessageData.gameType == GameType.room) {
            console.log('joinErr2');
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = true;
                this.roomExitBtnNode.active = false;
            } else {
                this.visitorJoinBtnNode.active = true;
                this.visitorExitBtnNode.active = false;
            }
        }
        if (data.err_code == 81008) {
            Message.joinErrPoint(JoinErrorType.no_money);
            let titleString = '';
            let rechargeString = '';
            let okString = '';
            if(MessageData.gameName === 'ludo') {
                titleString = MessageData.lang.game_coins ? MessageData.lang.game_coins : MessageData.langEnglish.game_coins;
                rechargeString = MessageData.lang.recharge ? MessageData.lang.recharge : MessageData.langEnglish.recharge;
                okString = MessageData.lang.yes ? MessageData.lang.yes : MessageData.langEnglish.yes;
                
            } else {
                titleString = MessageData.langDominoe.game_coins ? MessageData.langDominoe.game_coins : MessageData.langDominoeEnglish.game_coins;
                rechargeString = MessageData.langDominoe.recharge ? MessageData.langDominoe.recharge : MessageData.langDominoeEnglish.recharge;
                okString = MessageData.langDominoe.yes_lang ? MessageData.langDominoe.yes_lang : MessageData.langDominoeEnglish.yes_lang;

            }

            this.showTipPopup(titleString, rechargeString, okString, () => {
                this.closeTipPopup();
                MessageManager.buyGameCion();
            }, () => {
                this.closeTipPopup();
            })
        } else if (data.err_code == 90018) {
            // this.showTipPopup("The seats are full and you cannot join the game. Please communicate with the owner.", "OK", "OK", () => {
            //     this.closeTipPopup();
            // }, () => {
            //     this.closeTipPopup();
            // })
            Message.joinErrPoint(JoinErrorType.others);
        } else if (!(data && data.status == 'OK')) {
            Message.joinErrPoint(JoinErrorType.others);
        }
    }

    private mainSocket(data) {
        console.log("切换房间data:",data);
        MessageData.switch_room_id = data.data.data.room_id;
    }
    /**初始化 */
    private init() {
        MathcResData.isJoin = false;
        this.joinPlayers = new Array<MatchPlayer>();
        this.joinPlayers.length = 0;
        MatchResData.playerFollow.length = 0;
        this.onEvent();
        this.initNode();
        this.initData();

        this.isstartChronography = true;
        MyEvent.I.on("joinErrMessage", this.joinErr.bind(this), this.node);
        MyEvent.I.on("insufficientBalance", this.joinErr2.bind(this), this.node);
        MyEvent.I.on(MessageType.MESSAGE_SWITCH_ROOM, this.mainSocket.bind(this), this.node);
        MyEvent.I.on("onAndroidResume", this.initData.bind(this), this.node);
        MyEvent.I.on("joinRoomGameErr", this.joinRoomGameErr.bind(this), this.node);

    }

    joinRoomGameErr(data: any) {
        console.log("data is ",data);
        if(data.err_code === 80002) {
            console.log('匹配大区错误');
            let title,yesStr,noStr;

            if(MessageData.gameName === 'dominoe') {
                title = MessageData.langDominoe.network_abnormality ? MessageData.langDominoe.network_abnormality : MessageData.langDominoeEnglish.network_abnormality;
                yesStr = MessageData.langDominoe.yes_lang ? MessageData.langDominoe.yes_lang : MessageData.langDominoeEnglish.yes_lang;
                noStr = MessageData.langDominoe.no_lang ? MessageData.langDominoe.no_lang : MessageData.langDominoeEnglish.no_lang;
            } else {
                title = MessageData.lang.network_abnormality ? MessageData.lang.network_abnormality : MessageData.langEnglish.network_abnormality;
                yesStr = MessageData.lang.yes ? MessageData.langEnglish.yes : MessageData.langEnglish.yes;
                noStr = MessageData.lang.no ? MessageData.langEnglish.no : MessageData.langEnglish.no;
            }

            this.showTipPopup(title,yesStr,noStr,() => {
                console.log('yes');
                this.closeTipPopup();
            },() => {
                console.log('no');
                this.closeTipPopup();
            })

        }
        this.isNotJoinGameSetBtn();
    }
    private initData() {
        if (MessageData.gameType == GameType.room) {
            if (MatchingScene.isFirstPlayGame) {
                MatchingScene.isFirstPlayGame = false;
            } else {
                this.joinGame();
            }
            // 设置MessageData.roomId and MessageData.shareUrl;
            MessageForRoom.getRoomInfo((data) => {
                // 更新房间状态 会触发updateStatus
                MessageForRoom.getStatus(MessageData.gameRoomId);
            })
            this.isCountDownStart = false;
        } else {

        }
    }


    private onEvent() {
        MyEvent.I.on(MessageType.MESSAGE_CHATROOM_STATUS, this.chatroomStatus.bind(this), this.node);
        MyEvent.I.on(MessageType.MESSAGE_MATCHING, this.matchingDataUpDate.bind(this), this.node);
        MyEvent.I.on(MessageType.MESSAGE_PLAYER, this.gamePlaying.bind(this), this.node);
    }

    protected onEnable(): void {
        MyEvent.I.on('errorPop', this.popError.bind(this), this.node);
        
    }

    protected onDisable(): void {
        MyEvent.I.remove('errorPop', this.node);
        
    }

    public popError(data: string) {
        console.log('data is ',data);
        let errorStr = 'error';
        // to do 根据不同错误展示
        switch(data) {
            case 'abanded':
                errorStr = MessageData.lang.ban_user_game ? MessageData.lang.ban_user_game : MessageData.langEnglish.ban_user_game;
                break;
            case 'systemfix':
                errorStr = MessageData.lang.under_maintenance ? MessageData.lang.under_maintenance : MessageData.langEnglish.under_maintenance;
                break;
            case 'downgrade':
                errorStr = MessageData.lang.system_busy ? MessageData.lang.system_busy : MessageData.langEnglish.system_busy;
                break;
        }
        this.showTipPopup(errorStr,'yes','no',() => {
            this.closeTipPopup();
        },() => {
            this.closeTipPopup();
        },true);
    }

    public systemFix


    private chatroomStatus(data) {
        console.log('@房间状态改变时候改变麦位',data);
        if(data && data.status && data.status.err_code) return;

        if (data.statusData.players && MessageData.gameType == GameType.room) {
            this.allCountDownTime = data.statusData.countdown_duration || data.statusData.countdown;
            this.isCountDownStart = false;
            this.setPlayersData(data.statusData.players, true);
        }
        if(GameConfig.gameName === 'dominoe' && data.statusData && data.statusData.status === 'completed') {
            this.isNotJoinGameSetBtn();
            // 恢复麦位原始状态
            this.resetAllPlayersStatus();
        }
    }

    private hadConnectSocket() {
        // 接收到消息
        console.log("socket消息已经接收改变按钮状态");
        if(MessageData.gameType === GameType.room) {
            this.roomJoinBtnNode.getComponent(cc.Button).interactable = true;
            this.roomJoinBtnNode.children[0].getChildByName('bg2').active = false;

            this.visitorJoinBtnNode.getComponent(cc.Button).interactable = true;
            this.visitorJoinBtnNode.children[0].getChildByName('bg2').active = false;
        }
    }

    private resetAllPlayersStatus(): void {
        this.joinPlayers.forEach((item,index) => {
            item.clearPlayerData(index + 1);
        })
    }

    private matchingDataUpDate(data) {
        console.log("@matcting 改变麦位",data);
        if (data.data.data.players && MessageData.gameType == GameType.room) {
            this.allCountDownTime = data.data.data.countdown_duration || data.data.data.countdown;
            this.isCountDownStart = false;
            debugLog('matching 消息设置玩家信息并开始倒计时');
            this.setPlayersData(data.data.data.players, true);
        }
        if(data.statusData && data.statusData.status === 'completed') {
            this.isNotJoinGameSetBtn();
            this.resetAllPlayersStatus();
        }
    }

    private gamePlaying(data) {
        if (MessageData.gameType == GameType.single && MessageData.switch_room_id != data.data.data.source_id) {
            return;
        }
        console.log('@进入 playing 改变麦位');

        if (data.data.data.players) {
            this.allCountDownTime = data.data.data.countdown_duration;
            this.setPlayersData(data.data.data.players, false);
        }
        if (MessageData.gameType == GameType.single) {
            MessageData.gameSource_Id = data.data.data.source_id;
            MessageData.gameRoomId = data.data.data.source_id;
        }
    }

    /**初始化结点 */
    private initNode() {
        this.initOtherNode();
        this.initNeedLoadNode();
        this.loadUIRes();
        this.showBtnUI()
        this.getUserInfo();
    }

    /**初始化需要加载资源的结点 */
    private initNeedLoadNode() {
        this.bgNode = cc.find("Canvas/bgNode");
        this.dragonBonesNode = cc.find("Canvas/dragonBonesNode");
        this.betsNode = cc.find("Canvas/betsNode");
        this.roomOwner = cc.find("Canvas/roomOwner");
        this.roomJoinBtnNode = this.roomOwner.getChildByName("roomJoinBtnNode");
        this.roomStartBtnNode = this.roomOwner.getChildByName("roomStartBtnNode");
        this.roomExitBtnNode = this.roomOwner.getChildByName("roomExitBtnNode");
        this.roomVisitor = cc.find("Canvas/roomVisitor");
        this.visitorJoinBtnNode = this.roomVisitor.getChildByName("VisitorJoinBtnNode");
        this.visitorExitBtnNode = this.roomVisitor.getChildByName("VisitorExitBtnNode");
        this.single = cc.find("Canvas/single");
        this.singleJoinBtnNode = this.single.getChildByName("singleJoinBtnNode");
        this.singleExitBtnNode = this.single.getChildByName("singleExitBtnNode");
        this.playerLayer = cc.find("Canvas/midNode/playerLayer");
        this.tipPopupNode = cc.find("Canvas/TipPopupNode");
        this.rulePopupNode = cc.find("Canvas/RulePopupNode");
        this.RuleBtnNode = cc.find("Canvas/RuleBtnNode");

    }
    /**加载UI资源 */
    private loadUIRes() {
        let playerIndex = 0;
        for (let i = 0; i < MatchResData.matchSceneResource.length; i++) {
            const element = MatchResData.matchSceneResource[i];
            if (element.name != "player") {
                let elementNode: cc.Node = cc.instantiate(element);
                
                switch (element.name) {
                    case "BG":
                        let vcode = MessageManager.getUrlParameterValue('vcode');
                        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'ludo') {
                            this.bgNode.addChild(elementNode);
                        }
                        break;
                    case "Bets":
                        this.betsNode.addChild(elementNode);
                        break;
                    case "scoreBets":
                        this.betsNode.addChild(elementNode);
                        break;
                    case "ExitBtn_owner":
                        this.roomExitBtnNode.addChild(elementNode);
                        break;
                    case "JoinBtn_owner":
                        this.roomJoinBtnNode.addChild(elementNode);
                        // this.roomJoinBtnNode.getComponent(cc.Button).interactable = false;
                        // this.roomJoinBtnNode.children[0].getChildByName('bg2').active = true;

                        break;
                    case "StartBtn_owner":
                        this.roomStartBtnNode.addChild(elementNode);
                        break;
                    case "SingleJoinBtn":
                        this.singleJoinBtnNode.addChild(elementNode);
                        // elementNode.getComponent(cc.Button).interactable = false;
                        break;
                    case "VisitorExitBtn":
                        this.visitorExitBtnNode.addChild(elementNode);
                        break;
                    case "VisitorJoinBtn":
                        this.visitorJoinBtnNode.addChild(elementNode);
                        // this.visitorJoinBtnNode.getComponent(cc.Button).interactable = false;
                        // this.visitorJoinBtnNode.children[0].getChildByName('bg2').active = true;
                        break;
                    case "Title":
                        this.dragonBonesNode.addChild(elementNode);
                        break;
                    case "RulePrefab":
                        elementNode.active = false;
                        this.rulePopupNode.addChild(elementNode);
                        break;
                    case "RuleBtn":
                        this.RuleBtnNode.addChild(elementNode);
                        break;
                    case "TipPopup":
                        this.tipPopupNode.addChild(elementNode);
                        this.tipPopup = cc.find("Canvas/TipPopupNode/TipPopup");
                        this.textLabel = this.tipPopup.getChildByName("textLabel").getComponent(cc.Label);
                        this.yesLabel = this.tipPopup.getChildByName("yesLabel").getComponent(cc.Label);
                        this.noLabel = this.tipPopup.getChildByName("noLabel").getComponent(cc.Label);
                        this.yesBtn = this.tipPopup.getChildByName("yesBtn");
                        this.noBtn = this.tipPopup.getChildByName("noBtn");
                        break;
                    case "RoomSetMode":
                        MatchSetBets.betsPopup = elementNode;
                        this.node.addChild(elementNode);
                        elementNode.active = false;
                        break;
                }
            } else {
                let l = Number(MessageData.player_number);
                for (let j = 0; j < l; j++) {
                    const playerNode: cc.Node = cc.instantiate(element);
                    this.playerLayer.addChild(playerNode);
                    let lerpX = j % 2 == 0 ? -1 : 1;
                    let lerpY = (l > 2 ? 100 : 0) * (j < 2 ? 1 : -1);
                    playerNode.setPosition(lerpX * 150, lerpY);
                    let playernumber = (j + 1);
                    playerNode.getChildByName("nameLabel").getComponent(cc.Label).string = "player" + playernumber;
                    this.joinPlayers.push(playerNode.getComponent(MatchPlayer));
                }
            }
        }
    }

    private initOtherNode() {
        this.waitingLabel = cc.find("Canvas/waitingLabel").getComponent(cc.Label);
        this.countDownLabel = cc.find("Canvas/countDownLabel").getComponent(cc.Label);
    }
    /**根据参数显示UI */
    public showBtnUI() {
        if (MessageData.gameType == "room") {
            if (MessageData.isRoomOwner) {
                this.roomOwner.active = true;
                this.roomVisitor.active = false;
                this.single.active = false;
            } else {
                this.roomOwner.active = false;
                this.roomVisitor.active = true;
                this.single.active = false;
            }
        } else {
            this.roomOwner.active = false;
            this.roomVisitor.active = false;
            this.single.active = true;
        }
    }


    //获取个人信息；
    getUserInfo() {
        //先获取个人信息，然后获取房间信息，然后获取游戏信息;
        if (MessageData.userInfo) {
            this.setTopUserData(MessageData.userInfo);
            // this.getRoomInfo();
        } else {
            Message.getUserInfo((userInfo) => {
                MessageData.userInfo = userInfo;
                MessageData.userId = Number(userInfo.userId);
                // this.getRoomInfo();
                this.setTopUserData(userInfo);
            });
        }

    }

    /**设置顶部UI的用户信息 */
    setTopUserData(userInfo) {
        let avatar = userInfo.avatar;
        let name = userInfo.userName;
        let uid = userInfo.userId;
        if (MessageData.gameType == GameType.single) {
            let playerData = {
                avatar: avatar,
                name: name,
                id: uid
            }
            this.joinPlayers[0].setPlayerData(playerData);
            this.joinGame();
        }
    }

    /**设置在位置上的用户信息 */
    setPlayersData(players, isCountDown) {
        let nowPlayerIsJoin = false;
        let keys = Object.keys(players);
        this.allJoinPlayerID.length = 0;
        this.setMcPlayer(players, keys, nowPlayerIsJoin);
        if (isCountDown && MessageData.gameType == GameType.room) {
            this.setCountDwon(players);
        }

    }
    private lastplayers = [];
    /**设置麦位上的人 */
    setMcPlayer(players, keys, nowPlayerIsJoin) {
        for (let i = 0; i < this.joinPlayers.length; i++) {
            debugLog('设置麦位上的人 i is ',i);
            const element = players[keys[i]];
            if (!element) {
                this.joinPlayers[i].clearPlayerData(i + 1);
                continue;
            }
            if ((element.id || element.user_id) == MessageData.userId) {
                nowPlayerIsJoin = true;
                this.isJoinGameSetBtn();
            }
            let playerData = {
                avatar: element.avatar || element.user_avatar,
                name: element.name || element.user_name,
                id: element.id || element.user_id
            }
            this.joinPlayers[i].setPlayerData(playerData);

            this.joinPlayers[i].node.off(cc.Node.EventType.TOUCH_START);
            this.joinPlayers[i].node.on(cc.Node.EventType.TOUCH_START, () => {
                MessageManager.showPlayerInfo(element.id || element.user_id);
            });
            if (this.allJoinPlayerID.indexOf(element.id || element.user_id) < 0)
                this.allJoinPlayerID.push(element.id || element.user_id);
        }

        if (!nowPlayerIsJoin) {
            this.isNotJoinGameSetBtn();
        }
    }



    /**检查是否自动开始倒计时倒计时 */
    setCountDwon(players) {
        console.log(" setCountDwon: =============>");
        this.countDownTime = this.allCountDownTime;
        this.waitingLabel.string = this.formatLang('prepare',MessageData.gameName);
        this.countDownLabel.string = this.countDownTime + "";
        console.log("this.allJoinPlayerID.length: =============>" + this.allJoinPlayerID.length);
        if (this.allJoinPlayerID.length >= 4) {
            MatchingScene.isFull = true;
        } else {
            MatchingScene.isFull = false;
        }
        this.setJoinBtnColor();
        console.log(" MatchingScene.isFull: =============>" + MatchingScene.isFull);
        if (this.allJoinPlayerID.length >= 2) {
            this.startCountDown();
        } else {
            this.stopCountDown();
        }
    }

    
    /**
     * 翻译语言根据标志位
     * @param  {string} tag
     * @returns string
     */
    private formatLang(tag: string,gameName: string = 'dominoe'): string {
        const langJson = gameName === 'ludo' ? MessageData.lang : MessageData.langEnglish;
        const langJsonBackup = gameName === 'dominoe' ? MessageData.langDominoe : MessageData.langDominoeEnglish;

        if(gameName === 'dominoe') {
            switch(tag) {
                case "prepare":
                    return MessageData.langDominoe.start_prepare ? MessageData.langDominoe.start_prepare : MessageData.langDominoeEnglish.start_prepare;
                case "wait":
                    return MessageData.langDominoe.waiting ? MessageData.langDominoe.waiting : MessageData.langDominoeEnglish.waiting;
                case "matchFail":
                    return MessageData.langDominoe.match_failed ? MessageData.langDominoe.match_failed : MessageData.langDominoeEnglish.match_failed;
                case "ok":
                    return MessageData.langDominoe.yes_lang ? MessageData.langDominoe.yes_lang : MessageData.langDominoeEnglish.yes_lang;
                case "tryAgain":
                    return MessageData.langDominoe.try_again ? MessageData.langDominoe.try_again : MessageData.langDominoeEnglish.try_again;
            }
        } else {
            switch(tag) {
                case 'prepare':
                    return MessageData.lang.start_prepare ? MessageData.lang.start_prepare : MessageData.langEnglish.start_prepare;
                case 'wait':
                    return MessageData.lang.waiting ? MessageData.lang.waiting : MessageData.langEnglish.waiting;
                case "matchFail":
                    return MessageData.lang.match_failed ? MessageData.lang.match_failed : MessageData.langEnglish.match_failed;
                case "resetGameMode":
                    return MessageData.lang.reset_game_model ? MessageData.lang.reset_game_model : MessageData.langEnglish.reset_game_model;
                case "tryAgain":
                    return MessageData.lang.try_again ? MessageData.lang.try_again : MessageData.langEnglish.try_again;
            }
        }
    }

    setJoinBtnColor() {
        if (MessageData.gameType == GameType.room)
            if (MatchingScene.isFull) {
                this.roomJoinBtnNode.children[0].getChildByName('bg2').active = true;
                this.visitorJoinBtnNode.children[0].getChildByName('bg2').active = true;
            } else {
                this.roomJoinBtnNode.children[0].getChildByName('bg2').active = false;
                this.visitorJoinBtnNode.children[0].getChildByName('bg2').active = false;
            }
    }
    /**开始倒计时 */
    startCountDown() {
        console.log(this.isCountDownStart);
        if (this.isCountDownStart) {
            return;
        }
        this.isCountDownStart = true;
        this.schedule(this.countDown, 1, 15);

        this.waitingLabel.string = this.formatLang('prepare',MessageData.gameName);
    }
    /**倒计时 */
    countDown() {
        this.countDownTime--;
        if (this.countDownTime <= 0) {
            this.countDownTime = 0;
            this.stopCountDown(false);
        }
        debugLog('countDowntime : ',this.countDownTime);
        this.countDownLabel.string = this.countDownTime + "";
    }
    /**停止倒计时 */
    stopCountDown(isreset: boolean = true) {
        this.unschedule(this.countDown);
        if (isreset) {
            this.waitingLabel && (this.waitingLabel.string = this.formatLang('wait',MessageData.gameName));
            this.countDownLabel && (this.countDownLabel.string = "");
        }
    }

    /**开始计时 */
    startChronography() {
        if (!this.isstartChronography) return;
        MatchingScene.joinLobbyTimes = 0;
        this.timeChronography = 0;
        /** 一秒调用一次请求加入大厅的接口 */
        this.schedule(this.chronography, 1);
        this.waitingLabel && (this.waitingLabel.string = this.formatLang('prepare',MessageData.gameName));
    }

    /**计时 */
    chronography() {
        this.timeChronography++;
        if (MatchingScene.joinLobbyTimes >= 4) {
            if (MessageData.gameType == GameType.single) {
                // 如果加入大厅超过4次还没有成功的话弹出错误框
                if (this.timeChronography != 0 && this.timeChronography % 20 == 0) {
                    this.unschedule(this.chronography);
                    this.joinLobbyGameErr();
                }
            }
        }
        if (!MatchResData.isJoin) {
            if (MessageData.gameType == GameType.single) {
                if (this.timeChronography != 0 && this.timeChronography % 15 == 0) {
                    MatchingScene.joinLobbyTimes++;
                    NDB.run("joinLobby", MessageData.extra);
                }
            }
        } else {
            /** 加入大厅成功 */
            this.unschedule(this.chronography);
        }
        this.countDownLabel && (this.countDownLabel.string = this.timeChronography + "");
    }
    /**停止计时 */
    stopChronography() {
        this.isstartChronography = false;
        this.unschedule(this.chronography);
        this.waitingLabel && (this.waitingLabel.string = this.formatLang('wait',MessageData.gameName));
        this.countDownLabel && (this.countDownLabel.string = "");
    }

    /**显示退出麦位 */
    isJoinGameSetBtn() {
        if (MessageData.gameType == GameType.room) {
            if (MatchingScene.isFull) return;
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = false;
                this.roomExitBtnNode.active = true;
            } else {
                this.visitorJoinBtnNode.active = false;
                this.visitorExitBtnNode.active = true;
            }
        } else {
            this.singleJoinBtnNode.active = false;
        }
    }
    /**显示加入麦位 */
    isNotJoinGameSetBtn() {
        if (MessageData.gameType == GameType.room) {
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = true;
                this.roomExitBtnNode.active = false;
            } else {
                this.visitorJoinBtnNode.active = true;
                this.visitorExitBtnNode.active = false;
            }
        }
    }
    
    /**加入游戏 */
    joinGame() {
        if (MessageData.gameType == GameType.room) {
            if (MatchingScene.isFull) return;
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = false;
                this.roomExitBtnNode.active = true;
            } else {
                this.visitorJoinBtnNode.active = false;
                this.visitorExitBtnNode.active = true;
            }
        } else {
            this.isstartChronography = true;
            this.startChronography();
            this.singleJoinBtnNode.active = false;
            NDB.run("joinLobby", MessageData.extra);
        }
        // 加入游戏
        Message.joinGame({ player_count: Number(MessageData.player_number), is_coin: false });
    }
    /**房主模式开始游戏 */
    startGame() {

    }

    /**房间模式退出麦位 */
    exitGame() {
        this.showTipPopup(this.exitGameLang().title, this.exitGameLang().no, this.exitGameLang().yes, () => {
        }, () => {
            this.isCountDownStart = false;
            if (MessageData.gameType == GameType.room) {
                if (MessageData.isRoomOwner) {
                    this.roomJoinBtnNode.active = true;
                    this.roomExitBtnNode.active = false;
                } else {
                    this.visitorJoinBtnNode.active = true;
                    this.visitorExitBtnNode.active = false;
                }
            }
            Message.exitGame();
        });
    }

    /**撮合模式 撮合失败 */
    matchingErr() {
        if (MessageData.gameType == GameType.single) {
            this.singleJoinBtnNode.active = true;
        }
    }

    /**显示弹窗 */
    showTipPopup(titleStr: string, yesStr: string, noStr: string, yesFunc?: Function, noFunc?: Function, iscenter: boolean = false) {
        this.tipPopup.active = true;
        this.textLabel.string = titleStr;
        if (iscenter) {
            this.yesLabel.node.x = 0;
            this.yesBtn.x = 0;
            this.noLabel.node.active = false;
            this.noBtn.active = false;
        } else {
            this.yesLabel.node.x = 115;
            this.yesBtn.x = 115;
            this.noLabel.node.x = -115;
            this.noBtn.x = -115;
            this.noLabel.node.active = true;
            this.noBtn.active = true;
        }

        
        this.yesLabel.string = yesStr;
        this.noLabel.string = noStr;
        this.yesBtn.off(cc.Node.EventType.TOUCH_END);
        this.yesBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (yesFunc)
                yesFunc();
            this.closeTipPopup();
        })
        this.noBtn.off(cc.Node.EventType.TOUCH_END);
        this.noBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (noFunc) {
                noFunc();
            }
            this.closeTipPopup();

        })
    }
    /**关闭弹窗 */
    closeTipPopup() {
        this.tipPopup.active = false;
    }

    showSetBetsPopup() {

    }

    showRulePopup() {
        this.rulePopupNode.children[0].active = true;
    }
    clearAllPlayer() {
        for (let i = 0; i < this.joinPlayers.length; i++) {
            this.joinPlayers[i].clearPlayerData(i + 1);
        }
    }
    automaticExitJoin() {
        for (let i = 0; i < this.joinPlayers.length; i++) {
            this.joinPlayers[i].clearPlayerData(i + 1);
        }
        if (MessageData.gameType == GameType.room) {
            if (MessageData.isRoomOwner) {
                this.roomJoinBtnNode.active = true;
                this.roomExitBtnNode.active = false;
            } else {
                this.visitorJoinBtnNode.active = true;
                this.visitorExitBtnNode.active = false;
            }
        }
    }

    /**大厅模式匹配次数超过3次 */
    joinLobbyGameErr() {
        if (MessageData.gameName == 'ludo') {
            const matchFailed = this.formatLang('matchFail','ludo');
            const okStr = this.formatLang('resetGameMode','ludo');
            const tryAgainStr = this.formatLang('tryAgain','ludo');

            this.showTipPopup(matchFailed, okStr, tryAgainStr, () => {
                this.closeTipPopup();
                this.matchingErr();
                MatchingScene.joinLobbyTimes = 0;
                cc.director.loadScene("ludo_ModeScene");
            }, () => {
                this.closeTipPopup();
                this.matchingErr();
                MatchingScene.joinLobbyTimes = 0;
                cc.director.loadScene("ludo_ModeScene");
            }, true);
        } else {
            const matchFailed = this.formatLang('matchFail');
            const okStr = this.formatLang('ok');
            const tryAgainStr = this.formatLang('tryAgain');
            this.showTipPopup(matchFailed, okStr, tryAgainStr, () => {
                this.isstartChronography = true;
                this.startChronography();
                this.singleJoinBtnNode.active = false;
                NDB.run("joinLobby", MessageData.extra);
                Message.joinGame({ player_count: Number(MessageData.player_number), is_coin: false });
            }, () => {
                this.isstartChronography = true;
                this.startChronography();
                this.singleJoinBtnNode.active = false;
                NDB.run("joinLobby", MessageData.extra);
                Message.joinGame({ player_count: Number(MessageData.player_number), is_coin: false });
            }, true);
        }
    }

    exitGameLang() {
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        let data = { title: '', yes: '', no: '' }

        data.title = MessageData.langDominoe.exit_game_lang ? MessageData.langDominoe.exit_game_lang : MessageData.langDominoeEnglish.exit_game_lang;
        data.yes = MessageData.langDominoe.yes_lang ? MessageData.langDominoe.yes_lang : MessageData.langDominoeEnglish.yes_lang;
        data.no = MessageData.langDominoe.no_lang ? MessageData.langDominoe.no_lang : MessageData.langDominoeEnglish.no_lang;
        return data;
    }

    protected onDestroy(): void {
        
    }

}
