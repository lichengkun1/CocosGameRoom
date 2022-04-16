
enum Dominoe_POSTYPE {
    NONE = 'none',
    LEFT = 'left',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFTTOP = 'leftTop',
    TOPRIGHT = 'topRight',
    RIGHTTOP = 'rightTop',
    TOPLEFT = 'topLeft',
    RIGHTBOTTOM = 'rightBottom',
    BOTTOMLEFT = 'bottomLeft',
    LEFTBOTTOM = 'leftBottom',
    BOTTOMRIGHT = 'bottomRight'
}

const leftposArr = [Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT,
Dominoe_POSTYPE.LEFTTOP, Dominoe_POSTYPE.TOP,
Dominoe_POSTYPE.TOPRIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT,
Dominoe_POSTYPE.RIGHTTOP, Dominoe_POSTYPE.TOP,
Dominoe_POSTYPE.TOPLEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT,
Dominoe_POSTYPE.LEFTTOP, Dominoe_POSTYPE.TOP,
Dominoe_POSTYPE.TOPRIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT
];

const rightposArr = [Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT,
Dominoe_POSTYPE.RIGHTBOTTOM, Dominoe_POSTYPE.BOTTOM,
Dominoe_POSTYPE.BOTTOMLEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT,
Dominoe_POSTYPE.LEFTBOTTOM, Dominoe_POSTYPE.BOTTOM,
Dominoe_POSTYPE.BOTTOMRIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT, Dominoe_POSTYPE.RIGHT,
Dominoe_POSTYPE.RIGHTBOTTOM, Dominoe_POSTYPE.BOTTOM,
Dominoe_POSTYPE.BOTTOMLEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT, Dominoe_POSTYPE.LEFT];

import { globalAgent } from 'http';
import { GameConfig } from '../../../gameConfig';

import PlayerModel from '../../../ludo/script/models/player';
import BgmSettings from '../../../roomCommon/CommonScripts/bgmSettings';
import Message from '../../../roomCommon/CommonScripts/Utils/Message';
import MessageData, { GameType } from '../../../roomCommon/CommonScripts/Utils/MessageData';
import MessageForRoom from '../../../roomCommon/CommonScripts/Utils/MessageForRoom';
import MessageManager from '../../../roomCommon/CommonScripts/Utils/MessageManager';
import MessageSoundManager from '../../../roomCommon/CommonScripts/Utils/MessageSoundManager';
import MessageType from '../../../roomCommon/CommonScripts/Utils/MessageType';
import MyEvent from '../../../roomCommon/CommonScripts/Utils/MyEvent';
import NDB from '../../../roomCommon/CommonScripts/Utils/NDBTS';
import { GameStatusModel, PlayerInfoModel } from '../models/gameStatusModel';
import RankComp from '../rank/rankComp';
import { PockerObj } from '../rank/rankItem';
import { mockRankData } from '../testRank';
import Global, { GameModeDominoe } from '../Utils/Dominoe_GlobalGameData';
import Dominoe_ExitPopup from './Dominoe_ExitPopup';
import Dominoe_paiLayerLogic from './Dominoe_paiLayerLogic';
import Dominoe_paiLogic from './Dominoe_paiLogic';
import Dominoe_playerLogic from './Dominoe_playerLogic';
import Dominoe_settingLayerLogic from './Dominoe_settingLayerLogic';

import showPointPockerLogic from './showPointPockerLogic';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_gameLogic extends cc.Component {

    /** 牌的预制体 */
    @property(cc.Prefab)
    pai: cc.Prefab = null;

    /** 玩家显示层 */
    @property(cc.Node)
    playerLayer: cc.Node = null;

    @property(cc.Node)
    paiLayer: cc.Node = null;

    /** 做多4个玩家所有的节点数组 */
    @property(cc.Node)
    players: cc.Node[] = [];

    /** 结算层预制件 */
    @property(cc.Prefab)
    settingLayer: cc.Prefab = null;

    @property({ type: cc.AudioClip })
    playPockerAudio: cc.AudioClip = null;

    /** 加载动画骨骼节点 */
    @property(cc.Node)
    loadingNode: cc.Node = null;

    @property({ type: cc.AudioClip })
    getPockerAudio: cc.AudioClip = null;

    /** 单张牌的图片 */
    @property(cc.SpriteFrame)
    paiSurplus: cc.SpriteFrame = null;

    /** 不够200游戏币弹窗 */
    @property(cc.Prefab)
    popPrefab: cc.Prefab = null;

    /** 切换出牌人时候那个特效粒子 */
    @property(cc.Node)
    guanglu: cc.Node = null;

    /** 胜利节点 */
    @property(cc.Node)
    winNode: cc.Node = null;

    /** 胜利彩带 */
    @property(cc.Node)
    caidai: cc.Node = null;

    @property({ type: cc.AudioClip })
    victoryAudio: cc.AudioClip = null;

    /** 上帝模式背景图 */
    @property(cc.SpriteFrame)
    gameBGGod: cc.SpriteFrame = null;
    /** 正常背景图 */
    @property(cc.Node)
    gameBG: cc.Node = null;

    /** 最上面发牌时候显示的牌数 */
    @property(cc.Label)
    paiStackLabel: cc.Label = null;

    @property(cc.Node)
    pointLayer: cc.Node = null;

    @property(cc.JsonAsset)                                 //emoji表情映射json；
    emojiJson: cc.JsonAsset = null;

    @property(cc.Node)
    emojiNode: cc.Node = null;

    /** 最底下展示的每一点数牌剩余的个数 */
    @property(cc.Node)
    showPointCount: cc.Node[] = [];

    /** 显示所有包含该点的卡牌 */
    @property(cc.Node)
    showPointPocker: cc.Node = null;

    /** 退出游戏弹框 */
    @property(Dominoe_ExitPopup)
    exitPopup: Dominoe_ExitPopup = null;

    @property(cc.Node)
    iconRobot: cc.Node = null;

    /** 游戏规则节点 */
    @property(cc.Node)
    RuleLogic: cc.Node = null;

    /** 一小局排名组件预制体 */
    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    /** 游戏模式label */
    @property(cc.Label)
    modelLabel: cc.Label = null;

    @property(cc.Node)
    oneRoundRuleNode: cc.Node = null;
    @property(cc.Node)
    scoreRuleNode: cc.Node = null;

    /** 扑克区域空间 */
    @property(cc.Node)
    pokerRanger: cc.Node = null;

    @property({
        type: cc.AudioClip
    })
    gameAudio: cc.AudioClip = null;

    private midPai: cc.Node = null;                          //中间牌；
    private leftPaiArr: cc.Node[] = [];                      //坐标牌；
    private rightPaiArr: cc.Node[] = [];                     //右边牌；

    private allPai: cc.Node[] = [];                          //所有的牌;
    private myPai: cc.Node[] = [];                           //自己手里的牌;
    private scaleNum: number = 0.75;                          //拍桌上牌的缩放值;
    private userDataMap = {};

    private leftNums: number[][] = [];                       //左边数组队列;
    private rightNums: number[][] = [];                      //右边数组队列；
    private myNums: number[][] = [];                          //自己手里的牌;   

    // private lewatBtn: cc.Node = null;
    private nowShowCountPlayer = null;                       //当前显示倒计时的玩家;
    private settleLayer: cc.Node = null;                     //结算界面;
    private selfPlayPocker: cc.Node = null;                  //自己打出的牌;
    private isReceiverMessage: boolean = true;                //是否接收消息;
    private midPaiY: number = 45;                             //中间牌的坐标;
    private isShowPopLayer: boolean = false;                  //是否已经显示过了，系统3次弹窗;
    private loadingTimeCount: number = -1;                    //显示loading的倒计时;  
    
    private roundIndex: number = 1;

    // channel.id
    private gameId: number = 0;

    private bgmNode: cc.Node = null;
    private bgmOnNode: cc.Node = null;
    private bgmOffNode: cc.Node = null;

    /** 最后自己操作来出的牌（而不是机器人或者代打） */
    private lastSelfPlayerPockerPoints: number[] = [];

    // 每个玩家的分数map
    public playerScoreMap: {[key: string]: number} = {
        
    };

    private bgmId: number = -1;

    onLoad(): void {

        if(MessageSoundManager.audioEngineOn) {
            cc.audioEngine.stopMusic();
            this.bgmId = MessageSoundManager.playBgm(this.gameAudio);
        }

        const bgmNode = cc.find("Canvas/bgm");
        const bgmComp = bgmNode.getComponent(BgmSettings);
        let self = this;    
        bgmComp.updateMusic = function() {
            if(MessageSoundManager.audioEngineOn) {
                if(self.bgmId === -1) {
                    console.log('播放音频');
                    cc.audioEngine.stopMusic();
                    self.bgmId = cc.audioEngine.playMusic(self.gameAudio,true);
                } else {
                    MessageSoundManager.resumeMusic();
                }
                bgmComp.bgmOnActive(true);
                bgmComp.bgmOffActive(false);
            } else {
                console.log('播放音频');
                bgmComp.bgmOnActive(false);
                bgmComp.bgmOffActive(true);
                MessageSoundManager.updateMusic();
            }
        }
    }

    start() {
        this.init();
        Global.setpocker_object();
        this.initShowUI();
        this.gameStartEvent();
        this.joinError();

        let vcode = MessageManager.getUrlParameterValue('vcode');
        const bgDominoe = cc.find("Canvas/bg_dominoe");

        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'dominoe') {
            bgDominoe.active = true;
        }

        this.drawingDebugPokerRange();
    }

    private drawingDebugPokerRange(): void {
        if(CC_DEBUG) {
            if(!this.pokerRanger) return;
            
            const penNode = new cc.Node();
            this.pokerRanger.addChild(penNode);
            const pen: cc.Graphics = penNode.addComponent(cc.Graphics);
            pen.lineWidth = 6;
            pen.strokeColor = new cc.Color().fromHEX('#ffaa33');
            const box: cc.Rect = this.pokerRanger.getBoundingBox();
            pen.rect(box.x,box.y,box.width,box.height);
            pen.stroke();
        }
    }

    private joinError() {
        MyEvent.I.on("joinErrMessage", (data) => {
            if (data && data.err_code == 90020) {
                let exitPopup = cc.find("Canvas/exitPopup").getComponent(Dominoe_ExitPopup);
                exitPopup.node.active = true;
                exitPopup.show(false);
            }
        }, this.node);
    }

    init() {
        Global.isCanAutoJoinGame = false;
        // MessageSoundManager.playBGEngine('GamesRes/sound/gameBGM');
        // this.lewatBtn = this.playerLayer.getChildByName('lewatBtn');
        this._initModeLabel();
        // MessageForRoom.getStatus(Global.gameRoomId);
    }

    /**
     * 初始化游戏模式
     * @returns void
     */
    private _initModeLabel(): void {
        const modelLabelNode = cc.find('Canvas/model_bg/modelLabel');
        modelLabelNode.getComponent(cc.Label).string = Global.gameMode === GameModeDominoe.ROUND ? MessageData.langDominoe.one_round ? MessageData.langDominoe.one_round : 'ONE ROUND' : MessageData.langDominoe.score_100 ? MessageData.langDominoe.score_100 : "SCORE 100";
        const modelBgNode = cc.find('Canvas/model_bg');
        this.scheduleOnce(() => {
            // 设置背景长度
            modelLabelNode.width = modelLabelNode.width + 10;
        },0.01);
    }
    /** 游戏打点 */
    gameStartEvent() {
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
        let obj = {
            eventName: "game_start",
            name: `${GameConfig.gameName}${gameType}`,
            bets: 'game',
            type: `${GameConfig.gameName}${gameType}`
        }
        NDB.sendAutoJoinEvent(obj);
    }

    initShowUI(execPlayingMessage: boolean = true) {
        let message = MessageManager.getLastMessage();
        message = message.players ? message : message.data;
        let players = message.players;
        if (!players) {
            players = message.data.data.players;
        }
        if (Global.isGodModel) {
            this.initGodModelUI(players);
        } else {
            this.paiLayer.getChildByName('boom').active = true;
            this.initPlayerModelUI(message);
        }
        if(execPlayingMessage) {
            this.addMKEventDispatch();
        }
        let poker_played = message.poker_played;
        if (!poker_played) {
            poker_played = message.data.data.poker_played;
        }

        let messageData = null;
        if (message.data) {
            messageData = message.data.data;
        } else {
            messageData = message;
        }
        if(execPlayingMessage) {
            this.scheduleOnce(() => {
                this.playingMessage(messageData);
            }, 0.2);
        }
    }

    //初始化上帝模式的UI;
    initGodModelUI(players) {
        this.gameBG.getComponent(cc.Sprite).spriteFrame = this.gameBGGod;
        let plyerKeys = Object.keys(players);
        let addNum: number = 0;
        for (let i = 0, len = plyerKeys.length; i < len; i++) {
            let key = plyerKeys[i];
            if (players[key]) {
                let player = this.players[i + addNum];
                player.active = true;
                const playerComp = player.getComponent(Dominoe_playerLogic);

                playerComp.gameLogic = this;
                playerComp.initPlayer(players[key]);
                let playerid = players[key].id;
                this.userDataMap[playerid] = {};
                this.userDataMap[playerid]['key'] = key;
                this.userDataMap[playerid]['player'] = player;
            }
            if (len == 2) {
                addNum = 1;
            }
        }
        this.players[0].x = 0;
    }

    //初始化玩家模式游戏模式;
    initPlayerModelUI(message: GameStatusModel) {
        MessageData.isCanSendEmoji = true;
        let players = message.players;
        this.paiLayer.getChildByName('boom').active = true;
        //自己所在座位;
        let selfIndex = 0;
        let newPlayers = {};
        let keys = Object.keys(players);
        for (let i = 0; i < 4; i++) {
            let key = keys[i];
            if (players[key]) {
                newPlayers[key] = players[key];
                let playerid = players[key].id;
                this.userDataMap[playerid] = {};
                this.userDataMap[playerid]['key'] = key;
                this.userDataMap[playerid]['info'] = players[key];
                if (playerid == Global.userId) {
                    selfIndex = i;
                }
            }
        }

        keys = Object.keys(newPlayers);
        for (let i = 0; i < selfIndex; i++) {
            let key = keys.shift();
            keys.push(key);
        }
        let addNum: number = 0;
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let number: number = i + addNum;
            let player = this.players[number];
            if (players[key]) {
                player.active = true;
                const playerComp = player.getComponent(Dominoe_playerLogic);
                playerComp.gameLogic = this;
                playerComp.initPlayer(players[key]);

                let playerid = players[key].id;
                this.userDataMap[playerid]['player'] = player;
                this.userDataMap[playerid]['info'] = players[key] as PlayerInfoModel;
            }
            if (len == 2) {
                addNum = 1;
            }
        }
        // this.scheduleOnce(() => {
            
        // }, 0.15)
        this.initMyPai(message.player_current.user_id);

        // this.players[0].getChildByName('lewatBG').x = 0;
    }

    //初始化自己的牌;
    initMyPai(player_current_user_id) {
        let info = this.userDataMap[Global.userId].info as PlayerInfoModel;
        //剩余的牌;
        let poker_remain_list = info.poker_remain_list;
        if (!poker_remain_list) {
            return;
        }
        let numsArr: number[][] = [];
        for (let i = 0, len = poker_remain_list.length; i < len; i++) {
            numsArr.push(poker_remain_list[i].nums);
        }
        let numsLen = numsArr.length;
        let myNumsLen = this.myNums.length;

        for (let i = 0; i < numsLen; i++) {
            if (!this.myNums[i] || this.myNums[i][0] != numsArr[i][0] || this.myNums[i][1] != numsArr[i][1]) {
                this.myNums[i] = numsArr[i];
                if (this.myPai[i]) {
                    this.myPai[i].getComponent(Dominoe_paiLogic).setPaiShow(numsArr[i]);
                } else {
                    let pai = this.addPaiNode(this.myNums[i]);
                    pai.name = 'selfPoker';
                    this.paiLayer.addChild(pai);
                    this.myPai[i] = pai;
                }
            }
            this.myPai[i].getComponent(Dominoe_paiLogic).key = poker_remain_list[i].Key;
            this.myPai[i].getComponent(Dominoe_paiLogic).isCanTouch = false;
        }

        if (myNumsLen > numsLen) {
            for (let i = numsLen; i < myNumsLen; i++) {
                if (this.myPai[i]) {
                    this.myPai[i].destroy();
                    this.myPai[i] = null;
                }
            }
            this.myNums.length = numsLen;
            this.myPai.length = numsLen;
        }

        let scaleNum: number = 0;
        let spacingX: number = 0;
        if (numsLen < 8) {
            spacingX = 80;
            scaleNum = 1;
        } else if (numsLen == 8) {
            spacingX = 70;
            scaleNum = 1;
        } else if (numsLen > 8 && numsLen < 11) {
            spacingX = 60;
            scaleNum = 0.9;
        } else if (numsLen > 10 && numsLen < 12) {
            spacingX = 50;
            scaleNum = 0.8;
        } else if (numsLen >= 12) {
            spacingX = 40;
            scaleNum = 0.6;
        }
        for (let i = 0; i < numsLen; i++) {
            this.myPai[i].x = -173 + spacingX * i;
            this.myPai[i].y = -this.paiLayer.height / 2 + 150// -320;
            this.myPai[i].scale = scaleNum;
            this.myPai[i].getComponent(Dominoe_paiLogic).setStartPos(cc.v2(-173 + spacingX * i, -this.paiLayer.height / 2 + 150));
        }

        //获取当前操作人id;
        if (player_current_user_id == Global.userId) {
            // 抽取到的牌;
            let pick_out_poker_list = info.pick_out_poker_list;
            let outLen = pick_out_poker_list.length;
            if (outLen > 0) {
                //找出抓到的牌 是那些手牌;
                let outNumsArr: number[][] = [];
                // 需要直接打掉的牌
                let outPai: cc.Node[] = [];
                for (let i = 0, len = pick_out_poker_list.length; i < len; i++) {
                    let outNums = pick_out_poker_list[i].nums;
                    outNumsArr.push(outNums);
                    for (let j = 0; j < numsLen; j++) {
                        if (outNums[0] == numsArr[j][0] && outNums[1] == numsArr[j][1]) {
                            // 抓到的牌跟手里的牌对比如果一样说明牌已经在手里了但是只是没有显示而已需要一个发牌的动画，发完之后显示出来
                            outPai.push(this.myPai[j]);
                        }
                    }
                }
                this.playOutPocker(outPai, scaleNum);
            }
        }
    }

    /**
     * 自己发牌的效果
     * @param  {cc.Node[]} pockerArr 需要直接出的牌
     * @param  {number} scaleNum 牌的缩放值
     */
    playOutPocker(pockerArr: cc.Node[], scaleNum: number) {
        let len = pockerArr.length;
        for (let i = 0; i < len; i++) {
            pockerArr[i].active = false;
        }

        let prmArr = [];
        for (let i = 0; i < len; i++) {
            let promise = () => {
                return new Promise((resolve, reject) => {
                    pockerArr[i].active = true;
                    let movePos = cc.v2(pockerArr[i].x, pockerArr[i].y);
                    pockerArr[i].x = -304;
                    pockerArr[i].y = this.paiLayer.height / 2 - 100;
                    pockerArr[i].scale = 1;
                    let move = cc.moveTo(0.3, movePos);
                    let scaT = cc.scaleTo(0.3, scaleNum);
                    let call = cc.callFunc(() => {
                        MessageSoundManager.playLoadEffect(this.getPockerAudio);
                        resolve(null);
                    });
                    pockerArr[i].runAction(cc.sequence(cc.spawn(move, scaT), call));
                });
            }
            prmArr.push(promise);
        }
        Global.runPromiseArray(prmArr);
    }

    addMKEventDispatch() {
        console.log('注册事件');
        if(Global.isGameEnd) {
            // 游戏结束了直接回到大厅
            // this.goHallScene();
        }
        //自己的牌被点击了;
        MyEvent.I.on('paiTouchStart', this.paiTouchStart.bind(this), this.node);
        //自己的牌被放下;
        MyEvent.I.on('paiTouchEnd', this.paiTouchEnd.bind(this), this.node);
        //监听服务器给的消息;
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //切换会前台；
        MyEvent.I.on('onAndroidResume', this.onAndroidResume.bind(this), this.node);
        //切换到后台事件;
        MyEvent.I.on('onAndroidStop', this.onAndroidStop.bind(this), this.node);
        //当前房间状态；
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //取消点击事件;
        MyEvent.I.on('cancelTouch', this.cancelTouch.bind(this), this.node);

        MyEvent.I.on('showPoint_start', this.showPoint_start.bind(this), this.node);

        MyEvent.I.on('showPoint_end', this.showPoint_end.bind(this), this.node);

        MyEvent.I.on('replayMusic',this.replayMusic.bind(this),this.node);
    }

    replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && MessageSoundManager.audioEngineOn) {
            console.log('replaymusic');
            MessageSoundManager.pauseMusic();
            MessageSoundManager.resumeMusic();
        }
    }

    //消息分发处理；
    messageFunc(mData) {
        let method = mData.data.method;
        if (method == 'dominoe_playing') {                                  //游戏进行;
            MessageData.gameSource_Id = mData.data.data.source_id;
            this.playingMessage(mData.data.data);
        } else if (method == 'dominoe_completed') {                         //游戏结束;
            console.log('游戏结束');
            this.showSettingData(mData.data.data);
        } else if (method == 'emoji_on_mic') {                              //表情;
            let displayId = mData.data.data.user.display_id;
            let msg = mData.data.data.msg;
            let name = mData.data.data.emoji_name;
            if(!msg) {
                const emojiObjs = Object.values(this.emojiJson.json) as {name: string,image: string,svga: string,svga_o: string}[];
                msg = emojiObjs.find(item => item.name === name).svga;

            }
            // if (this.settleLayer) {
            //     // this.settleLayer.getComponent(settingLayerLogic).setEmojiShow(displayId, msg);
            // } else {
            this.setEmojiShow(displayId, msg);
            // }
        } else if (method == 'response_ws_status') {                        //网络波动;
            this.request_ws_status(mData);
        } else if (method == 'updateVolumeIndication') {
            this.setPlayerSpeakAction(mData.data.speakers);
        }
    }

    //设置玩家的语音播放;
    setPlayerSpeakAction(speakers) {
        let len = speakers.length;
        for (let i = 0; i < len; i++) {
            let uid = speakers[i].uid;
            let volume = speakers[i].volume;
            if (uid == 0) { uid = Global.userId }
            if (this.userDataMap[uid] && volume > 0) {
                this.userDataMap[uid].player.getComponent(Dominoe_playerLogic).setPlayerSpeakType();
            }
        }
    }

    // 游戏消息处理;
    playingMessage(messageData: GameStatusModel) {
        if(messageData.action === 'reset') {
            this.scheduleOnce(() => {
                let players = messageData.players;
                let playerKeys = Object.keys(players);

                const dynamicAddedNodes = this.paiLayer.children.filter(item => item.name !== 'boom' && item.name !== 'Selected');
                dynamicAddedNodes.forEach((item) => {
                    item.destroy();
                    item = null;
                });
                this.resetData();
                for (let i = 0, len = playerKeys.length; i < len; i++) {
                    let key = playerKeys[i];
                    let id = players[key].id;
                    
                    this.playerScoreMap[id] = players[key].total_score;
                }
                this.showRoundRank(messageData.rounds,Object.values(messageData.players));
            },2);
            
            return;
        }
        if(messageData.action === 'start') {
            Global.setpocker_object();
            const dynamicAddedNodes = this.paiLayer.children.filter(item => item.name !== 'boom' && item.name !== 'Selected');
            dynamicAddedNodes.forEach((item) => {
                item.destroy();
                item = null;
            });
            this.resetData();
            this.initShowUI(false);
        }
        if (!this.isReceiverMessage) {
            return;
        }
        this.stopAllPaiAction();
        if (!Global.isGodModel) {
            this.getShowingpocker(messageData);
            // 非上帝模式;
            let selfKey = this.userDataMap[Global.userId].key;
            let info = messageData.players[selfKey];
            let system_paly_count = info.system_paly_count;
            if (system_paly_count >= 3 && !this.isShowPopLayer) {
                this.isShowPopLayer = true;
                // let pop = cc.instantiate(this.popPrefab);
                // this.node.addChild(pop);
            }
        } else {
            cc.find("Canvas/showPointNode").active = false;
        }

        this.paiLayer.getComponent(Dominoe_paiLayerLogic).hideAllSelectNode();
        Global.isTouchPocker = false;
        // this.loadingNode.active = false;
        this.hideLoading();
        Global.isCanSendPocker = false;
        // 初始化拍桌上面的牌;
        this.initPocker(messageData.poker_played);

        let player_current = messageData.player_current;
        let player_id = player_current.user_id;
        let playerInfo = this.userDataMap[player_id];
        let countdown_duration = player_current.countdown_duration;


        //牌堆里面的牌;
        let poker_remain_count = messageData.poker_remain_count;

        if (poker_remain_count > 0) {
            this.paiStackLabel.node.active = true;
            cc.find("Canvas/paiStack").active = true;
            this.paiStackLabel.string = poker_remain_count as string;
        } else {
            this.paiStackLabel.node.active = false;
            cc.find('Canvas/paiStack').active = false;
        }
        if (playerInfo) {
            //闹钟的倒计时;
            if (Number(countdown_duration) > 0) {
                //隐藏上一个闹钟;
                if (this.nowShowCountPlayer) {
                    this.nowShowCountPlayer.player.getComponent(Dominoe_playerLogic).stopCountDown();
                }
                playerInfo.player.getComponent(Dominoe_playerLogic).playCountDown(Number(countdown_duration));
            }
            this.nowShowCountPlayer = playerInfo;

            if (player_id != 0 && player_id != Global.userId) {
                let is_pick_out = player_current.is_pick_out;
                if (is_pick_out) {
                    this.userDataMap[player_id].player.getComponent(Dominoe_playerLogic).showlewat('draw');
                }
            }
        }

        let players = messageData.players;
        let playerKeys = Object.keys(players);
        for (let i = 0, len = playerKeys.length; i < len; i++) {
            let key = playerKeys[i];
            let id = players[key].id;
            let playerPoker_remain_count = players[key].poker_remain_count;
            let player = this.userDataMap[id].player;
            let status = players[key].status;
            if (id == MessageData.userId) {
                if (players[key].is_agent == true) {
                    this.iconRobot.active = true;
                } else {
                    this.iconRobot.active = false;
                }
            }
            const playerLogicComp: Dominoe_playerLogic = player.getComponent(Dominoe_playerLogic) as Dominoe_playerLogic;

            playerLogicComp.setPaiCount(Number(playerPoker_remain_count));
            playerLogicComp.setplayerStatus(this.exitPopup, status);
            /** 重新设置玩家的状态 */
            playerLogicComp.setPlayerStatus(players[key].status);
            // 更新每个玩家的分数信息
            this.playerScoreMap[id] = players[key].total_score;
            /** 断线重连需要恢复玩家分数 */
            playerLogicComp.updateScoreWithUpdateStatus(players[key].total_score);
        }

        //上一个出牌人;
        let player_last = messageData.player_last;
        let action = messageData.action;
        if (player_last && action != 'leave') {
            //出牌的检测;
            let played = player_last.poker_played_one;
            let user_id = played.user_id;
            let SystemPlay = played.system_play;
            let poker = played.poker;

            if (user_id != 0) {
                //如果上一个牌是自己出的，并且是系统出牌的;
                if (user_id == Global.userId && SystemPlay) {
                    this.showSelfPlayPocker(poker);
                } else if (user_id != Global.userId) {
                    this.showOtherplayerPocker(user_id, poker);
                }
            }

            //抽牌的检测；
            let pick_ount_poker_one = player_last.pick_ount_poker_one;
            if (pick_ount_poker_one) {
                let user_id = pick_ount_poker_one.user_id;
                if (user_id != 0 && user_id != Global.userId) {
                    let count = pick_ount_poker_one.count;
                    this.showOtherOutPocker(user_id, count);
                }
            }

            //无牌可出；
            let skip_one = player_last.skip_one;
            if (skip_one) {
                let user_id = skip_one.user_id;
                let reason = skip_one.reason;
                if (user_id && user_id != Global.userId && reason == 'not_poker_playable') {
                    this.userDataMap[user_id].player.getComponent(Dominoe_playerLogic).showlewat('skip');
                }
            }
        }

        if (!Global.isGodModel) {
            let selfKey = this.userDataMap[Global.userId].key;
            this.userDataMap[Global.userId].info = messageData.players[selfKey];
            //初始化自己的牌;
            this.initMyPai(player_current.user_id);
        }

        //是否有牌可以出;
        if (Number(player_id) == Number(Global.userId)) {

            //是否有以抽牌，当不能抽牌的时候，才去判断是否可以出牌;
            let is_pick_out = player_current.is_pick_out;
            if (is_pick_out) {
                // 抽牌
                this.userDataMap[player_id].player.getComponent(Dominoe_playerLogic).showlewat('draw');
            } else {
                let is_poker_playable = player_current.is_poker_playable;
                if (is_poker_playable) {
                    this.userDataMap[player_id].player.getComponent(Dominoe_playerLogic).showlewat('turn');
                    let poker_playable_list = messageData.players[playerInfo.key].poker_playable_list;
                    for (let i = 0, len = this.myNums.length; i < len; i++) {
                        for (let j = 0, pLen = poker_playable_list.length; j < pLen; j++) {
                            let nums = poker_playable_list[j].nums;
                            if (this.myNums[i][0] == nums[0] && this.myNums[i][1] == nums[1]) {
                                const paiComp = this.myPai[i].getComponent(Dominoe_paiLogic);
                                paiComp.isCanTouch = true;
                            }
                        }
                    }
                } else {
                    this.userDataMap[player_id].player.getComponent(Dominoe_playerLogic).showlewat('skip');
                }
            }
        } else {
            for (let i = 0, len = this.myPai.length; i < len; i++) {
                this.myPai[i].getComponent(Dominoe_paiLogic).isCanTouch = false;
            }
        }
        let lastId = messageData.player_last.poker_played_one.user_id;
        if (player_id && lastId) {
            let startPlayer = this.userDataMap[player_id].player;
            let lastPlayer = this.userDataMap[lastId].player;

            let startPos = cc.v2(startPlayer.x, startPlayer.y);
            let endPos = cc.v2(lastPlayer.x, lastPlayer.y);
            if (player_id == Global.userId) {
                startPos = cc.v2(0, -320);
            } else if (lastId == Global.userId) {
                endPos = cc.v2(0, -320);
            }
            this.showGuang(endPos, startPos);
        }

        
        
    }

    /**
     * 重置游戏数据 重新开局
     */
    private resetData() {
        this.midPai = null;
        this.leftPaiArr = [];
        this.rightPaiArr = [];

        this.allPai = [];
        this.myPai = [];

        this.leftNums = [];
        this.rightNums = [];
        this.myNums = [];

        this.lastSelfPlayerPockerPoints.length = 0;

        /** 重置所有的扑克数据 */
        // Global.pocker_object = {};
    }

    /**
     * 显示当前小局排行榜信息
     * @param  {number} roundIndex 当前第几小局
     * @param  {PlayerInfoModel} players 当前小局玩家信息
     * @returns void
     */
    private showRoundRank(roundIndex: number,players: PlayerInfoModel[]): void {
        const rankNode = this.node.getChildByName('rankNode');

        /** 根据ranking字段进行排序 */
        players.sort((a,b) => a.ranking - b.ranking > 0 ? 1 : a.ranking - b.ranking === 0 ? 0 : -1);
        rankNode.active = true;
        const rankComp = rankNode.getComponent(RankComp);
        rankComp.roundIndex = roundIndex;
        rankComp.showRankItems(players);
    }

    /**
     * 显示自己出牌 系统出牌
     * @param  {PockerObj} poker 扑克所代表的数据
     */
    showSelfPlayPocker(poker: PockerObj) {
        let startPos = cc.v2(0, 0);
        let endPos = cc.v2(0, 0);
        let _endAngle = 0;
        let showNode = null;
        let key = poker.Key;

        let myTargetPoker = null;
        // 找到需要出的牌的位置
        for (let i = 0, len = this.myPai.length; i < len; i++) {
            let pKey = this.myPai[i].getComponent(Dominoe_paiLogic).key;
            if (pKey == key) {
                startPos = cc.v2(this.myPai[i].x, this.myPai[i].y);
                myTargetPoker = this.myPai[i];
            }
        }

        // 找到所有牌跟该张牌能对上点的位置
        for (let i = 0, len = this.allPai.length; i < len; i++) {
            let pKey = this.allPai[i].getComponent(Dominoe_paiLogic).key;
            if (pKey == key) {
                endPos = cc.v2(this.allPai[i].x, this.allPai[i].y);
                _endAngle = this.allPai[i].angle;
                showNode = this.allPai[i];
            }
        }
        if (showNode) {
            showNode.x = startPos.x;
            showNode.y = startPos.y;
            showNode.angele = 0;
            let move = cc.moveTo(0.3, cc.v2(endPos.x, endPos.y));
            let ro = cc.rotateTo(0.3, -_endAngle);
            showNode.runAction(cc.spawn(move, ro));
        }

    }

    //显示别人出牌的动画;
    showOtherplayerPocker(user_id, poker) {
        MessageSoundManager.playLoadEffect(this.playPockerAudio);
        let endPos = cc.v2(0, 0);
        let _endAngle = 0;
        let showNode = null;
        let key = poker.Key;
        let player = this.userDataMap[user_id].player;
        let startPos = cc.v2(player.x, player.y);
        for (let i = 0, len = this.allPai.length; i < len; i++) {
            let pKey = this.allPai[i].getComponent(Dominoe_paiLogic).key;
            if (pKey == key) {
                endPos = cc.v2(this.allPai[i].x, this.allPai[i].y);
                _endAngle = this.allPai[i].angle;
                showNode = this.allPai[i];
            }
        }
        if (showNode) {
            showNode.x = startPos.x;
            showNode.y = startPos.y;
            showNode.angele = 0;
            let move = cc.moveTo(0.3, cc.v2(endPos.x, endPos.y));
            let ro = cc.rotateTo(0.3, -_endAngle);
            let call = cc.callFunc(() => {
                showNode.getComponent(Dominoe_paiLogic).otherMoveEnd();
            });
            showNode.runAction(cc.spawn(move, ro, call));
        }
    }

    //显示别人抽牌动画;
    showOtherOutPocker(user_id: number, count: number) {
        let pockerArr: cc.Node[] = [];
        for (let i = 0; i < count; i++) {
            let pocker = new cc.Node();
            let sp = pocker.addComponent(cc.Sprite);
            sp.spriteFrame = this.paiSurplus;
            this.paiLayer.addChild(pocker);
            // let paiStack = this.paiLayer.getChildByName('paiStack');
            pocker.x = -304;
            pocker.y = this.paiLayer.height / 2 - 100;
            pocker.scale = 1.15;
            pockerArr.push(pocker);
        }

        let player = this.userDataMap[user_id].player;
        let paiSurplus = player.getChildByName('paiSurplus');
        let endPos = cc.v2(player.x + paiSurplus.x, player.y + paiSurplus.y);

        let promiseArr = [];
        for (let i = 0; i < count; i++) {
            let promise = () => {
                return new Promise((resolve, reject) => {
                    let move = cc.moveTo(0.3, cc.v2(endPos.x, endPos.y));
                    let scaleT = cc.scaleTo(0.3, 1);
                    let call = cc.callFunc((event) => {
                        MessageSoundManager.playLoadEffect(this.getPockerAudio);
                        pockerArr[i].active = false;
                        resolve(null);
                    });
                    pockerArr[i].runAction(cc.sequence(cc.spawn(move, scaleT), call));
                });
            }
            promiseArr.push(promise);
        }

        let promise = () => {
            return new Promise((resolve, reject) => {
                for (let i = 0; i < count; i++) {
                    pockerArr[i].destroy();
                    pockerArr[i] = null;
                }
                pockerArr = [];
            });
        }
        promiseArr.push(promise);
        Global.runPromiseArray(promiseArr);
    }

    /**
     * 初始化牌桌上显示的卡牌;
     * @param  {{left:PockerObj[]} pocker
     * @param  {PockerObj[]} middle
     * @param  {PockerObj[]}}} right
     */
    initPocker(pocker: {left: PockerObj[],middle: PockerObj,right: PockerObj[]}) {
        //左边的牌；
        let leftPockerArr: number[][] = [];
        let leftKeys: number[] = [];
        let leftPocker = pocker.left;
        let leftPocketLen = leftPocker.length;
        if (leftPocketLen > 0) {
            for (let i = 0, len = leftPocketLen; i < len; i++) {
                let nums = leftPocker[i].nums;
                let key = leftPocker[i].Key;
                leftPockerArr.push(nums);
                leftKeys.push(key);
            }
            this.initLeftPaiNode(leftPockerArr, leftKeys);
        }


        //中间的牌；
        let middle = pocker.middle;
        let midNums = middle.nums;
        if (midNums && midNums.length == 2) {
            let key = middle.Key;
            this.initMidPocker(midNums, key);
        }

        //右边的牌；
        let rightPockerArr: number[][] = [];
        let rightPocker = pocker.right;
        let rightPockerLen = rightPocker.length;
        let rightKeys: number[] = [];
        if (rightPockerLen > 0) {
            for (let i = 0, len = rightPocker.length; i < len; i++) {
                let nums = rightPocker[i].nums;
                rightPockerArr.push(nums);
                let key = rightPocker[i].Key;
                rightKeys.push(key);
            }
            this.initRightPaiNode(rightPockerArr, rightKeys);
        }

        // let sCount = leftPocketLen + rightPockerLen;

        let leftLine = this.getLineCount(leftPocketLen);
        let rightLine = this.getLineCount(rightPockerLen);
        let minCount = leftPocketLen > rightPockerLen ? leftPocketLen : rightPockerLen;
        if (minCount == 0) {
            this.scaleNum = 1.2;
        } else if (minCount == 1) {
            this.scaleNum = 1.0;
        } else if (minCount == 2) {
            this.scaleNum = 0.9;
        } else {
            if (leftLine + rightLine - 1 < 4) {
                this.scaleNum = 0.65;
            } else {
                this.scaleNum = 0.6;
            }
        }
        //更新牌坐标;
        this.updateAllPai(null);
        if (this.selfPlayPocker) {
            this.selfPlayPocker.destroy();
            this.selfPlayPocker = null;
        }
    }

    //获取行数;
    getLineCount(num: number) {
        if (num < 5) {
            return 1;
        } else if (num < 14) {
            return 2;
        } else {
            return 3;
        }
    }

    initMidPocker(nums: number[], key: number) {
        if (!this.midPai) {
            let pai = this.addPaiNode(nums);
            pai.name = 'middlePoker';
            this.paiLayer.addChild(pai);
            this.midPai = pai;
            if (nums[0] == nums[1]) {
                this.midPai.angle = 0;
                this.midPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
            } else {
                this.midPai.angle = 90;
                this.midPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
            }
            this.allPai.push(this.midPai);
            this.midPai.y = this.midPaiY;
        }
        this.midPai.x = 0;
        this.midPai.scale = this.scaleNum;
        this.midPai.getComponent(Dominoe_paiLogic).showMeng = false;
        this.midPai.getComponent(Dominoe_paiLogic).key = key;
        this.midPai.getComponent(Dominoe_paiLogic).paiPosType = Dominoe_POSTYPE.NONE;
    }

    // 初始化左边数组;
    initLeftPaiNode(pockerArr: number[][], keys: number[]) {
        let len = pockerArr.length;
        let numsLen = this.leftNums.length;
        for (let i = 0; i < len; i++) {
            //如果服务器有这个数据，但是本地没有的时候 或者 本地数据和服务器数据不一样;
            if (!this.leftNums[i] || this.leftNums[i][0] != pockerArr[i][0] || this.leftNums[i][1] != pockerArr[i][1]) {
                this.leftNums[i] = pockerArr[i];
                //本地数组队列是否有这张牌；
                if (this.leftPaiArr[i]) {
                    this.leftPaiArr[i].getComponent(Dominoe_paiLogic).setPaiShow(this.leftNums[i]);
                } else {
                    let pai = this.addPaiNode(this.leftNums[i]);
                    pai.name = 'leftPoker';
                    this.paiLayer.addChild(pai);
                    this.leftPaiArr[i] = pai;
                    this.allPai.unshift(pai);
                }
                this.leftPaiArr[i].getComponent(Dominoe_paiLogic).showMeng = false;
                this.leftPaiArr[i].getComponent(Dominoe_paiLogic).key = keys[i];
            }
        }

        if (numsLen > len) {
            for (let i = len; i < numsLen; i++) {
                if (this.leftPaiArr[i]) {
                    this.leftPaiArr[i].destroy();
                    this.leftPaiArr[i] = null;
                }
            }
            this.leftNums.length = len;
            this.leftPaiArr.length = len;
        }
    }

    //初始化右边数组;
    initRightPaiNode(pockerArr: number[][], keys: number[]) {
        let len = pockerArr.length;
        let numsLen = this.rightNums.length;
        for (let i = 0; i < len; i++) {
            //如果服务器有这个数据，但是本地没有的时候 或者 本地数据和服务器数据不一样;
            if (!this.rightNums[i] || this.rightNums[i][0] != pockerArr[i][0] || this.rightNums[i][1] != pockerArr[i][1]) {
                this.rightNums[i] = pockerArr[i];
                //本地数组队列是否有这张牌；
                if (this.rightPaiArr[i]) {
                    this.rightPaiArr[i].getComponent(Dominoe_paiLogic).setPaiShow(this.rightNums[i]);
                } else {
                    let pai = this.addPaiNode(this.rightNums[i]);
                    pai.name = 'rightPoker';
                    this.paiLayer.addChild(pai);
                    this.rightPaiArr[i] = pai;
                    this.allPai.push(pai);
                }
                this.rightPaiArr[i].getComponent(Dominoe_paiLogic).showMeng = false;
                this.rightPaiArr[i].getComponent(Dominoe_paiLogic).key = keys[i];
            }
        }

        if (numsLen > len) {
            for (let i = len; i < numsLen; i++) {
                if (this.rightPaiArr[i]) {
                    this.rightPaiArr[i].destroy();
                    this.rightPaiArr[i] = null;
                }
            }
            this.rightNums.length = len;
            this.rightPaiArr.length = len;
        }
    }

    //创建一个牌，并且返回;
    addPaiNode(nums: number[]) {
        let pai = cc.instantiate(this.pai);
        pai.getComponent(Dominoe_paiLogic).setPaiShow(nums);
        return pai;
    }

    //自己的牌被点击了;
    paiTouchStart(event) {
        let points = event.points;
        this.setAllMyPockerTouchType(event.paiNode);
        this.paiLayer.getComponent(Dominoe_paiLayerLogic).hideAllSelectNode();
        let selectNodeLeft: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(0);
        let selectNodeRight: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(1);
        selectNodeLeft.scale = this.scaleNum * 1.5;
        selectNodeRight.scale = this.scaleNum * 1.5;
        //说明没有中间牌;
        if (!this.midPai) {
            selectNodeLeft.active = true;
            //说明是2个点相同的牌;
            if (points[0] == points[1]) {
                selectNodeLeft.angle = 90;
            }
            selectNodeLeft.x = 0;
            selectNodeLeft.y = this.midPaiY;
        } else {

            let pos = this.checkCanTouchPai();
            let leftPoint = pos.leftPoint;
            let rightPoint = pos.rightPoint;
            //**********************左边检测***************************;
            if (points[0] == leftPoint || points[1] == leftPoint) {
                selectNodeLeft.active = true;
                let leftPaiNode = this.allPai[0];
                let leftLeng = this.leftPaiArr.length;
                let leftPaiType = leftPaiNode.getComponent(Dominoe_paiLogic).paiType;
                let leftPosType = leftposArr[leftLeng];
                let leftXDis: number = 0;
                let leftYDis: number = 0;
                let leftX: number = 0;
                let XDis: number = 0;
                let YDis: number = 0;
                let XD: number = 0;
                //根据上一个牌的方向计算出上一个牌的自身距离;
                if (leftPaiType == Global.paiType.VERTICALLY_0 || leftPaiType == Global.paiType.VERTICALLY_180) {
                    leftXDis = leftPaiNode.width / 2 * this.scaleNum;
                    leftYDis = leftPaiNode.height / 2 * this.scaleNum;
                    leftX = 0;
                } else {
                    leftXDis = leftPaiNode.height / 2 * this.scaleNum;
                    leftYDis = leftPaiNode.width / 2 * this.scaleNum;
                    leftX = leftYDis;
                }

                //根据当前牌的方向计算出当前牌的自身距离；
                if (points[0] == points[1] && leftLeng != 5 && leftLeng != 14 || leftLeng == 3 || leftLeng == 4 || leftLeng == 12 || leftLeng == 13) {
                    XDis = leftPaiNode.width / 2 * this.scaleNum;
                    YDis = leftPaiNode.height / 2 * this.scaleNum;
                    selectNodeLeft.angle = 90;
                    XD = 0;
                } else {
                    XDis = leftPaiNode.height / 2 * this.scaleNum;
                    YDis = leftPaiNode.width / 2 * this.scaleNum;
                    selectNodeLeft.angle = 0;
                    XD = YDis;
                }

                switch (leftPosType) {
                    case Dominoe_POSTYPE.LEFT:
                        selectNodeLeft.x = leftPaiNode.x - leftXDis - XDis;
                        selectNodeLeft.y = leftPaiNode.y;
                        break;
                    case Dominoe_POSTYPE.LEFTTOP:
                        selectNodeLeft.x = leftPaiNode.x - leftX;
                        selectNodeLeft.y = leftPaiNode.y + leftYDis + YDis;
                        break;
                    case Dominoe_POSTYPE.TOP:
                        selectNodeLeft.x = leftPaiNode.x;
                        selectNodeLeft.y = leftPaiNode.y + leftYDis + YDis;
                        break;
                    case Dominoe_POSTYPE.TOPRIGHT:
                        selectNodeLeft.x = leftPaiNode.x + XD;
                        selectNodeLeft.y = leftPaiNode.y + leftYDis + YDis;
                        break;
                    case Dominoe_POSTYPE.RIGHT:
                        selectNodeLeft.x = leftPaiNode.x + leftXDis + XDis;
                        selectNodeLeft.y = leftPaiNode.y;
                        break;
                    case Dominoe_POSTYPE.RIGHTTOP:
                        selectNodeLeft.x = leftPaiNode.x + leftX;
                        selectNodeLeft.y = leftPaiNode.y + leftYDis + YDis;
                        break;
                    case Dominoe_POSTYPE.TOPLEFT:
                        selectNodeLeft.x = leftPaiNode.x - XD;
                        selectNodeLeft.y = leftPaiNode.y + leftYDis + YDis;
                        break;
                }
            }

            //**********************右边检测***************************;
            if (points[0] == rightPoint || points[1] == rightPoint) {
                selectNodeRight.active = true;
                let rightPaiNode = this.allPai[this.allPai.length - 1];
                let rightLeng = this.rightPaiArr.length;
                let rightPaiType = rightPaiNode.getComponent(Dominoe_paiLogic).paiType;
                let rightPosType = rightposArr[rightLeng];
                let rightXDis: number = 0;
                let rightYDis: number = 0;
                let rightX: number = 0;
                let XDis: number = 0;
                let YDis: number = 0;
                let YD: number = 0;
                //根据上一个牌的方向计算出上一个牌的自身距离;
                if (rightPaiType == Global.paiType.VERTICALLY_0 || rightPaiType == Global.paiType.VERTICALLY_180) {
                    rightXDis = rightPaiNode.width / 2 * this.scaleNum;
                    rightYDis = rightPaiNode.height / 2 * this.scaleNum;
                    rightX = 0;
                } else {
                    rightXDis = rightPaiNode.height / 2 * this.scaleNum;
                    rightYDis = rightPaiNode.width / 2 * this.scaleNum;
                    rightX = rightYDis;
                }

                //根据当前牌的方向计算出当前牌的自身距离；
                if (points[0] == points[1] && rightLeng != 5 && rightLeng != 14 || rightLeng == 3 || rightLeng == 4 || rightLeng == 12 || rightLeng == 13) {
                    XDis = rightPaiNode.width / 2 * this.scaleNum;
                    YDis = rightPaiNode.height / 2 * this.scaleNum;
                    selectNodeRight.angle = 90;
                    YD = 0;
                } else {
                    XDis = rightPaiNode.height / 2 * this.scaleNum;
                    YDis = rightPaiNode.width / 2 * this.scaleNum;
                    selectNodeRight.angle = 0;
                    YD = YDis;
                }

                switch (rightPosType) {
                    case Dominoe_POSTYPE.RIGHT:
                        selectNodeRight.x = rightPaiNode.x + rightXDis + XDis;
                        selectNodeRight.y = rightPaiNode.y;
                        break;
                    case Dominoe_POSTYPE.RIGHTBOTTOM:
                        selectNodeRight.x = rightPaiNode.x + rightX;
                        selectNodeRight.y = rightPaiNode.y - rightYDis - YDis;
                        break;
                    case Dominoe_POSTYPE.BOTTOM:
                        selectNodeRight.x = rightPaiNode.x;
                        selectNodeRight.y = rightPaiNode.y - rightYDis - YDis;
                        break;
                    case Dominoe_POSTYPE.BOTTOMLEFT:
                        selectNodeRight.x = rightPaiNode.x - YD;
                        selectNodeRight.y = rightPaiNode.y - rightYDis - YDis;
                        break;
                    case Dominoe_POSTYPE.LEFT:
                        selectNodeRight.x = rightPaiNode.x - rightXDis - XDis;
                        selectNodeRight.y = rightPaiNode.y;
                        break;
                    case Dominoe_POSTYPE.LEFTBOTTOM:
                        selectNodeRight.x = rightPaiNode.x - rightX;
                        selectNodeRight.y = rightPaiNode.y - rightYDis - YDis;
                        break;
                    case Dominoe_POSTYPE.BOTTOMRIGHT:
                        selectNodeRight.x = rightPaiNode.x + YD;
                        selectNodeRight.y = rightPaiNode.y - rightYDis - YDis;
                        break;
                }
            }
        }

        if (selectNodeLeft.active && selectNodeRight.active) {
            Global.isCanSendPocker = false;
        } else {
            Global.isCanSendPocker = true;
        }
    }

    //自己的牌被放下;
    paiTouchEnd(event) {
        Global.isCanSendPocker = false;
        let paiNode = event.paiNode;
        let pockerPos = '';
        if (!this.midPai) {
            let angleNum = 0;
            let midPoints = paiNode.getComponent(Dominoe_paiLogic).points;
            if (midPoints[0] == midPoints[1]) {
                paiNode.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
            } else {
                angleNum = -90;
                paiNode.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
            }
            pockerPos = 'middle';
            paiNode.getComponent(Dominoe_paiLogic).paiPosType = Dominoe_POSTYPE.NONE;
            // let move = cc.moveTo(0.2, cc.v2(0, this.midPaiY));
            // let scaleTo = cc.scaleTo(0.2, this.scaleNum);
            // let angle = cc.rotateTo(0.2, angleNum);
            // paiNode.runAction(cc.spawn(move, scaleTo, angle));
        } else {
            let pos = event.pos;
            let selectNodeLeft: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(0);
            let selectNodeRight: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(1);
            //如果两边都能放;
            if (selectNodeLeft.active && selectNodeRight.active) {
                let leftDistance = pos.sub(cc.v2(selectNodeLeft.x, selectNodeLeft.y)).mag();
                let rightDistance = pos.sub(cc.v2(selectNodeRight.x, selectNodeRight.y)).mag();
                //放右边;
                if (leftDistance >= rightDistance) {
                    pockerPos = 'right';
                }
                //放左边；
                else {
                    pockerPos = 'left';
                }
            }
            //只有左边显示;
            else if (selectNodeLeft.active) {
                pockerPos = 'left';
            }
            //只有右边显示；
            else {
                pockerPos = 'right';
            }
        }

        let index = this.myPai.indexOf(paiNode);
        if (index >= 0) {
            this.selfPlayPocker = this.myPai[index];
            this.selfPlayPocker.name = 'selfPoker';
            this.myPai.splice(index, 1);
            for (let i = 0, len = this.myPai.length; i < len; i++) {
                this.myPai[i].getComponent(Dominoe_paiLogic).isCanTouch = false;
            }
        }
        //隐藏所有的选择框;
        this.paiLayer.getComponent(Dominoe_paiLayerLogic).hideAllSelectNode();
        this.moveSelfPlayPocker(pockerPos);
        // this.playPocker(pockerPos, paiNode);
    }

    //选择框的点击事件；
    touchSelectKuang_callback(event, customEventData) {
        if (Global.selectSendPocker) {
            let paiNode = Global.selectSendPocker;
            let pockerPos = '';
            if (!this.midPai) {
                let angleNum = 0;
                let midPoints = paiNode.getComponent(Dominoe_paiLogic).points;
                if (midPoints[0] == midPoints[1]) {
                    paiNode.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
                } else {
                    angleNum = -90;
                    paiNode.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
                }
                pockerPos = 'middle';
                paiNode.getComponent(Dominoe_paiLogic).paiPosType = Dominoe_POSTYPE.NONE;
                // let move = cc.moveTo(0.2, cc.v2(0, this.midPaiY));
                // let scaleTo = cc.scaleTo(0.2, this.scaleNum);
                // let angle = cc.rotateTo(0.2, angleNum);
                // paiNode.runAction(cc.spawn(move, scaleTo, angle));
            } else {
                pockerPos = customEventData;
            }
            let index = this.myPai.indexOf(paiNode);
            if (index >= 0) {
                this.selfPlayPocker = this.myPai[index];
                this.selfPlayPocker.name = 'selfPoker';
                this.myPai.splice(index, 1);
            }
            //隐藏所有的选择框;
            this.paiLayer.getComponent(Dominoe_paiLayerLogic).hideAllSelectNode();
            this.moveSelfPlayPocker(pockerPos);
            // this.playPocker(pockerPos, paiNode);
        }
    }

    /**
     * 移动自己的出牌到指定的地点;
     * @param  {string} pos 出牌的位置 left right middle
     */
    moveSelfPlayPocker(pos: string) {
        if (!this.selfPlayPocker) {
            return;
        }
        let point = this.checkCanTouchPai();
        let points = this.selfPlayPocker.getComponent(Dominoe_paiLogic).points;
        this.lastSelfPlayerPockerPoints = points;

        let endPos = cc.v2(0, this.midPaiY);
        let angle = 0;
        if (pos == 'middle') {
            if (points[0] == points[1]) {
                angle = 0;
            } else {
                angle = 90;
            }
        } else if (pos == 'left') {
            let leftPoint = point.leftPoint;
            let selectNodeLeft: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(0);
            endPos = cc.v2(selectNodeLeft.x, selectNodeLeft.y);
            let leng = this.leftPaiArr.length;
            //下一个牌的类型;
            let posType = leftposArr[leng];
            switch (posType) {
                case Dominoe_POSTYPE.LEFT:
                    if (points[0] == points[1]) {
                        angle = 0;
                    } else if (points[0] == leftPoint) {
                        angle = -90;
                    } else if (points[1] == leftPoint) {
                        angle = 90;
                    }
                    break;
                case Dominoe_POSTYPE.TOPLEFT:
                    if (points[0] == leftPoint) {
                        angle = -90;
                    } else if (points[1] == leftPoint) {
                        angle = 90;
                    }
                    break;
                case Dominoe_POSTYPE.LEFTTOP:
                case Dominoe_POSTYPE.TOP:
                case Dominoe_POSTYPE.RIGHTTOP:
                    if (points[0] == leftPoint) {
                        angle = 180;
                    } else if (points[1] == leftPoint || points[0] == points[1]) {
                        angle = 0;
                    }
                    break;
                case Dominoe_POSTYPE.TOPRIGHT:
                    if (points[0] == leftPoint) {
                        angle = 90;
                    } else if (points[1] == leftPoint) {
                        angle = -90;
                    }
                    break;
                case Dominoe_POSTYPE.RIGHT:
                    if (points[0] == points[1]) {
                        angle = 0;
                    } else if (points[0] == leftPoint) {
                        angle = 90;
                    } else if (points[1] == leftPoint) {
                        angle = -90;
                    }
                    break;
            }
        } else if (pos == 'right') {
            let rightPoint = point.rightPoint;
            let selectNodeRight: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(1);
            endPos = cc.v2(selectNodeRight.x, selectNodeRight.y);
            let leng = this.rightPaiArr.length;
            let posType = rightposArr[leng];
            switch (posType) {
                case Dominoe_POSTYPE.RIGHT:
                    if (points[0] == points[1]) {
                        angle = 0;
                    } else if (points[0] == rightPoint) {
                        angle = 90;
                    } else if (points[1] == rightPoint) {
                        angle = -90;
                    }
                    break;
                case Dominoe_POSTYPE.RIGHTBOTTOM:
                case Dominoe_POSTYPE.BOTTOM:
                case Dominoe_POSTYPE.LEFTBOTTOM:
                    if (points[0] == rightPoint || points[0] == points[1]) {
                        angle = 0;
                    } else if (points[1] == rightPoint) {
                        angle = 180;
                    }
                    break;
            case Dominoe_POSTYPE.BOTTOMLEFT:
                    if (points[0] == rightPoint) {
                        angle = -90;
                    } else if (points[1] == rightPoint) {
                        angle = 90;
                    }
                    break;
                case Dominoe_POSTYPE.LEFT:
                    if (points[0] == points[1]) {
                        angle = 0;
                    } else if (points[0] == rightPoint) {
                        angle = -90;
                    } else if (points[1] == rightPoint) {
                        angle = 90;
                    }
                    break;
                case Dominoe_POSTYPE.BOTTOMRIGHT:
                    if (points[0] == rightPoint) {
                        angle = 90;
                    } else if (points[1] == rightPoint) {
                        angle = -90;
                    }
                    break;
            }
        }
        this.showLoading(endPos);
        MessageSoundManager.playLoadEffect(this.playPockerAudio);
        let moveTime = 0.3;
        let move = cc.moveTo(moveTime, cc.v2(endPos.x, endPos.y));
        let ro = cc.rotateTo(moveTime, -angle);
        let sca = cc.scaleTo(moveTime, this.scaleNum);
        let call = cc.callFunc(() => {
            console.log('@自己出牌完毕')
            this.selfPlayPocker.scale = this.scaleNum;
            this.playPocker(pos, this.selfPlayPocker);
            this.updateAllPaiYPos();
            this.selfPlayPocker.getComponent(Dominoe_paiLogic).moveEnd();
        });
        this.selfPlayPocker.runAction(cc.sequence(cc.spawn(move, ro,sca), call));
    }

    //取消选择框;
    cancelTouch() {
        this.paiLayer.getComponent(Dominoe_paiLayerLogic).hideAllSelectNode();
    }

    //将所有的手牌设置为非点击选中状态；
    setAllMyPockerTouchType(paiNode) {
        for (let i = 0, len = this.myPai.length; i < len; i++) {
            if (this.myPai[i] != paiNode) {
                this.myPai[i].getComponent(Dominoe_paiLogic).setNodeTouchType(false);
            }
        }
    }

    /**
     * 对一个节点在规定的时间内缩放到指定的缩放比例
     * @param  {cc.Node} node 要缩放的节点
     * @param  {number=0.2} time 缩放所需要的时间
     * @returns void
     */
    private scaleNodeByTween(node: cc.Node,time: number = 0.2): void {
        const nodeComp = node.getComponent(Dominoe_paiLogic);
        if(this.lastSelfPlayerPockerPoints.length > 0 && nodeComp.points[0] === this.lastSelfPlayerPockerPoints[0] && nodeComp.points[1] === this.lastSelfPlayerPockerPoints[1]) {
            node.scale = this.scaleNum;
            return;
        }
        if(node.scale === this.scaleNum) {
            return;
        }
        cc.tween(node).to(time,{
            scale: this.scaleNum
        }).start();
    }

    //更新牌的顺序以及坐标；
    updateAllPai(paiNode) {
        if (!this.midPai) {
            return;
        }
        
        // this.midPai.scale = this.scaleNum;
        this.scaleNodeByTween(this.midPai);

        let leftPaiLeng = this.leftPaiArr.length;
        if (leftPaiLeng > 0) {
            let previousPai = this.midPai;
            for (let i = 0; i < leftPaiLeng; i++) {
                let leftPai: cc.Node = this.leftPaiArr[i];
                leftPai.scale = this.scaleNum;
                this.scaleNodeByTween(leftPai);
                let rightPoints: number[] = leftPai.getComponent(Dominoe_paiLogic).points;
                //上一个牌的状态;
                let previousPaiType = previousPai.getComponent(Dominoe_paiLogic).paiType;
                //上一个牌的点数；
                let previousPoints = previousPai.getComponent(Dominoe_paiLogic).points;
                //当前牌的位置类型;
                let paiPosType = leftposArr[i];
                //上一个牌的外接点；
                let previousPoint = 0;
                //获取对应出来的点数;
                if (previousPaiType == Global.paiType.LEFT) {
                    if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.LEFTTOP) {
                        previousPoint = previousPoints[0];
                    } else {
                        previousPoint = previousPoints[1];
                    }
                } else if (previousPaiType == Global.paiType.RIGHT) {
                    if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.LEFTTOP) {
                        previousPoint = previousPoints[1];
                    } else {
                        previousPoint = previousPoints[0];
                    }
                } else if (previousPaiType == Global.paiType.VERTICALLY_0) {
                    if (paiPosType == Dominoe_POSTYPE.TOP || paiPosType == Dominoe_POSTYPE.TOPLEFT || paiPosType == Dominoe_POSTYPE.TOPRIGHT) {
                        previousPoint = previousPoints[0];
                    } else {
                        previousPoint = previousPoints[1];
                    }
                } else if (previousPaiType == Global.paiType.VERTICALLY_180) {
                    if (paiPosType == Dominoe_POSTYPE.TOP || paiPosType == Dominoe_POSTYPE.TOPLEFT || paiPosType == Dominoe_POSTYPE.TOPRIGHT) {
                        previousPoint = previousPoints[1];
                    } else {
                        previousPoint = previousPoints[0];
                    }
                }

                //当前卡牌的类型;
                if (rightPoints[0] == rightPoints[1] && i != 5 && i != 14) {
                    leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
                    leftPai.angle = 0;
                } else if (i == 3 || i == 4 || i == 12 || i == 13) {
                    if (rightPoints[0] == previousPoint) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_180;
                        leftPai.angle = 180;
                    } else if (rightPoints[1] == previousPoint) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
                        leftPai.angle = 0;
                    }
                } else if (rightPoints[0] == previousPoint) {
                    if (paiPosType == Dominoe_POSTYPE.RIGHT || paiPosType == Dominoe_POSTYPE.TOPRIGHT) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
                        leftPai.angle = 90;
                    } else if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.TOPLEFT) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.RIGHT;
                        leftPai.angle = -90;
                    }
                } else if (rightPoints[1] == previousPoint) {
                    if (paiPosType == Dominoe_POSTYPE.RIGHT || paiPosType == Dominoe_POSTYPE.TOPRIGHT) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.RIGHT;
                        leftPai.angle = -90;
                    } else if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.TOPLEFT) {
                        leftPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
                        leftPai.angle = 90;
                    }
                }

                this.setPaiPos(previousPai, leftPai, paiPosType);
                previousPai = leftPai;
                leftPai.getComponent(Dominoe_paiLogic).paiPosType = paiPosType;
            }
        }
        let rightPaiLeng = this.rightPaiArr.length;
        if (rightPaiLeng > 0) {
            let previousPai = this.midPai;
            for (let i = 0; i < rightPaiLeng; i++) {
                let rightPai: cc.Node = this.rightPaiArr[i];
                // rightPai.scale = this.scaleNum;
                this.scaleNodeByTween(rightPai);
                let rightPoints: number[] = rightPai.getComponent(Dominoe_paiLogic).points;
                //上一个牌的状态;
                let previousPaiType = previousPai.getComponent(Dominoe_paiLogic).paiType;
                //上一个牌的点数；
                let previousPoints = previousPai.getComponent(Dominoe_paiLogic).points;
                //当前牌的位置类型;
                let paiPosType = rightposArr[i];
                //上一个牌的外接点；
                let previousPoint = 0;
                //获取对应出来的点数;
                if (previousPaiType == Global.paiType.LEFT) {
                    if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.LEFTBOTTOM) {
                        previousPoint = previousPoints[0];
                    } else {
                        previousPoint = previousPoints[1];
                    }
                } else if (previousPaiType == Global.paiType.RIGHT) {
                    if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.LEFTBOTTOM) {
                        previousPoint = previousPoints[1];
                    } else {
                        previousPoint = previousPoints[0];
                    }
                } else if (previousPaiType == Global.paiType.VERTICALLY_0) {
                    if (paiPosType == Dominoe_POSTYPE.BOTTOM || paiPosType == Dominoe_POSTYPE.BOTTOMLEFT || paiPosType == Dominoe_POSTYPE.BOTTOMRIGHT) {
                        previousPoint = previousPoints[1];
                    } else {
                        previousPoint = previousPoints[0];
                    }
                } else if (previousPaiType == Global.paiType.VERTICALLY_180) {
                    if (paiPosType == Dominoe_POSTYPE.BOTTOM || paiPosType == Dominoe_POSTYPE.BOTTOMLEFT || paiPosType == Dominoe_POSTYPE.BOTTOMRIGHT) {
                        previousPoint = previousPoints[0];
                    } else {
                        previousPoint = previousPoints[1];
                    }
                }

                //当前卡牌的类型;
                if (rightPoints[0] == rightPoints[1] && i != 5 && i != 14) {
                    rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
                    rightPai.angle = 0;
                } else if (i == 3 || i == 4 || i == 12 || i == 13) {
                    if (rightPoints[0] == previousPoint) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_0;
                        rightPai.angle = 0;
                    } else if (rightPoints[1] == previousPoint) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.VERTICALLY_180;
                        rightPai.angle = 180;
                    }
                } else if (rightPoints[0] == previousPoint) {
                    if (paiPosType == Dominoe_POSTYPE.RIGHT || paiPosType == Dominoe_POSTYPE.BOTTOMRIGHT) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
                        rightPai.angle = 90;
                    } else if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.BOTTOMLEFT) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.RIGHT;
                        rightPai.angle = -90;
                    }
                } else if (rightPoints[1] == previousPoint) {
                    if (paiPosType == Dominoe_POSTYPE.RIGHT || paiPosType == Dominoe_POSTYPE.BOTTOMRIGHT) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.RIGHT;
                        rightPai.angle = -90;
                    } else if (paiPosType == Dominoe_POSTYPE.LEFT || paiPosType == Dominoe_POSTYPE.BOTTOMLEFT) {
                        rightPai.getComponent(Dominoe_paiLogic).paiType = Global.paiType.LEFT;
                        rightPai.angle = 90;
                    }
                }
                this.setPaiPos(previousPai, rightPai, paiPosType);
                previousPai = rightPai;
                rightPai.getComponent(Dominoe_paiLogic).paiPosType = paiPosType;
            }
        }

        if (!this.selfPlayPocker) {
            this.updateAllPaiYPos();
        }
    }

    /*
        设置牌的坐标;
        @param  previousPai         上一个牌
        @param  currentPai          当前牌
        @param  direction           方位
    */
    setPaiPos(previousPai: cc.Node, currentPai: cc.Node, direction: string) {
        /**
         *  Global.paiType.VERTICALLY           牌为竖直方面
         *  Global.paiType.LEFT                 牌为向左方面
         *  Global.paiType.RIGHT                牌为向右方面
         */
        //上一个牌的状态和需要保持的距离;
        let previousXDis: number = 0;                //X方向距离；
        let previousYDis: number = 0;                //Y方向距离；
        let previousDis: number = 0;                 //拐角时X的偏差；
        let previousPaiType = previousPai.getComponent(Dominoe_paiLogic).paiType;
        switch (previousPaiType) {
            case Global.paiType.VERTICALLY_0:
            case Global.paiType.VERTICALLY_180:
                previousXDis = previousPai.width / 2 * this.scaleNum;
                previousYDis = previousPai.height / 2 * this.scaleNum;
                previousDis = 0;
                break;
            case Global.paiType.LEFT:
            case Global.paiType.RIGHT:
                previousXDis = previousPai.height / 2 * this.scaleNum;
                previousYDis = previousPai.width / 2 * this.scaleNum;
                previousDis = previousYDis;
                break;
        }
        //自己牌的状态和需要保持的距离;
        let currentXDis: number = 0;                 //X方向距离；
        let currentYDis: number = 0;                 //Y方向距离；
        let currentDis: number = 0;                  //拐角时X的偏差；
        let currentPaiType = currentPai.getComponent(Dominoe_paiLogic).paiType;
        switch (currentPaiType) {
            case Global.paiType.VERTICALLY_0:
            case Global.paiType.VERTICALLY_180:
                currentXDis = previousPai.width / 2 * this.scaleNum;
                currentYDis = previousPai.height / 2 * this.scaleNum;
                currentDis = 0;
                break;
            case Global.paiType.LEFT:
            case Global.paiType.RIGHT:
                currentXDis = previousPai.height / 2 * this.scaleNum;
                currentYDis = previousPai.width / 2 * this.scaleNum;
                currentDis = previousPai.width / 2 * this.scaleNum;
                break;
        }
        let currentPaiX: number = 0;
        let currentPaiY: number = 0;

        switch (direction) {
            case Dominoe_POSTYPE.LEFT:
                currentPaiX = previousPai.x - currentXDis - previousXDis;
                currentPaiY = previousPai.y;
                break;
            case Dominoe_POSTYPE.TOP:
                currentPaiX = previousPai.x;
                currentPaiY = previousPai.y + currentYDis + previousYDis;
                break;
            case Dominoe_POSTYPE.RIGHT:
                currentPaiX = previousPai.x + currentXDis + previousXDis;
                currentPaiY = previousPai.y;
                break;
            case Dominoe_POSTYPE.BOTTOM:
                currentPaiX = previousPai.x;
                currentPaiY = previousPai.y - currentYDis - previousYDis;
                break;
            case Dominoe_POSTYPE.RIGHTBOTTOM:
                currentPaiX = previousPai.x + previousDis;
                currentPaiY = previousPai.y - currentYDis - previousYDis;
                break;
            case Dominoe_POSTYPE.BOTTOMLEFT:
                currentPaiX = previousPai.x - currentDis;
                currentPaiY = previousPai.y - currentYDis - previousYDis;
                break;
            case Dominoe_POSTYPE.LEFTBOTTOM:
                currentPaiX = previousPai.x - previousDis;
                currentPaiY = previousPai.y - currentYDis - previousYDis;
                break;
            case Dominoe_POSTYPE.BOTTOMRIGHT:
                currentPaiX = previousPai.x + currentDis;
                currentPaiY = previousPai.y - currentYDis - previousYDis;
                break;
            case Dominoe_POSTYPE.LEFTTOP:
                currentPaiX = previousPai.x - previousDis;
                currentPaiY = previousPai.y + currentYDis + previousYDis;
                break;
            case Dominoe_POSTYPE.TOPRIGHT:
                currentPaiX = previousPai.x + currentDis;
                currentPaiY = previousPai.y + currentYDis + previousYDis;
                break;
            case Dominoe_POSTYPE.RIGHTTOP:
                currentPaiX = previousPai.x + previousDis;
                currentPaiY = previousPai.y + currentYDis + previousYDis;
                break;
            case Dominoe_POSTYPE.TOPLEFT:
                currentPaiX = previousPai.x - currentDis;
                currentPaiY = previousPai.y + currentYDis + previousYDis;
                break;
        }

        if (this.selfPlayPocker) {
            let currentPaiPoints = currentPai.getComponent(Dominoe_paiLogic).points;
            let selfPlayPockerpoints = this.selfPlayPocker.getComponent(Dominoe_paiLogic).points;
            currentPai.x = currentPaiX;
            currentPai.y = currentPaiY;
            if (currentPaiPoints[0] == selfPlayPockerpoints[0] && currentPaiPoints[1] == selfPlayPockerpoints[1]
                || currentPaiPoints[0] == selfPlayPockerpoints[1] && currentPaiPoints[1] == selfPlayPockerpoints[0]) {

                this.hideLoading();
                // currentPai.getComponent(Dominoe_paiLogic).moveEnd();
                // this.updateAllPaiYPos();
                /*
            currentPai.x = this.selfPlayPocker.x;
            currentPai.y = this.selfPlayPocker.y;
            let angleNum = currentPai.angle;
            currentPai.angle = 0;
            this.hideLoading();
            currentPai.getComponent(Dominoe_paiLogic).moveEnd();
            this.updateAllPaiYPos();
            cc.tween(currentPai)
                .to(0.5, { position: cc.v2(currentPaiX, currentPaiY), angle: angleNum })
                .call(() => {
                    currentPai.getComponent(Dominoe_paiLogic).moveEnd();
                    this.updateAllPaiYPos();
                })
                .start()
*/
            } else {
                // currentPai.x = currentPaiX;
                // currentPai.y = currentPaiY;
            }
        } else {
            currentPai.x = currentPaiX;
            currentPai.y = currentPaiY;
        }
    }

    //检测自己能显示触摸的牌;
    checkCanTouchPai() {
        let leng = this.allPai.length;
        let myPaiLen = this.myPai.length;
        let leftPoint = 0;
        let rightPoint = 0;

        if (leng > 0) {
            let leftNode = this.allPai[0];
            // 牌的位置
            let leftPaiPosType = leftNode.getComponent(Dominoe_paiLogic).paiPosType;
            // 牌的点数
            let leftPoints = leftNode.getComponent(Dominoe_paiLogic).points;
            // 牌的类型
            let leftType = leftNode.getComponent(Dominoe_paiLogic).paiType;

            if (leftType == Global.paiType.VERTICALLY_0) {
                if (leftPaiPosType == Dominoe_POSTYPE.TOP || leftPaiPosType == Dominoe_POSTYPE.LEFTTOP || leftPaiPosType == Dominoe_POSTYPE.RIGHTTOP) {
                    leftPoint = leftPoints[0];
                } else {
                    leftPoint = leftPoints[1];
                }
            } else if (leftType == Global.paiType.VERTICALLY_180) {
                if (leftPaiPosType == Dominoe_POSTYPE.TOP || leftPaiPosType == Dominoe_POSTYPE.LEFTTOP || leftPaiPosType == Dominoe_POSTYPE.RIGHTTOP) {
                    leftPoint = leftPoints[1];
                } else {
                    leftPoint = leftPoints[0];
                }
            } else if (leftType == Global.paiType.RIGHT) {
                switch (leftPaiPosType) {
                    case Dominoe_POSTYPE.LEFT:
                    case Dominoe_POSTYPE.TOPLEFT:
                        leftPoint = leftPoints[1];
                        break;
                    case Dominoe_POSTYPE.TOPRIGHT:
                    case Dominoe_POSTYPE.RIGHT:
                        leftPoint = leftPoints[0];
                        break;
                }
            } else if (leftType == Global.paiType.LEFT) {
                switch (leftPaiPosType) {
                    case Dominoe_POSTYPE.LEFT:
                    case Dominoe_POSTYPE.TOPLEFT:
                    case Dominoe_POSTYPE.NONE:
                        leftPoint = leftPoints[0];
                        break;
                    case Dominoe_POSTYPE.TOPRIGHT:
                    case Dominoe_POSTYPE.RIGHT:
                        leftPoint = leftPoints[1];
                        break;
                }
            }

            let rightNode = this.allPai[this.allPai.length - 1];
            let rightPaiPosType = rightNode.getComponent(Dominoe_paiLogic).paiPosType;
            let rightPoints = rightNode.getComponent(Dominoe_paiLogic).points;
            let rightType = rightNode.getComponent(Dominoe_paiLogic).paiType;

            if (rightType == Global.paiType.VERTICALLY_0) {
                if (rightPaiPosType == Dominoe_POSTYPE.BOTTOM || rightPaiPosType == Dominoe_POSTYPE.RIGHTBOTTOM || rightPaiPosType == Dominoe_POSTYPE.LEFTBOTTOM) {
                    rightPoint = rightPoints[1];
                } else {
                    rightPoint = rightPoints[0];
                }
            } else if (rightType == Global.paiType.VERTICALLY_180) {
                if (rightPaiPosType == Dominoe_POSTYPE.BOTTOM || rightPaiPosType == Dominoe_POSTYPE.RIGHTBOTTOM || rightPaiPosType == Dominoe_POSTYPE.LEFTBOTTOM) {
                    rightPoint = rightPoints[0];
                } else {
                    rightPoint = rightPoints[1];
                }
            } else if (rightType == Global.paiType.RIGHT) {
                switch (rightPaiPosType) {
                    case Dominoe_POSTYPE.LEFT:
                    case Dominoe_POSTYPE.BOTTOMLEFT:
                        rightPoint = rightPoints[1];
                        break;
                    case Dominoe_POSTYPE.BOTTOMRIGHT:
                    case Dominoe_POSTYPE.RIGHT:
                        rightPoint = rightPoints[0];
                        break;
                }
            } else if (rightType == Global.paiType.LEFT) {
                switch (rightPaiPosType) {
                    case Dominoe_POSTYPE.LEFT:
                    case Dominoe_POSTYPE.BOTTOMLEFT:
                        rightPoint = rightPoints[0];
                        break;
                    case Dominoe_POSTYPE.BOTTOMRIGHT:
                    case Dominoe_POSTYPE.RIGHT:
                    case Dominoe_POSTYPE.NONE:
                        rightPoint = rightPoints[1];
                        break;
                }
            }
            return { leftPoint: leftPoint, rightPoint: rightPoint };
        }
    }

    //结算界面Func;
    showSettingData(data) {
        MessageSoundManager.playLoadEffect(this.victoryAudio);
        this.pointLayer.active = true;
        let players = data.players;
        let keys = Object.keys(players);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            const tempPlayers = players[key] as PlayerInfoModel;
            let id = players[key].id;
            this.userDataMap[id].player.getComponent(Dominoe_playerLogic).showSettintData(players[key]);
            let diamond = players[key].diamond;
            //如果自己是赢方，显示win动画;
            if (diamond > 0 && id == Global.userId) {
                this.winNode.active = true;
                this.caidai.active = true;
                let winDrag = this.winNode.getComponent(dragonBones.ArmatureDisplay);
                winDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    winDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    winDrag.playAnimation('chixv', 0);
                }, this);
                winDrag.playAnimation('kaishi', 1);
            }
        }

        // 显示结算界面;
        setTimeout(() => {
            if(this.node && this.node.active) {
                this.winNode.active = false;
                this.caidai.active = false;
                this.addSettingLayer(data);
            }
        }, 5000);
    }

    //添加结算界面；
    addSettingLayer(data) {
        let setting = cc.instantiate(this.settingLayer);
        setting.getComponent(Dominoe_settingLayerLogic).setLayerData(data);
        this.node.addChild(setting);
        this.settleLayer = setting;
    }

    //出牌;
    playPocker(pos: string, paiNode: cc.Node) {
        console.log(MessageData.gameRoomId);
        let id = MessageData.gameType == GameType.single ? MessageData.gameSource_Id : MessageData.gameRoomId;
        let url = MessageType.PLAYPOCKER + id + '/' + `?game_id=${MessageData.gameid}`;
        let pockerKey = paiNode.getComponent(Dominoe_paiLogic).key;
        let points = paiNode.getComponent(Dominoe_paiLogic).points;
        let postData = {}
        // if (MessageData.gameType == GameType.room) {
        postData = {
            user_id: Global.userId,
            position: pos,
            poker: { key: pockerKey, nums: points },
        };
        // } else {
        //     postData = {
        //         user_id: Global.userId,
        //         position: pos,
        //         poker: { key: pockerKey, nums: points },
        //         is_single: true
        //     };
        // }

        MessageManager.httpResult('post', url, postData, (data) => {
            console.log('playPocker data:');
        });

        if (Global.selectSendPocker) {
            Global.selectSendPocker = null;
        }

        /*
        let _points = this.selfPlayPocker.getComponent(Dominoe_paiLogic).points;
        let pNode = this.addPaiNode(_points);
        pNode.getComponent(Dominoe_paiLogic).showMeng = false;
        pNode.x = this.selfPlayPocker.x;
        pNode.y = this.selfPlayPocker.y;
        this.paiLayer.addChild(pNode);
        let selectNodeLeft: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(0);
        let selectNodeRight: cc.Node = this.paiLayer.getComponent(Dominoe_paiLayerLogic).getIndexSelectNode(1);
        switch(pos){
            case 'left':
                this.leftPaiArr.push(pNode);
                // this.selfPlayPocker.x = selectNodeLeft.x;
                // this.selfPlayPocker.y = selectNodeLeft.y;
                break;
            case 'right':
                this.rightPaiArr.push(pNode);
                // this.selfPlayPocker.x = selectNodeRight.x;
                // this.selfPlayPocker.y = selectNodeRight.y;
                break;
            case 'middle':
                // this.selfPlayPocker.x = 0;
                // this.selfPlayPocker.y = this.midPaiY;
                this.midPai = pNode;
                break;
        }
        this.selfPlayPocker.active = false;
        this.updateAllPai(null);
        */
    }

    //表情显示;
    setEmojiShow(displayId, msg) {
        let player = this.userDataMap[displayId].player;
        let playerHeadBG = player.getChildByName('headNode');
        let posX = player.x + playerHeadBG.x;
        let posY = player.y + playerHeadBG.y;
        Message.showEmoji([posX, posY], [96, 96], msg);
    }

    //切换前台;
    onAndroidResume(data) {
        MessageForRoom.getStatus(Global.gameRoomId);

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

    //切换到后台;
    onAndroidStop(data) {
        this.isReceiverMessage = false;
    }

    //更新当前状态；
    updateStatus(event) {
        this.isReceiverMessage = true;
        let data = event.statusData;
        //如果是匹配状态;
        if (data.status == "playing") {
            /** 清空所有数据之后重新走初始化流程 */
            Global.setpocker_object();
            const dynamicAddedNodes = this.paiLayer.children.filter(item => item.name !== 'boom' && item.name !== 'Selected');
            dynamicAddedNodes.forEach((item) => {
                item.destroy();
                item = null;
            });
            this.resetData();
            this.playingMessage(data);
            this.initShowUI(false);
        } else if (data.status == "matching" || data.status == "completed") {
            console.log('返回大厅',' id is ',data.id, ' and ',MessageData.gameid);
            // if(data.id === MessageData.gameid) {
                // }
            this.goHallScene();
        }
    }

    //网络波动;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            MessageForRoom.getStatus(Global.gameRoomId);
        }
    }

    //去大厅场景；
    goHallScene() {
        Global.isGameEnd = false;
        if (cc.director.getScene().name = 'gameScene') {
            // if (MessageData.gameType == GameType.single) {
            //     MessageForSingle.playAgain(() => { });
            // }
            cc.director.loadScene("MatchScene");
        }
    }

    //显示光;
    showGuang(startPos: cc.Vec2, endPos: cc.Vec2) {
        let midPos = cc.v2(0, 0);
        midPos.x = startPos.x + endPos.x;
        midPos.y = startPos.y + endPos.y;
        this.guanglu.active = true;
        this.guanglu.x = startPos.x;
        this.guanglu.y = startPos.y;

        let bzer = cc.bezierTo(1.2, [startPos, midPos, endPos]).easing(cc.easeOut(1.2));
        let call = cc.callFunc(() => {
            this.guanglu.active = false;
        });
        this.guanglu.runAction(cc.sequence(bzer, call));
    }

    //停止所有自己的牌;
    stopAllPaiAction() {
        for (let i = 0, len = this.allPai.length; i < len; i++) {
            this.allPai[i].stopAllActions();
        }
    }

    /**
     * 显示loding;
     * @param  {cc.Vec2} pos loading显示的位置信息
     */
    showLoading(pos) {
        if (this.loadingTimeCount >= 0) {
            clearTimeout(this.loadingTimeCount);
        }
        this.loadingTimeCount = setTimeout(() => {
            this.loadingNode.active = true;
            this.loadingNode.x = pos.x;
            this.loadingNode.y = pos.y;
        }, 1500);
    }

    //隐藏loading;
    hideLoading() {
        if (this.loadingTimeCount >= 0) {
            clearTimeout(this.loadingTimeCount);
            this.loadingTimeCount = -1;
        }
        this.loadingNode.active = false;
    }


    //调整所有牌的Y坐标;
    updateAllPaiYPos() {
        let len = this.allPai.length;
        if (!this.midPai || len == 0) {
            return;
        }
        //第一张牌和中牌的距离;
        let firstNodeY = this.allPai[0].y - this.midPaiY;
        //最后一张牌和中牌的距离;
        let lastNodeY = this.allPai[len - 1].y - this.midPaiY;
        if (firstNodeY == lastNodeY) {
            return;
        } else {
            let disparity = (firstNodeY + lastNodeY) / 2;
            let moveY = -disparity;
            for (let i = 0; i < len; i++) {
                let move = cc.moveBy(0.5, cc.v2(0, moveY));
                this.allPai[i].runAction(move);
            }
        }
    }


    getShowingpocker(messageData) {
        if (Global.isGodModel && MessageData.gameType == GameType.room) {
            // 房间模式 && 上帝模式 没有记牌器
            return;
        }
        let showPocker = [];
        const players = messageData.players;
        const keys = Object.keys(players);
        let pid: number = 0;
        let key: string = '';
        let selfData = null;
        //获取自己的数据;
        for (let i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            pid = Number(players[key].id);
            if (pid === Global.userId) {
                selfData = players[key];
                break;
            }
        }
        //自己的手牌;
        const poker_remain_list = selfData.poker_remain_list;
        //牌堆里面的牌;
        const poker_played = messageData.poker_played;
        if (!poker_remain_list || !poker_played) {
            return;
        }
        const left_pocket = poker_played.left;
        const middle_pocket = poker_played.middle;
        const right_pocket = poker_played.right;
        //将已知的牌组合在一起；
        showPocker = poker_remain_list;
        showPocker = showPocker.concat(left_pocket);
        showPocker = showPocker.concat(middle_pocket);
        showPocker = showPocker.concat(right_pocket);

        //已知牌的点数；
        let nums: number[] = [];
        for (let i = 0, len = showPocker.length; i < len; i++) {
            nums = showPocker[i].nums;
            if (nums) {
                Global.pocker_object[nums[0]][nums[1]]['isShow'] = true;
                Global.pocker_object[nums[1]][nums[0]]['isShow'] = true;
            }
        }
        this.setShowPointCount();
    }
    setShowPointCount() {
        let pockerIndexObj = {};
        let count: number = 0;
        for (let i = 0; i < 7; i++) {
            pockerIndexObj = Global.pocker_object[i.toString()];
            count = 0;
            for (let j = 0; j < 7; j++) {
                if (pockerIndexObj[j]['isShow']) {
                    count++;
                }
            }
            this.showPointCount[i].getChildByName('countLabel').getComponent(cc.Label).string = `${7 - count}`;
        }
    }

    showPoint_start(event) {
        /** 点击的是底下的哪个 (牌计数器的点) */
        let point = event.point;
        this.showPointPocker.active = true;
        /** 这里设置了所有牌的蒙层显示状态 */
        this.showPointPocker.getComponent(showPointPockerLogic).setShowPoint(point);
    }
    //隐藏当前出牌情况；
    showPoint_end() {
        this.showPointPocker.active = false;
    }

    isRobotBtnClick = false
    robotBtn() {
        if (this.isRobotBtnClick) return;
        this.isRobotBtnClick = true;
        console.log("发送robotBtn请求");
        let data = {
            "source": "chatroom", //chatroom/single
            "source_id": MessageData.gameSource_Id,      //room_id
            "game_id": MessageData.gameid,        //game_id, 不为空则优先此值匹配游戏
        }

        MessageManager.httpResult('post', `v1/${MessageData.gameName}/comeback`, data, (data) => {
            this.scheduleOnce(() => {
                this.isRobotBtnClick = false;
            }, 2)
            if (data.status == "OK")
                this.iconRobot.active = false;
        })
    }
    showRuleLogic() {
        this.RuleLogic.active = true;
        if(Global.gameMode === GameModeDominoe.ROUND) {
            this.oneRoundRuleNode.active = true;
            this.scoreRuleNode.active = false;
        } else {
            this.scoreRuleNode.active = true;
            this.oneRoundRuleNode.active = false;
        }
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
