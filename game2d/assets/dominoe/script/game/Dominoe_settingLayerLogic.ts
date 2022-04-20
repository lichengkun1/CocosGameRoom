
import { GameConfig } from '../../../gameConfig';
import MatchingScene from '../../../Script/CommonScripts/MatchSceneScripts/MatchingScene';
import Message from '../../../Script/CommonScripts/Utils/Message';
import MessageData, { GameType } from '../../../Script/CommonScripts/Utils/MessageData';
import MessageForRoom from '../../../Script/CommonScripts/Utils/MessageForRoom';
import MessageManager from '../../../Script/CommonScripts/Utils/MessageManager';
import NDB from '../../../Script/CommonScripts/Utils/NDBTS';
import ResourcesManager from '../../../Script/CommonScripts/Utils/ResourcesManager';
import FrameImage from '../../../Script/FrameImageComponent/FrameImage';
import FrameImageController from '../../../Script/FrameImageComponent/FrameImageController';
import Global, { GameModeDominoe } from '../Utils/Dominoe_GlobalGameData';

/**
 * 
 * 
 * 结算界面
 * 
 * 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_settingLayerLogic extends cc.Component {

    @property(cc.Node)
    players: cc.Node[] = [];

    @property(cc.SpriteFrame)
    followed: cc.SpriteFrame = null;


    @property(cc.JsonAsset)
    jsonAsset: cc.JsonAsset = null;

    private winIcon: cc.Node = null;
    private loseIcon: cc.Node = null;
    private countDownLabel: cc.Label = null;
    private layerData = null;                        //页面数据；    
    private isUpdate: boolean = false;               //是否开启倒计时;
    private dtTime: number = 0;                      //秒标尺;
    private countTimeNum: number = 6;                //倒计时时间;
    private isChangeScene: boolean = false;          //是否在切换场景;
    private shareBtn: cc.Node = null;                //分享按钮;
    private playAgainBtn: cc.Node = null;            //在玩一次按钮；
    private playAgainBtnLabel: cc.Label = null;            //在玩一次按钮；
    // private backBtn: cc.Node = null;                 //退出游戏按钮；
    private countTimeDI: cc.Node = null;             //倒计时底;
    private playerIdArr: number[] = [];               //玩家id数组;

    start() {
        this.init();
    }

    init() {
        MessageForRoom.takeChangeRoom(false);
        this.winIcon = this.node.getChildByName('winIcon');
        this.loseIcon = this.node.getChildByName('loseIcon');
        this.countDownLabel = this.node.getChildByName('countDownLabel').getComponent(cc.Label);
        this.shareBtn = this.node.getChildByName('shareBtn');
        this.playAgainBtn = this.node.getChildByName('playAgainBtn');
        this.playAgainBtnLabel = this.playAgainBtn.getChildByName("Label").getComponent(cc.Label);
        this.playAgainBtnLabel.string = this.getLangText();
        // this.backBtn = this.node.getChildByName('backBtn');
        this.countTimeDI = this.node.getChildByName('countTimeDI');

        let playerWinArr = [];
        let playerLoseArr = [];

        let players = this.layerData.players;
        let keys = Object.keys(players);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let diamond = players[key].diamond;
            if (diamond > 0) {
                playerWinArr.push(players[key]);
            } else {
                playerLoseArr.push(players[key]);
            }
        }

        let playerArr = playerWinArr.concat(playerLoseArr);
        playerArr.sort((a,b) => a.ranking - b.ranking > 0 ? 1 : a.ranking - b.ranking === 0 ? 0 : -1);

        for (let i = 0, len = playerArr.length; i < len; i++) {
            this.setPlayersInfo(playerArr[i], i);
        }

        if (Global.isGodModel) {
            this.shareBtn.x = 0;
            this.playAgainBtn.active = false;
            // this.backBtn.active = false;
            this.node.getChildByName('godTitle').active = true;
        }

        this.startCountTime();
    }

    //获取结算数据；
    setLayerData(data) {
        this.layerData = data;
    }

    setPlayersInfo(player, index) {
        let playerNode = this.players[index];
        playerNode.active = true;
        //用户头像;
        let playerHead = playerNode.getChildByName('playerHead');
        //用户头像框
        let playerFrame = playerNode.getChildByName('headNodeFrame');
        //用户昵称;
        let nameLabel = playerNode.getChildByName('nameLabel').getComponent(cc.Label);
        //用户积分;
        let integralLabel = playerNode.getChildByName('integralLabel').getComponent(cc.Label);
        //用户游戏币;
        let coinLabel = playerNode.getChildByName('coinLabel').getComponent(cc.Label);
        //关注按钮;
        let follow = playerNode.getChildByName('follow');

        let avatar = player.avatar;
        let id = player.id;
        this.playerIdArr[index] = id;
        playerNode.getChildByName("headNodeFrame").getComponent(FrameImage).InitFrameImage(id);
        let status = player.status;
        if (status != 'online') {
            playerNode.getChildByName('goAway').active = true;
        }

        let diamond = player.diamond;
        if (diamond >= 0) {
            playerNode.getChildByName('userDi').active = true;
            playerNode.getChildByName('crown').active = true;
            playerNode.getChildByName('winIcon').active = true;
        } else {
            playerNode.getChildByName('loseIcon').active = true;
        }

        if (id == Global.userId) {
            follow.active = false;
            playerNode.getChildByName('light').active = true;
            let rst = '';
            if (diamond < 0) {
                this.loseIcon.active = true;
                rst = 'lose';
            } else {
                this.winIcon.active = true;
                rst = 'win';
            }
            this.gameEndEvent(rst);
        } else {
            if (Global.followedObj[id] == undefined) {
                MessageForRoom.isFollowedPlayer(id, (pid, flag) => {
                    if (this.node && this.node.active) {
                        follow.active = true;
                        if (flag) {
                            follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                        } else {
                            follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                                event.stopPropagation();
                                MessageForRoom.followedPlayer(id, (uid, flag: boolean) => {
                                    if (this.node && this.node.active && flag) {
                                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                        follow.off(cc.Node.EventType.TOUCH_START);
                                    }
                                });
                            }, this);
                        }
                    }
                });
            } else if (Global.followedObj[id] == false) {
                follow.active = true;
                follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                    event.stopPropagation();
                    MessageForRoom.followedPlayer(id, (uid, flag: boolean) => {
                        if (this.node && this.node.active && flag) {
                            follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                            follow.off(cc.Node.EventType.TOUCH_START);
                        }
                    });
                }, this);
            } else if (Global.followedObj[id]) {
                follow.active = true;
                follow.getComponent(cc.Sprite).spriteFrame = this.followed;
            }
        }

        nameLabel.string = Global.subNickName(player.name);
        if(Global.gameMode === GameModeDominoe.ROUND) {
            integralLabel.string = player.props;
        } else {
            integralLabel.string = player.total_score;
        }
        coinLabel.string = player.diamond;
        if (Number(player.diamond) > 0) {
            coinLabel.node.color = new cc.Color(253, 239, 72, 255)
        } else {
            coinLabel.node.color = new cc.Color(5, 255, 24, 255)
        }
        playerHead.off(cc.Node.EventType.TOUCH_START);
        playerHead.on(cc.Node.EventType.TOUCH_START, () => {
            MessageManager.showPlayerInfo(id);
        })
        ResourcesManager.loadHeadImag(avatar, id, 2, (spr) => {
            spr.packable = false;
            playerHead.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
            playerHead.scaleX = 64 / playerHead.width;
            playerHead.scaleY = 64 / playerHead.height;
        });
        // 设置头像框
        this.node.getComponent(FrameImageController).SetOneUserFrame(playerFrame, id);
    }

    gameEndEvent(rst) {
        let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room";
        let obj = {
            eventName: "game_end",
            name: `${GameConfig.gameName}${gameType}`,
            result: rst,
            bets: 'game',
            type: `${GameConfig.gameName}${gameType}`
        }
        NDB.sendAutoJoinEvent(obj);
    }

    //有人发送表情;
    setEmojiShow(displayId, msg) {
        return;
        let index = this.playerIdArr.indexOf(displayId);
        if (index >= 0) {
            Message.showEmoji([this.players[index].x - 250, this.players[index].y], [64, 64], msg);
        }
    }

    //开始倒计时;
    startCountTime() {
        this.countTimeNum = 6;
        this.isUpdate = true;
        this.countDownLabel.string = `Close in ${this.countTimeNum}S`;
    }

    //再次游戏back；
    playAgain_callback() {
        if (this.isChangeScene) {
            return;
        }
        // MessageForRoom.joinRoomGame(2, true);
        this.isChangeScene = true;
        this.autoChangeScene();
    }

    //分享游戏;
    share_game() {
        this.isUpdate = false;
    }

    //分享开始时，隐藏按钮，显示图片;
    shareHideButton() {
        this.isUpdate = false;
        this.countTimeDI.active = false;
        this.countDownLabel.node.active = false;
        this.shareBtn.active = false;
        this.playAgainBtn.active = false;
        // this.backBtn.active = false;
        // this.logo.active = true;
    }

    //分享以后，恢复按钮显示；
    shareShowButton() {
        this.autoChangeScene();
        // this.logo.active = false;
        if (Global.isGodModel) {
            this.shareBtn.x = 0;
            this.shareBtn.active = true;
        } else {
            this.shareBtn.active = true;
            this.playAgainBtn.active = true;
            // this.backBtn.active = true;
            // this.logo.active = false;
        }
    }

    //返回注意back；
    exit_callback() {
        if (MessageData.gameType == GameType.single) {
            return;
        }
        MessageForRoom.exitRoomGame();
        this.autoChangeScene();
    }

    //停止倒计时;
    stopUpdate() {
        this.isUpdate = false;
    }

    //自动切换场景;
    autoChangeScene() {
        if (Global.isGodModel) {
            // Message.joinGame();
            MatchingScene.isFirstPlayGame = true;
        }

        if (cc.director.getScene().name = 'gameScene') {
            if (Global.hallSceneIsLoad) {
                // if (MessageData.gameType == GameType.single) {
                //     MessageForSingle.playAgain(() => { });
                // }
                cc.director.loadScene("MatchScene");
            } else {
                cc.director.preloadScene('MatchScene', (completedCount, totalCount, item) => {
                    // if (MessageData.gameType == GameType.single) {
                    //     MessageForSingle.playAgain(() => { });
                    // }
                    cc.director.loadScene("MatchScene");
                    Global.hallSceneIsLoad = true;
                }, (error) => {
                    
                });
            }
        }
    }

    update(dt) {
        if (this.isUpdate) {
            if (MessageData.gameType == GameType.single) {
                this.countDownLabel.string = "";
                return;
            }
            this.dtTime += dt;
            if (this.dtTime >= 1) {
                this.dtTime = 0;
                this.countTimeNum--;
                this.countDownLabel.string = `Close in ${this.countTimeNum}S`;
                if (this.countTimeNum == 0) {
                    this.isUpdate = false;
                    this.autoChangeScene();
                } else if (this.countTimeNum == 1) {

                }
            }
        }
    }
    getLangText(): string {
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        const langJson = this.jsonAsset.json;
        let playAgain: string = langJson.en.playAgain;

        playAgain = MessageData.langDominoe.play_again ? MessageData.langDominoe.play_again : MessageData.langDominoeEnglish.play_again;

        return playAgain;
    }
}
