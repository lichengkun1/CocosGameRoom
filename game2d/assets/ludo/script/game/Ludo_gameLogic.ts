import Global from '../Global/Ludo_GlobalGameData';
import Ludo_userNodeList from './Ludo_userNodeList';
import LudoPlayerLogic from './Ludo_playerLogic';
import Ludo_MessageType from '../Utils/Ludo_MessageType';
import Ludo_propsLogic from './Ludo_propsLogic';
import Ludo_ExitPopup from './Ludo_ExitPopup';
import Ludo_coinmoveLogic from './Ludo_coinmoveLogic';
import Ludo_userNodeLogic from './Ludo_userNodeLogic';
import Ludo_settlementLogic from './Ludo_settlementLogic';
import Ludo_GameMode from '../ModeSceneScripts/Ludo_GameMode';
import PlayerModel from '../models/player';
import { dataCacheManager } from '../models/dataCache';
import { ToolsData } from '../models/serverDataInterface';
import Ludo_GlobalGameData from '../Global/Ludo_GlobalGameData';
import MessageSoundManager from '../../../roomCommon/CommonScripts/Utils/MessageSoundManager';
import BgmSettings from '../../../roomCommon/CommonScripts/bgmSettings';
import { getUrlParameterValue } from '../../../Script/common/utils/util';
import { GameConfig } from '../../../gameConfig';
import MessageManager from '../../../roomCommon/CommonScripts/Utils/MessageManager';
import MyEvent from '../../../roomCommon/CommonScripts/Utils/MyEvent';
import NDB from '../../../roomCommon/CommonScripts/Utils/NDBTS';
import MessageData from '../../../roomCommon/CommonScripts/Utils/MessageData';
import MessageForRoom from '../../../roomCommon/CommonScripts/Utils/MessageForRoom';
import ResourcesManager from '../../../roomCommon/CommonScripts/Utils/ResourcesManager';
import Message from '../../../roomCommon/CommonScripts/Utils/Message';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_gameLogic extends cc.Component {

    //                ------------用户信息------------
    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.SpriteFrame)                               //默认头像纹理；
    headIcon: cc.SpriteFrame = null;
    @property(cc.Node)                                      //玩家头像骰子；
    playerNodeArr: cc.Node[] = [];
    //               ------------棋子------------
    @property(cc.Node)                                      //蓝色棋子;
    piece_blueArr: cc.Node[] = [];
    @property(cc.Node)                                      //红色棋子；
    piece_redArr: cc.Node[] = [];
    @property(cc.Node)                                      //绿色棋子；
    piece_greenArr: cc.Node[] = [];
    @property(cc.Node)                                      //黄色棋子；
    piece_yellowArr: cc.Node[] = [];

    @property(cc.Node)                                      //蓝色棋子;
    piece_blueArr_Pos: cc.Node[] = [];
    @property(cc.Node)                                      //红色棋子；
    piece_redArr_Pos: cc.Node[] = [];
    @property(cc.Node)                                      //绿色棋子；
    piece_greenArr_Pos: cc.Node[] = [];
    @property(cc.Node)                                      //黄色棋子；
    piece_yellowArr_Pos: cc.Node[] = [];
    //               ------------道具------------
    @property(cc.Prefab)                                    //道具;
    propsPrefab: cc.Prefab = null;
    @property({ type: cc.AudioClip })                       //欢呼音效;
    cheerAudio: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //获取骰子;
    diceGet: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //道具添加;
    propShow: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //火箭爆炸;
    rocketBoom: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //火箭飞行;
    rocketFly: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //ufo飞行;
    ufoFly: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //ufo放下骰子;
    ufoTu: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //ufo吸入骰子;
    ufoXi: cc.AudioClip = null;
    @property({ type: cc.AudioClip })                       //获取隐身衣;
    yinshengyiStart: cc.AudioClip = null;
    @property(cc.Node)                                      //UFO道具;
    UFOprops: cc.Node[] = [];
    @property(cc.Node)                                      //金骰子道具;
    diceProps: cc.Node = null;
    @property(cc.Node)                                      //火箭道具;
    rocketProps: cc.Node = null;
    @property(cc.Node)
    goldDiceNode: cc.Node = null;                            //金骰子;
    @property(cc.Node)
    yinshenyi: cc.Node = null;                               //隐身衣;
    @property(cc.SpriteFrame)
    checkerboardArr: cc.SpriteFrame[] = [];                //棋盘;
    @property(cc.SpriteAtlas)                                //游戏场景资源;
    gamePlist: cc.SpriteAtlas = null;
    @property(cc.Prefab)                                    //3次为操作弹框；
    popLayer: cc.Node = null;
    @property(cc.Prefab)                                    //飞金币效果；
    coinmovePrefab: cc.Prefab = null;
    //               ------------棋盘表情------------ 
    @property(cc.Node)                                      //皮肤背景；
    showBG: cc.Node = null;
    // @property(cc.SpriteAtlas)                               //海岛棋盘背景；
    // isLandcheckerboardPlist: cc.SpriteAtlas = null;
    @property(cc.JsonAsset)                                 //emoji表情映射json；
    emojiJson: cc.JsonAsset = null;
    // @property(cc.Node)
    // emojiNode: cc.Node = null;
    @property(cc.Node)
    rulePopup: cc.Node = null;
    //               ------------金币------------
    @property(cc.SpriteFrame)
    yoyoPool: cc.SpriteFrame = null;
    @property(cc.Node)
    coinPoolNode: cc.Node = null;

    @property(cc.Prefab)                                    //飞金币效果；
    caidai: cc.Prefab = null;

    @property(cc.Boolean)
    isDebug: boolean = false;


    @property(cc.SpriteAtlas)                               //棋子位置；
    piecePlist: cc.SpriteAtlas = null;

    @property({
        type: cc.AudioClip
    })
    gameAudio: cc.AudioClip = null;

    private arrowNode: cc.Node = null;                      //箭头；
    private checkerboard: cc.Node = null;                   //棋盘;
    private checkerboard2: cc.Node = null;                   //棋盘;
    private userDataMap = {};                               //用户数据;
    private nowActionPlayer = null;                         //当前操作用户;
    private isCanTouchDice: boolean = false;                //是否能点击骰子;
    private dicePoints: number = 0;                         //骰子点数;
    private nowMoveClass = null;                            //当前操作的用户棋子，用户检测棋子移动结束后的检测;
    private startIdenticalNode = [];                        //移动棋子移动前相同坐标的其他棋子;
    private endIdenticalNode = [];                          //移动棋子相同坐结束后标的其他棋子;
    private TNode = [];                                     //棋子移动后应该被T的棋子；
    public isUpdate: boolean = false;                      //是否开启循环;
    private dtTime: number = 0;                             //倒计时标尺;
    private start_duration: number = 0;                     //剩余事件;
    private timeLabel: cc.Label = null;                     //倒计时事件;
    private modeLabel: cc.Label = null;
    private isStartCountTime: boolean = true;               //是否需要更新倒计时;
    private isShowSettlementLayer: boolean = false;         //是否在显示结算界面;
    private moveLayer: cc.Node = null;                      //moveLayer;
    private settleLayer: cc.Node = null;                    //结算界面;
    private propsNodeObj = {};                              //道具数据节点;
    private messageData = null;                             //当前服务器收到的数据;
    private isShowSkipPop: boolean = false;                 //是否显示过skip弹窗;
    private moveTrack = [Global.user1MoveTrack, Global.user2MoveTrack, Global.user3MoveTrack, Global.user4MoveTrack];
    private coinLabel: cc.Label = null;                     //金币label;
    private coinShowLayer: cc.Node = null;                  //显示金币动画的层;
    private coinValue: number = 0;                          //金币显示的值;
    private coinMaxValue: number = 0;                       //金币的最大值;
    private coinNodeArr: cc.Node[] = [];                    //金币节点数组;
    private isReceiverMessage: boolean = true;              //是否接收消息;
    private settingLayer: cc.Node = null;                   //结算界面；
    private nowPlayering: cc.Node = null;                   //当前操作用户；
    private isCanSendEmoji: boolean = false;                //当前是否能发送emoji;
    private isRobotModel: boolean = false;                  //是否是机器人模式;
    private robotLabelIsSet: boolean = false;               //机器人文案是否已经设置;
    private nowShowDicePlayer: cc.Node = null;              //当前掷骰子的用户;
    private propLayer: cc.Node = null;                      // 道具层 将飞碟和炸弹实例化到节点池里面
    private ufoPrefab: cc.Node = null;

    private ufoPool: cc.NodePool = null;       // ufo节点池
    private playerIds: number[] = [];
    private idKeyMap: {[key: string]: string} = {};        // playerId：玩家id -> key：座位号
    private players: any;

    private skinInSocket: boolean = false;
    private skinInLocal: boolean = false;

    private piecePosArr = [
        [[-251, -180], [-163, -180]],
        [[-251, 193], [-163, 193]],
        [[163, 193], [251, 193]],
        [[163, -180], [251, -180]]];                         // 初始化位置
    private piecePosArr2 = [
        [[-251, -150], [-163, -150], [-251, -225], [-163, -225]],
        [[-251, 225], [-163, 225], [-251, 150], [-163, 150]],
        [[163, 225], [251, 225], [163, 150], [251, 150]],
        [[163, -150], [251, -150], [163, -225], [251, -225]]];

    /** 切后台的时间 保存ufo运送的棋子的状态 */
    private whilebackUFOWithPiece: cc.Node = null;
    /** ufo正在运送的棋子 */
    private ufoMovePiece: cc.Node = null;

    private bgmId: number = -1;

    __preload() {
        Global.enterGameScene = true;
        console.log('_preload stopall');
    }

    onLoad(): void {
        cc.audioEngine.stop(0);

        if(MessageSoundManager.audioEngineOn) {
            cc.audioEngine.stopMusic();
            this.bgmId = MessageSoundManager.playBgm(this.gameAudio);
        }
        const bgmNode = cc.find("Canvas/topNode/bgm");
        const bgmComp = bgmNode.getComponent(BgmSettings);
        let self = this;
        bgmComp.updateMusic = function() {
            console.log('转入ludo',MessageSoundManager.audioEngineOn,self.bgmId);
            if(MessageSoundManager.audioEngineOn) {
                console.log('bgmId is ',self.bgmId);   
                if(self.bgmId === -1) {
                    console.log('播放游戏音频');
                    cc.audioEngine.stopMusic();
                    self.bgmId = cc.audioEngine.playMusic(self.gameAudio,true);
                } else {
                    MessageSoundManager.resumeMusic();
                }
                bgmComp.bgmOnActive(true);
                bgmComp.bgmOffActive(false);

            } else {
                bgmComp.bgmOnActive(false);
                bgmComp.bgmOffActive(true);
                MessageSoundManager.updateMusic();
            }

        }
    }
    // // 地图块索引 => 
    // public nodePosMap: {[key: string]: cc.Node[]} = {};
    start() {
        window['Global'] = Global;

        let vcode = getUrlParameterValue('vcode');
        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'ludo') {
            cc.find('Canvas/BG').active = true;
        }
        this.initInfo();
        this.initTopUI();
        /** 初始化ufo节点池 */
        this.initUfoPool();
        this.initShowUI();
        
        console.log('skineInLocal is ',this.skinInLocal,' skinInSocket is ',this.skinInSocket);
        if(!this.skinInLocal && !this.skinInSocket) {
            console.log("获取道具数据...");
            this.getDicesByPlayerIds(this.playerIds);
        }

        this.showPlayersPathIfDebug();
        this.addEventDispatch();
        
        Global.isCanAutoJoinGame = false;
        setTimeout(() => {
            if (this.node && this.node.active && !this.settingLayer) {
                //预加载loading界面;
                this.loadSettingLayer();
            }
        }, 5000);
        this.gameStartEvent();
        this.joinError();
    }

    /**
     * 显示所有玩家的路径
     */
    showPlayersPathIfDebug() {
        if(this.isDebug && CC_DEBUG) {
            const pathColor = ['#0000ff','#ff0000','#00ff00','#ffd700'];
            // 调试模式
            console.log("players",this.players);
            const keys = Object.keys(this.players);
            let self = this.players[1];

            let selfGraphNode = new cc.Node();
            this.moveLayer.addChild(selfGraphNode);
            let selfPen = selfGraphNode.addComponent(cc.Graphics);
            selfPen.lineWidth = 4;
            selfPen.strokeColor = new cc.Color().fromHEX(pathColor[0]);
            selfPen.lineJoin = cc.Graphics.LineJoin.ROUND;

            const user1Track = Ludo_GlobalGameData.user1MoveTrack;
            for(let i = 0; i < user1Track.length; i++) {
                const x = -322 + 46 * user1Track[i][0];
                const y = -322 + 46 * user1Track[i][1];
                if(i === 0) {
                    selfPen.moveTo(x,y);
                } else {
                    selfPen.lineTo(x,y);
                }
            }
            selfPen.stroke();
        }
    }

    /**
     * 设置玩家的骰子，地图皮肤，角色皮肤
     * @param  {number[]} playerIds 所有玩家的id数组
     */
    getDicesByPlayerIds(playerIds: number[]) {
        if(playerIds.length === 0) {
            return;
        }

        MessageManager.httpResult("post",Ludo_MessageType.TOOLS,{
            uids: playerIds
        },(messageData) => {
            console.log('messageData is ',messageData as ToolsData);
            // 存入缓存
            dataCacheManager.setLocalData<ToolsData>('usersData',messageData.data);
            this.initBoardAndRoleAndDice(messageData.data);
        },1);
    }

    /**
     * 根据后端数据填充地图背景 骰子 和角色
     * @param  {ToolsData} data
     */
    initBoardAndRoleAndDice(data: ToolsData) {
        const playersData = data;
        const playerIds = Object.keys(playersData);

        const buildNameDirStr = (numberKey: number,ludoBoardId: number,player: cc.Node,diceNumber: number,key: string) => {
            let nickNameDirStr = '';
            switch(ludoBoardId) {
                case 1:
                    nickNameDirStr = 'knight_';
                    break;
                case 2:
                    nickNameDirStr = 'island_';
                    break;    
            }
            let nameDirStr = '';
            switch(numberKey) {
                case 0:
                    nameDirStr = `${nickNameDirStr}user_blue`;
                    break;
                case 1:
                    nameDirStr = `${nickNameDirStr}user_red`;
                    break;
                case 2:
                    nameDirStr = `${nickNameDirStr}user_green`;
                    break;
                case 3:
                    nameDirStr = `${nickNameDirStr}user_yellow`;
                    break;          
            }
            player.getComponent(LudoPlayerLogic).initPlayerInfo(this.players[key],this.gamePlist.getSpriteFrame(nameDirStr),diceNumber);
        }
        
        playerIds.forEach((item) => {
            const playerTools = playersData[item].user_tools;
            const key = this.idKeyMap[item];
            // console.log('key si ',key);
            const targetGoodsObj = playerTools.find(target => target.gtype === 'game_ludo_board');
            // console.log('targetGoodsObj is ',targetGoodsObj);
            const boardId = targetGoodsObj.goods_id;
            if(targetGoodsObj && +item === Global.userId) {
                this.showStoreBG(targetGoodsObj.goods_id,key);
            }

            let pieceArr = [this.piece_blueArr, this.piece_redArr, this.piece_greenArr, this.piece_yellowArr];
            const numKey = Number(key) - 1;

            playerTools.forEach((it) => {
                switch(it.gtype) {
                    case 'game_ludo_role':
                        const roleId = it.goods_id;
                        // 设置玩家皮肤
                        this.setStorePieceSkin(roleId,pieceArr[numKey],key);
                        break;
                    case 'game_ludo_dice':
                        const playerNode = this.userDataMap[item].player;
                        const diceNumber = it.goods_id;
                        buildNameDirStr(numKey,boardId,playerNode,diceNumber,key);
                        break;
                }
            })
        });
    }

    /** 初始化ufo节点池 */
    initUfoPool() {
        if(!this.ufoPrefab) return;

        this.ufoPool = new cc.NodePool();
        const poolDeep = 10;
        for(let i = 0; i < poolDeep; i++) {
            const poolItem = cc.instantiate(this.ufoPrefab) as cc.Node;
            this.ufoPool.put(poolItem);
        }
    }

    private joinError() {
        MyEvent.I.on("joinErrMessage", (data) => {
            if (data && data.err_code == 90020) {
                let exitPopup = cc.find("Canvas/exitPopup").getComponent(Ludo_ExitPopup);
                exitPopup.show(false);
            }
        }, this.node);
    }


    gameStartEvent() {
        let obj = {};

        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
        let betsType = 'game';
        if (Global.isCoinType) {
            betsType = 'yoyo';
        }
        obj = {
            eventName: "game_start",
            name: `${GameConfig.gameName}${gameType}`,
            bets: betsType,
            type: `${GameConfig.gameName}${gameType}`,
            mode: Ludo_GameMode.piceNum == 2 ? 'quick' : 'classical'
        }
        NDB.sendAutoJoinEvent(obj);

    }

    // 初始化topUI
    initTopUI() {
        let topNode = this.node.getChildByName('topNode');
        this.propLayer = this.node.getChildByName('propLayer');
        this.ufoPrefab = this.propLayer.getChildByName('ufoProps');
        this.arrowNode = this.propLayer.getChildByName('arrowNode');
        this.checkerboard = this.node.getChildByName('game_board');
        this.checkerboard2 = this.node.getChildByName('game_board2');
        this.timeLabel = topNode.getChildByName('countBG').getChildByName('timeLabel').getComponent(cc.Label);
        this.modeLabel = topNode.getChildByName('countBG').getChildByName('modeLabel').getComponent(cc.Label);
        if (Ludo_GameMode.piceNum == 2) {
            this.modeLabel.string = MessageData.lang.quick ? MessageData.lang.quick : 'QUICK';
        } else {
            this.modeLabel.string = MessageData.lang.classical ? MessageData.lang.classical : 'CLASSICAL';
        }
        this.coinLabel = topNode.getChildByName('coinPool').getChildByName('coinLabel').getComponent(cc.Label);
        this.moveLayer = this.node.getChildByName('moveLayer');
        let newImg = topNode.getChildByName('new');
        let move1 = cc.moveBy(0.5, cc.v2(0, 6));
        let move2 = cc.moveBy(0.5, cc.v2(0, -6));
        newImg.runAction(cc.repeatForever(cc.sequence(move1, move2)));
        this.coinShowLayer = topNode.getChildByName('coinShowLayer');
    }

    // 初始化房间信息
    initInfo() {
        Global.channelId = 0;
        Global.allNodePos = {};
        if (Global.gameRoomId == '' || !Global.gameRoomId) {
            MessageForRoom.getRoomInfo((roomInfo) => {
                Global.gameRoomId = roomInfo['room_id'];
                Global.shareUrl = roomInfo['share_url'];
            });
        }
    }

    //消息监听;
    addEventDispatch() {
        //socket消息；
        MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
        //棋子点击事件；
        MyEvent.I.on('touch_user1', this.user1NodeTouchEmit.bind(this), this.node);
        //棋子开始移动事件；
        MyEvent.I.on('move_tart', this.PieceMoveStartEmit.bind(this), this.node);
        //棋子移动结束事件；
        MyEvent.I.on('move_end', this.PieceMoveEndtEmit.bind(this), this.node);
        //切换回前台事件；
        MyEvent.I.on('onAndroidResume', this.onAndroidResume.bind(this), this.node);
        //切换到后台事件;
        MyEvent.I.on('onAndroidStop', this.onAndroidStop.bind(this), this.node);
        //当前房间状态；
        MyEvent.I.on('emit_status', this.updateStatus.bind(this), this.node);
        //金币move结束；
        MyEvent.I.on('coinMoveOver', this.coinMoveOverFunc.bind(this), this.node);
        //设置为机器人模式;
        MyEvent.I.on('robot_model', this.setRobotModel.bind(this), this.node);
        MyEvent.I.on('replayMusic', this.replayMusic.bind(this), this.node);
    }

    replayMusic() {
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && MessageSoundManager.audioEngineOn) {
            console.log('replaymusic');
            MessageSoundManager.pauseMusic();
            MessageSoundManager.resumeMusic();
        }
    }

    //设置商城买的背景;
    showStoreBG(boardType: number, key: string) {
        if (boardType == 593 || boardType == 0) {
            return;
        }

        let picePosskinName = ''
        if (boardType == 586) {
            picePosskinName = 'chengbao';
            const loadMapTime = console.time('loadMap');
            //设置棋盘动画；
            ResourcesManager.loadDragonBonesRes('chengbaocheckerboard/background_chengbao', (dragData) => {
                this.showBG.active = true;
                this.showBG.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.showBG.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.showBG.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';   
                this.showBG.getComponent(dragonBones.ArmatureDisplay).playAnimation(`type${key}`, 0);
            });
        } else if (boardType == 585) {
            picePosskinName = 'island';
            //棋盘；
            let spriteFrame = '';
            switch (key) {
                case '1':
                    spriteFrame = 'island_checkerboard_blue';
                    break;
                case '2':
                    spriteFrame = 'island_checkerboard_red';
                    break;
                case '3':
                    spriteFrame = 'island_checkerboard_green';
                    break;
                case '4':
                    spriteFrame = 'island_checkerboard_yellow';
                    break;
            }

            console.time('load585');
            ResourcesManager.loadSpriteAtlas('isLandCheckerboard/island_checkerboardPlist', (atlas: cc.SpriteAtlas) => {
                console.timeEnd('load585');
                this.checkerboard2.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(spriteFrame);
            });
        }
        let pieceArrPos = [this.piece_blueArr_Pos, this.piece_redArr_Pos, this.piece_greenArr_Pos, this.piece_yellowArr_Pos];
        if (picePosskinName == '') {
            picePosskinName = 'chessboard'
        }
        for (let i = 0; i < pieceArrPos.length; i++) {
            const pices = pieceArrPos[i];
            let color = '';
            switch (i) {
                case 0:
                    color = 'blue';
                    break;
                case 1:
                    color = 'red';
                    break;
                case 2:
                    color = 'green';
                    break;
                case 3:
                    color = 'yellow';
                    break;
            }
            for (let j = 0; j < pices.length; j++) {
                const element = pices[j];
                element.getComponent(cc.Sprite).spriteFrame = this.piecePlist.getSpriteFrame(`${picePosskinName}_${color}`)
            }
        }

    }

    //设置从商场购买的棋子;
    setStorePieceSkin(pieceType: number, pieceArr: cc.Node[], playerIndex: string) {
        if (pieceType == 594 || pieceType == 0) {
            return;
        }
        let pieceName = '';
        switch (pieceType) {
            case 589:
                pieceName = 'knightPiece/knight_';
                break;
            case 590:
                pieceName = 'princessPiece/princess_';
                break;
            case 587:
                pieceName = 'isLandManPiece/islandMan_';
                break;
            case 588:
                pieceName = 'isLandWomenPiece/islandWoman_';
                break;
        }

        let skinName: string = '';
        switch (playerIndex) {
            case '1':
                skinName = `${pieceName}blue`;
                break;
            case '2':
                skinName = `${pieceName}red`;
                break;
            case '3':
                skinName = `${pieceName}green`;
                break;
            case '4':
                skinName = `${pieceName}yellow`;
                break;
        }
        ResourcesManager.loadDragonBonesRes(skinName, (dragData) => {
            for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
                pieceArr[i].getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                pieceArr[i].getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                pieceArr[i].getComponent(dragonBones.ArmatureDisplay).armatureName = 'qizi';
                pieceArr[i].getComponent(dragonBones.ArmatureDisplay).playAnimation('daiji', 0);
            }
        });
    }

    //将ui初始化;
    initShowUI() {
        this.isCanSendEmoji = true;
        let message = MessageManager.getLastMessage();
        if (message.data && message.data.method && message.data.method == 'ludo_completed') {
            this.addSettingLayer(message);
        } else {
            let players = null;
            //说明获取状态信息的数据;
            if (message.players && message.rolling) {
                players = message.players;
                message.data = {};
                message.data.data = {};
                message.data.data.players = message.players;
                message.data.data.rolling = message.rolling;
                message.data.data.props = message.props;
                message.data.data.last_prop = message.last_prop;
                message.data.data.start_duration = message.countdown_duration;
                if (message.rolling.dice == 0) {
                    message.data.data.action = 'skip';
                } else {
                    message.data.data.action = 'roll';
                }
                if (message.status && message.status == 'completed') {
                    message.data.data.ranking = message.ranking;
                    this.addSettingLayer(message);
                    return;
                }

            } else {
                players = message.data.data.players;
            }
            this.players = players;

            //上帝模式;
            if (Global.nowGameType == Global.gameType.GodModel) {
                this.initGodModelUI(players);
            } else {
                this.initPlayerModelUI(players);
            }

            // this.getDicesByPlayerIds(this.playerIds);
            
            let last_prop = message.last_prop;
            if (message.rolling && message.rolling.user_id == Global.userId &&
                last_prop && last_prop.prop && last_prop.prop.id == 1) {
                this.sendPieceMove(last_prop.effect.piece_id, last_prop.effect.distance);
            } else {
                this.playingMessage(message);
            }

            //初始化道具；
            let porps = message.data.data.props;
            this.initPropsNode(porps);
            MessageManager.clearSocketDatas();

            //检测道具;

            this.checkPlayerProp(message.data.data.players, message.data.data.last_prop);
            this.initAddShowCoinAnimation();
        }
    }

    // 初始化上帝模式的UI;
    initGodModelUI(players) {
        let pieceArr = [this.piece_blueArr, this.piece_redArr, this.piece_greenArr, this.piece_yellowArr];
        let pieceArrPos = [this.piece_blueArr_Pos, this.piece_redArr_Pos, this.piece_greenArr_Pos, this.piece_yellowArr_Pos];
        let userMoveTrackArr = [Global.user1MoveTrack, Global.user2MoveTrack, Global.user3MoveTrack, Global.user4MoveTrack];
        let userArr = ['user1', 'user2', 'user3', 'user4'];
        let piecePosArr;
        if (Ludo_GameMode.piceNum == 4)
            piecePosArr = this.piecePosArr2;
        else
            piecePosArr = this.piecePosArr;

        let keys = Object.keys(players);
        const playerIdSkinMap = {};

        this.playerIds = [];
        this.idKeyMap = {};
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (players[key]) {
                let playerid = players[key].id;
                this.playerIds.push(playerid);
                this.idKeyMap[playerid] = key;
                let pieces = players[key].pieces;
                let index = Number(key) - 1;
                let player = this.playerNodeArr[index];
                player.active = true;
                for (let j = 0; j < Ludo_GameMode.piceNum; j++) {
                    pieceArr[Number(key) - 1][j].active = true;
                    pieceArrPos[Number(key) - 1][j].active = true;
                }
                //设置用户map数据;
                this.userDataMap[playerid] = {};
                this.userDataMap[playerid]['key'] = key;
                this.userDataMap[playerid]['player'] = player;
                this.userDataMap[playerid]['userClass'] = new Ludo_userNodeList(pieceArr[index], pieceArrPos[index], userMoveTrackArr[index], piecePosArr[index], userArr[index], playerid,+key - 1);
                this.userDataMap[playerid]['userClass'].setNodePos(pieces, '1', index);
                this.userDataMap[playerid]['userClass'].savaNodePos(pieces);

                let game_ludo_role = 0;
                let game_ludo_dice = 0;
                const setPlayersSkin = () => {
                    //设置玩家棋子皮肤；
                    this.setStorePieceSkin(game_ludo_role, pieceArr[Number(key) - 1], key);

                    // 设置数据显示;
                    let nameDiStr = '';
                    switch (i) {
                        case 0:
                            nameDiStr = 'user_blue';
                            break;
                        case 1:
                            nameDiStr = 'user_red';
                            break;
                        case 2:
                            nameDiStr = 'user_green';
                            break;
                        case 3:
                            nameDiStr = 'user_yellow';
                            break;
                    }

                    player.getComponent(LudoPlayerLogic).initPlayerInfo(players[key], this.gamePlist.getSpriteFrame(nameDiStr), game_ludo_dice);
                }
                if (players[key]) {
                    this.skinInSocket = true;
                    //棋子和骰子的数据;
                    let ludo_equipment = players[key];
                    game_ludo_role = ludo_equipment.game_ludo_role;
                    game_ludo_dice = ludo_equipment.game_ludo_dice;

                    /** 设置玩家的装备 */
                    playerIdSkinMap[playerid] = ludo_equipment;

                } else {
                    // 从缓存里面拿
                    const localData = dataCacheManager.getLocalData('userDataGod');
                    if(localData && localData[playerid]) {
                        this.skinInLocal = true;
                        let ludo_equipment = localData[playerid];
    
                        game_ludo_role = ludo_equipment.game_ludo_role;
                        game_ludo_dice = ludo_equipment.game_ludo_dice;

                    }
                }

                setPlayersSkin();
                
            } else {
                let index = Number(key) - 1;
                let player = this.playerNodeArr[index];
                player.active = false;
                for (let j = 0; j < Ludo_GameMode.piceNum; j++) {
                    pieceArr[i][j].active = false;
                    pieceArrPos[i][j].active = false;
                }
            }
        }

        dataCacheManager.setLocalData('userDataGod',JSON.stringify(playerIdSkinMap));
        this.showStoreBG(Global.godModeGameBoard, '1');
        //对同位置节点进行缩放;
        this.setAllPosScale();
    }

    //初始化玩家模式的UI;
    initPlayerModelUI(players) {
        // let code = Number(MessageManager.getUrlParameterValue('vcode'));
        // if (code >= 13100) {
        //     this.emojiNode.active = true;
        // }
        let pieceArr = [this.piece_blueArr, this.piece_redArr, this.piece_greenArr, this.piece_yellowArr];
        let pieceArrPos = [this.piece_blueArr_Pos, this.piece_redArr_Pos, this.piece_greenArr_Pos, this.piece_yellowArr_Pos];
        let userMoveTrackArr = [Global.user1MoveTrack, Global.user2MoveTrack, Global.user3MoveTrack, Global.user4MoveTrack];
        let userArr = ['user1', 'user2', 'user3', 'user4'];

        let piecePosArr;
        if (Ludo_GameMode.piceNum == 4)
            piecePosArr = this.piecePosArr2;
        else
            piecePosArr = this.piecePosArr;
        //自己所在座位;
        let selfIndex = 0;
        let newPlayers = { 1: {}, 2: {}, 3: {}, 4: {} };
        let keys = Object.keys(newPlayers);
        for (let i = 0; i < 4; i++) {
            let key = keys[i];
            if (players[key]) {
                newPlayers[key] = players[key];
                let playerid = players[key].id;
                this.userDataMap[playerid] = {};
                this.userDataMap[playerid]['key'] = key;
                if (playerid == Global.userId) {
                    selfIndex = i;
                }
            } else {
                newPlayers[key] = {};
            }
        }
        let selfKey = this.userDataMap[Global.userId]['key'];
        if (selfKey != '1') {
            this.checkerboard.getComponent(cc.Sprite).spriteFrame = this.checkerboardArr[Number(selfKey) - 1];
        }

        keys = Object.keys(newPlayers);
        for (let i = 0; i < selfIndex; i++) {
            let key = keys.shift();
            keys.push(key);
        }

        this.playerIds = [];
        this.idKeyMap = {};
        /** 玩家id： 皮肤map */
        const playerIdSkinMap = {};

        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let number: number = i;
            let player = this.playerNodeArr[number];
            let numberKey = Number(key) - 1;
            if (players[key]) {
                player.active = true;
                let playerid = players[key].id;
                this.idKeyMap[playerid] = key;
                this.playerIds.push(playerid);
                // playerIdSkinMap[playerid];

                let pieces = players[key].pieces;
                for (let j = 0; j < Ludo_GameMode.piceNum; j++) {
                    pieceArr[numberKey][j].active = true;
                    // console.log(`第${j}个位置，第${j}个棋子的zIndex is `,pieceArr[numberKey][j].zIndex);
                    pieceArrPos[numberKey][j].active = true;
                }

                let game_ludo_role = 0;
                let game_ludo_dice = 0;
                let game_ludo_board = 0;

                const setPlayersSkin = () => {
                    if(playerid === Global.userId) {
                        this.showStoreBG(game_ludo_board,key);
                    }
                    // 设置棋子皮肤
                    this.setStorePieceSkin(game_ludo_role,pieceArr[numberKey],key);
        
                    let nickNameDiStr = '';
                    switch (game_ludo_board) {
                        case 1:
                            nickNameDiStr = 'knight_';
                            break;
                        case 2:
                            nickNameDiStr = 'island_';
                            break;
                    }
        
                    let nameDiStr = '';
                    switch (numberKey) {
                        case 0:
                            nameDiStr = `${nickNameDiStr}user_blue`;
                            break;
                        case 1:
                            nameDiStr = `${nickNameDiStr}user_red`;
                            break;
                        case 2:
                            nameDiStr = `${nickNameDiStr}user_green`;
                            break;
                        case 3:
                            nameDiStr = `${nickNameDiStr}user_yellow`;
                            break;
                    }
                    //设置数据显示： 自己的骰子样式
                    player.getComponent(LudoPlayerLogic).initPlayerInfo(players[key], this.gamePlist.getSpriteFrame(nameDiStr), game_ludo_dice);
                }
                if (players[key]) {
                    this.skinInSocket = true;
                    //棋子和骰子的数据;
                    let ludo_equipment = players[key];
                    game_ludo_role = ludo_equipment.game_ludo_role;
                    game_ludo_dice = ludo_equipment.game_ludo_dice;
                    game_ludo_board = ludo_equipment.game_ludo_board;
                    // console.log('装备数据是',game_ludo_dice);
                } else {
                    const localData = dataCacheManager.getLocalData('userData');
                    if(localData && localData[playerid]) {
                        this.skinInLocal = true;
                        let ludo_equipment = localData[playerid];
                        game_ludo_role = ludo_equipment.game_ludo_role;
                        game_ludo_dice = ludo_equipment.game_ludo_dice;
                        game_ludo_board = ludo_equipment.game_ludo_board;
                    }
                }

                this.userDataMap[playerid]['player'] = player;
                this.userDataMap[playerid]['userClass'] = new Ludo_userNodeList(pieceArr[numberKey], pieceArrPos[numberKey], userMoveTrackArr[number], piecePosArr[number], userArr[number], playerid,+key - 1);
                if (this.getGameStatus()) {
                    this.userDataMap[playerid]['userClass'].setNodePos(pieces, '1', number);
                } else {
                    this.userDataMap[playerid]['userClass'].setNodePos(pieces, this.userDataMap[Global.userId]['key'], number);
                }
                this.userDataMap[playerid]['userClass'].savaNodePos(pieces);

                setPlayersSkin();                
            } else {
                player.active = false;
                for (let j = 0; j < Ludo_GameMode.piceNum; j++) {
                    pieceArr[numberKey][j].active = false;
                    pieceArrPos[numberKey][j].active = false;
                }
            }
            //如果只有2个人，那么需要拆分一下数据;
            // if (Global.nowGameType == Global.gameType.twoModel) {
            //     // addNum = 1;
            // }
        }

        console.log("playerIdSkinMap is ",playerIdSkinMap);
        // 用户的装备保存到本地
        dataCacheManager.setLocalData('usersData',JSON.stringify(playerIdSkinMap));
        //对同位置节点进行缩放;
        this.setAllPosScale();
    }

    //显示增加金币动画；
    initAddShowCoinAnimation() {
        if (Global.roomBetsType === 'coin') {
            this.coinPoolNode.getComponent(cc.Sprite).spriteFrame = this.yoyoPool;
        }
        let keys = Object.keys(this.userDataMap);
        this.coinValue = 0;
        this.coinMaxValue = keys.length * Global.roomBets;
        this.coinNodeArr = [];
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let userData = this.userDataMap[key];
            let player = userData.player;
            let coinNode = cc.instantiate(this.coinmovePrefab);
            this.coinShowLayer.addChild(coinNode);
            let startPos = cc.v2(player.x - 45, player.y + 9);
            let endPos = cc.v2(0, 470);
            coinNode.getComponent(Ludo_coinmoveLogic).runCoinAction(startPos, endPos);
            this.coinNodeArr.push(coinNode);
        }
    }

    //金币到终点以后的回调;
    coinMoveOverFunc() {
        //Global.roomBets
        let keys = Object.keys(this.userDataMap);
        this.coinValue += Math.ceil(this.coinMaxValue / 10 / keys.length);
        if (this.coinValue > this.coinMaxValue) {
            this.coinValue = this.coinMaxValue;
        }
        this.coinLabel.string = String(this.coinValue);
        if (this.coinValue == this.coinMaxValue) {
            setTimeout(() => {
                if (this.node && this.node.active) {
                    for (let i = 0, len = this.coinNodeArr.length; i < len; i++) {
                        this.coinNodeArr[i].destroy();
                        this.coinNodeArr[i] = null;
                    }
                    this.coinNodeArr = [];
                }
            }, 1000);
        }
    }

    //显示道具节点;
    initPropsNode(props) {
        // console.log('props is ',props);
        for (let i = 0, len = props.length; i < len; i++) {
            this.addPropsNode(props[i].loc, props[i].id);
        }
    }

    //道具数据对比;
    comparedProps(data) {
        let props = data.props;
        let locArr: number[] = [];

        //如果服务器有这个数据，自己没有的话，需要创建这个数据;
        for (let i = 0, len = props.length; i < len; i++) {
            let loc = props[i].loc;
            if (!this.propsNodeObj[loc]) {
                let id = props[i].id;
                this.addPropsNode(loc, id);
            }
            locArr.push(loc);
        }

        //当自己有的数据，服务器没有时，则删除该数据;
        let keys = Object.keys(this.propsNodeObj);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            if (locArr.indexOf(Number(key)) < 0) {
                this.propsNodeObj[key].destroy();
                this.propsNodeObj[key] = null;
                delete this.propsNodeObj[key];
            }
        }
    }
    /*
        添加道具节点：
        @param  posNum      道具坐标
        @param  type        道具类型
    */
    addPropsNode(posNum: number, type: number) {
        MessageSoundManager.playLoadEffect(this.propShow);
        let props = cc.instantiate(this.propsPrefab);
        this.propsNodeObj[posNum] = props;
        posNum = this.convertVlalue(posNum) - 1;
        props.getComponent(Ludo_propsLogic).setNodeType(type);
        props.x = Global.user1MoveTrack[posNum][0] * 46 - 322;
        props.y = Global.user1MoveTrack[posNum][1] * 46 - 322;
        props.zIndex = 15 - Global.user1MoveTrack[posNum][1];
        this.moveLayer.addChild(props);
    }

    //消息处理；
    messageFunc(mData) {
        if (!this.isReceiverMessage) {
            return;
        }
        let method = mData.data.method;
        if (MessageData.gameid == '')
            MessageData.gameid = mData.data.channel.id
        if (MessageData.gameSource_Id == '')
            MessageData.gameSource_Id = mData.data.data.source_id;
        switch (method) {
            case 'ludo_playing':                    //游戏消息;
                this.playingMessage(mData);
                break;
            case 'ludo_completed':                  //游戏结束消息；
                this.completedFunc(mData);
                break;
            case 'response_ws_status':              //网络波动逻辑；
                this.request_ws_status(mData);
                break;
            case 'emoji_on_mic':                    //表情;
                let displayId = mData.data.data.user.display_id;
                let msg = mData.data.data.msg;
                let name = mData.data.data.emoji_name;
                let num = mData.data.data.emoji_random_number;

                if(!msg) {
                    const emojiObjs = Object.values(this.emojiJson.json) as {name: string,image: string,svga: string,svga_o: string}[];
                    msg = emojiObjs.find(item => item.name === name).svga;

                }
                // if (this.isShowSettlementLayer) {
                //     // this.settleLayer.getComponent(ludoSettleLogic).setEmojiShow(displayId, msg,name,num);
                // } else {
                this.setEmojiShow(displayId, msg);
                // }
                break;
            case 'updateVolumeIndication':
                this.setPlayerSpeakAction(mData.data.speakers);
                break;
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
                this.userDataMap[uid].player.getComponent(LudoPlayerLogic).setPlayerSpeakType();
            }
        }
    }

    //检测用户身上是否有道具; 没有道具的隐藏隐身衣
    checkPlayerProp(players, last_prop) {
        let keys = Object.keys(players);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let props = players[key].props;
            let id = players[key].id;
            //是否有金骰子;
            let isHaveGlodDice: boolean = false;
            if (props && props.length > 0) {
                let invisibleArr = [0, 1];
                for (let j = 0, pLen = props.length; j < pLen; j++) {
                    //道具类型;
                    let pId = props[j].id;
                    //金骰子;
                    if (pId == 2) {
                        isHaveGlodDice = true;
                        let isGoldDice = this.userDataMap[id].player.getComponent(LudoPlayerLogic).getIsGoldDice();
                        if (!isGoldDice) {
                            if (last_prop.prop) {
                                let loc = last_prop.prop.loc;
                                MessageSoundManager.playLoadEffect(this.diceGet);
                                this.goldDiceAnimaFunc(loc, id, () => {
                                    //设置金骰子;
                                    this.userDataMap[id].player.getComponent(LudoPlayerLogic).setGoldDice();
                                });
                            } else {
                                this.userDataMap[id].player.getComponent(LudoPlayerLogic).setGoldDice();
                            }
                        }
                        continue;
                    } else if (pId == 3) {//隐身衣;
                        let piece_id = props[j].piece_id - 1;  // 0  1
                        for (let i = 0, len = invisibleArr.length; i < len; i++) {
                            if (invisibleArr[i] == piece_id) {
                                invisibleArr.splice(i, 1);
                            }
                        }
                        let piece = this.userDataMap[id]['userClass'].getNodeListIndex(piece_id);
                        let isPropType = piece.getComponent(Ludo_userNodeLogic).isPropType;
                        if (!isPropType) {
                            MessageSoundManager.playLoadEffect(this.yinshengyiStart);
                            this.showYSYAnimaFunc(piece);
                        }
                    }
                }
                for (let i = 0, len = invisibleArr.length; i < len; i++) {
                    let piece = this.userDataMap[id]['userClass'].getNodeListIndex(invisibleArr[i]);
                    piece.getComponent(Ludo_userNodeLogic).hideYSY();
                }
            } else {
                this.userDataMap[id]['userClass'].setAllPiecePiecePropInViCloak();
            }

            if (!isHaveGlodDice) {
                this.userDataMap[id].player.getComponent(LudoPlayerLogic).setIsGoldDice(false);
            }
        }
    }

    //游戏中消息处理;
    playingMessage(messageData) {
        if (!Global.channelId && messageData.data.channel) {
            Global.channelId = messageData.data.channel.id;
        }


        //设置时间;
        if (this.isStartCountTime) {
            let start_duration = messageData.data.data.start_duration;
            this.setTimeLabel(start_duration);
        }
        let players = messageData.data.data.players;
        let keys = Object.keys(players);
        //没有显示过弹窗并且非上帝模式;
        if (!this.isShowSkipPop && !this.getGameStatus()) {
            let players = messageData.data.data.players;
            let keys = Object.keys(players);
            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let player = players[key];
                let skip = player.skip;
                if (skip > 2) {
                    let id = player.id;
                    this.userDataMap[id].player.getComponent(LudoPlayerLogic).setleave();
                    if (id == Global.userId) {
                        //显示弹窗;
                        this.isShowSkipPop = true;
                        let node = cc.instantiate(this.popLayer);
                        this.node.addChild(node);
                    }
                }
            }
        }

        let playerids = [];
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let player = players[key];
            let id = player.id;
            playerids.push(id);
            this.userDataMap[id].player.getComponent(LudoPlayerLogic).setHeadStatus(player);
        }

        //该掷骰子状态;
        let action = messageData.data.data.action;
        if (action == 'skip' || action == 'start') {
            this.skipMessage(messageData);
        } else if (action == 'roll') {                     //掷骰子阶段;
            this.rollMessage(messageData);
        } else if (action == 'move') {                     //移动傻子;
            this.moveMessage(messageData);
        } else if (action == 'ufo_move') {
            this.ufoMoveMessage(messageData);
        } else if (action == 'leave') {                    //有人离开；
            this.leaveMessage(messageData);
        } else if (action == 'join') {                     //有人加入；
            this.joinMessage(messageData);
        } else if (action == 'kick') {
            this.kickMessage(messageData);
        }
    }

    /* ******************************** 游戏内操作消息 ***************************************** */

    //从道具对象中指定删除某个道具;
    removeLast_prop(prop) {
        let loc = prop.loc;
        if (loc) {
            if (this.propsNodeObj[loc]) {
                this.propsNodeObj[loc].destroy();
                this.propsNodeObj[loc] = null;
            }
        }
    }

    //收到Skip消息 掷骰子消息;
    skipMessage(messageData) {
        if (this.nowActionPlayer) {
            let nowPlayer = this.nowActionPlayer.getComponent(LudoPlayerLogic);
            nowPlayer.stopCountTime();
            this.scheduleOnce(() => {
                nowPlayer.setDicePoint(0);
            }, 1);
        }
        if (!this.getGameStatus()) {
            //将自己棋子设置为不能点击，防止超时自动结束以后，棋子还是点击状态；
            this.userDataMap[Global.userId]['userClass'].setAllNodeStandby();
        }

        let rolling = messageData.data.data.rolling;
        //操作人;
        let userMap = this.userDataMap[rolling.user_id];
        if (!userMap) {
            return;
        }
        let plyaer = userMap.player;
        this.nowActionPlayer = plyaer;
        //用户开始操作了，背景光和倒计时走起;
        if (this.nowPlayering) {
            this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
        }
        plyaer.getComponent(LudoPlayerLogic).startAction();
        this.nowPlayering = plyaer;
        //如果是操作人是自己，那么箭头显示，骰子可以点击;
        if (rolling.user_id == Global.userId) {
            this.arrowNode.active = true;
            this.isCanTouchDice = true;
        } else {
            this.arrowNode.active = false;
            this.isCanTouchDice = false;
        }
    }

    //收到Roll消息 有人掷骰子;
    rollMessage(messageData) {
        let rolling = messageData.data.data.rolling;
        let dataMap = this.userDataMap[rolling.user_id];
        let dicePoint = rolling.dice;                           //摇到的骰子点数；
        this.dicePoints = dicePoint;
        let userClass = dataMap['userClass'];
        let userPlayer = dataMap.player;

        //记录当前操作人;
        this.nowActionPlayer = userPlayer;
        //先把操作人的骰子点数值设为0；
        userPlayer.getComponent(LudoPlayerLogic).nowPoint = 0;
        //如果是自己掷骰子;
        if (rolling.user_id == Global.userId) {
            this.arrowNode.active = false;
            //设置所有棋子为待机状态;
            userClass.setAllNodeStandby();
            if (this.nowShowDicePlayer) {
                this.nowShowDicePlayer.getComponent(LudoPlayerLogic).setDiceAniNodeHide();
            }
            this.nowShowDicePlayer = userPlayer;
            userPlayer.getComponent(LudoPlayerLogic).dicePlayAnimation(dicePoint, () => {
                //如果骰子点数是6;
                if (dicePoint == 6) {
                    //获取可以等于6以后可以点击的数量;
                    let canMoveNum = userClass.getNLessThanumber(dicePoint);
                    //没有可以移动的棋子;
                    if (canMoveNum == 0) {
                        //获取一个未到重点的值;
                        let index = userClass.getCanMovePieceId2();
                        this.sendPieceMove(index, 6);
                    }
                    //有一个可以移动的值;
                    else if (canMoveNum == 1) {
                        let moveIndex = userClass.get6CanMovePieceId(dicePoint);
                        //获取可以移动6个位置的棋子id；
                        this.sendPieceMove(moveIndex, this.dicePoints);
                    } else {
                        //如果不知一个可以移动，将可以移动6位置的棋子开启点击事件;
                        userClass.setAllNodeCanTouch(dicePoint);
                    }
                }
                else {
                    //获取可以移动的棋子；
                    let moveingNum = userClass.getMoveingNum(dicePoint);
                    //没有可以移动的棋子;
                    if (moveingNum == 0) {
                        this.sendPieceMove(1, this.dicePoints);
                    } else if (moveingNum == 1) {
                        let number = userClass.getCanMovePieceId(dicePoint);
                        this.sendPieceMove(number, this.dicePoints);
                    } else {
                        //设置移动中的节点都能点击;
                        userClass.setMoveingCanTouch(dicePoint);
                    }
                }
            });
        } else {
            if (this.nowShowDicePlayer) {
                this.nowShowDicePlayer.getComponent(LudoPlayerLogic).setDiceAniNodeHide();
            }
            this.nowShowDicePlayer = userPlayer;
            userPlayer.getComponent(LudoPlayerLogic).dicePlayAnimation(dicePoint, () => { });
        }
    }

    //收到Move消息，有人移动;
    moveMessage(messageData) {
        if (this.nowActionPlayer) {
            this.nowActionPlayer.getComponent(LudoPlayerLogic).stopCountTime();
        }
        this.messageData = messageData;
        let sender = messageData.data.sender;
        //当前操作人;
        let userMap = this.userDataMap[sender];
        let userPlayer = userMap.player;
        //停止操作人的倒计时；
        userPlayer.getComponent(LudoPlayerLogic).stopCountTime();
        //骰子类；
        let userClass = userMap['userClass'] as Ludo_userNodeList;
        //获取当前操作人的数据;
        let playerData = this.getPlayerData(messageData.data.data.players, sender);
        if (playerData) {
            this.nowMoveClass = userClass;
            //新的坐标值;
            let pieces = playerData['pieces'];
            //获取是哪一个需要移动;
            let getMoveIndex = userClass.getMoveNodeIndex(pieces);
            //获取旧的坐标值;
            let oldPieces = userClass.getOldPieces();

            this.checkPosNode(getMoveIndex, oldPieces, pieces, messageData.data.data.players, sender);
            //去对比的棋子，看看移动那个棋子;
            if (this.getGameStatus()) {
                userClass.NodeComparedMove(pieces, '1');
            } else {
                if (sender == Global.userId) {
                    userClass.setAllNodeStandby();
                }
                userClass.NodeComparedMove(pieces, this.userDataMap[Global.userId]['key']);
            }
        }
    }

    //收到UFO消息;
    ufoMoveMessage(messageData) {
        let sender = messageData.data.sender;
        let rolling = messageData.data.data.rolling;
        //当前操作人;
        let userMap = this.userDataMap[sender];
        let userPlayer = userMap.player;
        this.messageData = messageData;
        //骰子类；
        let userClass = userMap['userClass'] as Ludo_userNodeList;
        let playerData = this.getPlayerData(messageData.data.data.players, sender);
        if (playerData) {
            this.nowMoveClass = userClass;
            //新的坐标值;
            let pieces = playerData['pieces'];
            let newpieces = Object.assign({}, pieces);
            //获取是哪一个需要移动;
            let getMoveIndex = userClass.getMoveNodeIndex(newpieces);

            //获取旧的坐标值;
            let oldPieces = userClass.getOldPieces();
            let oldPos = oldPieces[getMoveIndex];
            oldPos = this.convertVlalue(oldPos);
            // 地图上的第几个块
            const mapIndex = pieces[getMoveIndex];

            let endPos = this.convertVlalue(pieces[getMoveIndex]);
            let pieceNode = userClass.getNodeListIndex(getMoveIndex - 1);
            let keys = Object.keys(newpieces);
            let posArr = [];
            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let numner = this.convertVlalue(newpieces[key]);
                posArr.push(numner);
            }

            //刷新旧数据;
            //在Ufo时，固定让反悔按钮不可用;
            // 刷新nodePos数据
            userClass.setOldPieces(pieces, posArr);
            this.runUFOPropsFunc(oldPos, endPos, pieceNode, sender, (ufoNode: cc.Node,ufoAudioIds: number[]) => {

                console.log('ufo移动完毕');
                // const activeUfoNode = this.UFOprops.find((item) => item.active);
                this.scheduleOnce(() => {
                    if(ufoNode && ufoNode.active && ufoAudioIds) {
                        // console.log('出现ufo移动完毕没有消失的bug了');
                        ufoNode.active = false;
                        this.ufoPool.put(ufoNode);
                        // 停掉所有的ufo声音
                        ufoAudioIds.forEach((id) => {
                            if(id >= 0) {
                                cc.audioEngine.stopEffect(id);
                            }
                        });
                        // cc.audioEngine.stopAllEffects();
                    }
                },0.03);
                if(mapIndex === 58) {
                    delete userClass.repeat52To58Nodes[getMoveIndex - 1];
                } else if(mapIndex > 52 && mapIndex < 58) {
                    userClass.repeat52To58Nodes[getMoveIndex - 1] = endPos;
                }
                //道具数据;
                let last_prop = messageData.data.data.last_prop;
                //获取终点坐标;
                let players = messageData.data.data.players;
                let data = messageData.data.data;
                //检测道具情况;
                this.checkPlayerProp(players, data.last_prop);
                //道具对比;
                this.comparedProps(data);
                //有火箭的话，先执行火箭动作，然后检测是否有被T的节点;
                if (last_prop.prop && last_prop.prop.id == 4) {
                    //起点坐标;
                    let loc = last_prop.prop.loc;
                    let endLoc = loc + 5;
                    let keys = Object.keys(players);
                    let tArr = [];
                    for (let k = 0, kLen = keys.length; k < kLen; k++) {
                        let key = keys[k];
                        let id = players[key].id;
                        let pieces = players[key].pieces;
                        let tPosArr = this.userDataMap[id].userClass.getTPosArr(pieces);
                        if (tPosArr.length > 0) {
                            let TObj = {
                                id: id,
                                tPosArr: tPosArr
                            };
                            tArr.push(TObj);
                            endLoc = this.userDataMap[id].userClass.oldPieces[String(tPosArr[0] + 1)];
                        }
                    }
                    this.runRocketPropFunc(loc, endLoc, (boomPos) => {
                        let tLen = tArr.length;
                        this.rocketProps.rotation = 0;
                        let rocketNode = this.rocketProps.getChildByName('rocketNode');
                        let rocketDrag = rocketNode.getComponent(dragonBones.ArmatureDisplay);
                        rocketDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                            rocketDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                            this.rocketProps.active = false;
                            this.nextPlayerRolling();
                        }, this);
                        MessageSoundManager.playLoadEffect(this.rocketBoom);
                        rocketDrag.playAnimation('baozha', 1);
                        if (tLen > 0) {
                            let playerId = tArr[0].id;
                            let tPosArr = tArr[0].tPosArr;
                            let userClass = this.userDataMap[playerId]['userClass'];
                            userClass.boomGoHome(tPosArr);
                            this.nodeScaleFunc(boomPos);
                        }
                    });
                }
                //踩到UFO了，需要move;
                else if (last_prop.effect && last_prop.prop && last_prop.prop.id == 1) {
                    if (sender == Global.userId) {
                        console.log('ufo移动完毕又遇到一个ufo发送move事件');
                        this.sendPieceMove(last_prop.effect.piece_id, last_prop.effect.distance);
                    }
                }
                else {
                    // 校验相同坐标的节点;
                    this.checkPosNode(getMoveIndex, oldPieces, pieces, messageData.data.data.players, sender);
                    const repeatPosDeal = (repeatNodes: cc.Node[]) => {
                        let endLen = repeatNodes.length;
                        if (endLen > 1) {
                            let endIdenticalNode = repeatNodes;
                            let endPosX = this.posConvertValue(Global.user1MoveTrack[endPos - 1][0]);
                            for (let i = 0; i < endLen; i++) {
                                endIdenticalNode[i].scale = 0.8;
                                if (endLen % 2 == 0) {
                                    endIdenticalNode[i].x = endPosX - 10 - (endLen / 2 - 1) * 20 + i * 20;
                                } else {
                                    endIdenticalNode[i].x = endPosX - Math.floor(endLen / 2) * 20 + i * 20;
                                }
                            }
                        } else if(endLen === 1){
                            repeatNodes[0].scale = 1;
                            // 设置棋子到中间位置
                            let endPosX = this.posConvertValue(Global.user1MoveTrack[endPos - 1][0]);
                            repeatNodes[0].x = endPosX;
                        }
                    }
                    repeatPosDeal(this.endIdenticalNode);
                    repeatPosDeal(this.startIdenticalNode);

                    // 检查52 ~ 58范围内重叠的节点
                    this.afterMoveUfoCheckRepeatNodes();
                    let tLen = this.TNode.length;
                    if (tLen > 0) {
                        let playerId = this.TNode[0].id;
                        let tPosArr = this.TNode[0].tPosArr;
                        let userClass = this.userDataMap[playerId]['userClass'];
                        userClass.setNodeResult(tPosArr);
                    }
                    //道具对比;
                    this.comparedProps(data);
                    //---------------------------move以后，轮到下一个用户操作了------------------------；
                    let roUserMap = this.userDataMap[rolling.user_id];
                    let rollPlayer = roUserMap.player;
                    //记录当前操作人;
                    this.nowActionPlayer = rollPlayer;
                    if (this.node && this.node.active) {
                        if (this.nowPlayering) {
                            this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
                        }
                        this.nowPlayering = rollPlayer;
                        //新操作人开启倒计时;
                        rollPlayer.getComponent(LudoPlayerLogic).startAction();
                        userPlayer.getComponent(LudoPlayerLogic).resumeDicePoint(false);
                        //如果是轮到我掷骰子了，如果不是自己掷骰子的话，直接等待就行;
                        if (rolling.user_id == Global.userId) {
                            this.arrowNode.active = true;
                            this.isCanTouchDice = true;
                        } else {
                            //设置自己不能点击;
                            this.isCanTouchDice = false;
                            //隐藏箭头；                      
                            this.arrowNode.active = false;
                        }
                    }
                }
            });
        }
    }
    
    /**
     * ufo移动完毕之后检查 52 - 58之间的节点缩放和位置
     */
    afterMoveUfoCheckRepeatNodes() {
        const userDataMap = this.userDataMap;
        const playerIds = Object.keys(userDataMap);

        playerIds.forEach((id) => {
            const userNodeListComp = userDataMap[id]['userClass'] as Ludo_userNodeList;
            const nodes = userNodeListComp.repeat52To58Nodes;
            
            const allPieceKeys = Object.keys(nodes);
            
            const valueMap = {};
            allPieceKeys.forEach(it => {
                // 位置it
                const value = nodes[it];
                if(!valueMap[value]) {
                    valueMap[value] = [it];
                } else {
                    valueMap[value].push(it);
                }
            });
            const valueMapValue = Object.values(valueMap);
            valueMapValue.forEach((valueItem: Array<string>) => {
                if(valueItem.length === 1) {
                    // 设置缩放为1
                    const indexNumber = +valueItem[0];
                    const targetNode = userNodeListComp.getNodeListIndex(indexNumber);
                    targetNode && (targetNode.scale = 1);
                    const endPos = targetNode.getComponent(Ludo_userNodeLogic).getEndPos();
                    targetNode.x = endPos[0];

                } else {
                    const len = valueItem.length;
                    // 设置缩放为0.8
                    valueItem.forEach((indexStr,inx) => {
                        const indexNum = +indexStr;
                        const targetNode = userNodeListComp.getNodeListIndex(indexNum);
                        const endPos = targetNode.getComponent(Ludo_userNodeLogic).getEndPos();
                        targetNode && (targetNode.scale = 0.8);
                        if(len % 2 === 0) {
                            targetNode.x = endPos[0] - 10 - (len / 2 - 1) * 20 + inx * 20;
                        } else {
                            targetNode.x = endPos[0] - Math.floor(len / 2) * 20 + inx * 20;
                        }
                    });
                }
            });
        });
    }

    //收到leave消息，有人离开；
    leaveMessage(messageData) {
        //有人离开;
        let sender = messageData.data.sender;
        let player = this.userDataMap[sender]['player'];
        player.getComponent(LudoPlayerLogic).setleave();

        //下一个操作人;
        let rolling = messageData.data.data.rolling;
        let roUserMap = this.userDataMap[rolling.user_id];
        let rollPlayer = roUserMap.player;
        if (this.nowPlayering) {
            this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
        }
        this.nowPlayering = rollPlayer;
        rollPlayer.getComponent(LudoPlayerLogic).startAction();
        // rollPlayer.getComponent(LudoPlayerLogic).playCountTime();
        if (rolling.user_id == Global.userId) {
            this.arrowNode.active = true;
            this.isCanTouchDice = true;
        } else {
            //设置自己不能点击;
            this.isCanTouchDice = false;
            //隐藏箭头；                      
            this.arrowNode.active = false;
        }
    }

    //收到Join消息，有人加入;
    joinMessage(messageData) {
        let rolling = messageData.data.data.rolling;
        //摇到的骰子点数；
        let dicePoint = rolling.dice;
        //如果 dicePoint 为0  则表示应该掷骰子了，如果不是0，则直接move；
        this.dicePoints = dicePoint;
        let userClass = this.userDataMap[rolling.user_id]['userClass'];
        let userPlayer = this.userDataMap[rolling.user_id].player;
        userPlayer.getComponent(LudoPlayerLogic).setJoin();
        let diceNode = userPlayer.getComponent(LudoPlayerLogic).getDiceNode();
        this.nowActionPlayer = userPlayer;
        //如果用户摇到点数0;
        if (dicePoint == 0) {
            if (this.nowPlayering) {
                this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
            }
            this.nowPlayering = userPlayer;
            //用户开启倒计时;
            userPlayer.getComponent(Ludo_gameLogic).startAction();
            // userPlayer.getComponent(LudoPlayerLogic).playCountTime();
            //如果操作人是自己;
            if (rolling.user_id == Global.userId) {
                this.isCanTouchDice = true;
                this.arrowNode.active = true;
            } else {
                this.isCanTouchDice = false;
                this.arrowNode.active = false;
            }
        } else {
            if (rolling.user_id == Global.userId) {
                if (this.nowShowDicePlayer) {
                    this.nowShowDicePlayer.getComponent(LudoPlayerLogic).setDiceAniNodeHide();
                }
                this.nowShowDicePlayer = userPlayer;
                userPlayer.getComponent(LudoPlayerLogic).dicePlayAnimation(dicePoint, () => {
                    if (dicePoint == 6) {             //如果是6，则所有棋子都是可以点击状态;
                        let canMoveNum = userClass.getNLessThanumber(dicePoint);
                        //如果没有能移动的棋子，发送1过去；
                        if (canMoveNum == 0) {
                            let index = userClass.getCanMovePieceId2();
                            this.sendPieceMove(index, this.dicePoints);
                        } else if (canMoveNum == 1) {
                            let moveIndex = userClass.get6CanMovePieceId(dicePoint);
                            this.sendPieceMove(moveIndex, this.dicePoints);
                        } else {
                            userClass.setAllNodeCanTouch(dicePoint);
                        }
                    } else {
                        //获取目前为移动状态的棋子;
                        let moveingNum = userClass.getMoveingNum();
                        if (moveingNum == 0) {    //没有可以;
                            //这个是否随便发送一个棋子；
                            this.sendPieceMove(1, this.dicePoints);
                        } else if (moveingNum == 1) {
                            let number = userClass.getCanMovePieceId(dicePoint);
                            this.sendPieceMove(number, this.dicePoints);
                        } else {
                            //设置移动中的节点都能点击;
                            userClass.setMoveingCanTouch(dicePoint);
                        }
                    }
                });
            } else {
                //现在是别人移动骰子;
                diceNode.active = false;
                if (this.nowShowDicePlayer) {
                    this.nowShowDicePlayer.getComponent(LudoPlayerLogic).setDiceAniNodeHide();
                }
                this.nowShowDicePlayer = userPlayer;
                userPlayer.getComponent(LudoPlayerLogic).dicePlayAnimation(dicePoint, () => {
                })
            }
        }
    }

    //有人被T;
    kickMessage(messageData) {
        let players = messageData.data.data.players;
        let keys = Object.keys(players);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let status = players[key].status;
            if (status == 'kickoff') {
                let id = players[key].id;
                this.userDataMap[id].player.getComponent(LudoPlayerLogic).setleave();
                if (id == Global.userId) {
                    //设置自己不能点击;
                    this.isCanTouchDice = false;
                    //隐藏箭头；                      
                    this.arrowNode.active = false;
                }
            }
        }

        //下一个操作人;
        let rolling = messageData.data.data.rolling;
        let roUserMap = this.userDataMap[rolling.user_id];
        let rollPlayer = roUserMap.player;
        if (this.nowPlayering) {
            this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
        }
        this.nowPlayering = rollPlayer;
        rollPlayer.getComponent(Ludo_gameLogic).startAction();
        if (rolling.user_id == Global.userId) {
            this.arrowNode.active = true;
            this.isCanTouchDice = true;
        } else {
            //设置自己不能点击;
            this.isCanTouchDice = false;
            //隐藏箭头；                      
            this.arrowNode.active = false;
        }
    }

    //显示结算界面;
    completedFunc(messageData) {
        if (this.nowActionPlayer) {
            this.nowActionPlayer.getComponent(LudoPlayerLogic).passAction();
        }
        this.arrowNode.active = false;
        let data = messageData.data.data;
        let sender = messageData.data.sender;
        let action = data.action;
        if (action == 'move') {
            //当前操作人;
            let userMap = this.userDataMap[sender];
            let userClass = userMap['userClass'];
            let player = this.getPlayerData(messageData.data.data.players, sender);
            if (player) {
                this.nowMoveClass = userClass;
                //新的坐标值;
                let pieces = player['pieces'];
                //去对比的棋子，看看移动那个棋子;
                if (this.getGameStatus()) {
                    userClass.NodeComparedMove(pieces, '1');
                } else {
                    userClass.NodeComparedMove(pieces, this.userDataMap[Global.userId]['key']);
                }
            }
            setTimeout(() => {
                if (this.node && this.node.active) {
                    this.addSettingLayer(messageData);
                }
            }, 2000);
        } else {
            let player = this.userDataMap[sender]['player'];
            player.getComponent(LudoPlayerLogic).setleave();
            this.addSettingLayer(messageData);
        }
    }

    /* ******************************** End ***************************************** */

    //网络波动;
    request_ws_status(data) {
        let online = data.data.data.online;
        if (online) {
            MessageForRoom.getStatus(Global.gameRoomId);
        }
    }

    //更新当前状态;
    updateStatus(event) {
        this.isStartCountTime = false;
        Global.allNodePos = {};
        let data = event.statusData;
        let start_duration = data.countdown_duration;
        this.setTimeLabel(start_duration);
        if (data.status == "playing") {
            let players = data.players;
            console.log('data is ',data);
            //道具对比;
            this.comparedProps(data); 
            let keys = Object.keys(players);
            let len = keys.length;
            let addNum = 0;
            let pathRefrenceUserClass = null;
            for (let i = 0; i < len; i++) {
                let number: number = i + addNum;
                let key = keys[i];
                let pieces = players[key]['pieces'];
                let playerId = players[key].id;
                if(key === '1') {
                    pathRefrenceUserClass = this.userDataMap[playerId]['userClass'];
                }
                const nodeListComp = this.userDataMap[playerId]['userClass'] as Ludo_userNodeList;
                nodeListComp.clearRepeat52To58Map();
                nodeListComp.clearNodePos();

                nodeListComp.endNode = [];
                // 填充Global.allNodePos
                nodeListComp.savaNodePos(pieces);
                if (this.getGameStatus()) {
                    nodeListComp.setNodePos(pieces, '1', number);
                } else {
                    let userKey = nodeListComp.userKey;
                    nodeListComp.setNodePos(pieces, this.userDataMap[Global.userId]['key'], userKey);
                }
                if (Global.nowGameType == Global.gameType.twoModel) {
                    addNum = 1;
                }
            }

            // console.log('棋子缩放之前的值是：',Global.allNodePos);
            this.setAllPosScale(pathRefrenceUserClass);

            let rolling = data.rolling;
            if (rolling.dice == 0) {
                data.action = 'skip';
            } else {
                data.action = 'roll';
            }
            let message = { data: { data: data } };
            this.playingMessage(message);
        } else if (data.status == "matching" || data.status == 'completed') {
            //如果是结算或者匹配状态的话，直接切换去大厅场景;
            if (cc.director.getScene().name = 'GameScene') {
                cc.director.loadScene("MatchScene");
            }
        }
        this.isReceiverMessage = true;
    }

    printAllPiecePos() {
        const piecesArr = [this.piece_blueArr,this.piece_redArr,this.piece_greenArr,this.piece_yellowArr];

        piecesArr.forEach((pieceItems) => {
            pieceItems.forEach((pieceItem) => {
                console.log(`棋子${pieceItem.name}的真实坐标是：(${pieceItem.x},${pieceItem.y})`);
            });
        })
    }

    // 棋子移动开始的时候的emit 更新该位置棋子的状态
    PieceMoveStartEmit() {
        let startIdenticalNode = this.startIdenticalNode;
        //移动前坐标相同的节点数量;
        let startLen = startIdenticalNode.length;
        if (startLen > 0) {
            let endPos = startIdenticalNode[0].getComponent(Ludo_userNodeLogic).getEndPos();
            if (startLen == 1) {
                startIdenticalNode[0].scale = 1;
                startIdenticalNode[0].x = endPos[0];
            } else {
                for (let i = 0; i < startLen; i++) {
                    startIdenticalNode[i].scale = 0.8;
                    if (startLen % 2 == 0) {
                        startIdenticalNode[i].x = endPos[0] - 10 - (startLen / 2 - 1) * 20 + i * 20;
                    } else {
                        startIdenticalNode[i].x = endPos[0] - Math.floor(startLen / 2) * 20 + i * 20;
                    }
                }
            }
        }
        this.startIdenticalNode = [];
    }

    //棋子移动结束的时候的emit;
    PieceMoveEndtEmit(event) {
        let _endPos = event.endPos;
        let _pos = event.pos;
        //当有棋子到终点的时候，重新设置棋子位置;
        if (_endPos == 57) {
            this.nowMoveClass.setEndNodePos();
            if (MessageSoundManager.audioEngineOn) {
                cc.audioEngine.playEffect(this.cheerAudio, false);
            }
            let lizi = cc.instantiate(this.caidai)
            this.node.addChild(lizi);
            // this.nodeScaleFunc([0, 0]);
        } else {
            let endLen = this.endIdenticalNode.length;
            if (endLen > 1) {
                let endIdenticalNode = this.endIdenticalNode;
                // let endPos = endIdenticalNode[0].getComponent(ludo_userNodeLogic).getEndPos();
                for (let i = 0; i < endLen; i++) {
                    endIdenticalNode[i].scale = 0.8;
                    if (endLen % 2 == 0) {
                        endIdenticalNode[i].x = _pos[0] - 10 - (endLen / 2 - 1) * 20 + i * 20;
                    } else {
                        endIdenticalNode[i].x = _pos[0] - Math.floor(endLen / 2) * 20 + i * 20;
                    }
                }
            }
        }
        if (this.messageData) {
            //道具数据;
            let last_prop = this.messageData.data.data.last_prop;
            //有火箭的话，先执行火箭动作，然后检测是否有被T的节点;
            if (last_prop.prop && last_prop.prop.id == 4) {
                //起点坐标;
                let loc = last_prop.prop.loc;
                let endLoc = loc + 5;

                //获取终点坐标;
                let players = this.messageData.data.data.players;
                let keys = Object.keys(players);
                let tArr = [];
                for (let k = 0, kLen = keys.length; k < kLen; k++) {
                    let key = keys[k];
                    let id = players[key].id;
                    let pieces = players[key].pieces;
                    let tPosArr = this.userDataMap[id].userClass.getTPosArr(pieces);
                    if (tPosArr.length > 0) {
                        let TObj = {
                            id: id,
                            tPosArr: tPosArr
                        };
                        tArr.push(TObj);
                        endLoc = this.userDataMap[id].userClass.oldPieces[String(tPosArr[0] + 1)];
                    }
                }

                this.runRocketPropFunc(loc, endLoc, (boomPos) => {
                    let tLen = tArr.length;
                    this.rocketProps.rotation = 0;
                    let rocketNode = this.rocketProps.getChildByName('rocketNode');
                    let rocketDrag = rocketNode.getComponent(dragonBones.ArmatureDisplay);
                    rocketDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                        rocketDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                        this.rocketProps.active = false;
                        this.nextPlayerRolling();
                    }, this);
                    MessageSoundManager.playLoadEffect(this.rocketBoom);
                    rocketDrag.playAnimation('baozha', 1);
                    if (tLen > 0) {
                        let playerId = tArr[0].id;
                        let tPosArr = tArr[0].tPosArr;
                        let userClass = this.userDataMap[playerId]['userClass'];
                        userClass.boomGoHome(tPosArr);
                        this.nodeScaleFunc(boomPos);
                    }
                });
            } else {
                let tLen = this.TNode.length;
                if (tLen > 0) {
                    let playerId = this.TNode[0].id;
                    let tPosArr = this.TNode[0].tPosArr;
                    let userClass = this.userDataMap[playerId]['userClass'];
                    userClass.setNodeResult(tPosArr);
                    this.nodeScaleFunc(event.pos);
                    setTimeout(() => {
                        this.nextPlayerRolling();
                    }, 1500);
                } else {
                    this.nextPlayerRolling();
                }
            }
        }

        this.TNode = [];
        this.endIdenticalNode = [];

        this.checkAllPiecesNodeIndex();
    }

    /**
     * 检查所有的棋子的zIndex是否正常
     */
    checkAllPiecesNodeIndex() {
        const piecesArr = [this.piece_blueArr,this.piece_greenArr,this.piece_redArr,this.piece_greenArr,this.piece_yellowArr];
        piecesArr.forEach((itemPieceArr,index) => {
            itemPieceArr.forEach((piece,inx) => {
                const currentY = piece.y;
                const pComp = piece.getComponent(Ludo_userNodeLogic);
                // 没有出家不检测
                if(!pComp.isOutHome) return;

                // 目标行
                const targetRow = Math.round((currentY + 322) / 46);
                const targetZIndex = 15 - targetRow;
                if(pComp.zIndex !== targetZIndex) {
                    console.log(`层级异常 zIndex is ${piece.zIndex} and targetZIndex is ${targetZIndex}`);
                    pComp.zIndex = targetZIndex;
                }
            });
        });
    }

    //镜头拉近效果;
    nodeScaleFunc(pos) {
        this.camera.node.x = pos[0];
        this.camera.node.y = pos[1];
        this.camera.zoomRatio = 1.5;
        let deTime = cc.delayTime(2);
        let callfunc = cc.callFunc((event) => {
            this.camera.zoomRatio = 1;
            event.x = 0;
            event.y = 0;
        });
        this.camera.node.runAction(cc.sequence(deTime, callfunc));
    }

    //下一个用户操作;
    nextPlayerRolling() {
        let data = this.messageData.data.data;
        //道具对比;
        this.comparedProps(data);
        //检测用户身上是否有道具;
        let players = data.players;
        if (players) {
            this.checkPlayerProp(players, data.last_prop);
        }

        let messageData = this.messageData;
        let rolling = messageData.data.data.rolling;
        let roUserMap = this.userDataMap[rolling.user_id];
        let rollPlayer = roUserMap.player;
        let last_prop = messageData.data.data.last_prop;
        //记录当前操作人;
        this.nowActionPlayer = rollPlayer;
        if (this.node && this.node.active) {
            let sender = messageData.data.sender;
            let userMap = this.userDataMap[sender];
            let userPlayer = userMap.player;
            //踩到UFO了，需要move;
            if (last_prop.effect && last_prop.prop && last_prop.prop.id == 1) {
                if (sender == Global.userId) {
                    this.sendPieceMove(last_prop.effect.piece_id, last_prop.effect.distance);
                }
            } else {
                if (this.nowPlayering) {
                    // this.nowPlayering.getComponent(LudoPlayerLogic).hideDiceLight();
                    // this.nowPlayering.getComponent(LudoPlayerLogic).hideAlarmclock();
                    this.nowPlayering.getComponent(LudoPlayerLogic).passAction();
                }
                //新操作人开启倒计时;
                rollPlayer.getComponent(LudoPlayerLogic).startAction();
                this.nowPlayering = rollPlayer;
                // rollPlayer.getComponent(LudoPlayerLogic).playCountTime();
                if (sender != rolling) {
                    setTimeout(() => {
                        userPlayer.getComponent(LudoPlayerLogic).resumeDicePoint(false);
                    }, 1000)
                }
                //如果是轮到我掷骰子了，如果不是自己掷骰子的话，直接等待就行;
                if (rolling.user_id == Global.userId) {
                    this.arrowNode.active = true;
                    this.isCanTouchDice = true;
                } else {
                    //设置自己不能点击;
                    this.isCanTouchDice = false;
                    //隐藏箭头；                      
                    this.arrowNode.active = false;
                }
            }
        }
    }

    //获取当前操作人的数据；
    getPlayerData(playersData, playerId) {
        let keys = Object.keys(playersData);
        for (let i = 0, len = keys.length; i < len; i++) {
            if (playersData[keys[i]].id == playerId) {
                return playersData[keys[i]];
            }
        }
        return null;
    }

    //检测当前相同位置的节点，如果相同位置的节点数量超过1个，就需要缩放；
    setAllPosScale(pathReferenceUserClass?: Ludo_userNodeList) {
        let keys = Object.keys(Global.allNodePos);
        for (let i = 0, len = keys.length; i < len; i++) {
            
            let key = keys[i];
            let value = Global.allNodePos[key];
            let valueLen = value.length;
            if (value && valueLen > 1) {
                this.setNodeScale(value, valueLen,key);
            } else if(value && valueLen === 1){
                const node = value[0] as cc.Node;
                node.scale = 1;
            }
        }
    }

    /**
     * 根据数量对节点进行缩放；
     * @param  {cc.Node[]} value 节点数组
     * @param  {number} len 该位置有多少个棋子
     * @param  {string} key 棋盘上的位置
     */
    setNodeScale(value: cc.Node[], len: number,key: string) {
        if (value && value[0]) {
            let posX = value[0].x;
            
            for (let i = 0; i < len; i++) {
                value[i].scale = 0.8;
                if ((len & 1) == 0) {
                    value[i].x = posX - 10 - (len / 2 - 1) * 20 + i * 20;
                } else {
                    value[i].x = posX - Math.floor(len / 2) * 20 + i * 20;
                }
            }
        }
    }

    //骰子点击回调；
    playerDiceTouch_callback(event) {
        if (this.isCanTouchDice) {
            this.isCanTouchDice = false;
            this.arrowNode.active = false;
            //发送掷骰子消息；
            let source_ = "chatroom";
            MessageManager.httpResult('post', Ludo_MessageType.ROLLDICE, { source: source_, source_id: MessageData.gameRoomId }, (rollData) => {
            });
        }
    }

    //自己点击棋子事件；
    user1NodeTouchEmit(event) {
        let currIndex = event.touchIndex + 1;
        console.log(currIndex + "         ++++++++++++++++++++++++++++++++++++++++++");

        //将自己所有节点设置为待机状态;
        this.userDataMap[Global.userId]['userClass'].setAllNodeStandby();
        this.sendPieceMove(currIndex, this.dicePoints);
    }

    /**
     * 校验相同坐标的节点;
     * @param  {number} index 需要移动的是第几个节点
     * @param  {{[key: string]: number}} oldPosNode 旧的棋子坐标
     * @param  {{[key: string]: number}} newPosNode 新的棋子坐标
     * @param  {any} allPlayer 所有玩家数据
     * @param  {number} sender
     */
    checkPosNode(index: number, oldPosNode: {[key: string]: number}, newPosNode: {[key: string]: number}, allPlayer: PlayerModel[], sender: number) {
        // 原来的开始点
        let startMovePos = oldPosNode[index];
        // 新的结束点
        let endMovePos = newPosNode[index];

        let startIdenticalNode = [];          //起始坐标相同;
        let endIdenticalNode = [];            //终点坐标相同；
        let TNode = [];                       //需要被T的节点;

        //优化遍历;
        let playerKeyArr = Object.keys(allPlayer);
        for (let i = 0, len = playerKeyArr.length; i < len; i++) {
            let player = allPlayer[playerKeyArr[i]];
            //坐标;
            let pieces = player.pieces;
            //id；
            let playerId = player.id;

            let userClass = this.userDataMap[playerId]['userClass'] as Ludo_userNodeList;

            // 获取自己的起点和终点相同的坐标;
            if (playerId == sender) {
                let startPosArr = userClass.getStartPos(startMovePos, index, false);
                startIdenticalNode = startIdenticalNode.concat(startPosArr);
                let endPosArr = userClass.getEndPosArr(endMovePos, pieces, true);
                endIdenticalNode = endIdenticalNode.concat(endPosArr);
            } else {
                // 己方检查别的玩家重叠情况显示出来
                let startPosArr = userClass.getStartPos(startMovePos, index, true);
                startIdenticalNode = startIdenticalNode.concat(startPosArr);

                let endPosArr = userClass.getEndPosArr(endMovePos, pieces, false);
                endIdenticalNode = endIdenticalNode.concat(endPosArr);
                let tPosArr = userClass.getTPosArr(pieces);
                if (tPosArr.length > 0) {
                    let TObj = {
                        id: playerId,
                        tPosArr: tPosArr
                    };
                    TNode.push(TObj);
                }
            }
        }

        this.startIdenticalNode = startIdenticalNode;
        this.endIdenticalNode = endIdenticalNode;
        this.TNode = TNode;
    }

    /* ******************************** 道具方法 ***************************************** */
    /*
        bug1: 飞碟的位置会飞错
        UFO道具效果；
        @param   startPos     飞船起始点
        @param   endPos       飞船结束点
        @param   piece         棋子
    */
    runUFOPropsFunc(startPos: number, endPos: number, piece: cc.Node, playerId: number, callFunc) {
        /** 如果进入后台记录运送的是那个棋子 */
        this.ufoMovePiece = piece;
        let ufoDrag = this.getActiveUfo().getComponent(dragonBones.ArmatureDisplay);
        /** ufo运送的对象 */
        ufoDrag.node['targetHero'] = piece;

        ufoDrag.node['UnActive'] = false;
        // console.log('ufoDrag is ',ufoDrag);
        let poeceDrag = piece.getComponent(dragonBones.ArmatureDisplay);

        let userKey = this.userDataMap[playerId].userClass.userKey;
        let usermoveTrack = this.moveTrack[userKey];
        console.log(`ufo开始移动的点是: ${startPos} -> ${endPos},棋子：${piece.name}`);
        /** startPos与飞碟原来所属的位置大1 */
        let sPos: cc.Vec2 = cc.v2(usermoveTrack[startPos - 1][0], usermoveTrack[startPos - 1][1]);
        /** endPos -1 飞碟的目的地 */
        let ePos: cc.Vec2 = cc.v2(usermoveTrack[endPos - 1][0], usermoveTrack[endPos - 1][1]);
        const pieceComp = piece.getComponent(Ludo_userNodeLogic);
        
        ufoDrag.node.active = true;

        ufoDrag.node.x = this.posConvertValue(sPos.x);
        ufoDrag.node.y = this.posConvertValue(sPos.y);

        const ufoAudioArr = [];
        const stopUfoAudios = () => {
            ufoAudioArr.forEach((id) => {
                if(id >= 0) {
                    cc.audioEngine.stopEffect(id);
                }
            });
        }

        // ufo起飞
        let promise1 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                if(this.whilebackUFOWithPiece && this.whilebackUFOWithPiece === piece) {
                    resolve(null);
                    isResolve = true;
                    const pieceDragon = piece.getComponent(dragonBones.ArmatureDisplay);
                    if(pieceDragon.animationName !== 'daiji') {
                        pieceDragon.playAnimation('daiji',0);
                    }
                    stopUfoAudios();
                    return;
                }
                ufoDrag.timeScale = 1.2;
                ufoDrag.playAnimation('qifei', 1);

                const pCallback = () => {
                    isResolve = true
                    resolve(null);
                    ufoDrag.removeEventListener(dragonBones.EventObject.COMPLETE,pCallback,this);
                }
                ufoDrag.addEventListener(dragonBones.EventObject.COMPLETE, pCallback, this);
                this.scheduleOnce(() => {
                    if(!isResolve) {
                        console.log('ufo起飞异常');
                        resolve(null);
                    }
                },2);
            });
        }

        // 人物上升
        let promise1_1 = () => {
            return new Promise((resolve) => {
                let isResolve = false;
                if(this.whilebackUFOWithPiece && this.whilebackUFOWithPiece === piece) {
                    resolve(null);
                    isResolve = true;
                    const pieceDragon = piece.getComponent(dragonBones.ArmatureDisplay);
                    if(pieceDragon.animationName !== 'daiji') {
                        pieceDragon.playAnimation('daiji',0);
                    }
                    stopUfoAudios();
                    return;
                }

                const xiAudioId = MessageSoundManager.playLoadEffect(this.ufoXi);
                ufoAudioArr.push(xiAudioId);

                poeceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    poeceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    pieceComp.zIndex = 15 - Global.user1MoveTrack[endPos - 1][1];
                    isResolve = true;
                    resolve(null)
                }, this);
                poeceDrag.timeScale = 1.2;
                poeceDrag.playAnimation('shangsheng', 1);

                this.scheduleOnce(() => {
                    if(!isResolve) {
                        pieceComp.zIndex = 15 - Global.user1MoveTrack[endPos - 1][1];
                        console.log('层级异常处理');
                        stopUfoAudios();
                        resolve(null);
                    }
                },2);

            });
        }

        // ufo飞行并且移动到目的地
        let promise2 = () => {
            return new Promise((resolve, reject) => {
                let isResolve: boolean = false;
                let aid = -1;
                if(this.whilebackUFOWithPiece && this.whilebackUFOWithPiece === piece) {
                    resolve(null);
                    isResolve = true;
                    const pieceDragon = piece.getComponent(dragonBones.ArmatureDisplay);
                    if(pieceDragon.animationName !== 'daiji') {
                        pieceDragon.playAnimation('daiji',0);
                    }
                    stopUfoAudios();
                    return;
                }
                if (MessageSoundManager.audioEngineOn) {
                    aid = cc.audioEngine.playEffect(this.ufoFly, true);
                    ufoAudioArr.push(aid);
                }
                
                ufoDrag.playAnimation('feixing', 0);
                let pos = cc.v2(this.posConvertValue(ePos.x), this.posConvertValue(ePos.y));
                let move = cc.moveTo(0.4, cc.v2(pos.x, pos.y));
                const recoverLastState = () => {
                    piece.x = pos.x;
                    piece.y = pos.y;
                    piece.getComponent(Ludo_userNodeLogic).endPos = [pos.x, pos.y];
                }
                let callfunc = cc.callFunc(() => {
                    if (MessageSoundManager.audioEngineOn && aid >= 0) {
                        cc.audioEngine.stopEffect(aid);
                    }
                    recoverLastState();
                    isResolve = true;
                    resolve(null)
                });
                ufoDrag.node.runAction(cc.sequence(move, callfunc));

                // 如果3S以后，还没有到下一步，则自动到下一步;
                this.scheduleOnce(() => {
                    if (!isResolve) {
                        stopUfoAudios();
                        recoverLastState();
                        resolve(null)
                    }
                }, 3);
            });
        }

        // ufo降落
        let promise3 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                if(this.whilebackUFOWithPiece && this.whilebackUFOWithPiece === piece) {
                    resolve(null);
                    isResolve = true;
                    const pieceDragon = piece.getComponent(dragonBones.ArmatureDisplay);
                    if(pieceDragon.animationName !== 'daiji') {
                        pieceDragon.playAnimation('daiji',0);
                    }
                    stopUfoAudios();
                    return;
                }
                ufoDrag.timeScale = 1.2;
                ufoDrag.playAnimation('jiangluo', 1);
                const toAudioId = MessageSoundManager.playLoadEffect(this.ufoTu);
                ufoAudioArr.push(toAudioId);
                //棋子降落;
                ufoDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    ufoDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    console.log("棋子降落");
                    isResolve = true;
                    resolve(null);
                }, this);

                this.scheduleOnce(() => {
                    if(!isResolve) {
                        console.log("UFO降落动画发生异常");
                        stopUfoAudios();
                        resolve(null);
                    }
                },2);
            });
        }

        let promise3_1 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                poeceDrag.timeScale = 1.2;
                if(this.whilebackUFOWithPiece && this.whilebackUFOWithPiece === piece) {
                    resolve(null);
                    isResolve = true;
                    const pieceDragon = piece.getComponent(dragonBones.ArmatureDisplay);
                    if(pieceDragon.animationName !== 'daiji') {
                        pieceDragon.playAnimation('daiji',0);
                    }
                    this.whilebackUFOWithPiece = null;
                    stopUfoAudios();
                    return;
                }
                poeceDrag.playAnimation('xiajiang', 1);
                poeceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    poeceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    poeceDrag.timeScale = 1;
                    poeceDrag.playAnimation('daiji',0);
                    ufoDrag.node.active = false;
                    ufoDrag.node['unActive'] = true;
                    /** 放回到节点池 */
                    this.ufoPool.put(ufoDrag.node);
                    callFunc(ufoDrag.node);
                    isResolve = true;
                    resolve(null)
                }, this);
                
                this.scheduleOnce(() => {
                    if(!isResolve) {
                        stopUfoAudios();
                        ufoDrag.node.active = false;
                        /** 运送的目标置空 */
                        ufoDrag.node['targetHero'] = null;

                        this.ufoPool.put(ufoDrag.node);
                        callFunc(ufoDrag.node,ufoAudioArr);
                        resolve(null);
                        console.log("人物下降动画发生异常");
                        
                        // MessageManager.sendBugTraceByMessage('ludo','playDragonAnimation','人物下降动画没有播放完成就播放了wait动画，要造成飞碟不消失的风险');
                    }
                },2);
            });
        }

        Global.runPromiseArray([promise1, promise1_1, promise2, promise3, promise3_1]);
    }

    /**
     * 从节点池里面取出
     */
    getActiveUfo() {
        // if (this.UFOprops[0].active) {
        //     return this.UFOprops[1];
        // } else {
        //     return this.UFOprops[0];
        // }
        if(!this.ufoPrefab) return;
        let ufoItem = this.ufoPool.get();
        if(!ufoItem) {
            ufoItem = cc.instantiate(this.ufoPrefab);
        }
        ufoItem.name = 'ufoTempleate';
        ufoItem['targetHero'] = null;
        ufoItem.parent = this.propLayer;
        ufoItem.active = true;
        return ufoItem;
        

    }

    /*
        火箭方法执行
        @param      starPos         起始点
        @param      endPos          结束点
        @param      callfunc
    */
    runRocketPropFunc(starPos, endPos, callback) {
        let sPos = this.convertVlalue(starPos) - 1;
        let ePos = this.convertVlalue2(endPos) - 1;
        ePos = ePos % 52;
        if (ePos < sPos) {
            ePos += 52;
        }
        let promiseArr = [];
        this.rocketProps.active = true;
        this.rocketProps.x = Global.rocketTrack[sPos][0] * 46 - 322;
        this.rocketProps.y = Global.rocketTrack[sPos][1] * 46 - 322;

        let rocketNode = this.rocketProps.getChildByName('rocketNode');
        let rocketDrag = rocketNode.getComponent(dragonBones.ArmatureDisplay);
        rocketDrag.playAnimation('feixing', 0);

        let aid = -1;
        if (MessageSoundManager.audioEngineOn) {
            aid = cc.audioEngine.playEffect(this.rocketFly, true);
        }

        let boomPos = [Global.rocketTrack[ePos % 52][0] * 46 - 322, Global.rocketTrack[ePos % 52][1] * 46 - 322];
        for (let i = sPos + 1; i <= ePos; i++) {
            let index = i % 52;
            let promise = () => {
                return new Promise((resolve, reject) => {
                    let moveX = Global.rocketTrack[index][0] * 46 - 322;
                    let moveY = Global.rocketTrack[index][1] * 46 - 322;
                    let angle = Global.getAngle(this.rocketProps.x, this.rocketProps.y, moveX, moveY);
                    this.rocketProps.rotation = angle;
                    //++++++++++++++++++++++++ 火箭
                    let move = cc.moveTo(0.12, cc.v2(moveX, moveY));
                    let callfunc = cc.callFunc(() => {
                        resolve(null)
                    });
                    this.rocketProps.runAction(cc.sequence(move, callfunc));
                });
            }
            promiseArr.push(promise);
        }

        let promise = () => {
            return new Promise((resolve, reject) => {
                if (aid >= 0) {
                    cc.audioEngine.stopEffect(aid);
                }
                callback(boomPos);
                resolve(null)
            });
        }
        promiseArr.push(promise);
        Global.runPromiseArray(promiseArr);
    }

    //收到骰子以后的动画啊效果；
    /*
        @param     startPos      骰子的点
        @param      playerid     用户id
    */
    goldDiceAnimaFunc(startPos: number, playerid: number, callback) {
        let player = this.userDataMap[playerid].player;
        let sPos = this.convertVlalue(startPos) - 1;
        let ePos = cc.v2(player.x + 75, player.y);
        this.goldDiceNode.active = true;
        this.goldDiceNode.x = Global.moveUser1MoveTrack[sPos][0] * 46 - 322;
        this.goldDiceNode.y = Global.moveUser1MoveTrack[sPos][1] * 46 - 322;
        let diceNode = this.goldDiceNode.getChildByName('diceNode');
        let diceDrag = diceNode.getComponent(dragonBones.ArmatureDisplay);
        let promise1 = () => {
            return new Promise((resolve, reject) => {
                diceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    diceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    resolve(null)
                }, this);
                diceDrag.playAnimation('qifei', 1);
            });
        }

        let promise2 = () => {
            return new Promise((resolve, reject) => {
                diceDrag.playAnimation('yidong', 0);
                //++++++++++++++++++++++++ 骰子移动
                let move = cc.moveTo(0.4, ePos);
                let call = cc.callFunc(() => {
                    resolve(null)
                });
                this.goldDiceNode.runAction(cc.sequence(move, call));
            });
        }

        let promise3 = () => {
            return new Promise((resolve, reject) => {
                diceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    diceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                    this.goldDiceNode.active = false;
                    callback();
                }, this);
                diceDrag.playAnimation('xiaoshi', 1);
            });
        }

        Global.runPromiseArray([promise1, promise2, promise3]);
    }

    //隐身衣状态;
    showYSYAnimaFunc(piece, callback?) {
        this.yinshenyi.active = true;
        this.yinshenyi.x = piece.x;
        this.yinshenyi.y = piece.y;
        let drag = this.yinshenyi.getComponent(dragonBones.ArmatureDisplay);
        drag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            drag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.yinshenyi.active = false;
            piece.getComponent(Ludo_userNodeLogic).showYSY();
        }, this);
        drag.playAnimation('newAnimation', 1);
    }

    /* ******************************** End ***************************************** */

    //切换前台;
    onAndroidResume(data) {
        /** 上一次回到前台的时间戳 */
        Message.getStatus(Global.gameRoomId);

        const bgmNode = cc.find("Canvas/topNode/bgm");
        const bgmComp = bgmNode.getComponent(BgmSettings);

        if(bgmComp.bgmOffNode.active) {
            MessageSoundManager.audioEngineOn = false;
        }
        if(bgmComp.bgmOnNode.active){
            MessageSoundManager.audioEngineOn = true;
        }

        MessageSoundManager.updateMusic();
        // if(MessageSoundManager.audioEngineOn) {
        //     // MessageSoundManager.updateMusic();
        //     if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
        //         cc.sys["__audioSupport"].context.resume();
        //     }
        // } else {
        //     if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
        //         cc.sys["__audioSupport"].context.resume();
        //     }
        // }
    }

    //切换到后台;
    onAndroidStop(data) {
        this.isReceiverMessage = false;

        /** 全部回收飞碟 切换到前台的时候重置玩家位置不用关心飞碟飞完之后的位置重置问题 */
        this.propLayer.children.forEach((item) => {
            if(item.name === 'ufoTempleate') {
                const ufoDragonComp = item.getComponent(dragonBones.ArmatureDisplay);
                // 销毁骨骼动画的监听事件
                ufoDragonComp.removeEventListener(dragonBones.EventObject.COMPLETE);
                this.whilebackUFOWithPiece = item['targetHero'] || this.ufoMovePiece;
                item.active = false;
                this.ufoPool.put(item);
            }
        });
        /** 如果有飞弹的话也直接干掉 */
    }

    //设置表情显示;
    setEmojiShow(displayId, msg) {
        let player = this.userDataMap[displayId].player;
        let playerHeadBG = player.getChildByName('playerHeadBG');
        let posX = player.x + playerHeadBG.x;
        let posY = player.y + playerHeadBG.y - 40;
        Message.showEmoji([posX, posY], [playerHeadBG.width, playerHeadBG.height], msg);
    }

    //更新倒计时倒计时;
    setTimeLabel(start_duration) {
        this.start_duration = start_duration;
        this.isUpdate = true;
        this.isStartCountTime = false;
    }

    //坐标值转换成具体坐标值;
    posConvertValue(num) {
        let value = num * 46 - 322;
        return value;
    }

    //发送棋子move消息;
    sendPieceMove(pieceId: number, dicePoint: number) {
        //如果是机器人模式，不能主动移动棋子;
        if (this.isRobotModel) {
            return;
        }
        let source_ = "chatroom";
        let sendData = {
            piece_id: pieceId,
            dice: dicePoint,
            source: source_,
            source_id: MessageData.gameSource_Id
        }
        MessageManager.httpResult('post', Ludo_MessageType.MOVEDICE, sendData, (eData) => {
        });
    }

    //转换坐标;
    convertVlalue(number: number) {
        if (number > 52) {
            return number;
        } else if (number == 0) {
            return 0;
        }
        let selfKey = '1';
        if (!this.getGameStatus()) {
            selfKey = this.userDataMap[Global.userId]['key'];
        }
        switch (selfKey) {
            case '1':
                break;
            case '2':
                if (number <= 13) {
                    number += 52;
                }
                number -= 13;
                break;
            case '3':
                if (number <= 26) {
                    number += 52;
                }
                number -= 26;

                break;
            case '4':
                if (number <= 39) {
                    number += 52;
                }
                number -= 39;
                break;
        }
        return number;
    }

    //转换坐标;
    convertVlalue2(number: number) {
        if (number == 0) {
            return 0;
        }
        let selfKey = '1';
        if (!this.getGameStatus()) {
            selfKey = this.userDataMap[Global.userId]['key'];
        }
        switch (selfKey) {
            case '1':
                break;
            case '2':
                if (number <= 13) {
                    number += 52;
                }
                number -= 13;
                break;
            case '3':
                if (number <= 26) {
                    number += 52;
                }
                number -= 26;

                break;
            case '4':
                if (number <= 39) {
                    number += 52;
                }
                number -= 39;
                break;
        }
        return number;
    }

    //获取是否是上帝模式;   
    getGameStatus(): boolean {
        if (Global.nowGameType == Global.gameType.GodModel) {
            return true;
        }
        return false;
    }


    //添加setting节点;
    addSettingLayer(message) {
        console.log(message, "执行setting界面～～～～～～～～～～～～～～～～～～～");

        if (this.settingLayer) {
            console.log(message, "执行setting界面～～～～～～～～～～～～～～～～～～～222");
            let pNode = this.settingLayer;
            pNode.getComponent(Ludo_settlementLogic).setLayerData(message);
            this.node.addChild(pNode);
            this.isShowSettlementLayer = true;
            this.settleLayer = pNode;
        } else {
            console.log(message, "执行setting界面～～～～～～～～～～～～～～～～～～333～");
            ResourcesManager.loadPrefab('GamesRes/prefab/settleLayer', (pNode) => {
                pNode.getComponent(Ludo_settlementLogic).setLayerData(message);
                this.node.addChild(pNode);
                this.isShowSettlementLayer = true;
                this.settleLayer = pNode;
                this.settingLayer = pNode;
            });
        }
    }

    //预加载setting界面;
    loadSettingLayer() {
        if (!this.settingLayer) {
            ResourcesManager.loadPrefab('GamesRes/prefab/settleLayer', (pNode) => {
                this.settingLayer = pNode;
            });
        }
    }

    //商城回调;
    store_callback() {
        MessageManager.goStore();
    }

    //添加规则页面;
    addRule_callback() {
        // ResourcesManager.loadPrefab('GamesRes/prefab/rulePrefab', (pNode) => {
        //     this.node.addChild(pNode);
        // });
        this.rulePopup.active = true;
    }

    //根据当前是否使用过反悔功能进行处理;
    regretCallFunc(has_regret: boolean, callback: Function) {
        // if (has_regret) {
        //     callback();
        // } else {
        //     this.block.getComponent(ludoBlockLogic).playerCountDown(() => {
        //         callback();
        //     });
        // }
    }

    //获取使用了道具的国际化语言;
    getRegretText(nickName: string, type: string) {
        let json = {
            "en": `${nickName} roll dice again by using regret function`,
            "ar": `${nickName} رما النرد باستخدام وظيفة الندم`,
            "hi": `${nickName} ने रिग्रेट फंक्शन का उपयोग करके पासा को फिर से रोल किया`,
            "te": `${nickName} రిగ్రెట్ ఫంక్షన్ వాడడం ద్వారా డైస్ మరొక్కసారి రోల్ చేసారు`,
            "ta": `${nickName} வருத்தம் செயல்பாட்டை உபயோகித்து தாயத்தை மீண்டும் உருட்டலாம்`,
            "id": `${nickName} roll dadu lagi dengan menggunakan fungsi penyesalan`
        }
        return json[type] ? json[type] : null;
    }

    showToast(text) {
        let uiLayer = this.node.getChildByName('uiLayer');
        let toastNode = uiLayer.getChildByName('toastNode');
        let toastBG = toastNode.getChildByName('toastBG');
        let toastLabel = toastNode.getChildByName('toastLabel').getComponent(cc.Label);
        toastNode.active = true;
        toastNode.y = -500;
        toastLabel.string = text;
        toastBG.height = toastLabel.node.height - 20;
        let move = cc.moveTo(1, cc.v2(0, -155));
        let dTime = cc.delayTime(1);
        let callfunc = cc.callFunc(() => {
            toastNode.active = false;
        });
        toastNode.runAction(cc.sequence(move, dTime, callfunc));
    }

    //发送emoji;
    sendEmoji(event, custom) {
        if (custom == 'show') {
            Message.sendEmoji('show');
        } else {
            if (this.isCanSendEmoji) {
                this.isCanSendEmoji = false;
                const emojiObjs = Object.values(this.emojiJson.json) as {name: string,image: string,svga: string,svga_o: string}[];
                const targetEmoji = emojiObjs.find(item => item.name === custom);
                
                Message.sendEmoji(custom, targetEmoji.svga);
                setTimeout(() => {
                    if (this.node && this.node.active) {
                        this.isCanSendEmoji = true;
                    }
                }, 1000);
            }
        }
    }
    isClickComeBackBtn = false;
    //设置机器人模式;
    setRobotModel() {
        if (this.isRobotModel) {
            return;
        }
        this.isRobotModel = true;
        let robotLayer = this.node.getChildByName('robotLayer');
        robotLayer.active = true;
        let robotLabel = robotLayer.getChildByName('robotLabel');
        robotLabel.getComponent(cc.Label).string = MessageData.lang.tap_screen ? MessageData.lang.tap_screen : MessageData.langEnglish.tap_screen;
        robotLayer.on(cc.Node.EventType.TOUCH_START, (event) => {
            // let url = `${Ludo_MessageType.AGENT}${Global.channelId}`;
            if (this.isClickComeBackBtn) {
                return;
            }
            this.isClickComeBackBtn = true;
            this.scheduleOnce(() => {
                this.isClickComeBackBtn = false;
            }, 3)
            var self = this;
            let comeBackdata = {
                "source": "chatroom", //chatroom/single
                "source_id": MessageData.gameSource_Id,      //room_id
                "game_id": MessageData.gameid,        //game_id, 不为空则优先此值匹配游戏
            }
            // if (MessageData.gameSource_Id == '' || MessageData.gameid == '') return;
            MessageManager.httpResult('post', 'v1/ludo/comeback', comeBackdata, (data) => {
                if (data && data.status === 'OK') {
                    self.isRobotModel = false;
                    robotLayer.active = false;
                    this.userDataMap[Global.userId].player.getComponent(LudoPlayerLogic).setRobotModel(false);
                }
            });
        }, this.node);
        if (Global.lang_json && !this.robotLabelIsSet) {
            this.robotLabelIsSet = true;
            let CombinedShape = robotLayer.getChildByName('CombinedShape');
            robotLabel.on(cc.Node.EventType.SIZE_CHANGED, () => {
                CombinedShape.width = robotLabel.width + 60;
            }, this);
            
        }
    }

    //设计倒计时;
    update(dt) {
        if (this.isUpdate) {
            this.dtTime += dt;
            if (this.dtTime >= 1) {
                this.dtTime = 0;
                this.start_duration--;
                let time = this.start_duration;
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
                    if (this.timeLabel)
                        this.timeLabel.string = `${minuteStr}:${secondStr}`;
                }
            }
        }
    }

    onDestroy() {
        // this.isUpdate = false;
        //socket消息；
        MyEvent.I.remove('emit_message', this.node);
        //棋子点击事件；
        MyEvent.I.remove('touch_user1', this.node);
        //棋子开始移动事件；
        MyEvent.I.remove('move_tart', this.node);
        //棋子移动结束事件；
        MyEvent.I.remove('move_end', this.node);
        //切换回前台事件；
        MyEvent.I.remove('onAndroidResume', this.node);
        //余额不足提醒;
        MyEvent.I.remove('insufficientBalance', this.node);

        cc.audioEngine.stopMusic();
    }
    test() {
        let d = {
            err_code: 90020,
            err_msg: "invalid room id or game over"
        }
        MyEvent.I.emit('joinErrMessage', d);
    }

}
