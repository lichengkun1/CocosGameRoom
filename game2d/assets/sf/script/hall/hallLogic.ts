
import { getUrlParameterValue } from '../../../Script/common/utils/util';
import Message from '../../../Script/CommonScripts/Utils/Message';
import MessageForRoom from '../../../Script/CommonScripts/Utils/MessageForRoom';
import MessageManager from '../../../Script/CommonScripts/Utils/MessageManager';
import MessageSoundManager from '../../../Script/CommonScripts/Utils/MessageSoundManager';
import MessageType from '../../../Script/CommonScripts/Utils/MessageType';
import MyEvent from '../../../Script/CommonScripts/Utils/MyEvent';
import NDB from '../../../Script/CommonScripts/Utils/NDBTS';
import ResourcesManager from '../../../Script/CommonScripts/Utils/ResourcesManager';
import SFRuleLogic from '../game/sf_ruleLogic';
import GlobalGameData from '../Global/SFGlobalGameData';
import { SFMessageManager } from '../sfMessageManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class hallLogic extends cc.Component {
    @property(cc.Node)
    redPlayers: cc.Node[] = [];

    @property(cc.Node)
    bluePlayers: cc.Node[] = [];

    @property(cc.SpriteFrame)
    headSpriteFrame: cc.SpriteFrame = null;

    @property({ type: cc.AudioClip })
    readyAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    hallBGM: cc.AudioClip = null;

    @property(cc.SpriteFrame)
    headShowSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    rulePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    updatePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    depositPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    storePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    exitMatchingPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    followed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    follow: cc.SpriteFrame = null;

    @property(cc.Prefab)
    popLayer: cc.Prefab = null;

    private joinBtn: cc.Node = null;                             //加入按钮；
    private exitBtn: cc.Node = null;                             //退出按钮；
    private countDown: cc.Node = null;                          //倒计时模块；
    private countLabel: cc.Label = null;                         //倒计时label；
    private GlobalGameDataDT: number = 0;                                //倒计时时间;
    private isUpdata: boolean = false;                           //是否开启倒计时;
    private selfIsJoin: boolean = false;                         //自己是否已经加入游戏;
    private joinNumber: number = 0;                              //当前游戏加入的人数;
    private isChangeScene: boolean = false;                      //是否在切换场景;
    private playerHeadData = { blue: [], red: [] };
    private isCountTime: boolean = false;                        //是否在倒计时了;
    private match_time: number = 0;                              //倒计时时间;
    private emojiPos: number[][][] = [[[-230, -34], [-230, -170]], [[230, -34], [230, -170]]];
    private head: cc.Node = null;
    private nameLabel: cc.Label = null;                            //昵称;
    private coinLabel: cc.Label = null;                            //金币；
    private firstLabel: cc.Label = null;                            //第一名的昵称;
    private rankLabel: cc.Label = null;                             //用户排名;
    private isOldVersion: boolean = false;                          //是否是旧版本;
    private joinLabel: cc.Label = null;                            //加入游戏;
    private exitLabel: cc.Label = null;                            //离开游戏;
    private timeOutNum: number = -1;                                //10倒计时判断;
    private isReceiveMatchMessage: boolean = false;                 //是否有接收到过socket消息;

    start() {
        const vcode: number = Number(getUrlParameterValue('vcode'));

        MessageManager.setNetworkConfiguration();
        cc.audioEngine.setMusicVolume(0.8);
        cc.audioEngine.setEffectsVolume(0.8);
        cc.view.enableAntiAlias(true);
        cc.game.setFrameRate(31);
        this.init();
        this.getGameCoin();
        if (MessageSoundManager.audioEngineOn) {
            cc.audioEngine.playMusic(this.hallBGM, true);
        }
        //是点击了再次游戏进入的大厅;
        if (GlobalGameData.isPlayerAgain) {
            GlobalGameData.isPlayerAgain = false;
            this.join_callback();
        }
        SFMessageManager.isStartContinue = false;
        SFMessageManager.clearStartContinue();

        let isShowRule = cc.sys.localStorage.getItem('isShowRule');
        if (!isShowRule) {
            let node = cc.instantiate(this.rulePrefab);
            cc.sys.localStorage.setItem('isShowRule', true);
            node.getComponent(SFRuleLogic).setShowType(true);
            this.node.addChild(node);
        }

        // let vcode = Number(MessageManager.getUrlParameterValue('vcode'));
        // if (vcode < 11300 && vcode != 1) {
        //     this.isOldVersion = true;
        //     let upNode = cc.instantiate(this.updatePrefab);
        //     this.node.addChild(upNode);
        // }
    }

    init() {
        this.joinBtn = this.node.getChildByName('joinBtn');
        this.exitBtn = this.node.getChildByName('exitBtn');
        this.countDown = this.node.getChildByName('countDown');
        this.head = this.node.getChildByName('head');
        this.countLabel = this.countDown.getChildByName('countLabel').getComponent(cc.Label);
        this.nameLabel = this.node.getChildByName('nameLabel').getComponent(cc.Label);
        this.coinLabel = this.node.getChildByName('coinLabel').getComponent(cc.Label);
        this.firstLabel = this.node.getChildByName('firstLabel').getComponent(cc.Label);
        this.rankLabel = this.node.getChildByName('rankLabel').getComponent(cc.Label);
        this.joinLabel = this.joinBtn.getChildByName('joinLabel').getComponent(cc.Label);
        this.exitLabel = this.exitBtn.getChildByName('exitLabel').getComponent(cc.Label);

        //获取当前socket情况；
        MessageManager.socketSend(MessageType.MESSAGE_REQUEST_WS_STATUS);
        //获取个人信息;
        this.getUserinfo();
        //预加载游戏场景;
        this.loadScene();

        this.head.on(cc.Node.EventType.TOUCH_START, () => {
            if (GlobalGameData.userId) {
                MessageManager.showPlayerInfo(GlobalGameData.userId);
            }
        }, this);

        //获取排行榜数据;
        MessageManager.getRankData((data) => {
            console.log(data);
            if (data) {
                //第一名数据;
                if (data.leaderboard && data.leaderboard[0]) {
                    let name = GlobalGameData.subNickName(data.leaderboard[0].name);
                    this.firstLabel.string = name;
                }

                if (data.own) {
                    let ranking = data.own.ranking;
                    if (ranking == 0) {
                        ranking = 999;
                    }
                    this.rankLabel.string = String(ranking);
                }
            }
        });

        let uiLang = MessageManager.getUrlParameterValue('ui_lang');
        let joinStr = 'Join';
        let exitStr = 'Exit';
        switch (uiLang) {
            case 'en':
                joinStr = 'Join';
                exitStr = 'Exit';
                break;
            case 'ar':
                joinStr = 'انضم';
                exitStr = 'خروج';
                break;
            case 'hi':
                joinStr = 'जुड़े';
                exitStr = 'बाहर जाएं';
                break;
            case 'te':
                joinStr = 'చేరండి';
                exitStr = 'బయటకి దారి';
                break;
            case 'ta':
                joinStr = 'சேர்';
                exitStr = 'வெளியேறு';
                break;
            case 'id':
                joinStr = 'Ikuti';
                exitStr = 'Keluar';
                break;
        }
        this.joinLabel.string = joinStr;
        this.exitLabel.string = exitStr;
    }

    //获取个人信息；
    getUserinfo() {
        //先获取个人信息，然后获取房间信息，然后获取游戏信息;
        if (GlobalGameData.UserInfo) {
            this.setUserInfo(GlobalGameData.UserInfo);
            this.getRoomInfo();
        } else {
            MessageForRoom.getUserInfo((userInfo) => {
                GlobalGameData.UserInfo = userInfo;
                GlobalGameData.userId = Number(userInfo.userId);
                this.getRoomInfo();
                this.setUserInfo(userInfo);
            });
        }
    }

    //获取游戏币，并且显示;
    getGameCoin() {
        MessageManager.httpIAPResult('get', MessageType.ASSETS, {}, (data) => {
            console.log('ASSETS:');
            console.log(data);
            this.coinLabel.string = String(data.diamond);
        });
    }

    //设置自己的信息显示;
    setUserInfo(data) {
        let avatar = data.avatar;
        let name = data.userName;
        let uid = data.userId;
        ResourcesManager.loadHeadImag(avatar, uid, 2, (res: cc.Texture2D, userid) => {
            if (userid != uid) {
                return;
            }
            res.packable = false;
            this.head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            this.head.scaleX = 64 / this.head.width;
            this.head.scaleY = 64 / this.head.height;
        });
        this.nameLabel.string = GlobalGameData.subNickName(name, 10);
    }

    //获取房间信息;
    getRoomInfo() {
        if (GlobalGameData.RoomInfo) {
            let roomId = GlobalGameData.RoomInfo['room_id'];
            this.eventDispatchFunc();
            if (!this.isReceiveMatchMessage) {
                SFMessageManager.getStatus(roomId);
            }
        } else {
            MessageForRoom.getRoomInfo((roomInfo) => {
                GlobalGameData.RoomInfo = roomInfo;
                let roomId = roomInfo['room_id'];
                this.eventDispatchFunc();
                GlobalGameData.gameRoomId = roomId;
                if (!this.isReceiveMatchMessage) {
                    SFMessageManager.getStatus(roomId);
                }
                if (GlobalGameData.isCanAutoJoinGame) {
                    GlobalGameData.isCanAutoJoinGame = false;
                    let source = MessageManager.getUrlParameterValue('source');
                    if (source.match('gaming_') || source.match('trending_') || source.match('quickly_match_games')
                        || source.match('suggest_switch_match_') || source.match('channel_popup_') || source.match('popup_chatroom_')) {
                        MessageForRoom.joinRoomGame(2, true);
                    }
                }
            });
        }
    }

    //派发监听;
    eventDispatchFunc() {
        //监听服务器广播;
        MyEvent.I.on('emit_message', (data) => {
            //如果是旧版本，则不接受socket消息;
            if (this.isOldVersion) {
                return;
            }
            let method = data.data.method;
            if (method) {
                switch (method) {
                    //匹配消息派发;
                    case 'sf_matching':
                        this.matchFunc(data.data.data, false, 'matching');
                        break;
                    case 'sf_playing':
                        this.stopTimeOut();
                        let channelId = data.data.channel.id;
                        this.matchFunc(data.data.data, false, 'playing');
                        if (!GlobalGameData.channelId || GlobalGameData.channelId != channelId) {
                            GlobalGameData.channelId = channelId;
                        }
                        if (!this.isChangeScene) {
                            this.isChangeScene = true;
                            //游戏开始了，应该时刻监听服务器消息了;
                            SFMessageManager.isStartContinue = true;
                            SFMessageManager.continueGame(3);
                            let players = data.data.data.players;
                            if (players.red) {
                                this.setRedPlayersData(players.red);
                            } else {
                                this.playerHeadData.red = [];
                            }
                            if (players.blue) {
                                this.setBluePlayersData(players.blue);
                            } else {
                                this.playerHeadData.blue = [];
                            }
                            //设置游戏模式;
                            this.setGameType(data.data.data.players);
                            this.changeScene();
                        }
                        break;
                    case 'emoji_on_mic':        //表情系统;
                        let displayId = data.data.data.user.display_id;
                        let msg = data.data.data.msg;
                        this.setEmojiShow(displayId, msg);
                        break;
                    case 'updateVolumeIndication':
                        this.setPlayerSpeakAction(data.data.speakers);
                        break;
                }
            }
        }, this.node);
        //获取现在的状态;   
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //余额不足;
        MyEvent.I.on('insufficientBalance', this.insufficientBalanceFunc.bind(this), this.node);
        //切换回前台;
        MyEvent.I.on('onAndroidResume', this.onAndroidResumeFunc.bind(this), this.node);
        //取消匹配;
        MyEvent.I.on('exitMatching', this.exitMatchingFunc.bind(this), this.node);
        //没有座位，不能上麦;
        MyEvent.I.on('no_mic', this.noMicFunc.bind(this), this.node);
    }

    //设置玩家的语音播放;
    setPlayerSpeakAction(speakers) {
        let len = speakers.length;
        for (let i = 0; i < len; i++) {
            let uid = speakers[i].uid;
            let volume = speakers[i].volume;
            if (volume <= 0) {
                return;
            }
            if (uid == 0) {
                uid = GlobalGameData.userId;
            }

            let redLen = this.playerHeadData.red.length;
            for (let i = 0; i < redLen; i++) {
                if (this.playerHeadData.red[i] && this.playerHeadData.red[i] == uid && this.redPlayers[i]) {
                    this.redPlayers[i].getComponent('headLogic').setPlayerSpeakType();
                }
            }

            let blueLen = this.playerHeadData.blue.length;
            for (let i = 0; i < blueLen; i++) {
                if (this.playerHeadData.blue[i] && this.playerHeadData.blue[i] == uid && this.bluePlayers[i]) {
                    this.bluePlayers[i].getComponent('headLogic').setPlayerSpeakType();
                }
            }
        }
    }

    onDestroy() {
        MyEvent.I.remove('emit_status', this.node);
        MyEvent.I.remove('insufficientBalance', this.node);
        MyEvent.I.remove('emit_message', this.node);
        MyEvent.I.remove('onAndroidResume', this.node);
        MyEvent.I.remove('exitMatching', this.node);
    }

    setEmojiShow(displayId, msg) {
        let pos: number[] = [0, 0];
        //检测是否在红色阵营；
        for (let i = 0, len = this.playerHeadData.red.length; i < len; i++) {
            if (this.playerHeadData.red[i] == displayId) {
                pos = this.emojiPos[0][i];
                break;
            }
        }
        //说明不再红色阵营,检测是否在蓝色阵营;
        if (pos[0] == 0) {
            for (let i = 0, len = this.playerHeadData.blue.length; i < len; i++) {
                if (this.playerHeadData.blue[i] == displayId) {
                    pos = this.emojiPos[1][i];
                    break;
                }
            }
        }
        if (pos[0] != 0) {
            Message.showEmoji(pos, [96, 96], msg);
        }
    }

    //更新现在的状态;
    updateStatus(event) {
        //如果是旧版本，则不接收socket消息;
        if (this.isOldVersion || this.isReceiveMatchMessage) {
            return;
        }
        let data = event.statusData;
        let keys = Object.keys(data);
        if (keys.length == 0 || data.status == "completed") {
            this.startTimeOut();
            this.joinBtn.active = true;
            if (GlobalGameData.isCanAutoJoinGame) {
                GlobalGameData.isCanAutoJoinGame = false;
                let source = MessageManager.getUrlParameterValue('source');
                if (source.match('gaming_') || source.match('trending_') || source.match('quickly_match_games')
                    || source.match('suggest_switch_match_') || source.match('channel_popup_') || source.match('popup_chatroom_')) {
                    MessageForRoom.joinRoomGame(2, true);
                }
            }
        }
        //如果是匹配状态;
        if (data.status == "matching") {
            this.startTimeOut();
            this.matchFunc(data, true, 'matching');
            if (GlobalGameData.isCanAutoJoinGame) {
                GlobalGameData.isCanAutoJoinGame = false;
                let source = MessageManager.getUrlParameterValue('source');
                if (source.match('gaming_') || source.match('trending_') || source.match('quickly_match_games')
                    || source.match('suggest_switch_match_') || source.match('channel_popup_') || source.match('popup_chatroom_')) {
                    let players = data.players;
                    if (players) {
                        let pRed = players.red;
                        let pBlue = players.blue;
                        let redKeys = Object.keys(pRed);
                        let blueKeys = Object.keys(pBlue);
                        if (redKeys.length < 2 || blueKeys.length < 2 && !this.selfIsJoin) {
                            MessageForRoom.joinRoomGame(2, true);
                        }
                    } else {
                        MessageForRoom.joinRoomGame(2, true);
                    }
                }
            }
        } else if (data.status == "playing") {
            this.matchFunc(data, true, 'playing');
        }
    }

    //收到匹配消息以后;
    matchFunc(data, isUpdate = false, type) {
        this.isReceiveMatchMessage = true;
        this.selfIsJoin = false;
        this.joinNumber = 0;
        let players = data.players;
        let match_duration = data.countdown_duration;
        if (isUpdate) {
            match_duration = data.countdown_duration;
        }
        if (players.red) {
            this.setRedPlayersData(players.red);
        } else {
            this.playerHeadData.red = [];
        }
        if (players.blue) {
            this.setBluePlayersData(players.blue);
        } else {
            this.playerHeadData.blue = [];
        }

        if (players.red && players.blue && this.joinNumber > 1) {
            this.playCountDown(match_duration);
        } else {
            this.stopCountDwon();
        }

        if (type == 'matching') {
            if (!this.selfIsJoin) {
                if (this.joinNumber == 4) {
                    MessageForRoom.takeChangeRoom(true);
                }
            }
        } else if (type == 'playing') {
            if (this.selfIsJoin) {
                MessageForRoom.takeChangeRoom(false);
            } else {
                MessageForRoom.takeChangeRoom(true);
            }
        }

        if (this.isChangeScene) {
            this.joinBtn.active = false;
            this.exitBtn.active = false;
        } else {
            //自己是否已经加入游戏;
            if (this.selfIsJoin) {
                this.joinBtn.active = false;
                this.exitBtn.active = true;

            } else {
                //当游戏人数已经满了4个人，并且我没有加入游戏，则不能在显示加入按钮了;
                if (this.joinNumber == 4) {
                    this.joinBtn.active = false;
                    this.exitBtn.active = false;
                } else {
                    this.joinBtn.active = true;
                    this.exitBtn.active = false;
                }
            }
        }
    }

    //根据匹配情况设置用户头像显示;
    setPlayersHead(players) {
        if (players.red) {
            this.setRedPlayersData(players.red);
        } else {
            this.playerHeadData.red = [];
        }
        if (players.blue) {
            this.setBluePlayersData(players.blue);
        } else {
            this.playerHeadData.blue = [];
        }
    }

    //设置游戏的状态，1v1 还是2v2还是上帝模式；
    setGameType(players) {
        let blueTeam = players.blue;
        let redTeam = players.red;
        let playerNum: number = 0;
        let selfIsJoin: boolean = false;
        for (let i = 0, len = blueTeam.length; i < len; i++) {
            if (blueTeam[i]) {
                let id = blueTeam[i].id;
                playerNum++;
                if (id == GlobalGameData.userId) {
                    selfIsJoin = true;
                }
            }
        }

        for (let i = 0, len = redTeam.length; i < len; i++) {
            if (redTeam[i]) {
                let id = redTeam[i].id;
                playerNum++;
                if (id == GlobalGameData.userId) {
                    selfIsJoin = true;
                }
            }
        }

        if (selfIsJoin) {
            if (playerNum < 4) {
                GlobalGameData.nowGameType = GlobalGameData.gameType.SoloMode;
            } else if (playerNum == 4) {
                GlobalGameData.nowGameType = GlobalGameData.gameType.MultiplayerMode;
            }
        } else {
            if (playerNum < 4) {
                GlobalGameData.nowGameType = GlobalGameData.gameType.GodSoloMode;
            } else if (playerNum == 4) {
                GlobalGameData.nowGameType = GlobalGameData.gameType.GodMultiplayerMode;
            }
        }
    }

    //分享回调；
    share_callback() {
        let shareText: string = 'Come to join this chatroom and play incredible game!' + GlobalGameData.shareUrl;
        let shareUrl = 'http://static.funshareapp.com/atlas_op_common_file/1591264876058231.png';
        MessageManager.shareGameOrImage(shareText, shareUrl, (event) => {
        });
    }

    //加载场景;
    loadScene() {
        cc.director.preloadScene('sf_GameScene', (completedCount, totalCount, item) => {
            // cc.log('加载进度显示');
            let comple = Math.floor(completedCount / totalCount * 100);
            if (comple == 100) {
                GlobalGameData.gameSceneIsLoad = true;
            }
        }, (error) => {
            // //console.log('加载场景Err：'+error);
        });
    }

    //切换场景;
    changeScene() {
        this.joinBtn.active = false;
        this.exitBtn.active = false;
        this.playerHeadData.red = [];
        this.playerHeadData.blue = [];
        let fadeOut = cc.fadeOut(3);
        let func = cc.callFunc(() => {
            cc.director.loadScene("sf_GameScene");
        });
        this.node.runAction(cc.sequence(fadeOut, func));
    }

    //设置红色玩家；
    setRedPlayersData(playersData) {
        for (let i = 0; i < 2; i++) {
            if (playersData[i]) {
                this.redPlayers[i].off(cc.Node.EventType.TOUCH_START);
                this.joinNumber++;
                let avatar = playersData[i].avatar;
                let playerId = playersData[i].id;
                if (playerId == GlobalGameData.userId) {
                    GlobalGameData.userCamp = 'red';
                    this.selfIsJoin = true;
                    this.showSelfAciton(this.redPlayers[i]);
                } else {
                    this.hideSelfAction(this.redPlayers[i]);
                }
                this.redPlayers[i].on(cc.Node.EventType.TOUCH_START, () => {
                    MessageManager.showPlayerInfo(playerId);
                }, this);
                if (this.playerHeadData.red[i] == playerId) {
                    continue;
                }
                this.playerHeadData.red[i] = playerId;
                let head = this.redPlayers[i].getChildByName('headMask').getChildByName('head');
                head.getComponent(cc.Sprite).spriteFrame = this.headShowSpriteFrame;
                head.scaleX = 96 / head.width;
                head.scaleY = 96 / head.height;
                ResourcesManager.loadHeadImag(avatar, playerId, 2, (headSpriteFrame, userid) => {
                    if (userid != this.playerHeadData.red[i]) {
                        return;
                    }
                    let head = this.redPlayers[i].getChildByName('headMask').getChildByName('head');
                    if (headSpriteFrame) {
                        head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(headSpriteFrame);
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                    }
                });

                if (playerId == GlobalGameData.userId) {
                    this.redPlayers[i].getChildByName('follow').active = false;
                    this.redPlayers[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                    this.redPlayers[i].getChildByName('followAction').active = false;
                } else {
                    let follow = this.redPlayers[i].getChildByName('follow');
                    let followAction = this.redPlayers[i].getChildByName('followAction');
                    follow.active = false;
                    if (GlobalGameData.followedObj[playerId] == undefined) {
                        MessageForRoom.isFollowedPlayer(playerId, (pid, flag) => {
                            if (this.node && this.node.active && pid == this.playerHeadData.red[i]) {
                                follow.active = true;
                                if (flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                    this.redPlayers[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                                    this.redPlayers[i].getChildByName('followAction').active = false;
                                } else {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                                    follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                                        event.stopPropagation();
                                        MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                                            if (this.node && this.node.active) {
                                                if (playerId == uid && flag) {
                                                    GlobalGameData.setChangeSpriteFrameAction(follow, followAction);
                                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                                    follow.off(cc.Node.EventType.TOUCH_START);
                                                }
                                            }
                                        });
                                    }, this);
                                }
                            }
                        });
                    } else if (GlobalGameData.followedObj[playerId] == false) {
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                        follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                            event.stopPropagation();
                            MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                                if (this.node && this.node.active) {
                                    if (playerId == uid && flag) {
                                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                        follow.off(cc.Node.EventType.TOUCH_START);
                                        GlobalGameData.setChangeSpriteFrameAction(follow, followAction);
                                    }
                                }
                            });
                        }, this);
                    } else if (GlobalGameData.followedObj[playerId]) {
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                        follow.off(cc.Node.EventType.TOUCH_START);
                        followAction.active = false;
                    }
                }
            } else {
                let follow = this.redPlayers[i].getChildByName('follow');
                follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                follow.active = false;
                this.hideSelfAction(this.redPlayers[i]);
                this.playerHeadData.red[i] = null;
                let head = this.redPlayers[i].getChildByName('headMask').getChildByName('head');
                head.getComponent(cc.Sprite).spriteFrame = this.headSpriteFrame;
                head.scaleX = 96 / head.width;
                head.scaleY = 96 / head.height;
                this.redPlayers[i].off(cc.Node.EventType.TOUCH_START);
            }
        }
    }

    //设置蓝色玩家；
    setBluePlayersData(playersData) {
        for (let i = 0; i < 2; i++) {
            if (playersData[i]) {
                this.bluePlayers[i].off(cc.Node.EventType.TOUCH_START);
                this.joinNumber++;
                let avatar = playersData[i].avatar;
                let playerId = playersData[i].id;
                if (playerId == GlobalGameData.userId) {
                    GlobalGameData.userCamp = 'blue';
                    this.selfIsJoin = true;
                    this.showSelfAciton(this.bluePlayers[i]);
                } else {
                    this.hideSelfAction(this.bluePlayers[i]);
                }
                this.bluePlayers[i].on(cc.Node.EventType.TOUCH_START, () => {
                    MessageManager.showPlayerInfo(playerId);
                }, this);
                if (this.playerHeadData.blue[i] == playerId) {
                    continue;
                }
                this.playerHeadData.blue[i] = playerId;
                let head = this.bluePlayers[i].getChildByName('headMask').getChildByName('head');
                head.getComponent(cc.Sprite).spriteFrame = this.headShowSpriteFrame;
                head.scaleX = 96 / head.width;
                head.scaleY = 96 / head.height;
                ResourcesManager.loadHeadImag(avatar, playerId, 2, (headSpriteFrame, userid) => {
                    if (userid != this.playerHeadData.blue[i]) {
                        return;
                    }
                    if (headSpriteFrame) {
                        head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(headSpriteFrame);
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                    }
                });
                if (playerId == GlobalGameData.userId) {
                    this.bluePlayers[i].getChildByName('follow').active = false;
                    this.bluePlayers[i].getChildByName('follow').off(cc.Node.EventType.TOUCH_START);
                    this.bluePlayers[i].getChildByName('followAction').active = false;
                } else {
                    let follow = this.bluePlayers[i].getChildByName('follow');
                    let followAction = this.bluePlayers[i].getChildByName('followAction');
                    follow.active = false;
                    if (GlobalGameData.followedObj[playerId] == undefined) {
                        MessageForRoom.isFollowedPlayer(playerId, (pid, flag) => {
                            if (this.node && this.node.active && pid == this.playerHeadData.blue[i]) {
                                follow.active = true;
                                if (flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                    follow.off(cc.Node.EventType.TOUCH_START);
                                    followAction.active = false;
                                } else {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                                    follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                                        event.stopPropagation();
                                        MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                                            if (this.node && this.node.active) {
                                                if (playerId == uid && flag) {
                                                    GlobalGameData.setChangeSpriteFrameAction(follow, followAction);
                                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                                    follow.off(cc.Node.EventType.TOUCH_START);
                                                }
                                            }
                                        });
                                    }, this);
                                }
                            }
                        });
                    } else if (GlobalGameData.followedObj[playerId] == false) {
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                        follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                            event.stopPropagation();
                            MessageForRoom.followedPlayer(playerId, (uid, flag: boolean) => {
                                if (this.node && this.node.active) {
                                    if (playerId == uid && flag) {
                                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                        follow.off(cc.Node.EventType.TOUCH_START);
                                        GlobalGameData.setChangeSpriteFrameAction(follow, followAction);
                                    }
                                }
                            });
                        }, this);
                    } else if (GlobalGameData.followedObj[playerId]) {
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                        follow.off(cc.Node.EventType.TOUCH_START);
                        followAction.active = false;
                    }
                }
            } else {
                let follow = this.bluePlayers[i].getChildByName('follow');
                follow.getComponent(cc.Sprite).spriteFrame = this.follow;
                follow.active = false;
                this.hideSelfAction(this.bluePlayers[i]);
                this.playerHeadData.blue[i] = null;
                let head = this.bluePlayers[i].getChildByName('headMask').getChildByName('head');
                head.getComponent(cc.Sprite).spriteFrame = this.headSpriteFrame;
                head.scaleX = 96 / head.width;
                head.scaleY = 96 / head.height;
                this.bluePlayers[i].off(cc.Node.EventType.TOUCH_START);
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
    }

    hideSelfAction(node: cc.Node) {
        let actionNode = node.getChildByName('actionNode');
        let icon_me = node.getChildByName('icon_me');
        icon_me.active = false;
        actionNode.active = false;
        actionNode.stopAllActions();
    }

    //开始倒计时;
    playCountDown(match_duration) {
        this.stopTimeOut();
        this.match_time = match_duration;
        if (this.match_time > 0) {
            this.isCountTime = true;
            this.countDown.active = true;
            this.match_time = match_duration;
            this.isUpdata = true;
        } else {
            this.isUpdata = false;
        }
    }

    //停止倒计时;
    stopCountDwon() {
        this.startTimeOut();
        this.isCountTime = false;
        this.countDown.active = false;
        this.isUpdata = false;
        this.countDown.active = false;
    }

    //加入按钮回调;
    join_callback() {
        MessageForRoom.joinRoomGame(2, true);
    }

    //退出按钮回调；
    exit_callback() {
        // MessageManager.exitJoinGame();
        let exitMatchingPrefab = cc.instantiate(this.exitMatchingPrefab);
        this.node.addChild(exitMatchingPrefab);
    }

    //添加规则页面;
    addRuleNode() {
        let node = cc.instantiate(this.rulePrefab);
        this.node.addChild(node);
    }

    //余额不足的界面;
    insufficientBalanceFunc() {
        let pNode = cc.instantiate(this.depositPrefab);
        this.node.addChild(pNode);
    }

    //显示排行榜；
    showRanking_callback() {
        NDB.openWebView('http://a.fslk.co/activity4/togo_game_leader_board/index.html?type=sheep');
    }

    //商城回调;
    store_callback() {
        let node = cc.instantiate(this.storePrefab);
        this.node.addChild(node);
    }

    //充值金币按钮；
    rechargeCoin_callback() {
        MessageManager.buyGameCion();
    }

    //切换回前台;
    onAndroidResumeFunc() {
        this.getGameCoin();
    }

    //10S倒计时；
    startTimeOut() {
        this.stopTimeOut();
        this.timeOutNum = window.setTimeout(() => {
            if (this.node && this.node.active) {
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

    //没有麦味了;
    noMicFunc() {
        let node = cc.instantiate(this.popLayer);
        this.node.addChild(node);
    }

    exitMatchingFunc() {
        MessageForRoom.exitRoomGame();
    }

    update(dt) {
        if (this.isUpdata) {
            this.countLabel.string = String(this.match_time);
            this.GlobalGameDataDT += dt;
            if (this.GlobalGameDataDT >= 1) {
                this.GlobalGameDataDT = 0;
                if (MessageSoundManager.audioEngineOn) {
                    cc.audioEngine.playEffect(this.readyAudio, false);
                }
                this.match_time--;
                this.countLabel.string = String(this.match_time);
                if (this.match_time == 0) {
                    // this.stopCountDwon();
                    this.isUpdata = false;
                    //console.log('切换场景');
                }
            }
        }
    }
}
