import { eventManager } from "../../../Script/common/managers/eventManager";
import { getUrlParameterValue, isProd } from "../../../Script/common/utils/util";
import timeManager from "../../../Script/CommonScripts/MatchSceneScripts/timeManager";
import MessageForRoom from "../../../Script/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MessageType from "../../../Script/CommonScripts/Utils/MessageType";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";
import { GameData } from "../Common/Game/GameData";
import { LanguageManager } from "../Common/Language/LanguageManager";
import { logManager } from "../Common/LogManager";
import { PopupManager } from "../Common/Popup/PopupManager";
import SoundManager from "../Common/Sound/SoundManager";
import Socket from "../Game/Socket/Socket";
import GlobalGameData, { LatestGameInfo, RoomType } from "../GlobalGameData";
import MainTipPopup from "../Matching/MainTipPopup";
import Player from "../Players/Player";
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

    /** 加入成功 */
    private joinSuccess: boolean = false;

    public static isFirstEnter = true;

    private viewResolution: cc.Size = cc.size(0);

    private versionNode: cc.Node = null;

    public static GameConfig = {
        bet: 100,
        time_limit: 240,
        turn_duration: 12
    }

    onLoad () {
        this.versionNode = this.node.getChildByName('version');
        timeManager.I.startUpdate();

        if(isProd()) {
            this.versionNode.active = false;
        } else {
            this.versionNode.active = true;
        }
        this.viewResolution = cc.view.getVisibleSize();
        console.log(cc.find('Popup'));
        this.initLabels();
        const vcode = getUrlParameterValue('vcode');
        
        if(GlobalGameData.roomType === RoomType.ROOM) {
            if((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200)) {
                this.bgNode.node.active = true;

            } else {
                this.bgNode.node.active = false;
            }
        } else {
            
            // this.disableAllBtns();
        }
        this.SetNetworkConfiguration();
        if(UNOMatching.isFirstEnter) {
            this.GameLoad('UNO');
        }
        this.GetGameConfig();
        Socket.Init();
        LanguageManager.Init();
        if(GlobalGameData.roomType == RoomType.SINGLE) {
            
            this.disableAllBtns();
            this.startWaitTime();
            if(!UNOMatching.isFirstEnter) {
                NDB.run("lobbyGameOver",lobbyExtra);
                this.joinGame();
            } else {
                console.log('首次进入游戏调用loadLobbyDone');
                NDB.run("loadLobbyDone",lobbyExtra);
            }
            
        } else {
            if(!UNOMatching.PlayAgain) {
                console.log('非首次进入游戏显示加入按钮');
                // 显示加入按钮
                this.setJoinStatus(false,true);
            } else {
                // this.startCountDown();
                this.disableAllBtns();
            }
        }

        MessageForRoom.getUserInfo((result) => {
            let userId = result.userId;
            let userName = result.userName;
            let avatar = result.avatar;
            let player: Player = new Player();
            player.user_id = Number(userId);
            this.setSelfPosition({userId: player.user_id,avatar,username: userName});

            player.user_name = userName;
            player.user_avatar = avatar;
            PlayerManager.thisPlayer_user_id = +result.userId;
            GlobalGameData.userId = +result.userId;
            PlayerManager.SetPlayer(Number(userId), player);
            PlayerManager.thisPlayer_user_id = Number(userId);
            
            this.matchingUserInfo.initUserInfo(result);
            MessageForRoom.getRoomInfo((res) => {
                console.log('roomInfo is ',res);
                GlobalGameData.roomId = res.room_id;
                GlobalGameData.roomUserId = res.owner_id;

                if(GlobalGameData.roomType == RoomType.ROOM) {
                    if(result.userId == GlobalGameData.roomUserId) {
                        GlobalGameData.isRoomOwner = true;
                        this.setRoomOwner(true);
                    } else {
                        this.setRoomOwner(false);
                    }
                }
                /** 获取房间状态 */
                if(GlobalGameData.roomType === RoomType.ROOM) {
                    this.getRoomStatus();
                }
            });

        });
        
    }

    /** 设置自己的麦位 */
    private setSelfPosition(userData: {userId: number,avatar: string,username: string}) {
        if(GlobalGameData.roomType === RoomType.SINGLE) {
            this.matchingPlayers.setPlayerByIndex(userData,0);
            // 自动加入游戏
            
        }
    }

    protected onEnable(): void {
        UNOMatching.I = this;

        eventManager.on('insufficientBalance',this.noEnoughGameCoin,this);
        eventManager.on('joinRoomGameErr',this.joinRoomGameErr,this);
        eventManager.on('exitRoomGameErr',this.exitGameErr,this);

        eventManager.on('emit_status',this.updateStatus,this);
        MyEvent.I.on(MessageType.MESSAGE_MATCHING,this.updateMatching.bind(this),this.node);
        MyEvent.I.on(MessageType.MESSAGE_PLAYER,this.updatePlaying.bind(this),this.node);
        MyEvent.I.on(MessageType.MESSAGE_REQUEST_WS_STATUS,this.wsStatus.bind(this),this.node);
        MyEvent.I.on('onAndroidResume',this.resume.bind(this),this.node);
        MyEvent.I.on('joinErrMessage',this.joinLobbyErr.bind(this),this.node);
        MyEvent.I.on('replayMusic',this.replayMusic,this.node);

        if(UNOMatching.PlayAgain) {
            this.setJoinStatus(true);
            if(GlobalGameData.roomType === RoomType.ROOM) {
                // 自动加入游戏
                this.joinGame();
            }
            
        }
    }

    /**
     * join 游戏失败消息客户端回调
     */
    joinLobbyErr(data: any) {
        if(GlobalGameData.roomType === RoomType.ROOM) return;
        console.log('加入大厅游戏失败：',data);

        this.setJoinStatus(false);

        // this.matchingPlayers.resetAllPlayers();
        if(data.err_code === 81008 || data.err_code === 89012) {
            this.noEnoughGameCoin();
            this.stopWaitTime();
            this.setJoinStatus(false,false);
        }
        
    }

    protected onDisable(): void {
        eventManager.remove('insufficientBalance',this.noEnoughGameCoin);
        eventManager.remove('joinRoomGameErr',this.joinRoomGameErr);
        eventManager.remove('exitRoomGameErr',this.exitGameErr);
        MyEvent.I.remove('replayMusic',this.replayMusic);

        eventManager.remove('emit_status',this.updateStatus);
        MyEvent.I.remove(MessageType.MESSAGE_MATCHING,this.node);
        MyEvent.I.remove(MessageType.MESSAGE_PLAYER,this.node);
        MyEvent.I.remove(MessageType.MESSAGE_REQUEST_WS_STATUS,this.node);
        MyEvent.I.remove('onAndroidResume',this.node);
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
        MessageManager.getStatus(GlobalGameData.roomId,(res: LatestGameInfo) => {
            this.updateStatus(res);
        });
    }


    updateMatching(message: any) {
        console.log('matching message is ',message);
        const players = message.data.data.players;
        const countdown = message.data.data.countdown;
        if(GlobalGameData.roomType == RoomType.SINGLE) {
            return;
        }

        if(countdown > 0) {
            this.startCountDown(countdown);
        } else {
            console.log('倒计时为0停止倒计时');
            this.stopCountDown();
        }
        this.matchingPlayers.setPlayers(message.data.data.players);

    }


    updatePlaying(message: any) {
        // 切换场景
    }

    /**
     * 更新房间状态
     * @param  {LatestGameInfo} res 拉取的房间状态信息
     */
    updateStatus(res: LatestGameInfo) {
        console.log('res is ',res);
        // if(res)
        if(res.status == 'completed') {

        } else if(res.status == 'matching') {
            this.updateMatching({data: {data: {players: res.players,countdown: res.countdown}}});
        } else if(res.status == 'playing') {
            /** 如果是playing状态的时候加入按钮隐藏 */
            this.disableAllBtns();
            let dataObj = {
                data: res
            }
            GameData.gameid = res.game_id;
            // 准备玩家数据，转换场景 
            UNOMatching.I.InitGameData(dataObj);
            UNOMatching.I.JumpScene(0);

        }
    }

    noEnoughGameCoin() {
        console.log('没有多余的游戏币');
        this.setJoinStatus(false,false);
        if(GlobalGameData.roomType == RoomType.ROOM) {
            this.stopCountDown();
        } else {
            this.stopWaitTime();
        }

        logManager.sendLog({eventName: 'game_not_start',reason: 'no money'});
        MainTipPopup.I.ShowTip(LanguageManager.GetType().game_coins ? LanguageManager.GetType().game_coins : LanguageManager.enLangJson.game_coins,LanguageManager.GetType().cancel ? LanguageManager.GetType().cancel : LanguageManager.enLangJson.cancel,LanguageManager.GetType().recharge ? LanguageManager.GetType().recharge : LanguageManager.enLangJson.recharge,() => {
            MainTipPopup.I.CloseTip();
        },() => {
            MainTipPopup.I.CloseTip();
            MessageManager.buyGameCion();
        });

    }

    joinRoomGameErr(data: any) {
        console.log('匹配大区错误');
        this.setJoinStatus(false);
        logManager.sendLog({eventName: 'game_not_start',reason: 'others'});
        MainTipPopup.I.ShowTip(LanguageManager.GetType().network_abnormality ? LanguageManager.GetType().network_abnormality : LanguageManager.enLangJson.network_abnormality,LanguageManager.GetType().no_lang ? LanguageManager.GetType().no_lang : LanguageManager.enLangJson.no_lang,LanguageManager.GetType().yes_lang ? LanguageManager.GetType().yes_lang : LanguageManager.enLangJson.yes_lang,() => {
            MainTipPopup.I.CloseTip();
        },() => {
            MainTipPopup.I.CloseTip();
            // MKMessageManager.buyGameCion();
        });
        // if(data.err_code === 80002) {
            
        // }
    }

    /** 退出房间游戏失败 */
    exitGameErr() {
        if(GlobalGameData.roomType === RoomType.ROOM) {
            this.setJoinStatus(true);
        }
    }

    /** 加入房间 */
    public joinGame(): void {
        if(GlobalGameData.roomType == RoomType.ROOM) {
            
            MessageManager.joinRoomGame(2,false,(data: any) => {
                if(data.status == 'OK') {
                    console.log('加入房间游戏成功');
                    this.setJoinStatus(true);
                    
                }
            });
        } else {
            console.log('开始加入大厅');
            // if(UNOMatching.PlayAgain) {
            //     NDB.run("lobbyGameOver",,lobbyExtra)
            // } else {
                // 加入大厅
                NDB.run('joinLobby',lobbyExtra);
            // }
            this.disableAllBtns();
            // if(this.sc)
            if(this.waitTime == 0) {
                this.startWaitTime();
            }
        }

        logManager.sendLog({eventName: "game_join_click",from: MKMessageManager.getUrlParameterValue('source'),time: TimeManager.I.getNowTime(),messageType: 'http'});

    }

    private disableAllBtns() {
        this.joinBtn.active = false;
        this.joinBtnDisable.active = false;

        this.joinBtnBig.active = false;
        this.joinBtnBigDisable.active = false;
    }

    /**
     * 是否显示退出按钮
     * @param  {boolean} isShowExit true: 显示退出按钮 false: 显示加入按钮
     */
    public setJoinStatus(isShowExit: boolean,avoidSingle: boolean = true) {
        if(GlobalGameData.roomType === RoomType.SINGLE && avoidSingle) {
            this.disableAllBtns();
            return;
        }
        console.log('显示按钮');
        if(GlobalGameData.isRoomOwner) {
            // 显示退出按钮，隐藏加入按钮
            this.joinBtn.active = !isShowExit;
            this.joinBtnDisable.active = isShowExit;
        } else {
            this.joinBtnBig.active = !isShowExit;
            this.joinBtnBigDisable.active = isShowExit;
        }
    }

    public exitGame(): void {
        MainTipPopup.I.ShowTip(LanguageManager.GetType().exit_lang ? LanguageManager.GetType().exit_lang : LanguageManager.enLangJson.exit_lang,LanguageManager.GetType().no_lang ? LanguageManager.GetType().no_lang : LanguageManager.enLangJson.no_lang,LanguageManager.GetType().yes_lang ? LanguageManager.GetType().yes_lang : LanguageManager.enLangJson.yes_lang,() => {
            MainTipPopup.I.CloseTip();
            
        },() => {
            MainTipPopup.I.CloseTip();
            if(+this.countDownLabel.string > 1) {
                MessageManager.exitRoomGame((data: any) => {
                    console.log('exitGame',data);
                    if(data.status == 'OK') {
                        // 显示加入按钮
                        this.setJoinStatus(false);
                        console.log('退出房间停止倒计时');
                    }
                })
            }
        });
    }

    public SetNetworkConfiguration() {
        MKMessageManager.setNetworkConfiguration();
    }

    public GetGameConfig() {
        this.betNumber.string = UNOMatching.GameConfig.bet + "";

        // let url = UNOMatching.GAMECONFIG + "?bet_type=" + "diamond"
        // let data ="bet_type=" + "diamond";
        // MKMessageManager.httpResult('get', url, {}, (res) => {
        //     console.log("GetGameConfig++++++", res);

        //     if (res) {
        //         if (res.bet)
        //             UNOMatching.GameConfig.bet = res.bet
        //         if (res.time_limit)
        //             UNOMatching.GameConfig.time_limit = res.time_limit
        //         if (res.turn_duration)
        //             UNOMatching.GameConfig.turn_duration = res.turn_duration
        //         // UNOMatching.GameConfig = res;
        //     }
        // });
    }

    

    private initLabels() {
        this.matchStatus = this.node.getChildByName('matchStatus').getComponent(cc.Label);
        this.countDownLabel = this.node.getChildByName('countdown').getComponent(cc.Label);
        this.betNumber = this.node.getChildByName('betNumber').getComponent(cc.Label);
        this.bgNode = this.node.getChildByName('bg').getComponent(cc.Sprite);
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
        console.log("初始化游戏信息,\nmessage : ", message);
        // 退出重进的时候将对局信息保存起来，防止如果用户从房间里面的匹配界面进到游戏页面没有消息的问题
        GameData.message = message;
        let index = 0;

        if(GameData.message.data.players.every(item => item.user_id !== GlobalGameData.userId)) {
            GlobalGameData.isGod = true;
        } else {
            GlobalGameData.isGod = false;
        }

        const userfulPlayers = GameData.message.data.players.filter(item => item.user_id);
        GlobalGameData.playerCount = userfulPlayers.length === 2 ? GamePlayerCount.TWO : userfulPlayers.length === 3 ? GamePlayerCount.THREE : GamePlayerCount.FOUR;
        console.log('游戏开始重置所有的玩家头像数据');
        // this.matchingPlayers.resetAllPlayers();

        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.user_id) continue;
            // if (element.user_id != PlayerManager.thisPlayer_user_id) {
            //     index++;
            // }
            this.CreatePlayer(element, i);
        }
    }

    private CreatePlayer(element: { user_id: number; user_name: string; user_avatar: string; poker_remain_count: number; poker_remain: number[]; status: string; rank: number; score: number; coin: number; }, index) {
        let headImageNodeName = "Canvas/players/OtherPlayer" + index + "HeadImage";
        let nameNodeName = "Canvas/players/name" + index;
        // console.log(headImageNodeName, nameNodeName);
        let headImage = cc.find(headImageNodeName).getComponent(cc.Sprite);
        let nameNode = cc.find(nameNodeName).getComponent(cc.Label);
        let playernode = {
            headImage: headImage,
            nameNode: nameNode,
        }

        if(element.user_id == GlobalGameData.userId) {
            this.matchingPlayers.setTabMe(index);
        }
        let player = new Player();
        player.user_id = element.user_id;
        player.user_name = element.user_name;
        playernode.nameNode.string = usernameSlice(element.user_name,8);
        player.user_avatar = element.user_avatar;
        player.user_type = PlayerType.OtherPlayer;
        PlayerManager.SetPlayer(player.user_id, player);
        // playernode.headImage.spriteFrame = this.PlayerHeadImage;
        if (!player.user_headImage) {
            console.log(player.user_avatar, player.user_id);
            // MKResourcesManager.loadHeadImag(player.user_avatar, player.user_id, 3, (res: cc.Texture2D) => {
            //     res.packable = false;
            //     let HeadImage = new cc.SpriteFrame(res);
            //     player.user_headImage = HeadImage;
            //     if (!UNOMatching.isJump)
            //         playernode.headImage.spriteFrame = player.user_headImage;
            // });
        }
    }

    JumpScene(time?: number) {
        console.log('跳转场景停止倒计时');
        this.stopCountDown();
        this.stopWaitTime();
        this.joinSuccess = true;

        setTimeout(() => {
            console.log('跳转到游戏场景');
            UNOMatching.isJump = true;
            cc.director.loadScene("GameScene");
        },typeof time == 'number' ? time * 1000 : 1500);

    }

    /** 尝试4次戳和没有成功 */
    joinLobbyGameErr() {
        console.log('加入大厅匹配失败');
        MainTipPopup.I.ShowTip(LanguageManager.GetType().match_failed ? LanguageManager.GetType().match_failed : LanguageManager.enLangJson.match_failed,LanguageManager.GetType().cancel ? LanguageManager.GetType().cancel : LanguageManager.enLangJson.cancel,LanguageManager.GetType().ok ? LanguageManager.GetType().ok : LanguageManager.enLangJson.ok,() => {
            console.log('yesFunc');
            MainTipPopup.I.CloseTip();
            this.stopWaitTime();
            this.joinLobbyTimes = 0;
            this.setJoinStatus(false,false);
        },() => {
            console.log('noFunc');
            MainTipPopup.I.CloseTip();
            this.stopWaitTime();
            this.joinLobbyTimes = 0;
            this.setJoinStatus(false,false);
        });
    }

    startWaitTime() {
        if(GlobalGameData.roomType === RoomType.ROOM) return;
        this.matchStatus.string = LanguageManager.GetType().start_prepare ? LanguageManager.GetType().start_prepare : LanguageManager.enLangJson.start_prepare;
        // this.unscheduleAllCallbacks();
        this.unschedule(this.startWait);
        this.countDownLabel.string = this.waitTime.toString();
        this.schedule(this.startWait,1);
    }

    stopWaitTime() {
        console.log('停止计时器');
        this.unschedule(this.startWait);
        if(GlobalGameData.roomType === RoomType.ROOM) return;

        this.matchStatus.string = LanguageManager.GetType().waiting ? LanguageManager.GetType().waiting : LanguageManager.enLangJson.waiting;
        // this.unscheduleAllCallbacks();
        this.waitTime = 0;
        this.countDownLabel.node.active = false;
    }

    startWait() {   
        if(this.joinSuccess) {
            console.log('join成功');
            this.unschedule(this.startWait);
            return;
        }
        console.log('waitTime: ',this.waitTime);
        this.countDownLabel.node.active = true;
        this.waitTime++;
        // 匹配 >= 4次的时候
        if(this.joinLobbyTimes >= 4) {
            this.unschedule(this.startWait);
            this.joinLobbyGameErr();
            return;
        }
        if(this.waitTime !== 0 && this.waitTime % 15 === 0) {
            this.joinLobbyTimes++;
            console.log('join失败次数加一：',this.joinLobbyTimes);
            this.joinGame();
        }
        this.countDownLabel.string = this.waitTime.toString();
    }

    startCountDown(time: number) {
        if(GlobalGameData.roomType === RoomType.SINGLE) return;
        this.countDownTotalTime = time;
        this.matchStatus.string = LanguageManager.GetType().start_prepare ? LanguageManager.GetType().start_prepare : LanguageManager.enLangJson.start_prepare;
        this.unschedule(this.countDown);
        this.countDownLabel.node.active = true;
        this.countDownLabel.string = time + '';
        this.schedule(this.countDown,1,time - 1);
    }

    countDown() {
        this.countDownTotalTime--;
        this.countDownLabel.string = '' + (this.countDownTotalTime < 0 ? 0 : this.countDownTotalTime);
        if(this.countDownTotalTime <= 0) {
            // this.scheduleOnce(() => {
            //     cc.director.loadScene("GameScene");
            // },1);
        }
    }

    stopCountDown() {
        console.log('停止倒计时');
        this.unschedule(this.countDown);
        if(GlobalGameData.roomType === RoomType.SINGLE) return;
        this.matchStatus.string = LanguageManager.GetType().waiting ? LanguageManager.GetType().waiting : LanguageManager.enLangJson.waiting;
        this.countDownLabel.node.active = false;
        this.countDownTotalTime = 15;
    }

    showRule() {
        // let ruleNode = this.node.getChildByName('rule');
        // let rulePrefabNode = cc.instantiate(this.rulePrefab);
        // let rulePop = rulePrefabNode.getComponent(RulePopup);

        // ruleNode.addChild(rulePrefabNode);
        // rulePrefabNode.setPosition(cc.v2(0,0));

        // rulePop.Init();
        // const ruleNodeChildren1 = ruleNode.children[0];
        // console.log(ruleNodeChildren1.getPosition());
        
        PopupManager.ShowPopup("RulePopup");
        // console.log("rule's childrencount is ",ruleNode.childrenCount,);
    }

    start () {
        if(UNOMatching.isFirstEnter) {
            UNOMatching.isFirstEnter = false;
        }
    }

}
