
import MessageData, { GameType } from '../../../../Common/CommonScripts/Utils/MessageData';
import Global from '../Global/Ludo_GlobalGameData';
import MyEvent from '../../../../Common/CommonScripts/Utils/MyEvent';
import MessageForRoom from '../../../../Common/CommonScripts/Utils/MessageForRoom';
import NDB from '../../../../Common/CommonScripts/Utils/NDBTS';
import Message from '../../../../Common/CommonScripts/Utils/Message';
import MessageManager from '../../../../Common/CommonScripts/Utils/MessageManager';
import ResourcesManager from '../../../../Common/CommonScripts/Utils/ResourcesManager';
import Ludo_BetsConfig from './Ludo_BetsConfig';
import FrameImage from '../../../../Common/Component/FrameImageComponent/FrameImage';
import { time } from 'console';
import { GameConfig } from '../../../../Jsons/GameConfig';
import Ludo_gameLogic from './Ludo_gameLogic';
import Ludo_playerLogic from './Ludo_playerLogic';
import Ludo_GameMode from '../ModeSceneScripts/Ludo_GameMode';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_settlementLogic extends cc.Component {

    @property(cc.Node)
    winIcon: cc.Node = null;

    @property(cc.Node)
    loseIcon: cc.Node = null;

    @property(cc.Node)
    players: cc.Node[] = [];

    @property(cc.SpriteFrame)
    playerhandler: cc.SpriteFrame[] = [];

    @property(cc.JsonAsset)
    langJson: cc.JsonAsset = null;

    @property(cc.Label)
    playAgainLabel: cc.Label = null;

    @property(cc.Label)
    exitLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    coinSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    winBGSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    loseBGSpriteFrame: cc.SpriteFrame = null;

    private isChangeScene: boolean = false;          //是否在切换场景;
    private layerData = null;                        //页面数据；    
    private playerIdArr: number[] = [];              //用户id数组;
    private countTimeDI: cc.Node;
    private countDownLabel: cc.Label;
    private timeIndex = 10;

    private showCoinType: string = '';
    start() {
        this.init();
        // if (Global.nowGameType == Global.gameType.twoModel) {
        //     this.players[0].y = this.players[2].y;
        //     this.players[1].y = this.players[3].y;
        // }
        this.timeIndex = 10;
        this.startCountTime();
        cc.find("Canvas").getComponent(Ludo_gameLogic).isUpdate = false;
        if (Global.nowGameType == Global.gameType.GodModel) {
            this.node.getChildByName("play_again").active = false;
        }
        let players = cc.find("Canvas").getComponent(Ludo_gameLogic).playerNodeArr;
        for (let i = 0; i < players.length; i++) {
            players[i].getComponent(Ludo_playerLogic).isUpdate = false;
        }
    }

    startCountTime() {
        if (MessageData.gameType == GameType.single) return;
        this.countTimeDI = this.node.getChildByName("countTimeDI");
        this.countDownLabel = this.node.getChildByName("countDownLabel").getComponent(cc.Label);
        this.countTimeDI.active = true;
        this.countDownLabel.node.active = true;
        this.countDownLabel.string = "Close in " + this.timeIndex + "S";
        this.schedule(this.countTime, 1);

    }
    countTime() {
        if (this.timeIndex > 0) {
            this.timeIndex--;
            this.countDownLabel.string = "Close in " + this.timeIndex + "S";
        } else {
            this.playAgain_callback();
        }
    }
    //获取页面数据；
    setLayerData(data) {
        this.layerData = data;
    }

    init() {
        Global.betsConfig = null;
        MessageForRoom.takeChangeRoom(false);

        if (this.layerData) {
            console.log("init  Settlement!!!!!!!!!!!!!!!!!!!!!!!!");

            let randPlayerObj = {};
            const settleData = this.layerData;
            const players_ = settleData.data.data.players;
            let keys = Object.keys(players_);
            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let pId = players_[key].id;
                randPlayerObj[pId] = players_[key];
                randPlayerObj[pId]['key'] = Number(key);
            }
            const rank = settleData.data.data.ranking;
            this.showCoinType = settleData.data.data.bet_type;

            this.showPlayerInfo(rank, randPlayerObj);
        }
        this.setplayAgainLabel();
    }

    //有人发送表情;
    setEmojiShow(displayId, msg) {
        return;
        let index = this.playerIdArr.indexOf(displayId);
        if (index >= 0) {
            Message.showEmoji([this.players[index].x, this.players[index].y], [106, 106], msg);
        }
    }

    setplayAgainLabel() {
        const textJson = this.langJson.json;
        let playAgainText = textJson.en.playAgain;
        let exitText = textJson.en.exit;

        console.log("结算设置语言：",MessageData.lang);
        playAgainText = MessageData.lang.play_again ? MessageData.lang.play_again : MessageData.langEnglish.play_again;
        exitText = MessageData.lang.exit ? MessageData.lang.exit : MessageData.langEnglish.exit;

        this.playAgainLabel.string = playAgainText;
        this.exitLabel.string = exitText;
        
    }
    showPlayerInfo(rankDataList, randPlayerObj) {
        console.log("rankDataList!!!!!!!!!!!!!!!!!!!!", rankDataList);
        console.log("randPlayerObj!!!!!!!!!!!!!!!!!!!!", randPlayerObj);
        let playerids = [];
        for (let index = 0; index < rankDataList.length; index++) {
            playerids.push(rankDataList[index].user_id);
        }
        for (let i = 0; i < 4; i++) {
            if (rankDataList[i]) {
                this.players[i].active = true;
                let user_id = rankDataList[i].user_id;
                let playerData = randPlayerObj[user_id];
                let rectangle = this.players[i];
                let rectangleBG = rectangle.getComponent(cc.Sprite);
                let head = rectangle.getChildByName('head').getComponent(cc.Sprite);
                let userName = rectangle.getChildByName('userName').getComponent(cc.Label);
                let countLabel = rectangle.getChildByName('countLabel').getComponent(cc.Label);
                let addCoinLabel = rectangle.getChildByName('addCoinLabel').getComponent(cc.Label);
                let RectangleL = rectangle.getChildByName('Rectangle');
                let piece_blue = rectangle.getChildByName('piece_blue');
                let frame = rectangle.getChildByName('frame').getComponent(FrameImage).InitFrameImage(user_id);
                head.node.off(cc.Node.EventType.TOUCH_START);
                head.node.on(cc.Node.EventType.TOUCH_START, () => {
                    MessageManager.showPlayerInfo(user_id);
                }, head);
                if (this.showCoinType === 'coin') {
                    let Icon_coin_yoyo = rectangle.getChildByName('Icon_coin_yoyo').getComponent(cc.Sprite);
                    Icon_coin_yoyo.spriteFrame = this.coinSpriteFrame;
                }

                let diamond = playerData.diamond;
                let avatar = playerData.avatar;
                let uName = playerData.name;
                let key = playerData.key;
                this.playerIdArr[i] = user_id;
                //头像;
                ResourcesManager.loadHeadImag(avatar, user_id, 2, (res: cc.Texture2D) => {
                    res.packable = false;
                    head.spriteFrame = new cc.SpriteFrame(res);
                    head.node.scaleX = 64 / head.node.width;
                    head.node.scaleY = 64 / head.node.height;
                });
                //昵称 和 棋子纹理；
                userName.string = Global.subNickName(uName);
                this.setplayerNameColor(key, userName.node, piece_blue);
                //棋子个数；
                countLabel.string = rankDataList[i].arrived;
                //金币数量;
                let coinNum: string = "";
                if (diamond)
                    coinNum = diamond + "";
                else
                    coinNum = '0'

                if (diamond > 0) {
                    coinNum = '+' + coinNum;
                }
                addCoinLabel.string = coinNum;

                if (diamond > 0) {
                    rectangleBG.getComponent(cc.Sprite).spriteFrame = this.winBGSpriteFrame;
                } else {
                    rectangleBG.getComponent(cc.Sprite).spriteFrame = this.loseBGSpriteFrame;
                }
                if (user_id == Global.userId) {
                    RectangleL.active = true;
                    if (diamond > 0) {
                        this.winIcon.active = true;
                        this.loseIcon.active = false;
                        this.gameEndEvent('win');
                        if (Global.nowGameType == Global.gameType.twoModel) {
                            this.winIcon.y = 290;
                        }
                    } else {
                        this.winIcon.active = false;
                        this.loseIcon.active = true;
                        this.gameEndEvent('lose');
                        if (Global.nowGameType == Global.gameType.twoModel) {
                            this.loseIcon.y = 290;
                        }
                    }
                }
            } else {
                this.players[i].active = false;
            }
        }
    }

    //设置字体颜色和骰子颜色;
    setplayerNameColor(key: number, node: cc.Node, piece: cc.Node) {
        switch (key) {
            case 1:
                // node.color = cc.color(92, 226, 253, 255);
                break;
            case 2:
                // node.color = cc.color(255, 97, 97, 255);
                break;
            case 3:
                // node.color = cc.color(145, 255, 121, 255);
                break;
            case 4:
                // node.color = cc.color(255, 217, 90, 255);
                break;
        }
        piece.getComponent(cc.Sprite).spriteFrame = this.playerhandler[key - 1];
    }

    gameEndEvent(rst) {
        let obj = {}
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
        let betsType = 'game';
        if (Global.isCoinType) {
            betsType = 'yoyo';
        }
        obj = {
            eventName: "game_end",
            name: `${GameConfig.gameName}${gameType}`,
            result: rst,
            bets: betsType,
            type: `${GameConfig.gameName}${gameType}`,
            mode: Ludo_GameMode.piceNum == 2 ? 'quick' : 'classical'
        }

        NDB.sendAutoJoinEvent(obj);
    }


    playAgain_callback() {
        if (this.isChangeScene) {
            return;
        }
        Ludo_BetsConfig.getRoomConfig(Global.gameRoomId, (configData) => {
            if (configData && configData.data) {
                let data = configData.data;
                Global.betsConfig = data;
            }
        },'get');
        this.isChangeScene = true;
        this.autoChangeScene();
        if (MessageData.gameType == GameType.room) {
            this.unschedule(this.countTime);
        }
    }


    //返回注意back；
    exit_callback() {
        MessageForRoom.exitRoomGame();
        this.autoChangeScene();
    }


    //自动切换场景;
    autoChangeScene() {
        if (cc.director.getScene().name = 'GameScene') {
            cc.director.loadScene("MatchScene");
        }
    }


}
