// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { GameConfig } from "../../../gameConfig";
import { getUrlParameterValue } from "../../../Script/common/utils/util";
import BgmSettings from "../../../Script/CommonScripts/bgmSettings";
import MatchingScene from "../../../Script/CommonScripts/MatchSceneScripts/MatchingScene";
import MathcResData from "../../../Script/CommonScripts/MatchSceneScripts/MatchResData";
import MatchSetBets from "../../../Script/CommonScripts/MatchSceneScripts/MatchSetBets";
import timeManager from "../../../Script/CommonScripts/MatchSceneScripts/timeManager";
import Message from "../../../Script/CommonScripts/Utils/Message";
import MessageData, { GameCoinType, GameType } from "../../../Script/CommonScripts/Utils/MessageData";
import MessageForRoom from "../../../Script/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MessageSoundManager from "../../../Script/CommonScripts/Utils/MessageSoundManager";
import MessageType from "../../../Script/CommonScripts/Utils/MessageType";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";

import Dominoe_BetsConfig from "../bets/Dominoe_BetsConfig";
import Dominoe_GameMode from "../mode/Dominoe_GameMode";
import Global, { GameModeDominoe } from "../Utils/Dominoe_GlobalGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class dominoe_Matching extends cc.Component {

    private isUpdate: boolean = false;               //是否开启update;
    
    private playerDataArr: number[] = [];            //当前匹配玩家数据;
    private match_time: number = 0;                  //倒计时时间;
    private countTimeDT: number = 0;                 //倒计时基准;
    // private countDownLabel: cc.Label = null;         //倒计时label;
    private isChangeScene: boolean = false;          //是否在切换场景;
    private playersIdArr: number[] = [];             //玩家id数组;
    private playerPosArr: number[][] = [[-221.5, -188], [-75.5, -188], [75.5, -188], [221.5, -188]];
    
    private isOldVersion: boolean = false;            //是否是旧版本;
    private isLoadChangeScene: boolean = false;       //是否在切换场景;
   
    private timeOutNum: number = -1;                  //10倒计时判断;
    private isReceiveMatchMessage: boolean = false;   //是否有接收到过socket消息;
    private isFristReveiveMessage: boolean = false;   //是否为第一次打点;
    private isAotuStr: string = 'no';                 //是否是自动join的消息;
    private isSendStatusEvent: boolean = false;        //是否打了当前状态的点;
    private isSendJoinEvent: boolean = false;          //是否打了join的点;

    private modeLabel: cc.Label = null;

    private perBetLabel: cc.Label = null;
    private totalBetLabel: cc.Label = null;

    private scoreBetLabel: cc.Label = null;

    /** 一局模式下需要展示的金币展示设置 */
    private oneRoundBetsShowNode: cc.Node = null;
    /** 分数模式下需要展示的金币展示设置 */
    private scoreBetsShowNode: cc.Node = null;

    /** 修改图标icon */
    private modifyIcon: cc.Node = null;

    onLoad() {
        this.preloadGameScene();
        Global.isGameEnd = false;
        if (Global.isFirstLoad) {
            Global.isFirstLoad = false;
            let nowTime = new Date().getTime();
            let time = NDB.startTime;
            let t = ((nowTime - time) / 1000).toFixed(1);

            let gameType = getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
            let obj = {
                eventName: "game_load_complete",
                name: `${GameConfig.gameName}${gameType}`,
                time: t
            }
            NDB.sendAutoJoinEvent(obj);
        }

        const bgmNode = cc.find("Canvas/bgm");
        const btnOff = cc.find("Canvas/btnOff");
        const btnOn = cc.find("Canvas/btnOn");

        const bgmOff = bgmNode.getChildByName('bgmOff');
        const bgmOn = bgmNode.getChildByName('bgmOn');

        bgmOff.getComponent(cc.Sprite).spriteFrame = btnOff.getComponent(cc.Sprite).spriteFrame;
        bgmOn.getComponent(cc.Sprite).spriteFrame = btnOn.getComponent(cc.Sprite).spriteFrame;
        
        const bgmComp = bgmNode.getComponent(BgmSettings);
        bgmComp.updateMusic = function() {
            if(MessageSoundManager.audioEngineOn) {
                console.log('开启音乐');
                MessageSoundManager.resumeMusic();
                bgmComp.bgmOnActive(true);
                bgmComp.bgmOffActive(false);
            } else {
                console.log('关闭音乐');
                bgmComp.bgmOnActive(false);
                bgmComp.bgmOffActive(true);
                MessageSoundManager.updateMusic();
            }
        }
    }

    start() {
        cc.game.setFrameRate(32);
        this.init();
        this.getUserinfo();
        this.getGameCoin();
        this.getRankingData();
        this.loadScene();
        // MessageForRoom.getGameResource();
        //发送获取APP与服务器链接情况;
        MessageManager.socketSend(MessageType.MESSAGE_REQUEST_WS_STATUS);
        this.firstLoding();
    }

    //游戏页面加载完成打点；
    firstLoding() {
        if (Global.isCanAutoJoinGame) {
            cc.find("Canvas").getComponent(timeManager).startUpdate();
            let isAuto: string = 'no';
            if (MessageForRoom.getIsAutoJoin()) {
                isAuto = 'yes';
            }
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
            let obj = {
                eventName: "game_loading_complete",
                type: `${GameConfig.gameName}${gameType}`,
                source: MessageData.gameSource,
                is_match_auto: isAuto,
                time: cc.find("Canvas").getComponent(timeManager).getNowTime()
            }
            NDB.sendAutoJoinEvent(obj);
        }
    }

    //当前接收的消息是否是自动join的消息打点；
    gameJoinComplete() {
        this.isFristReveiveMessage = false;
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
        let obj = {
            eventName: "game_join_complete",
            type: `${GameConfig.gameName}${gameType}`,
            source: MessageData.gameSource,
            is_match_auto: this.isAotuStr,
            time: cc.find("Canvas").getComponent(timeManager).getNowTime()
        }
        NDB.sendAutoJoinEvent(obj);
    }


    //游戏状态首次更新完成;
    sendStatusComplete(flag: boolean, nowStatus, mType: string = 'http') {
        this.isSendStatusEvent = true;
        if (Global.isCanAutoJoinGame) {
            console.log('可以自动加入房间');
            if (MessageForRoom.getIsAutoJoin() && !this.isSendJoinEvent) {
                
                this.isAotuStr = 'yes';
                this.isFristReveiveMessage = true;
                this.isSendJoinEvent = true;
                setTimeout(() => {
                    if (this.node && this.node.active) {
                        this.isAotuStr = 'no';
                        this.isFristReveiveMessage = false;
                    }
                }, 10000);
            }

            let isAuto = 'no';
            if (MessageForRoom.getIsAutoJoin()) {
                console.log("可以自动加入");
                isAuto = 'yes';
                if (flag) {
                    console.log('发送加入事件');
                    MatchingScene.I.joinGame();
                    // MessageManager.joinGame(2, true, isAuto);
                } else {
                    isAuto = 'no';
                }
            }
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
            let obj = {
                eventName: "game_status_complete",
                type: `${GameConfig.gameName}${gameType}`,
                source: Global.gameSource,
                is_match_auto: isAuto,
                status: nowStatus,
                messageType: mType,
                time: cc.find("Canvas").getComponent(timeManager).getNowTime()
            }
            NDB.sendAutoJoinEvent(obj);
        }
    }

    init() {
        this.oneRoundBetsShowNode = cc.find("Canvas/betsNode/betsIcon");
        this.scoreBetsShowNode = cc.find("Canvas/betsNode/scoreBets");

        const perBetNode = cc.find("Canvas/betsNode/scoreBets/betCon/perBet");
        this.perBetLabel = this.oneRoundBetsShowNode.getChildByName('perBet').getComponent(cc.Label);
        this.totalBetLabel = this.oneRoundBetsShowNode.getChildByName('totalBet').getComponent(cc.Label);

        this.scoreBetLabel = perBetNode.getComponent(cc.Label);
        const betsConfig = Dominoe_GameMode.roomModeData as any;

        if(Global.gameMode === GameModeDominoe.ROUND) {
            this.modifyIcon = this.oneRoundBetsShowNode.getChildByName('modifyIcon');
            this.modeLabel = this.oneRoundBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            this.scoreBetsShowNode.active = false;
            this.oneRoundBetsShowNode.active = true;
            this.modeLabel.string = MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : 'ONEROUND';

            this.totalBetLabel.string = MessageData.bet_limit.toString() + ' Limits';
            this.perBetLabel.string =  MessageData.bet_limit / 40 + ' / points';
        } else {
            this.modeLabel = this.scoreBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            this.modifyIcon = cc.find("Canvas/betsNode/scoreBets/betCon/modifyIcon");

            // 分数模式下需要修改的游戏币
            this.scoreBetsShowNode.active = true;
            this.oneRoundBetsShowNode.active = false;
            // 显示本局使用的游戏币
            this.scoreBetLabel.string = MessageData.bet_limit.toString();
            // this.scoreBetLabel.string = .bet_limit.toString();
            this.modeLabel.string = MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : 'SCORE_100';
        }
        
        MessageSoundManager.playBGEngine(`resources_${GameConfig.gameName}/sound/hallBGM`);
    }

    eventDispatchFunc() {
        //监听服务器广播;
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //获取当前最新的状态;
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

        MyEvent.I.on(MessageType.MESSAGE_MIC_USERS,this.micUsers.bind(this),this.node);
    }

    private replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && MessageSoundManager.audioEngineOn) {
            MessageSoundManager.pauseMusic();
            MessageSoundManager.resumeMusic();
        }
    }

    micUsers(): void {
        console.log("micUsers");
    }

    //网络波动;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            this.getGameRoomStatus(false);
        }
    }

    //设置排行榜信息;
    getRankingData() {
       
    }

    //获取游戏币数据，并显示;
    getGameCoin() {
        // MessageManager.httpIAPResult('get', MessageType.ASSETS, {}, (data) => {
        //     if (this.coinLabel && data) {
        //         this.coinLabel.string = String(data.diamond);
        //     }
        // });
    }

    //设置加入和退出按钮的国际化;
    setJoinExitLabel() {
        
    }

    //获取个人信息；
    getUserinfo() {
        //先获取个人信息，然后获取房间信息，然后获取游戏信息;
        if (Global.UserInfo) {
            this.setUserInfo(Global.UserInfo);
            this.getRoomInfo();
        } else {
            MessageForRoom.getUserInfo((userInfo) => {
                Global.UserInfo = userInfo;
                Global.userId = Number(userInfo.userId);
                this.getRoomInfo();
                this.setUserInfo(userInfo);
            });
        }
    }

    //设置自己的信息显示;
    setUserInfo(data) {
        // let avatar = data.avatar;
        // let name = data.userName;
        // let uid = data.userId;
        // ResourcesManager.loadHeadImag(avatar, uid, 2, (res: cc.Texture2D) => {
        //     res.packable = false;
        //     this.userHead.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
        //     this.userHead.scaleX = 64 / this.userHead.width;
        //     this.userHead.scaleY = 64 / this.userHead.height;
        // });
        // this.username.string = Global.subNickName(name, 10);
    }

    //获取房间信息;
    getRoomInfo() {
        if (Global.RoomInfo) {
            this.getGameRoomStatus();
            let roomId = Global.RoomInfo['room_id'];
            this.eventDispatchFunc();
            if (!this.isReceiveMatchMessage) {
                MessageForRoom.getStatus(roomId);
                
            }
        } else {
            MessageForRoom.getRoomInfo((roomInfo) => {
                Global.RoomInfo = roomInfo;
                let roomId = roomInfo['room_id'];
                this.eventDispatchFunc();
                Global.gameRoomId = roomId;
                MessageData.gameRoomId = roomId;
                if (!this.isReceiveMatchMessage) {
                    MessageForRoom.getStatus(roomId);
                }
                this.getGameRoomStatus();
            });
        }
    }

    /*
        当有人发送表情的时候，设置表情的显示;
        @param      displayId    发送表情人的ID
        @param      msg          表情内容
    */
    setEmojiShow(displayId, msg) {
        //获取发送表情的用户在第几个;
        let index = this.playerDataArr.indexOf(displayId);
        if (index >= 0) {
            Message.showEmoji(this.playerPosArr[index], [106, 106], msg);
        }
    }

    //加载场景;
    loadScene() {
        // if (Global.gameSceneIsLoad) {
        //     return;
        // }
        // cc.director.preloadScene('gameScene', (completedCount, totalCount, item) => {
        //     let comple = Math.floor(completedCount / totalCount * 100);
        //     if (comple == 100) {
        Global.gameSceneIsLoad = true;
        //     }
        // }, (error) => {
        // });
    }

    //加入游戏回调;
    hallJoinGame_callback() {
        // MKMessageManager.joinGame(2, true);
    }

    //离开游戏回调；
    hallExitGame_callback() {
        // let exitmatchingPrefab = cc.instantiate(this.exitMatchingPrefab);
        // this.node.addChild(exitmatchingPrefab);
    }

    exitMatchingFunc() {
        // MessageManager.exitJoinGame();
    }

    //添加金币回调;
    addCoin_callback() {
        MessageManager.buyGameCion();
    }

    //显示排行榜；
    showRanking_callback() {
        NDB.openWebView('http://a.fslk.co/activity4/togo_game_leader_board/index.html?type=duminoes');
        let obj = {
            eventName: "room_game_ranking",
            from: 'room_game_lightbox',
        }
        NDB.sendEvent(obj);
    }

    //邀请玩家加入游戏;
    invite_callback() {
        let shareText: string = 'Come to join this chatroom and play incredible game!' + Global.shareUrl;
        let shareUrl = 'http://static.funshareapp.com/atlas_op_common_file/1599895401813423.jpg';
        MessageManager.shareGameOrImage(shareText, shareUrl, (event) => {
        });
    }

    //商城回调;
    store_callback() {
        MessageManager.goStore();
    }

    //添加规则页面;
    addRule_callback() {
        // let node = cc.instantiate(this.rulePrefab);
        // this.node.addChild(node);
    }

    //余额不足的界面;
    insufficientBalanceFunc() {
        // let pNode = cc.instantiate(this.depositPrefab);
        // this.node.addChild(pNode);
    }

    //服务器给的广播;
    messageFunc(data) {
        let method = data.data.method;
        switch (method) {
            case 'emoji_on_mic':        //表情;
                let displayId = data.data.data.user.display_id;
                let msg = data.data.data.msg;
                this.setEmojiShow(displayId, msg);
                break;
            case 'dominoe_matching':
                if (MessageData.gameType == GameType.single) {
                    return;
                }
                let mData = data.data.data;
                this.setMatchingShow(mData, 'matching');
                this.getNowGameStatus(data, method);
                break;
            case 'dominoe_playing':
                if (MessageData.gameType == GameType.single) {
                    if (data.data.data.action == "start") {
                        Global.gameID = data.data.channel.id
                        MessageData.gameid = data.data.channel.id
                        MessageData.gameSource_Id = data.data.data.source_id;
                    } else {
                        return;
                    }
                } else {
                    MessageData.gameid = data.data.channel.id;
                    Global.gameMode = data.data.data.model === 'score' ? GameModeDominoe.SCORE100 : GameModeDominoe.ROUND;
                }
                this.stopTimeOut();
                MessageManager.isPushmessage = true;
                let eData = data.data.data;
                console.log('刚开始data is ',data);
                this.setMatchingShow(eData, 'playing');
                this.getNowGameStatus(data, method);

                if (!this.isChangeScene) {
                    this.changeScene(data);
                }
                break;
            case 'dominoe_completed':
                console.log('游戏已经结束');
                // Global.isGameEnd = true;
                break;    
            case 'dominoe_bets_config':                //当改变房间配置的时候，socket回调；
                let bData = data.data.data;
                this.updateBetsChange(bData);
                break;    
            case 'response_ws_status':
                this.request_ws_status(data);
                break;
        }
    }

    /**
     * 更新游戏币配置
     * @param  {any} bData 游戏币配置数据
     */
    updateBetsChange(bData) {
        console.log("@更新的游戏币配置是：",bData);
        Dominoe_GameMode.roomModeData = bData;

        Global.roomBetsType = bData.coin_type;
        Global.gameMode = bData.model === 'score' ? GameModeDominoe.SCORE100 : GameModeDominoe.ROUND;
        if (bData.model === 'score') {
            this.modeLabel.string = MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : 'SCORE 100';
        } else {
            this.modeLabel.string = MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : 'ONE ROUND';
        }

        if (Global.roomBetsType === 'diamond') {
            MessageData.game_coinType = GameCoinType.game_coin;
        }
        
        Global.roomBets = bData.bets;
        MatchingScene.I.automaticExitJoin();
        MatchingScene.I.stopCountDown();
        this.updateBetShow();
    }

    updateBetShow() {
        const modifyIconIsTrue = this.modifyIcon.active;
        if(Global.gameMode === GameModeDominoe.ROUND) {
            this.modifyIcon = this.oneRoundBetsShowNode.getChildByName('modifyIcon');
            this.modifyIcon.active = modifyIconIsTrue;
            // 5游戏币 / 分  上限200游戏币 mode
            this.oneRoundBetsShowNode.active = true;
            this.scoreBetsShowNode.active = false;
            this.modeLabel = this.oneRoundBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            this.modeLabel.string = MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : "ONE ROUND";
            this.perBetLabel = this.oneRoundBetsShowNode.getChildByName('perBet').getComponent(cc.Label);
            this.totalBetLabel = this.oneRoundBetsShowNode.getChildByName('totalBet').getComponent(cc.Label);

            this.perBetLabel.string = Global.roomBets / 40 + ' / points';
            this.totalBetLabel.string = Global.roomBets.toString() + ' Limits';
        } else {
            this.modifyIcon = cc.find("Canvas/betsNode/scoreBets/betCon/modifyIcon");
            this.modifyIcon.active = modifyIconIsTrue;
            this.modeLabel = this.scoreBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            // 分数模式
            this.oneRoundBetsShowNode.active = false;
            this.scoreBetsShowNode.active = true;
            this.modeLabel.string = MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : "SCORE 100";
            // 设置房间游戏币
            this.scoreBetLabel.string = Global.roomBets.toString();
        }
    }

    //获取房间最新状态；
    updateStatus(event) {
        if (MessageData.gameType == GameType.single) {
            return;
        }
        if (this.isReceiveMatchMessage) {
            return;
        }
        let data = event.statusData;
        if(!data) return;
        
        let keys = Object.keys(data);

        if (keys.length == 0 || data.status == "completed") {
            console.log('开启倒计时');
            this.startTimeOut("=>房间状态completed");
            console.log('发送第一次状态完成');
            this.sendStatusComplete(true, 'lack');
        }
        //如果是匹配状态;
        if (data.status == "playing") {

            MessageManager.isPushmessage = true;
            if (MessageManager.socketDatas.length == 0) {
                MessageManager.socketDatas.push(data.data);
            }
            this.setMatchingShow(data, 'playing');
            this.sendStatusComplete(false, 'gaming');
            if (MessageData.gameType == GameType.room) {
                if (!this.isChangeScene) {
                    this.changeScene(data);
                }
            }
        } else if (data.status == "matching") {
            this.startTimeOut("=>房间状态 匹配中");
            this.setMatchingShow(data, 'matching');
            this.audoJoinGame(data);
        }
    }

    //获取当前房间信息; 
    getNowGameStatus(data, method) {
        if (!this.isSendStatusEvent && Global.isCanAutoJoinGame) {
            this.isSendStatusEvent = true;
            if (method === 'dominoe_playing') {
                this.sendStatusComplete(false, 'gaming', 'socket');
            } else if (method === "dominoe_matching") {
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

    //是否自动join游戏;
    audoJoinGame(data?) {
        if (Global.isCanAutoJoinGame) {
            let players = data.players;
            let keys = Object.keys(players);
            if (keys.length < 4) {
                this.sendStatusComplete(true, 'lack');
            } else {
                this.sendStatusComplete(false, 'full');
            }
        }
    }

    
    /**
     * 设置匹配的玩家数据;
     * @param  {any} data 服务端返回的数据
     * @param  {string} type 类型 play,match
     */
    setMatchingShow(data, type) {
        if(type === 'playing') {
            console.log('刚开始进入游戏时候data is ',data);
        }
        this.isReceiveMatchMessage = true;
        let players = data.players;
        let selfIsJoin = false;
        let keys = Object.keys(players);
        for (let i = 0; i < 4; i++) {
            let key = keys[i];
            if (players[key]) {
                //数据中的用户id；
                let playerId = players[key].id;
                if (playerId == Global.userId) {
                    selfIsJoin = true;
                    // this.showSelfAciton(this.playerArr[i]);
                    if (this.isFristReveiveMessage && Global.isCanAutoJoinGame && MessageForRoom.getIsAutoJoin()) {
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
            }
        }

        let number = 0;
        for (let i = 0, len = this.playerDataArr.length; i < len; i++) {
            if (this.playerDataArr[i] && this.playerDataArr[i] > 0) {
                number++;
            }
        }

        if (type == 'matching') {
            if (selfIsJoin) {
                // this.joinBtn.active = false;
                // this.exitBtn.active = true;
                // this.joinLabel.node.active = false;
                // this.exitLabel.node.active = true;
                // this.exitBtn.getComponent(cc.Button).interactable = true;
                // this.exitLabel.node.color = cc.color(51, 51, 51, 255);
            } else {
                // this.joinBtn.active = true;
                // this.joinBtn.getComponent(cc.Button).interactable = true;
                // this.exitBtn.active = false;
                // this.joinLabel.node.active = true;
                // this.exitLabel.node.active = false;
                if (number == 4) {
                    /** 切换房间 */
                    console.log('房间人数为4个人切换房间');
                    MessageForRoom.takeChangeRoom(true);
                }
            }
        } else if (type == 'playing') {
            if (selfIsJoin) {
                console.log('自己在房间里切换房间');
                console.log('隐藏切换icon');
                MessageForRoom.takeChangeRoom(false);
            } else {
                console.log('自己没有在房间里切换房间');
                MessageForRoom.takeChangeRoom(true);
            }
        }

        if (selfIsJoin) {
            Global.isGodModel = false;
        } else {
            Global.isGodModel = true;
        }

        // if (number >= 2) {
        //     let countdown_duration = data.countdown_duration;
        //     this.playCountDown(countdown_duration);
        // } else {
        //     this.stopCountDwon();
        // }

        if (number == 4 && !selfIsJoin) {
            // this.joinBtn.active = false;
            // this.exitBtn.active = true;
            // this.joinLabel.node.active = false;
            // this.exitLabel.node.active = true;
            // this.exitBtn.getComponent(cc.Button).interactable = false;
            // this.exitLabel.node.color = cc.color(108, 108, 108, 255);
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
    }

    hideSelfAction(node: cc.Node) {
        let actionNode = node.getChildByName('actionNode');
        let icon_me = node.getChildByName('icon_me');
        icon_me.active = false;
        actionNode.active = false;
        actionNode.stopAllActions();
    }

    //切换场景;
    changeScene(data) {

        MathcResData.isJoin = true;
        MessageManager.socketDatas.push(data);
        // this.joinBtn.active = false;
        // this.joinLabel.node.active = false;
        // this.exitBtn.getComponent(cc.Button).interactable = false;
        // this.exitLabel.node.color = cc.color(108, 108, 108, 255);
        this.isChangeScene = true;
        //场景是否已经加载过了;
        if (Global.gameSceneIsLoad) {
            let fadeOut = cc.fadeOut(1.5);
            let func = cc.callFunc(() => {
                this.loadChangeScene();
            });
            this.node.runAction(cc.sequence(fadeOut, func));
        } else {
            this.preloadGameScene().then(() => {
                this.loadChangeScene();
            });
        }
    }

    private preloadGameScene(): Promise<void> {
        return new Promise((resolve,reject) => {
            cc.director.preloadScene('dominoe_GameScene', (completedCount, totalCount, item) => {
                let comple = Math.floor(completedCount / totalCount * 100);
                if (comple == 100) {
                    Global.gameSceneIsLoad = true;
                    // this.loadChangeScene();
                    resolve();
                }
            }, (error: Error) => {
                reject(error);
            });
        });
    }

    //没有麦味了;
    noMicFunc() {
        // let node = cc.instantiate(this.popLayer);
        // node.getComponent(popLayer).setLayerType('nomic');
        // this.node.addChild(node);
    }

    //实际切换场景;
    loadChangeScene() {
        if (this.isLoadChangeScene) {
            return;
        }
        this.isLoadChangeScene = true;
        cc.director.loadScene("dominoe_GameScene");
    }

    //开始倒计时;
    playCountDown(match_duration) {
        this.stopTimeOut();
        this.match_time = match_duration;
        if (this.match_time > 0) {
            this.isUpdate = true;
            // this.countDownLabel.node.active = true;
            // this.countDownLabel.string = String(this.match_time);
            // this.startLabel.active = true;
            // this.waitingLabel.active = false;
        } else {
            this.isUpdate = false;
        }
    }

    //停止倒计时;
    stopCountDwon() {
        this.isUpdate = false;
        // this.countDownLabel.node.active = false;
        // this.startLabel.active = false;
        // this.waitingLabel.active = true;
        this.startTimeOut();
    }

    //10S倒计时；
    startTimeOut(tag?: string) {
        this.stopTimeOut();
        this.timeOutNum = window.setTimeout(() => {
            if (this.node && this.node.active) {
                console.log("10秒倒计时到切换房间",tag);
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

    // 获取当前房间配置和状态;
    getGameRoomStatus(flag = true) {
        //说明已经获取过配置数据了;
        // if (Global.betsConfig && flag) {
        //     this.setBetsInfo(Global.betsConfig);
        //     if (!this.isReceiveMatchMessage) {
        //         MessageForRoom.getStatus(MessageData.gameRoomId);
        //     }
        // } else {
        console.log('roomId is ',MessageData.gameRoomId);
        Dominoe_BetsConfig.getRoomConfig(MessageData.gameRoomId, (configData) => {
            console.log('--->',configData);
            if (configData && configData.data && this.node && this.node.active) {
                let data = configData.data;
                this.setBetsInfo(data);
                /** 设置房间模式信息 */
                Dominoe_GameMode.roomModeData = data;
                // if()
                this.setBetSConfig();
            }
        }, {}, 'get');
    }

    //设置赌注信息;
    setBetsInfo(data) {
        // 多米诺玩法模式显示
        const activated = data.activated;
        Dominoe_GameMode.roomModeData = data;
        if (data.model == 'score') {
            // Dominoe_GameMode.piceNum = 4;
            this.modeLabel = cc.find("Canvas/betsNode/scoreBets/mode").getComponent(cc.Label);
            this.modifyIcon = cc.find("Canvas/betsNode/scoreBets/betCon/modifyIcon");
            this.modeLabel.string = MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : 'SCORE 100';

            Global.gameMode = GameModeDominoe.SCORE100;
        } else {
            this.modifyIcon = cc.find("Canvas/betsNode/betsIcon/modifyIcon");
            this.modeLabel = cc.find("Canvas/betsNode/betsIcon/mode").getComponent(cc.Label);
            // Dominoe_GameMode.piceNum = 2;
            this.modeLabel.string = MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : 'ONE ROUND';
            Global.gameMode = GameModeDominoe.ROUND;
        }

        console.log("最开始设置游戏币的数据是：",data);
        if (activated) {
            if (data.is_modify) {
                // this.changBetType.active = true;
                MatchSetBets.iscanChanageBets = true;
                this.modifyIcon.active = true;
            } else {
                console.log('不可修改');
                this.modifyIcon.active = false;
            }
            // Ludo_BetsIcon.I.setBetsIcon();
            // Global.bets_list = data.bets_list;
            // Global.roomBetsType = data.coin_type;
            MessageData.game_coinType = GameCoinType.game_coin;

        }
    }

    private setBetSConfig() {
        const betsConfig = Dominoe_GameMode.roomModeData as {model: string,bets: number};
        if(betsConfig.model === 'one') {
            this.modeLabel = this.oneRoundBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            this.scoreBetsShowNode.active = false;
            this.oneRoundBetsShowNode.active = true;
            this.modeLabel.string = MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : 'ONE ROUND';

            this.totalBetLabel.string = betsConfig.bets.toString() + " Limits";
            this.perBetLabel.string =  betsConfig.bets / 40 + ' / points';

        } else {
            this.modeLabel = this.scoreBetsShowNode.getChildByName('mode').getComponent(cc.Label);
            // 分数模式下需要修改的游戏币
            this.scoreBetsShowNode.active = true;
            this.oneRoundBetsShowNode.active = false;
            // 显示本局使用的游戏币
            this.scoreBetLabel.string = betsConfig.bets.toString();
            // this.scoreBetLabel.string = .bet_limit.toString();
            this.modeLabel.string = MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : 'SCORE 100';
        }
    }

    
    update(dt) {
        if (this.isUpdate) {
            this.countTimeDT += dt;
            if (this.countTimeDT >= 1) {

                // MessageSoundManager.playLoadEffect(this.countDownAudio);
                // this.countTimeDT = 0;
                // this.countDownLabel.string = String(--this.match_time);
                // if (this.match_time == 0) {
                //     this.isUpdate = false;
                // }
            }
        }

        // console.log('音频是否正在播放: ',cc.audioEngine.isMusicPlaying());
    }

    protected onDestroy(): void {
        cc.audioEngine.stopMusic();
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {

            //@ts-ignore
            if(cc.sys.__audioSupport.context && cc.sys.__audioSupport.context['suspend']) {
                //@ts-ignore
                cc.sys.__audioSupport.context.suspend();
            }
        }
    }
}
