import Message from "../../../Script/CommonScripts/Utils/Message";
import MessageForRoom from "../../../Script/CommonScripts/Utils/MessageForRoom";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import MessageSoundManager from "../../../Script/CommonScripts/Utils/MessageSoundManager";
import MessageType from "../../../Script/CommonScripts/Utils/MessageType";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";
import ResourcesManager from "../../../Script/CommonScripts/Utils/ResourcesManager";
import Global from "../Global/SFGlobalGameData";
import { SFMessageManager } from "../sfMessageManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class gameLogic extends cc.Component {

    @property(cc.Prefab)
    sheepMaxPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    sheepBigPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    sheepMidPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    sheepSmallPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bullMaxPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bullBigPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bullMidPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bullSmallPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    SpecialEffectsPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    selfHead: cc.Sprite = null;

    @property(cc.Prefab)
    SettlementLayer: cc.Prefab = null;

    @property(cc.Node)
    redHeadArr: cc.Node[] = [];

    @property(cc.Node)
    blueHeadArr: cc.Node[] = [];

    @property({ type: cc.AudioClip })
    bullBigAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    bullMaxAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    bullMidAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    bullSmallAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    sheepBigAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    sheepMaxAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    sheepMidAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    sheepSmallAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    settleAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    deductionAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    gameBGM: cc.AudioClip = null;

    @property(cc.Node)
    redDifferenceLabel: cc.Node = null;

    @property(cc.Node)
    blueDifferenceLabel: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Prefab)
    collisionNode: cc.Prefab = null;

    @property(cc.Prefab)
    noMorePrefab: cc.Prefab = null;

    @property(cc.Node)
    hintNode: cc.Node = null;

    @property(cc.Node)
    touchShow: cc.Node = null;

    @property(cc.Prefab)
    rulePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    depositPrefab: cc.Prefab = null;

    @property(cc.JsonAsset)                                 //emoji表情映射json；
    emojiJson: cc.JsonAsset = null;

    @property(cc.Node)
    emojiNode: cc.Node = null;

    @property(cc.Node)
    emojiBtn: cc.Node = null;

    @property(cc.Node)
    timeImg:cc.Node = null;

    private user1UI: cc.Node = null;                     //用户1;        
    private user2UI: cc.Node = null;                     //用户2;        
    private user3UI: cc.Node = null;                     //用户3;        
    private user4UI: cc.Node = null;                     //用户4;        
    private userSelf: cc.Node = null;                    //用户自己;  
    private coinpool: cc.Node = null;                    //金币池;
    private coinLabel: cc.Label = null;                  //金币label;  
    private coinValue: number = 0;                       //金币值;
    private coinMaxValue: number = 0;                    //金币的最大值;
    private coinNodeArr: cc.Node[] = [];                 //金币节点数组;
    private readyAnimal: cc.Node = null;                 //当前准备阶段的动物;    
    private isCantouch: boolean = false;                 //当前是否允许触摸;
    private animalLayer: cc.Node = null;                 //动物移动层;
    private HPRedProgressBar: cc.ProgressBar = null;     //红色进度条;
    private HPBlueProgressBar: cc.ProgressBar = null;    //蓝色进度条;
    private custom: number = -1;                         //跑道值;
    private needGetBulletNo: boolean = true;             //是否需要获取当前应该得到放置的值;
    private selfBullets: number[] = [];                  //自己羊的数组;
    private bulletsIndex: number = 0;                    //获取自己羊的数组下标;
    private blueScore: number = 0;                       //蓝色方得分;                     
    private redScore: number = 0;                        //红色方得分；
    private isCanSend: boolean = true;                   //是否可以发送消息;  
    private hintNodeIsShow: boolean = false;             //手指提示是否有显示;
    private countTime: number = -1;                      //倒计时的计时器;
    private SpecialEffectsPool: cc.NodePool = null;      //出现牛羊的时候的显示动画;
    private collisionNodePool: cc.NodePool = null;       //撞击烟雾的动画;
    private channelId: string = '';                      //当局游戏的channelId;
    private isComparedChannelId: boolean = false;        //是否去对比channelID是否相同;
    private isShowSettlementLayer: boolean = false;      //是否显示了结算界面;
    private settleLayer: cc.Node = null;                 //结算界面;
    private isStartCountTime: boolean = false;           //是否开启了倒计时;
    private isUpdate: boolean = false;                   //是否开启update;
    private countTimeNum: number = 1;                    //update基准值;
    private start_duration: number = 0;                  //开场时间;
    private isonAndroidResume: boolean = false;          //是否是切换回前台操作;
    private selfIsGame: boolean = false;                 //自己是否参加了阵营;
    private bullMaxPool: cc.NodePool = null;
    private bullBigPool: cc.NodePool = null;
    private bullMidPool: cc.NodePool = null;
    private bullSmallPool: cc.NodePool = null;
    private sheepMaxPool: cc.NodePool = null;
    private sheepBigPool: cc.NodePool = null;
    private sheepMidPool: cc.NodePool = null;
    private sheepSmallPool: cc.NodePool = null;
    private isOnAndroidStop: boolean = false;            //是否切换到游戏后台了;
    private CampType = {                                //阵营;
        RED: 0,
        BLUE: 1
    }
    private selfCamp: number = -1;                       //自己的阵营；
    private isSetHead: boolean = false;                  //是否已经设置用户头像等;
    private linesObj = [
        { red_bullets: [], blue_bullets: [] },
        { red_bullets: [], blue_bullets: [] },
        { red_bullets: [], blue_bullets: [] },
        { red_bullets: [], blue_bullets: [] },
        { red_bullets: [], blue_bullets: [] }
    ];
    private playerIdMap = new Map();
    private isCanSendEmoji: boolean = false;                  //当前是否能发送emoji;


    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        this.SpecialEffectsPool = new cc.NodePool();
        this.collisionNodePool = new cc.NodePool();
        this.bullMaxPool = new cc.NodePool();
        this.bullBigPool = new cc.NodePool();
        this.bullMidPool = new cc.NodePool();
        this.bullSmallPool = new cc.NodePool();
        this.sheepMaxPool = new cc.NodePool();
        this.sheepMidPool = new cc.NodePool();
        this.sheepBigPool = new cc.NodePool();
        this.sheepSmallPool = new cc.NodePool();
    }

    start() {
        this.init();
        this.addEventDispatch();
        if (MessageSoundManager.audioEngineOn) {
            cc.audioEngine.playMusic(this.gameBGM, true);
        }
        if (!Global.isShowHint &&
            (Global.nowGameType == Global.gameType.SoloMode || Global.nowGameType == Global.gameType.MultiplayerMode)) {
            this.hintNode.active = true;
            this.hintNodeIsShow = true;
            this.selfIsGame = true;
        }
    }

    //退出游戏;
    exitGame() {
        let testExiturl = `${MessageManager.CHAT_API_CONST_PATH}v1/chatroom/${Global.gameRoomId}/game/guest/leave/?game_source=cocos`;
        MessageManager.httpTestUserResult('post', testExiturl, {}, (data) => {
            //console.log('exit test:');
            //console.log(data);
        });
    }

    init() {
        this.user1UI = this.node.getChildByName('user1UI');
        this.user2UI = this.node.getChildByName('user2UI');
        this.user3UI = this.node.getChildByName('user3UI');
        this.user4UI = this.node.getChildByName('user4UI');
        this.userSelf = this.node.getChildByName('userSelf');
        this.user1UI.zIndex = 6;
        this.user2UI.zIndex = 6;
        this.user3UI.zIndex = 6;
        this.user4UI.zIndex = 6;
        this.userSelf.zIndex = 6;

        this.animalLayer = this.node.getChildByName('animalLayer');
        this.coinpool = this.node.getChildByName('coinpool');
        this.HPRedProgressBar = this.node.getChildByName('HPRedProgressBar').getComponent(cc.ProgressBar);
        this.HPBlueProgressBar = this.node.getChildByName('HPBlueProgressBar').getComponent(cc.ProgressBar);
        if (Global.nowGameType == Global.gameType.SoloMode || Global.nowGameType == Global.gameType.MultiplayerMode) {
            this.isCantouch = true;
        }
        this.HPRedProgressBar.node.zIndex = 5;
        this.HPBlueProgressBar.node.zIndex = 5;
        this.node.getChildByName('BD').zIndex = 5;
        this.node.getChildByName('BT').zIndex = 5;
        // this.node.getChildByName('')
        this.coinLabel = this.node.getChildByName('coinLabel').getComponent(cc.Label);

        if (!Global.gameRoomId || Global.gameRoomId == '') {
            MessageForRoom.getRoomInfo((roomInfo) => {
                Global.gameRoomId = roomInfo['room_id'];
                Global.shareUrl = roomInfo['share_url'];
            });
        }

        this.timeLabel.node.zIndex = 6;
        this.timeImg.zIndex = 6;
    }

    //事件派发回调；
    addEventDispatch() {
        //倒计时准备好了;
        MyEvent.I.on('icon_ready', this.emitRunNode.bind(this), this.node);
        //接受服务器消息;
        MyEvent.I.on('emit_message', this.receiveMessage.bind(this), this.node);
        //显示碰撞效果;
        MyEvent.I.on('collider', this.showColliderNode.bind(this), this.node);
        //重新获取纹理显示数组;
        MyEvent.I.on('needGetBulletNo', () => {
            this.needGetBulletNo = true;
        }, this.node);
        //获取游戏状态；
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //切换到游戏后台;
        MyEvent.I.on('onAndroidStop', () => {
            this.isOnAndroidStop = true;
        }, this.node);
        //金币move结束;
        MyEvent.I.on('coinMoveOver', this.coinMoveOver.bind(this), this.node);
        //余额不足;
        MyEvent.I.on('insufficientBalance', this.insufficientBalanceFunc.bind(this), this.node);
    }

    //显示碰撞时候的烟雾;
    showColliderNode(event) {
        let showNodePos = event.showPos;
        let showNode = this.collisionNodePool.get();
        if (!showNode) {
            showNode = cc.instantiate(this.collisionNode);
        }
        showNode.x = showNodePos[0];
        showNode.y = showNodePos[1];
        this.node.addChild(showNode);
        let showNodeDrag = showNode.getComponent(dragonBones.ArmatureDisplay);
        showNodeDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            showNodeDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.collisionNodePool.put(showNode);
        }, this);
        showNodeDrag.playAnimation('newAnimation', 1);
    }

    //增加金币显示;
    addCoinRunMove(players) {
        this.coinValue = 0;
        this.coinMaxValue = players.length * 100;
        this.coinNodeArr = [];
        this.coinLabel.string = String(this.coinValue);
        for (let i = 0, len = players.length; i < len; i++) {
            let user = players[i];
            let userDi = user.getChildByName('userDi');
            let coin = cc.instantiate(this.coinPrefab);
            this.node.addChild(coin);
            coin.zIndex = 7;
            coin.getComponent('coinmoveLogic').runCoinAction(cc.v2(userDi.x, userDi.y), cc.v2(this.coinpool.x - 48, this.coinpool.y));
            this.coinNodeArr.push(coin);
        }
    }

    //游戏币；
    coinMoveOver() {
        this.coinValue += 10;
        if (this.coinValue > this.coinMaxValue) {
            this.coinValue = this.coinMaxValue;
        }
        this.coinLabel.string = String(this.coinValue);
        if (this.coinValue == this.coinMaxValue) {
            setTimeout(() => {
                for (let i = 0, len = this.coinNodeArr.length; i < len; i++) {
                    this.coinNodeArr[i].destroy();
                    this.coinNodeArr[i] = null;
                }
                this.coinNodeArr = null;
            }, 1000);
        }
    }

    //根据当前游戏状态，显示内容;
    showGameType(players) {
        let playerHeads = [];
        switch (Global.nowGameType) {
            case Global.gameType.GodSoloMode:
                this.coinpool.y = 129;
                this.coinLabel.node.y = 129;
                this.user3UI.active = true;
                this.user2UI.active = false;
                this.user4UI.active = false;
                this.userSelf.active = false;
                let userDi = this.user3UI.getChildByName('userDi');
                let iconDI = this.user3UI.getChildByName('iconDI');
                userDi.y = -248;
                iconDI.y = -248;
                let redPlayId = players.red[0].id;
                this.user1UI.getComponent('userHeadLogic').setPlayerId(redPlayId);
                let bluePlayId = players.blue[0].id;
                this.user3UI.getComponent('userHeadLogic').setPlayerId(bluePlayId);
                playerHeads = [this.user1UI, this.user3UI];
                this.playerIdMap[redPlayId] = this.user1UI;
                this.playerIdMap[bluePlayId] = this.user3UI;
                break;
            case Global.gameType.GodMultiplayerMode:
                this.coinpool.y = 129;
                this.coinLabel.node.y = 129;
                this.user2UI.active = true;
                this.user3UI.active = true;
                this.user3UI.getChildByName('userDi').y = -159;
                this.user3UI.getChildByName('iconDI').y = -159;
                this.user4UI.active = true;
                this.userSelf.active = false;
                this.user1UI.getComponent('userHeadLogic').setPlayerId(players.red[0].id);
                this.user2UI.getComponent('userHeadLogic').setPlayerId(players.red[1].id);
                this.user3UI.getComponent('userHeadLogic').setPlayerId(players.blue[0].id);
                this.user4UI.getComponent('userHeadLogic').setPlayerId(players.blue[1].id);
                playerHeads = [this.user1UI, this.user2UI, this.user3UI, this.user4UI];

                this.playerIdMap[players.red[0].id] = this.user1UI;
                this.playerIdMap[players.red[1].id] = this.user2UI;
                this.playerIdMap[players.blue[0].id] = this.user3UI;
                this.playerIdMap[players.blue[1].id] = this.user4UI;
                break;
            case Global.gameType.SoloMode:
                this.coinpool.y = 129;
                this.coinLabel.node.y = 129;
                this.user3UI.active = false;
                this.user2UI.active = false;
                this.user4UI.active = false;
                this.userSelf.active = true;
                if (Global.userCamp == 'red') {
                    this.user1UI.getComponent('userHeadLogic').setPlayerId(players.blue[0].id);
                    this.playerIdMap[players.blue[0].id] = this.user1UI;
                } else if (Global.userCamp == 'blue') {
                    this.user1UI.getComponent('userHeadLogic').setPlayerId(players.red[0].id);
                    this.playerIdMap[players.red[0].id] = this.user1UI;
                }
                playerHeads = [this.user1UI, this.userSelf];
                break;
            case Global.gameType.MultiplayerMode:
                this.coinpool.y = 180;
                this.coinLabel.node.y = 180;
                this.user3UI.active = true;
                this.user2UI.active = true;
                this.user4UI.active = false;
                this.userSelf.active = true;
                //自己是红色阵营;
                if (Global.userCamp == 'red') {
                    this.user1UI.getComponent('userHeadLogic').setPlayerId(players.blue[0].id);
                    this.user2UI.getComponent('userHeadLogic').setPlayerId(players.blue[1].id);
                    this.playerIdMap[players.blue[0].id] = this.user1UI;
                    this.playerIdMap[players.blue[1].id] = this.user2UI;
                    if (players.red[0].id == Global.userId) {
                        this.user3UI.getComponent('userHeadLogic').setPlayerId(players.red[1].id);
                        this.playerIdMap[players.red[1].id] = this.user3UI;
                    } else if (players.red[1].id == Global.userId) {
                        this.user3UI.getComponent('userHeadLogic').setPlayerId(players.red[0].id);
                        this.playerIdMap[players.red[0].id] = this.user3UI;
                    }
                } else if (Global.userCamp == 'blue') {
                    this.user1UI.getComponent('userHeadLogic').setPlayerId(players.red[0].id);
                    this.user2UI.getComponent('userHeadLogic').setPlayerId(players.red[1].id);
                    this.playerIdMap[players.red[0].id] = this.user1UI;
                    this.playerIdMap[players.red[1].id] = this.user2UI;
                    if (players.blue[0].id == Global.userId) {
                        this.user3UI.getComponent('userHeadLogic').setPlayerId(players.blue[1].id);
                        this.playerIdMap[players.blue[1].id] = this.user3UI;
                    } else if (players.blue[1].id == Global.userId) {
                        this.user3UI.getComponent('userHeadLogic').setPlayerId(players.blue[0].id);
                        this.playerIdMap[players.blue[0].id] = this.user3UI;
                    }
                }
                playerHeads = [this.user1UI, this.user2UI, this.user3UI, this.userSelf];
                break;
        }
        this.isCanSendEmoji = true;
        this.addCoinRunMove(playerHeads);
        let code = Number(MessageManager.getUrlParameterValue('vcode'));
        if(Global.nowGameType != Global.gameType.GodSoloMode && 
            Global.nowGameType != Global.gameType.GodMultiplayerMode && code >= 13100){
            // this.emojiNode.active = true;
            this.emojiNode.zIndex = 8;
            this.emojiBtn.zIndex = 8;
            
        }
    }

    //设置用户头像；
    setHeadShow(players) {
        this.isSetHead = true;
        let blueTeam = players.blue;
        let redTeam = players.red;
        //自己参与的1v1solo模式;
        if (Global.nowGameType == Global.gameType.SoloMode) {
            //找出自己的阵营;
            for (let i = 0, len = blueTeam.length; i < len; i++) {
                if (blueTeam[i]) {
                    let id = blueTeam[i].id;
                    if (id == Global.userId) {
                        this.selfCamp = this.CampType.BLUE;
                        let avater = blueTeam[i].avatar;
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                this.selfHead.spriteFrame = new cc.SpriteFrame(spr);
                                this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                this.selfHead.spriteFrame = res;
                                this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                            });
                        });
                        break;
                    }
                }
            }

            //说明自己不再蓝色阵营,是在红色阵营;
            if (this.selfCamp == -1) {
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    if (redTeam[i]) {
                        let id = redTeam[i].id;
                        if (id == Global.userId) {
                            this.HPRedProgressBar.node.y = -292;
                            this.HPBlueProgressBar.node.y = 405;
                            this.selfCamp = this.CampType.RED;
                            let avater = redTeam[i].avatar;
                            ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                                if (spr) {
                                    this.selfHead.spriteFrame = new cc.SpriteFrame(spr);
                                    this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                    this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                    return;
                                }
                                cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                    if (err) {
                                        return;
                                    }
                                    this.selfHead.spriteFrame = res;
                                    this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                    this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                });
                            });
                            break;
                        }
                    }
                }

                for (let i = 0, len = blueTeam.length; i < len; i++) {
                    if (blueTeam[i]) {
                        let id = blueTeam[i].id;
                        let avater = blueTeam[i].avatar;
                        let head = this.user1UI.getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                head.getComponent(cc.Sprite).spriteFrame = res;
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                            });
                        });
                    }
                }
            }
            //自己是蓝色阵营;
            else {
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    if (redTeam[i]) {
                        let id = redTeam[i].id;
                        let avater = redTeam[i].avatar;
                        let head = this.user1UI.getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                head.getComponent(cc.Sprite).spriteFrame = res;
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                            });
                        });
                        break;

                    }
                }
            }

        }
        //自己参与的2v2模式；
        else if (Global.nowGameType == Global.gameType.MultiplayerMode) {
            //找出自己的阵营;
            for (let i = 0, len = blueTeam.length; i < len; i++) {
                if (blueTeam[i]) {
                    let id = blueTeam[i].id;
                    if (id == Global.userId) {
                        this.selfCamp = this.CampType.BLUE;
                        let avater = blueTeam[i].avatar;
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                this.selfHead.spriteFrame = new cc.SpriteFrame(spr);
                                this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                this.selfHead.spriteFrame = res;
                                this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                            });
                        });
                        break;
                    }
                }
            }

            //说明自己不在蓝色阵营,是在红色阵营;
            if (this.selfCamp == -1) {
                //设置红色阵营；
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    if (redTeam[i]) {
                        let id = redTeam[i].id;
                        let avater = redTeam[i].avatar;
                        if (id == Global.userId) {
                            this.HPRedProgressBar.node.y = -292;
                            this.HPBlueProgressBar.node.y = 405;
                            this.selfCamp = this.CampType.RED;
                            ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                                if (spr) {
                                    this.selfHead.spriteFrame = new cc.SpriteFrame(spr);
                                    this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                    this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                    return;
                                }
                                cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                    if (err) {
                                        return;
                                    }
                                    this.selfHead.spriteFrame = res;
                                    this.selfHead.node.scaleX = 64 / this.selfHead.node.width;
                                    this.selfHead.node.scaleY = 64 / this.selfHead.node.height;
                                });
                            });
                            break;
                        } else {
                            let head = this.user3UI.getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                            ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                                if (spr) {
                                    head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                                    head.scaleX = 64 / head.width;
                                    head.scaleY = 64 / head.height;
                                    return;
                                }
                                cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                    if (err) {
                                        return;
                                    }
                                    head.getComponent(cc.Sprite).spriteFrame = res;
                                    head.scaleX = 64 / head.width;
                                    head.scaleY = 64 / head.height;
                                });
                            });
                        }
                    }
                }

                let blueHeadArr = [this.user1UI, this.user2UI];
                //设置蓝色阵营；
                for (let i = 0, len = blueTeam.length; i < len; i++) {
                    if (blueTeam[i]) {
                        let id = blueTeam[i].id;
                        let avater = blueTeam[i].avatar;
                        let head = blueHeadArr[i].getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                head.getComponent(cc.Sprite).spriteFrame = res;
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                            });
                        });
                    }
                }
            } else {
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    let redHeadArr = [this.user1UI, this.user2UI];
                    //设置蓝色阵营；
                    if (redTeam[i]) {
                        let id = redTeam[i].id;
                        let avater = redTeam[i].avatar;
                        let head = redHeadArr[i].getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                        ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                            if (spr) {
                                head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                                return;
                            }
                            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                                if (err) {
                                    return;
                                }
                                head.getComponent(cc.Sprite).spriteFrame = res;
                                head.scaleX = 64 / head.width;
                                head.scaleY = 64 / head.height;
                            });
                        });
                    }
                }
            }

        }
        //上帝1v1模式；
        else if (Global.nowGameType == Global.gameType.GodSoloMode) {
            for (let i = 0, len = blueTeam.length; i < len; i++) {
                if (blueTeam[i]) {
                    let id = blueTeam[i].id;
                    let avater = blueTeam[i].avatar;
                    let head = this.user4UI.getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                    ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                        if (spr) {
                            head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                            return;
                        }
                        cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                            if (err) {
                                return;
                            }
                            head.getComponent(cc.Sprite).spriteFrame = res;
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                        });
                    });
                }
            }

            for (let i = 0, len = redTeam.length; i < len; i++) {
                if (redTeam[i]) {
                    let id = redTeam[i].id;
                    let avater = redTeam[i].avatar;
                    let head = this.user1UI.getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                    ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                        if (spr) {
                            head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                            return;
                        }
                        cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                            if (err) {
                                return;
                            }
                            head.getComponent(cc.Sprite).spriteFrame = res;
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                        });
                    });
                }
            }
        }
        //上帝模式2v2；
        else if (Global.nowGameType == Global.gameType.GodMultiplayerMode) {
            let redHeadArr = [this.user1UI, this.user2UI];
            let bluedArr = [this.user1UI, this.user2UI];
            for (let i = 0, len = blueTeam.length; i < len; i++) {
                if (blueTeam[i]) {
                    let id = blueTeam[i].id;
                    let avater = blueTeam[i].avatar;
                    let head = bluedArr[i].getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                    ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                        if (spr) {
                            head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                            return;
                        }
                        cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                            if (err) {
                                return;
                            }
                            head.getComponent(cc.Sprite).spriteFrame = res;
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                        });
                    });
                }
            }

            for (let i = 0, len = redTeam.length; i < len; i++) {
                if (redTeam[i]) {
                    let id = redTeam[i].id;
                    let avater = redTeam[i].avatar;
                    let head = redHeadArr[i].getChildByName('userDi').getChildByName('headMask').getChildByName('headIcon');
                    ResourcesManager.loadHeadImag(avater, id, 2, (spr) => {
                        if (spr) {
                            head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                            return;
                        }
                        cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                            if (err) {
                                return;
                            }
                            head.getComponent(cc.Sprite).spriteFrame = res;
                            head.scaleX = 64 / head.width;
                            head.scaleY = 64 / head.height;
                        });
                    });
                }
            }
        }

        this.showGameType(players);
        if (this.selfCamp >= 0) {
            this.userSelf.getComponent('userSelfLogic').setSelfCamp(this.selfCamp);
        }
    }

    //获取下一个放置的羊;
    getSelfBullets(players) {
        if (Global.nowGameType == Global.gameType.GodSoloMode ||
            Global.nowGameType == Global.gameType.GodMultiplayerMode) {
            this.needGetBulletNo = false;
            return;
        }
        let blueTeam = players.blue;
        let redTeam = players.red;
        let isGet = false;
        for (let i = 0, len = blueTeam.length; i < len; i++) {
            if (blueTeam[i]) {
                let id = blueTeam[i].id;
                if (id == Global.userId) {
                    let bullets = blueTeam[i].bullets;
                    this.selfBullets = bullets;
                    this.bulletsIndex = 0;
                    this.needGetBulletNo = false;
                    this.userSelf.getComponent('userSelfLogic').concatRandIcom(this.selfBullets);
                    isGet = true;
                }
            }
        }

        if (!isGet) {
            for (let i = 0, len = redTeam.length; i < len; i++) {
                if (redTeam[i]) {
                    let id = redTeam[i].id;
                    if (id == Global.userId) {
                        let bullets = redTeam[i].bullets;
                        this.selfBullets = bullets;
                        this.bulletsIndex = 0;
                        this.needGetBulletNo = false;
                        this.userSelf.getComponent('userSelfLogic').concatRandIcom(this.selfBullets);
                        isGet = true;
                    }
                }
            }
        }

    }

    //接收到服务器消息;
    receiveMessage(data) {
        //收到服务器消息； 
        let method = data.data.method;
        if (method == 'sf_playing') {
            if (this.isOnAndroidStop) {
                return;
            }
            SFMessageManager.continueGame(3);
            if (!this.channelId || this.channelId == '') {
                this.channelId == data.data.channel.id;
            }
            //记录下的channelId 和当前的channelId是否相同;
            if (this.isComparedChannelId && this.channelId) {
                if (this.channelId != data.data.channel.id) {
                    // NDB 刷新页面
                    NDB.onAndroidReload();
                }
            }
            let eData = data.data.data;
            let players = eData.players;
            let situation = eData.situation;
            let action = eData.action;

            //加速socket;
            if (action == 'quicken') {
                let situation = eData.situation;
                if (situation) {
                    let quicken_player = situation.quicken_player;
                    if (quicken_player != Global.userId) {
                        let userNode = this.playerIdMap[quicken_player];
                        if (userNode) {
                            userNode.getComponent('userHeadLogic').setSpeedType();
                        }
                    }
                }
            } else {
                if (!this.isStartCountTime) {
                    let start_duration = eData.start_duration;
                    this.setTimeLabel(start_duration);
                }
                //去设置头像显示等功能;
                if (!this.isSetHead) {
                    this.setHeadShow(players);
                }
                //当前是否需要去获取自己该放置应该放的羊值;
                if (this.needGetBulletNo) {
                    this.getSelfBullets(players);
                }
                //设置icon显示；
                this.setPlayerIcon(players);
                //对比服务器数据和自己本地数据，做差异化处理；
                this.comparedLinesData(situation);
                //设置进度条；
                this.nodePassEmitBack(situation);

                //如果为切换前台的;
                if (this.isonAndroidResume) {
                    this.isonAndroidResume = false;
                    this.refreshAllNodePos(situation);
                }
            }
        } else if (method == 'sf_completed') {
            //游戏已经结束，结束当前对socket的监听;
            SFMessageManager.isStartContinue = false;
            SFMessageManager.clearStartContinue();
            this.isUpdate = false;
            //停止倒计时;
            if (this.countTime >= 0) {
                clearInterval(this.countTime);
            }
            let situation = data.data.data.situation;
            this.nodePassEmitBack(situation);
            //游戏结束;
            let settleLayer = cc.instantiate(this.SettlementLayer);
            settleLayer.getComponent('settleLayerLogic').getSettleData(data.data);
            settleLayer.zIndex = 10;
            this.node.addChild(settleLayer);
            this.settleLayer = settleLayer;
            this.isShowSettlementLayer = true;
            //清空所有的牛和羊;
            this.clearAllAnimaNode();
            MessageSoundManager.playLoadEffect(this.settleAudio);
        } else if (method == 'response_ws_status') {
            this.request_ws_status(data);
        } else if (method == 'emoji_on_mic') {
            let displayId = data.data.data.user.display_id;
            let msg = data.data.data.msg;
            if (this.isShowSettlementLayer) {
                this.settleLayer.getComponent('settleLayerLogic').setEmojiShow(displayId, msg);
            } else {
                this.setEmojiShow(displayId, msg);
            }
        } else if (method == 'updateVolumeIndication') {
            this.setPlayerSpeakAction(data.data.speakers);
        }
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
                uid = Global.userId;
                if(Global.nowGameType != Global.gameType.GodSoloMode && 
                    Global.nowGameType != Global.gameType.GodMultiplayerMode){
                        this.userSelf.getComponent('userSelfLogic').setPlayerSpeakType();
                }
            } else {
                if (this.playerIdMap[uid]) {
                    this.playerIdMap[uid].getComponent('userHeadLogic').setPlayerSpeakType();
                }
            }
        }
    }

    //设置表情显示;
    setEmojiShow(displayId, msg) {
        if (displayId == Global.userId) {
            // 
            Message.showEmoji([-270, -327], [74, 74], msg);
            return;
        }
        let headArr = [this.user1UI, this.user2UI, this.user3UI, this.user4UI];
        for (let i = 0; i < 4; i++) {
            let playerId = headArr[i].getComponent('userHeadLogic').getPlayerId();
            if (playerId == displayId) {
                let di = headArr[i].getChildByName('userDi');
                console.log('di position is ',di.x,di.y);
                Message.showEmoji([di.x, di.y], [58, 58], msg);
                break;
            }
        }
    }

    //设置下一个放的是什么类型的羊;
    setPlayerIcon(players) {
        //1v1solo;
        if (Global.nowGameType == Global.gameType.SoloMode) {
            let redTeam = players.red;
            let blueTeam = players.blue;

            if (this.selfCamp == this.CampType.RED) {
                let bullets = blueTeam[0]['bullets'];
                let status = blueTeam[0].status;
                this.user1UI.getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'blue', bullets.length, status);
                let selfStatus = redTeam[0].status;
                this.userSelf.getComponent('userSelfLogic').setUserStatus(selfStatus);
            } else if (this.selfCamp == this.CampType.BLUE) {
                let bullets = redTeam[0]['bullets'];
                let status = redTeam[0].status;
                this.user1UI.getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'red', bullets.length, status);
                let selfStatus = blueTeam[0].status;
                this.userSelf.getComponent('userSelfLogic').setUserStatus(selfStatus);
            }
        }
        //2v2;
        else if (Global.nowGameType == Global.gameType.MultiplayerMode) {
            if (this.selfCamp == this.CampType.RED) {
                let blueTeam = players.blue;
                let redTeam = players.red;
                for (let i = 0, len = blueTeam.length; i < len; i++) {
                    let bullets = blueTeam[i]['bullets'];
                    let status = blueTeam[i].status;
                    this.redHeadArr[i].getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'blue', bullets.length, status);
                }
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    let id = redTeam[i].id;
                    let status = redTeam[i].status;
                    if (id != Global.userId) {
                        let bullets = redTeam[i]['bullets'];
                        this.user3UI.getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'red', bullets.length, status);
                    } else {
                        this.userSelf.getComponent('userSelfLogic').setUserStatus(status);
                    }
                }
            } else if (this.selfCamp == this.CampType.BLUE) {
                let redTeam = players.red;
                let blueTeam = players.blue;
                for (let i = 0, len = redTeam.length; i < len; i++) {
                    let bullets = redTeam[i]['bullets'];
                    let status = redTeam[i].status;
                    this.redHeadArr[i].getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'red', bullets.length, status);
                }
                for (let i = 0, len = blueTeam.length; i < len; i++) {
                    let id = blueTeam[i].id;
                    let status = blueTeam[i].status;
                    if (id != Global.userId) {
                        let bullets = blueTeam[i]['bullets'];
                        this.user3UI.getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'blue', bullets.length, status);
                    } else {
                        this.userSelf.getComponent('userSelfLogic').setUserStatus(status);
                    }
                }
            }
        }
        //上帝模式;
        else if (Global.nowGameType == Global.gameType.GodSoloMode ||
            Global.nowGameType == Global.gameType.GodMultiplayerMode) {
            let blueTeam = players.blue;
            let redTeam = players.red;
            for (let i = 0, len = blueTeam.length; i < len; i++) {
                let bullets = blueTeam[i]['bullets'];
                let status = blueTeam[i].status;
                this.blueHeadArr[i].getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'blue', bullets.length, status);
            }
            for (let i = 0, len = redTeam.length; i < len; i++) {
                let bullets = redTeam[i]['bullets'];
                let status = redTeam[i].status;
                this.redHeadArr[i].getComponent('userHeadLogic').setIconSpriteFrame(bullets[0], 'red', bullets.length, status);
            }
        }
    }

    //对比数据;
    comparedLinesData(linesData) {
        //线数据；
        let lines = linesData.lines;

        for (let i = 0; i < 5; i++) {
            //第i条线的蓝色数据与本地数据做比较；
            let red_bullets = lines[i].red_bullets;
            let blue_bullets = lines[i].blue_bullets;
            if (red_bullets.length == 0) {
                let selfRed_bullets = this.linesObj[i].red_bullets;
                let redLen = selfRed_bullets.length;
                if (redLen > 0) {
                    for (let j = 0; j < redLen; j++) {
                        selfRed_bullets[j].destroy();
                        selfRed_bullets[j] = null;
                    }
                    this.linesObj[i].red_bullets = [];
                }
            } else {
                this.comparedRedTrack(i, red_bullets);
            }

            //第i条线的红色数据与本地数据做比较；
            if (blue_bullets.length == 0) {
                let selfBlue_bullets = this.linesObj[i].blue_bullets;
                let blueLen = selfBlue_bullets.length;
                if (blueLen > 0) {
                    for (let j = 0; j < blueLen; j++) {
                        selfBlue_bullets[j].destroy();
                        selfBlue_bullets[j] = null;
                    }
                    this.linesObj[i].blue_bullets = [];
                }
            } else {
                this.comparedBlueTrack(i, blue_bullets);
            }
        }
    }

    //跑道中红色节点对比;
    comparedRedTrack(track, sData) {
        //获取数据第0个的创建时间；
        let dataCreate_at = String(sData[0].create_at);
        //第几个资源与数据第0个相同；
        let identicalIndex = -1;
        for (let r = 0, redLen = this.linesObj[track].red_bullets.length; r < redLen; r++) {
            let redCreateTime = this.linesObj[track].red_bullets[r].getComponent('animalLogic').createTime;
            if (redCreateTime == dataCreate_at) {
                identicalIndex = r;
                break;
            }
        }
        //删除多余的资源；
        if (identicalIndex > 0) {
            for (let i = 0; i < identicalIndex; i++) {
                let nodeType = this.linesObj[track].red_bullets[i].getComponent('animalLogic').nodeType;
                switch (nodeType) {
                    case 0:
                        this.bullSmallPool.put(this.linesObj[track].red_bullets[i]);
                        break;
                    case 1:
                        this.bullMidPool.put(this.linesObj[track].red_bullets[i]);
                        break;
                    case 2:
                        this.bullBigPool.put(this.linesObj[track].red_bullets[i]);
                        break;
                    case 3:
                        this.bullMaxPool.put(this.linesObj[track].red_bullets[i]);
                        break;
                }
                // this.linesObj[track].red_bullets[i].destroy();
                this.linesObj[track].red_bullets[i] = null;
            }
            this.linesObj[track].red_bullets.splice(0, identicalIndex);
        }

        let sLen = sData.length;
        let selfRed_bullets = this.linesObj[track].red_bullets;
        for (let i = 0, len = sLen; i < len; i++) {
            //创建时间;
            let create_at = String(sData[i].create_at);
            //坐标;
            let pos = sData[i].pos;
            // //阵营；
            //如果本地数据里面有这个值；
            if (selfRed_bullets[i]) {
                let sheepCreateTime = selfRed_bullets[i].getComponent('animalLogic').createTime;
                //如果当前的第i个节点与数据的创建时间是相同的，那么同步坐标和速度;
                //如果当前的第i个节点与数据的创建时间不相同，那么删除当前节点，创建一个新的节点，并设置属性；
                if (sheepCreateTime == create_at) {
                    // selfRed_bullets[i].getComponent('animalLogic').moveSpeed = sData[i].speed;
                    selfRed_bullets[i].getComponent('animalLogic').setNodePosY(pos);
                } else {
                    // selfRed_bullets[i].destroy();
                    let nodeType = selfRed_bullets[i].getComponent('animalLogic').nodeType;
                    switch (nodeType) {
                        case 0:
                            this.bullSmallPool.put(selfRed_bullets[i]);
                            break;
                        case 1:
                            this.bullMidPool.put(selfRed_bullets[i]);
                            break;
                        case 2:
                            this.bullBigPool.put(selfRed_bullets[i]);
                            break;
                        case 3:
                            this.bullMaxPool.put(selfRed_bullets[i]);
                            break;
                    }
                    let id = sData[i].id;
                    let sheep = this.getAnimalNode(1, id);
                    this.animalLayer.addChild(sheep);
                    sheep.x = Global.nodeStartPosX[track];
                    let cameType = 0;
                    if (this.selfCamp == this.CampType.RED) {
                        cameType = Global.SHEEPTYPE.BOOM;
                    } else {
                        cameType = Global.SHEEPTYPE.TOP;
                    }
                    sheep.getComponent('animalLogic').setNodeType(id, cameType, track, create_at, true, sData[i].speed, pos);
                    sheep.getComponent('animalLogic').setNodePosY(pos);
                    selfRed_bullets[i] = sheep;
                }
            }
            //如果服务器有数据，而本地没有数据的话，说明是新有的数据，或者前端漏的数据，或者是从断线重连进来的;
            else {
                let id = sData[i].id;
                let sheep = this.getAnimalNode(1, id);
                switch (id) {
                    case 0:
                        // cc.audioEngine.playEffect(this.bullSmallAudio,false);
                        MessageSoundManager.playLoadEffect(this.bullSmallAudio);
                        break;
                    case 1:
                        // cc.audioEngine.playEffect(this.bullMidAudio,false);
                        MessageSoundManager.playLoadEffect(this.bullMidAudio);
                        break;
                    case 2:
                        // cc.audioEngine.playEffect(this.bullBigAudio,false);
                        MessageSoundManager.playLoadEffect(this.bullBigAudio);
                        break;
                    case 3:
                        // cc.audioEngine.playEffect(this.bullMaxAudio,false);
                        MessageSoundManager.playLoadEffect(this.bullMaxAudio);
                        break;
                }
                this.animalLayer.addChild(sheep);
                sheep.x = Global.nodeStartPosX[track];
                let cameType = 0;
                if (this.selfCamp == this.CampType.RED) {
                    cameType = Global.SHEEPTYPE.BOOM;
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], -310);
                } else if (this.selfCamp == this.CampType.BLUE) {
                    cameType = Global.SHEEPTYPE.TOP;
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], 310);
                } else {
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], 310);
                    let camp = sData[i].camp;
                    if (camp == 'blue') {
                        cameType = Global.SHEEPTYPE.BOOM;
                    } else if (camp == 'red') {
                        cameType = Global.SHEEPTYPE.TOP;
                    }
                }
                sheep.getComponent('animalLogic').setNodeType(id, cameType, track, create_at, true, sData[i].speed, pos);
                // sheep.getComponent('animalLogic').nodePos = pos;                //设置坐标;
                sheep.getComponent('animalLogic').setNodePosY(pos);
                selfRed_bullets[i] = sheep;
            }
        }

        let selfNodeLen = selfRed_bullets.length;
        //当自己的数量大于服务器给的数量时，删除多余的;
        if (selfNodeLen > sLen) {
            for (let i = sLen + 1; i < selfNodeLen; i++) {
                this.linesObj[track].red_bullets[i].destroy();
                this.linesObj[track].red_bullets[i] = null;
            }
            this.linesObj[track].red_bullets.splice(sLen + 1, selfNodeLen - sLen);
        }
    }

    //跑道中蓝色节点对比;
    comparedBlueTrack(track, sData) {
        //获取数据第0个的创建时间；
        let dataCreate_at = String(sData[0].create_at);
        //第几个资源与数据第0个相同；
        let identicalIndex = -1;
        for (let r = 0, blueLen = this.linesObj[track].blue_bullets.length; r < blueLen; r++) {
            let redCreateTime = this.linesObj[track].blue_bullets[r].getComponent('animalLogic').createTime;
            if (redCreateTime == dataCreate_at) {
                identicalIndex = r;
                break;
            }
        }
        //删除多余的资源；
        if (identicalIndex > 0) {
            for (let i = 0; i < identicalIndex; i++) {
                let nodeType = this.linesObj[track].blue_bullets[i].getComponent('animalLogic').nodeType;
                switch (nodeType) {
                    case 0:
                        this.sheepSmallPool.put(this.linesObj[track].blue_bullets[i]);
                        break;
                    case 1:
                        this.sheepMidPool.put(this.linesObj[track].blue_bullets[i]);
                        break;
                    case 2:
                        this.sheepBigPool.put(this.linesObj[track].blue_bullets[i]);

                        break;
                    case 3:
                        this.sheepMaxPool.put(this.linesObj[track].blue_bullets[i]);
                        break;
                }
                // this.linesObj[track].blue_bullets[i].destroy();
                this.linesObj[track].blue_bullets[i] = null;
            }
            this.linesObj[track].blue_bullets.splice(0, identicalIndex);
        }

        let sLen = sData.length;
        //本地数据；
        let selfBlue_bullets = this.linesObj[track].blue_bullets;
        for (let i = 0, len = sLen; i < len; i++) {
            //创建时间;
            let create_at = String(sData[i].create_at);
            //坐标;
            let pos = sData[i].pos;
            //如果数据里面有这个值；
            if (selfBlue_bullets[i]) {
                let sheepCreateTime = selfBlue_bullets[i].getComponent('animalLogic').createTime;
                //如果当前的第i个节点与数据的创建时间是相同的，那么同步坐标和速度;
                //如果当前的第i个节点与数据的创建时间不相同，那么删除当前节点，创建一个新的节点，并设置属性；
                if (sheepCreateTime == create_at) {
                    // selfBlue_bullets[i].getComponent('animalLogic').moveSpeed = sData[i].speed;
                    // selfBlue_bullets[i].getComponent('animalLogic').nodePos = pos;
                    selfBlue_bullets[i].getComponent('animalLogic').setNodePosY(pos);
                } else {
                    selfBlue_bullets[i].destroy();
                    let cameType = 0;
                    if (this.selfCamp == this.CampType.BLUE) {
                        cameType = Global.SHEEPTYPE.BOOM;
                    } else {
                        cameType = Global.SHEEPTYPE.TOP;
                    }
                    let id = sData[i].id;
                    let sheep = this.getAnimalNode(0, id);
                    this.animalLayer.addChild(sheep);
                    sheep.x = Global.nodeStartPosX[track];
                    sheep.getComponent('animalLogic').setNodeType(id, cameType, track, create_at, true, sData[i].speed, pos);
                    sheep.getComponent('animalLogic').setNodePosY(pos);
                    selfBlue_bullets[i] = sheep;
                }
            }
            //如果服务器有数据，而本地没有数据的话，说明是新有的数据，或者前端漏的数据，或者是从断线重连进来的;
            else {
                let cameType = 0;
                if (this.selfCamp == this.CampType.BLUE) {
                    cameType = Global.SHEEPTYPE.BOOM;
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], -310);
                } else if (this.selfCamp == this.CampType.RED) {
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], 310);
                    cameType = Global.SHEEPTYPE.TOP;
                } else {
                    this.showSpecialEffectsPrefab(Global.nodeStartPosX[track], -310);
                    let camp = sData[i].camp;
                    if (camp == 'blue') {
                        cameType = Global.SHEEPTYPE.BOOM;
                    } else if (camp == 'red') {
                        cameType = Global.SHEEPTYPE.TOP;
                    }
                }
                let id = sData[i].id;
                let sheep = this.getAnimalNode(0, id);
                this.animalLayer.addChild(sheep);
                sheep.x = Global.nodeStartPosX[track];
                sheep.getComponent('animalLogic').setNodeType(id, cameType, track, create_at, true, sData[i].speed, pos);
                sheep.getComponent('animalLogic').setNodePosY(pos);
                selfBlue_bullets[i] = sheep;
                switch (id) {
                    case 0:
                        // cc.audioEngine.playEffect(this.sheepSmallAudio,false);
                        MessageSoundManager.playLoadEffect(this.sheepSmallAudio);
                        break;
                    case 1:
                        // cc.audioEngine.playEffect(this.sheepMidAudio,false);
                        MessageSoundManager.playLoadEffect(this.sheepMidAudio);
                        break;
                    case 2:
                        // cc.audioEngine.playEffect(this.sheepBigAudio,false);
                        MessageSoundManager.playLoadEffect(this.sheepBigAudio);
                        break;
                    case 3:
                        // cc.audioEngine.playEffect(this.sheepMaxAudio,false);
                        MessageSoundManager.playLoadEffect(this.sheepMaxAudio);
                        break;
                }
            }
        }

        let selfNodeLen = selfBlue_bullets.length;
        //当自己的数量大于服务器给的数量时，删除多余的;
        if (selfNodeLen > sLen) {
            for (let i = sLen; i < selfNodeLen; i++) {
                selfBlue_bullets[i].destroy();
            }
            this.linesObj[track].blue_bullets.splice(sLen, selfNodeLen - sLen);
        }
    }

    //显示点击光效;
    setTouchShow(custom) {
        this.touchShow.stopAllActions();
        this.touchShow.active = true;
        this.touchShow.opacity = 255;
        this.touchShow.x = Global.nodeStartPosX[custom];
        let fadeOut = cc.fadeOut(0.4);
        let callfunc = cc.callFunc((event) => {
            event.active = false;
        });
        this.touchShow.runAction(cc.sequence(fadeOut, callfunc));
    }

    //点击草坪回调;
    grass_callback(event, custom) {
        if (this.isCantouch) {
            //如果有预备的;
            if (this.hintNodeIsShow) {
                this.hintNode.active = false;
                this.hintNodeIsShow = false;
            }

            if (!this.userSelf.getComponent('userSelfLogic').isCanSendMessage) {
                return;
            }

            if (this.selfIsGame) {
                this.setTouchShow(custom);
            }
            if (this.readyAnimal) {
                this.readyAnimal.x = Global.nodeStartPosX[Number(custom)];
                this.custom = custom;
                //国道减了；
                this.readyAnimal.getComponent('animalLogic').nodeTrack = custom;
                let readType = this.readyAnimal.getComponent('animalLogic').readType;
                if (readType) {
                    this.iconReadyBack();
                }
            } else {
                //获取将要发送的节点；
                let obj = this.userSelf.getComponent('userSelfLogic').getReadyIcon();
                let iconType = obj.iconType;                        //类型;
                let iconReady = obj.iconReady;                      //是否是准备好的；
                let typeNum = 0;
                if (this.selfCamp == this.CampType.RED) {
                    typeNum = 1;
                }
                let showNode = this.getAnimalNode(typeNum, iconType);
                this.custom = custom;
                showNode.x = Global.nodeStartPosX[Number(custom)];
                // showNode.getComponent('animalLogic').setNodeType(Number(iconType),Global.SHEEPTYPE.BOOM,custom); //设置类型;
                showNode.getComponent('animalLogic').setNodeType(Number(iconType), Global.SHEEPTYPE.BOOM, custom, '', false, 0, 0);
                showNode.y = -280;
                showNode.opacity = 180;
                this.animalLayer.addChild(showNode);
                //步骤：
                //1、获取羊的数据，并创建。
                //2、判断羊是否是准备状态，如果已经准备好，判断是否是碰撞状态，如果为非准备状态的话，判断是否是碰撞状态;
                //是否是已经准备好的状态;
                this.readyAnimal = showNode;
                if (iconReady) {
                    //获取是否是碰撞状态，如果是碰撞状态，则等待碰撞结束，或者切换跑道；
                    this.sendAddSheepFunc();
                }
                //如果还没准备好；
                else {
                    showNode.y = -280;
                    showNode.opacity = 180;
                }
            }
        }
    }

    //倒计时准备好了;
    emitRunNode() {
        this.isCanSend = true;
        if (this.readyAnimal) {
            this.readyAnimal.getComponent('animalLogic').readType = true;
            this.iconReadyBack();
        }
    }

    //预定准备好以后派发的回调;
    iconReadyBack() {
        //预定发送的羊，发送;
        if (this.readyAnimal) {
            this.sendAddSheepFunc();
        }
    }

    //发送放羊的消息;
    sendAddSheepFunc() {
        let bullet_no = this.selfBullets[this.bulletsIndex];
        if (!this.isCanSend) {
            return;
        }
        this.isCanSend = false;
        let custom = Number(this.custom);
        let postData = {
            bullet_no: Number(bullet_no),
            line_no: (custom + 1),
            source: "chatroom",
            source_id: Global.gameRoomId
        };
        MessageManager.httpResult('post', MessageType.ADDSHEEP, postData, (eData) => {
            if (eData.status || eData.err_code == -1) {
                //开启头像倒计时;
                this.userSelf.getComponent('userSelfLogic').changeShowItem();
                this.bulletsIndex++;
                if (this.readyAnimal) {
                    this.readyAnimal.destroy();
                    this.readyAnimal = null;
                }
                return;
            } else if (eData.err_code && eData.err_code == 70001) {
                this.showNomore(Global.nodeStartPosX[custom]);
                if (this.readyAnimal) {
                    this.readyAnimal.destroy();
                    this.readyAnimal = null;
                }
            } else if (eData.err_code && eData.err_code == 80003) {
                //发送的数错了;
                this.needGetBulletNo = true;
                if (this.readyAnimal) {
                    this.readyAnimal.getComponent('animalLogic').readType = true;
                }
            }
            this.isCanSend = true;
            // if(this.readyAnimal){
            //     this.readyAnimal.getComponent('animalLogic').readType = true;
            // }
        });
    }

    //显示出现动画;
    showSpecialEffectsPrefab(showX, showY) {
        // console.log('showSpecialEffectsPrefab');
        let SpecialEffectsPrefab = null;
        if (this.SpecialEffectsPool.size() > 0) {
            SpecialEffectsPrefab = this.SpecialEffectsPool.get();
        } else {
            SpecialEffectsPrefab = cc.instantiate(this.SpecialEffectsPrefab);
        }
        SpecialEffectsPrefab.x = showX;
        SpecialEffectsPrefab.y = showY;
        this.animalLayer.addChild(SpecialEffectsPrefab);
        if (showY > 0) {
            SpecialEffectsPrefab.scaleY = -1;
        } else {
            SpecialEffectsPrefab.scaleY = 1;
        }
        let SpecialEffectsDrag = SpecialEffectsPrefab.getComponent(dragonBones.ArmatureDisplay);
        SpecialEffectsDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            SpecialEffectsDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            // SpecialEffectsPrefab.destroy();
            this.SpecialEffectsPool.put(SpecialEffectsPrefab);
        }, this);
        SpecialEffectsDrag.playAnimation('newAnimation', 1);
    }

    //网络不稳定;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            this.isCanSend = true;
            this.needGetBulletNo = true;
            SFMessageManager.getStatus(Global.gameRoomId);
        }
        if (this.readyAnimal) {
            this.readyAnimal.getComponent('animalLogic').readType;
        }
    }

    /*
        获取类型节点:
        @param  animalType   动物类型 可能是牛或者羊
        @param  icoinType    动物的类型  最大、大、中、小；
    */
    getAnimalNode(animalType, iconType) {
        let instanNode: cc.Node = null;
        //羊;
        if (animalType == 0) {
            switch (iconType) {
                case 0:
                    instanNode = this.sheepSmallPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.sheepSmallPrefab);
                    }
                    // instanNode = this.sheepSmallPrefab;
                    break;
                case 1:
                    instanNode = this.sheepMidPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.sheepMidPrefab);
                    }
                    // instanNode = this.sheepMidPrefab;
                    break;
                case 2:
                    instanNode = this.sheepBigPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.sheepBigPrefab);
                    }
                    // instanNode = this.sheepBigPrefab;
                    break;
                case 3:
                    instanNode = this.sheepMaxPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.sheepMaxPrefab);
                    }
                    // instanNode = this.sheepMaxPrefab;
                    break;
            }
        }
        //牛；
        else if (animalType == 1) {
            switch (iconType) {
                case 0:
                    instanNode = this.bullSmallPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.bullSmallPrefab);
                    }
                    break;
                case 1:
                    instanNode = this.bullMidPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.bullMidPrefab);
                    }
                    // instanNode = this.bullMidPrefab;
                    break;
                case 2:
                    instanNode = this.bullBigPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.bullBigPrefab);
                    }
                    // instanNode = this.bullBigPrefab;
                    break;
                case 3:
                    instanNode = this.bullMaxPool.get();
                    if (!instanNode) {
                        instanNode = cc.instantiate(this.bullMaxPrefab);
                    }
                    // instanNode = this.bullMaxPrefab;
                    break;
            }
        }

        return cc.instantiate(instanNode);
    }

    //设置进度条值;
    nodePassEmitBack(situation) {
        let blue_score = situation.blue_score;
        let red_score = situation.red_score;

        //蓝色方分数不变;
        if (this.blueScore != blue_score) {
            let difference = blue_score - this.blueScore;
            this.blueScore = blue_score;
            let pro = 100 - blue_score;
            if (pro < 0) {
                pro = 0;
            }

            this.HPRedProgressBar.progress = pro / 100;
            let proLabel = this.HPRedProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
            proLabel.string = String(pro);
            this.setRedDifferenceFunc(difference);

            /*
            //如果自己是红色方;
            if(this.selfCamp == this.CampType.RED){
                this.HPBlueProgressBar.progress = pro/100;
                let proLabel = this.HPBlueProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
                proLabel.string = String(pro);
                this.setBlueDifferenceFunc(difference);
            }
            //如果自己是蓝色方；
            else{
                this.HPRedProgressBar.progress = pro/100;
                let proLabel = this.HPRedProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
                proLabel.string = String(pro);
                this.setRedDifferenceFunc(difference);
            }
            */
        }

        //红色方分数有变化;
        if (this.redScore != red_score) {
            let difference = red_score - this.redScore;
            let pro = 100 - red_score;
            this.redScore = red_score;
            if (pro < 0) {
                pro = 0;
            }
            this.HPBlueProgressBar.progress = pro / 100;
            let proLabel = this.HPBlueProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
            proLabel.string = String(pro);
            this.setBlueDifferenceFunc(difference);
            /*
            //如果自己是蓝色方;
            if(this.selfCamp == this.CampType.RED){
                this.HPRedProgressBar.progress = pro/100;
                let proLabel = this.HPRedProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
                proLabel.string = String(pro);
                this.setRedDifferenceFunc(difference);
            }
            //如果自己是红色方；
            else{
                this.HPBlueProgressBar.progress = pro/100;
                let proLabel = this.HPBlueProgressBar.node.getChildByName('progressLabel').getComponent(cc.Label);
                proLabel.string = String(pro);
                this.setBlueDifferenceFunc(difference);
            }
            */
        }
    }

    //设置红色进度条显示;
    setRedDifferenceFunc(difference: number) {
        // cc.audioEngine.playEffect(this.deductionAudio,false);
        MessageSoundManager.playLoadEffect(this.deductionAudio);
        this.redDifferenceLabel.active = true;
        this.redDifferenceLabel.stopAllActions();
        this.redDifferenceLabel.x = 160;
        this.redDifferenceLabel.y = 0;
        this.redDifferenceLabel.getComponent(cc.Label).string = `-${difference}`;
        let move = cc.moveBy(1, cc.v2(50, 0));
        let callfunc = cc.callFunc(() => {
            this.redDifferenceLabel.active = false;
        });
        this.redDifferenceLabel.runAction(cc.sequence(move, callfunc));
    }

    //设置蓝色进度条显示;
    setBlueDifferenceFunc(difference: number) {
        // cc.audioEngine.playEffect(this.deductionAudio,false);
        MessageSoundManager.playLoadEffect(this.deductionAudio);
        this.blueDifferenceLabel.active = true;
        this.blueDifferenceLabel.stopAllActions();
        this.blueDifferenceLabel.x = 160;
        this.blueDifferenceLabel.y = 0;
        this.blueDifferenceLabel.getComponent(cc.Label).string = `-${difference}`;
        let move = cc.moveBy(1, cc.v2(50, 0));
        let callfunc = cc.callFunc(() => {
            this.blueDifferenceLabel.active = false;
        });
        this.blueDifferenceLabel.runAction(cc.sequence(move, callfunc));
    }

    //不能点击的效果；
    showNomore(showX) {
        let nomore = cc.instantiate(this.noMorePrefab);
        nomore.x = showX;
        nomore.y = -168;
        this.node.addChild(nomore);
        nomore.runAction(
            cc.sequence(
                cc.moveBy(0.1, cc.v2(5, 0)),
                cc.moveBy(0.1, cc.v2(-10, 0)),
                cc.moveBy(0.1, cc.v2(10, 0)),
                cc.moveBy(0.1, cc.v2(-10, 0)),
                cc.moveBy(0.1, cc.v2(10, 0)),
                cc.moveBy(0.1, cc.v2(-10, 0)),
                cc.moveBy(0.1, cc.v2(10, 0)),
                cc.moveBy(0.1, cc.v2(-10, 0)),
                cc.moveBy(0.1, cc.v2(5, 0)),
                cc.callFunc(() => {
                    nomore.destroy();
                })
            )
        );
    }

    //清空所有的牛和羊;
    clearAllAnimaNode() {
        for (let i = 0; i < 5; i++) {
            let blueNodeArr = this.linesObj[i].blue_bullets;
            let redNodeArr = this.linesObj[i].red_bullets;
            if (blueNodeArr.length > 0) {
                for (let j = 0, blueLen = blueNodeArr.length; j < blueLen; j++) {
                    blueNodeArr[j].destroy();
                    blueNodeArr[j] = [];
                }
                this.linesObj[i].blue_bullets = [];
            }

            if (redNodeArr.length > 0) {
                for (let j = 0, redLen = redNodeArr.length; j < redLen; j++) {
                    redNodeArr[j].destroy();
                    redNodeArr[j] = null;
                }
                this.linesObj[i].red_bullets = [];
            }
        }
        Global.colliderSituation = {};
        if (this.readyAnimal) {
            this.readyAnimal.destroy();
            this.readyAnimal = null;
        }
    }

    //更行状态；
    updateStatus(event) {
        let data = event.statusData;
        //如果是匹配状态;
        //如果是游戏状态;
        if (data.status == 'playing') {
            this.isComparedChannelId = true;
        } else if (data.status == 'completed') {
            SFMessageManager.isStartContinue = false;
            SFMessageManager.clearStartContinue();
            //切换到大厅场景；
            cc.director.preloadScene('HallScene', (completedCount, totalCount, item) => {
                cc.director.loadScene("HallScene");
            }, (error) => {
                // ////console.log('加载场景Err：'+error);
            });
        }
    }

    //切换回前台;
    onAndroidResume() {
        // this.clearAllAnimaNode();
        if (this.readyAnimal) {
            this.readyAnimal.getComponent('animalLogic').readType = true;
        }
        this.isOnAndroidStop = false;
        this.isonAndroidResume = true;
        this.isStartCountTime = false;
    }

    //刷新所有节点坐标;
    refreshAllNodePos(situation) {
        let lines = situation.lines;
        for (let i = 0; i < 5; i++) {
            let red_bullets = lines[i].red_bullets;
            let blue_bullets = lines[i].blue_bullets;
            if (red_bullets.length > 0) {
                for (let j = 0, len = red_bullets.length; j < len; j++) {
                    let redBullet = this.linesObj[i].red_bullets[j];
                    redBullet.getComponent('animalLogic').setMoveSpeed(red_bullets[j].speed);
                    redBullet.getComponent('animalLogic').isUpdate = true;
                    redBullet.getComponent('animalLogic').nodePos = red_bullets[j].pos;
                }
            }
            if (blue_bullets.length > 0) {
                for (let j = 0, len = blue_bullets.length; j < len; j++) {
                    let blueBUllet = this.linesObj[i].blue_bullets[j];
                    blueBUllet.getComponent('animalLogic').setMoveSpeed(blue_bullets[j].speed);
                    blueBUllet.getComponent('animalLogic').isUpdate = true;
                    blueBUllet.getComponent('animalLogic').nodePos = blue_bullets[j].pos;
                }
            }
        }
    }

    //设计倒计时;
    setTimeLabel(start_duration) {
        this.start_duration = start_duration;
        this.isUpdate = true;
        this.isStartCountTime = true;
    }

    //添加规则页面;
    addRuleNode() {
        let node = cc.instantiate(this.rulePrefab);
        node.zIndex = 30;
        this.node.addChild(node);
    }

    //余额不足的界面;
    insufficientBalanceFunc() {
        let str = 'Balance is not enough';
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        switch (lang) {
            case 'en':
                str = 'Your Game Coins is not enough';
                break;
            case 'ar':
                str = 'عملات اللعبة الخاصة بك ليست كافية';
                break;
            case 'hi':
                str = 'आपका गेम सिक्के पर्याप्त नहीं है';
                break;
            case 'te':
                str = 'இருப்பது போதாது';
                break;
            case 'ta':
                str = 'మీ గేమ్ నాణేలు సరిపోవు';
                break;
            case 'id':
                str = 'Koin Game Anda tidak cukup'
                break;
        }
        NDB.toast({ msg: str });
    }

    //加速回调;
    quicken_callback() {
        return;
        // let postData = {
        //     source: "chatroom",
        //     source_id: Global.gameRoomId
        // };
        // MKMessageManager.httpResult('post', MKMessageType.QUICKEN, postData, (eData) => {
        //     if (eData && eData.status == 'OK') {
        //         this.userSelf.getComponent('userSelfLogic').quickenSuccees();
        //         this.userSelf.getChildByName('speed').getComponent(cc.Button).interactable = false;
        //         setTimeout(() => {
        //             if (this.node && this.node.active) {
        //                 this.userSelf.getChildByName('speed').getComponent(cc.Button).interactable = true;
        //             }
        //         }, 10000);
        //     }
        // });
    }

    //发送emoji;
    sendEmoji(event, custom) {
        if (custom == 'show') {
            SFMessageManager.sendEmojiMessage('show');
        } else {
            if (this.isCanSendEmoji) {
                this.isCanSendEmoji = false;
                let data = this.emojiJson.json[custom];
                SFMessageManager.sendEmojiMessage(custom, data.svga);
                setTimeout(() => {
                    if (this.node && this.node.active) {
                        this.isCanSendEmoji = true;
                    }
                }, 1000);
            }
        }
    }

    update(dt) {
        if (this.isUpdate) {
            this.countTimeNum += dt;
            if (this.countTimeNum >= 1) {
                this.countTimeNum = 0;
                this.start_duration++;
                let time = 600 - this.start_duration;
                if (time >= 0) {
                    //分;
                    let minute = Math.floor(time / 60);
                    let minuteStr = '' + minute;
                    if (minute < 10) {
                        minuteStr = '0' + minuteStr;
                    }

                    //秒;
                    let second = time % 60;
                    let secondStr = '' + second;
                    if (second < 10) {
                        secondStr = '0' + secondStr;
                    }
                    this.timeLabel.string = `${minuteStr}:${secondStr}`;
                } else {
                    this.isUpdate = false;
                }
            }

        }
    }

    onDestroy() {
        this.SpecialEffectsPool.clear();
        this.bullMaxPool.clear();
        this.bullBigPool.clear();
        this.bullMidPool.clear();
        this.bullSmallPool.clear();
        this.sheepMaxPool.clear();
        this.sheepBigPool.clear();
        this.sheepMidPool.clear();
        this.sheepSmallPool.clear();

        //倒计时准备好了;
        MyEvent.I.remove('icon_ready', this.node);
        //接受服务器消息;
        MyEvent.I.remove('emit_message', this.node);
        //显示碰撞效果;
        MyEvent.I.remove('collider', this.node);
        //重新获取纹理显示数组;
        MyEvent.I.remove('needGetBulletNo', this.node);
        //获取游戏状态；
        MyEvent.I.remove('emit_status', this.node);
        //切换到游戏前台;
        MyEvent.I.remove('onAndroidResume', this.node);
        //余额不足提醒;
        MyEvent.I.remove('insufficientBalance', this.node);
    }
}
