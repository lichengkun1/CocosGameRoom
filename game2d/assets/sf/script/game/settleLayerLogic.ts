
import Message from '../../../Script/CommonScripts/Utils/Message';
import MessageForRoom from '../../../Script/CommonScripts/Utils/MessageForRoom';
import MessageManager from '../../../Script/CommonScripts/Utils/MessageManager';
import ResourcesManager from '../../../Script/CommonScripts/Utils/ResourcesManager';
import GlobalGameData from '../Global/GlobalGameData';

const { ccclass, property } = cc._decorator;

@ccclass
export default class settleLayerLogic extends cc.Component {

    @property(cc.SpriteFrame)
    followed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    follow: cc.SpriteFrame = null;

    private userDiRed1: cc.Node = null;
    private userDiRed2: cc.Node = null;
    private userDiBlue1: cc.Node = null;
    private userDiBlue2: cc.Node = null;
    private settleData = null;
    private isTouchButton: boolean = false;              //是否已经点击button，放置按钮乱点;
    private redTeam: cc.Node = null;
    private blueTeam: cc.Node = null;
    private shareBtn: cc.Node = null;
    private againBtn: cc.Node = null;
    private backBtn: cc.Node = null;
    private countTimeNum: number = 0;
    private countNum: number = 1;
    private isUpdate: boolean = false;
    private timeLabel: cc.Label = null;
    private winDrag: cc.Node = null;
    private loseDrag: cc.Node = null;
    private sharelogo: cc.Node = null;

    start() {
        this.init();
    }

    init() {
        MessageForRoom.takeChangeRoom(false);
        let redTeam = this.node.getChildByName('redTeam');
        let blueTeam = this.node.getChildByName('blueTeam');
        this.redTeam = redTeam;
        this.blueTeam = blueTeam;
        this.userDiRed1 = redTeam.getChildByName('userDiRed1');
        this.userDiRed2 = redTeam.getChildByName('userDiRed2');
        this.userDiBlue1 = blueTeam.getChildByName('userDiBlue1');
        this.userDiBlue2 = blueTeam.getChildByName('userDiBlue2');
        this.shareBtn = this.node.getChildByName('shareBtn');
        this.againBtn = this.node.getChildByName('againBtn');
        this.backBtn = this.node.getChildByName('backBtn');
        this.timeLabel = this.node.getChildByName('timeLabel').getComponent(cc.Label);
        this.winDrag = this.node.getChildByName('winDrag');
        this.loseDrag = this.node.getChildByName('loseDrag');
        this.sharelogo = this.node.getChildByName('sharelogo');
        this.startCountTime();
        if (this.settleData) {
            this.setLayerShow();
        }

        if (GlobalGameData.nowGameType == GlobalGameData.gameType.SoloMode ||
            GlobalGameData.nowGameType == GlobalGameData.gameType.GodSoloMode) {
            this.userDiRed1.y = 25;
            this.userDiBlue1.y = 25;
            this.userDiRed2.active = false;
            this.userDiBlue2.active = false;
        }

        //如果是上帝模式，则不显示在玩一次和退出游戏;
        if (GlobalGameData.nowGameType == GlobalGameData.gameType.GodSoloMode ||
            GlobalGameData.nowGameType == GlobalGameData.gameType.GodMultiplayerMode) {
            this.shareBtn.x = 0;
            this.againBtn.active = false;
            this.backBtn.active = false;
        }
    }

    setEmojiShow(displayId, msg) {
        let redArr = [this.userDiRed1, this.userDiRed2];
        for (let i = 0; i < 2; i++) {
            let id = redArr[i].getComponent('settleUserLogic').getPlayerId();
            if (id == displayId) {
                Message.showEmoji([redArr[i].x, redArr[i].y - 18], [106, 106], msg);
                return;
            }
        }

        let blueArr = [this.userDiBlue1, this.userDiBlue2];
        for (let i = 0; i < 2; i++) {
            let id = blueArr[i].getComponent('settleUserLogic').getPlayerId();
            if (id == displayId) {
                Message.showEmoji([blueArr[i].x, blueArr[i].y - 18], [106, 106], msg);
                return;
            }
        }
    }

    //开始倒计时;
    startCountTime() {
        this.countTimeNum = 10;
        this.isUpdate = true;
        this.timeLabel.string = `${this.countTimeNum}S`;
    }

    //设置显示；
    setLayerShow() {
        let players = this.settleData.data['players'];
        let win_camp = this.settleData.data['win_camp'];
        ////console.log('win_camp:'+win_camp);
        let blue = players['blue'];
        let red = players['red'];

        this.setBlueHeadShow(blue, win_camp);
        this.setRedHeadShow(red, win_camp);

        if (win_camp == 'draw') {
            this.node.getChildByName('draw').active = true;
        }
    }

    //设置蓝色方面显示;
    setBlueHeadShow(blueTeam, win_camp) {
        let isBluewin: boolean = win_camp == 'blue' ? true : false;
        let blueTeamHeadArr = [this.userDiBlue1, this.userDiBlue2];

        if (isBluewin) {
            this.winDrag.active = true;
            this.loseDrag.active = true;
            this.winDrag.x = 160;
            this.loseDrag.x = -160;
            this.winDrag.getComponent(dragonBones.ArmatureDisplay).playAnimation('yang', 0);
            this.loseDrag.getComponent(dragonBones.ArmatureDisplay).playAnimation('niu', 0);

            this.blueTeam.getChildByName('winShow').active = true;
            this.redTeam.getChildByName('loadShow').active = true;
        }

        for (let i = 0, len = blueTeam.length; i < len; i++) {
            if (blueTeam[i] && blueTeamHeadArr[i]) {
                //头像和昵称数据;
                let avatar = blueTeam[i].avatar;
                let nickname = blueTeam[i].name;
                let uid = blueTeam[i].id;
                let diamond = blueTeam[i].diamond;
                //头像和昵称节点；
                let head = blueTeamHeadArr[i].getChildByName('headMask').getChildByName('headIcon');
                let nickNameLabel = blueTeamHeadArr[i].getChildByName('nickNameLabel').getComponent(cc.Label);
                let crown = blueTeamHeadArr[i].getChildByName('crown');
                blueTeamHeadArr[i].getComponent('settleUserLogic').setPlayerId(uid);
                if (isBluewin) {
                    crown.active = true;
                }
                ResourcesManager.loadHeadImag(avatar, uid, 2, (spr) => {
                    if (spr) {
                        head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                        return;
                    }
                    cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                        if (err) {
                            return;
                        }
                        head.getComponent(cc.Sprite).spriteFrame = res;
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                    });
                });
                nickNameLabel.string = GlobalGameData.subNickName(nickname);
                let coinLabel = blueTeamHeadArr[i].getChildByName('coinLabel').getComponent(cc.Label);
                if(diamond > 0){
                    diamond = '+'+diamond;
                }
                coinLabel.string = String(diamond);

                let follow = blueTeamHeadArr[i].getChildByName('follow');
                let followAcrion = blueTeamHeadArr[i].getChildByName('followAction');
                if (uid == GlobalGameData.userId) {
                    follow.active = false;
                    followAcrion.active = false;
                } else {
                    if (GlobalGameData.followedObj[uid] == undefined) {
                        MessageForRoom.isFollowedPlayer(uid, (pid, flag) => {
                            if (this.node && this.node.active) {
                                follow.active = true;
                                if (flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                } else {
                                    follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                                        event.stopPropagation();
                                        MessageForRoom.followedPlayer(uid, (pid, flag: boolean) => {
                                            if (this.node && this.node.active && flag) {
                                                follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                                follow.off(cc.Node.EventType.TOUCH_START);
                                                GlobalGameData.setChangeSpriteFrameAction(follow,followAcrion);
                                            }
                                        });
                                    }, this);
                                }
                            }
                        });
                    } else if (GlobalGameData.followedObj[uid] == false) {
                        follow.active = true;
                        follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                            event.stopPropagation();
                            MessageForRoom.followedPlayer(uid, (pid, flag: boolean) => {
                                if (this.node && this.node.active && flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                    follow.off(cc.Node.EventType.TOUCH_START);
                                    GlobalGameData.setChangeSpriteFrameAction(follow,followAcrion);
                                }
                            });
                        }, this);
                    }else if(GlobalGameData.followedObj[uid]){
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                    }   
                }
            }
        }
    }

    //设置红色方面显示；
    setRedHeadShow(redTeam, win_camp) {
        let redTeamHeadArr = [this.userDiRed1, this.userDiRed2];
        let isRedWin: boolean = win_camp == 'red' ? true : false;

        if (isRedWin) {
            this.winDrag.active = true;
            this.loseDrag.active = true;
            this.winDrag.x = -160;
            this.loseDrag.x = 160;
            this.winDrag.getComponent(dragonBones.ArmatureDisplay).playAnimation('niu', 0);
            this.loseDrag.getComponent(dragonBones.ArmatureDisplay).playAnimation('yang', 0);

            this.redTeam.getChildByName('winShow').active = true;
            this.blueTeam.getChildByName('loadShow').active = true;
        }

        for (let i = 0, len = redTeam.length; i < len; i++) {
            if (redTeam[i] && redTeamHeadArr[i]) {
                //头像和昵称数据;
                let avatar = redTeam[i].avatar;
                let nickname = redTeam[i].name;
                let uid = redTeam[i].id;
                let diamond = redTeam[i].diamond;

                //头像和昵称节点；
                let head = redTeamHeadArr[i].getChildByName('headMask').getChildByName('headIcon');
                let nickNameLabel = redTeamHeadArr[i].getChildByName('nickNameLabel').getComponent(cc.Label);
                let crown = redTeamHeadArr[i].getChildByName('crown');
                redTeamHeadArr[i].getComponent('settleUserLogic').setPlayerId(uid);
                if (isRedWin) {
                    crown.active = true;
                }
                ResourcesManager.loadHeadImag(avatar, uid, 2, (spr) => {
                    if (spr) {
                        head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr);
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                        return;
                    }
                    cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                        if (err) {
                            return;
                        }
                        head.getComponent(cc.Sprite).spriteFrame = res;
                        head.scaleX = 96 / head.width;
                        head.scaleY = 96 / head.height;
                    });
                });
                nickNameLabel.string = GlobalGameData.subNickName(nickname);
                let coinLabel = redTeamHeadArr[i].getChildByName('coinLabel').getComponent(cc.Label);
                if(diamond > 0){
                    diamond = '+'+diamond;
                }
                coinLabel.string = String(diamond);

                let follow = redTeamHeadArr[i].getChildByName('follow');
                let followAcrion = redTeamHeadArr[i].getChildByName('followAction');
                if (uid == GlobalGameData.userId) {
                    follow.active = false;
                    followAcrion.active = false;
                } else {
                    if (GlobalGameData.followedObj[uid] == undefined) {
                        MessageForRoom.isFollowedPlayer(uid, (pid, flag) => {
                            if (this.node && this.node.active) {
                                follow.active = true;
                                if (flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                } else {
                                    follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                                        event.stopPropagation();
                                        MessageForRoom.followedPlayer(uid, (pid, flag: boolean) => {
                                            if (this.node && this.node.active && flag) {
                                                follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                                follow.off(cc.Node.EventType.TOUCH_START);
                                                GlobalGameData.setChangeSpriteFrameAction(follow,followAcrion);
                                            }
                                        });
                                    }, this);
                                }
                            }
                        });
                    } else if (GlobalGameData.followedObj[uid] == false) {
                        follow.active = true;
                        follow.on(cc.Node.EventType.TOUCH_START, (event) => {
                            event.stopPropagation();
                            MessageForRoom.followedPlayer(uid, (pid, flag: boolean) => {
                                if (this.node && this.node.active && flag) {
                                    follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                                    follow.off(cc.Node.EventType.TOUCH_START);
                                    GlobalGameData.setChangeSpriteFrameAction(follow,followAcrion);
                                }
                            });
                        }, this);
                    }else if(GlobalGameData.followedObj[uid]){
                        follow.active = true;
                        follow.getComponent(cc.Sprite).spriteFrame = this.followed;
                    }   
                }
            }
        }
    }

    //结算界面获取数据;
    getSettleData(data) {
        this.settleData = data;
    }

    //分享回调;
    share_callback() {
        let countTimeDI = this.node.getChildByName('countTimeDI');
        this.timeLabel.node.active = false;
        countTimeDI.active = false;
        this.shareBtn.active = false;
        this.againBtn.active = false;
        this.backBtn.active = false;
        this.sharelogo.active = true;

    }

    shareHideButton() {
        console.log('shareHideButton');
        this.isUpdate = false;
        MessageForRoom.exitRoomGame();
        let countTimeDI = this.node.getChildByName('countTimeDI');
        this.timeLabel.node.active = false;
        countTimeDI.active = false;
        this.shareBtn.active = false;
        this.againBtn.active = false;
        this.backBtn.active = false;
        this.sharelogo.active = true;
    }

    shareShowButton() {
        // let countTimeDI = this.node.getChildByName('countTimeDI');
        this.sharelogo.active = false;
        this.autoChangeScene();
        //;
        if (GlobalGameData.nowGameType == GlobalGameData.gameType.GodSoloMode ||
            GlobalGameData.nowGameType == GlobalGameData.gameType.GodMultiplayerMode) {
            this.shareBtn.active = true;
        } else {
            // this.timeLabel.node.active = true;
            // countTimeDI.active = true;
            this.shareBtn.active = true;
            this.againBtn.active = true;
            this.backBtn.active = true;
        }

    }

    //在玩一次回调；
    again_callback() {
        if (this.isTouchButton) {
            return;
        }
        this.isTouchButton = true;
        GlobalGameData.isPlayerAgain = true;
        cc.director.loadScene("HallScene");
    }

    //退出游戏回调；
    exit_callback() {
        MessageForRoom.exitRoomGame();
        this.isTouchButton = true;
        cc.director.loadScene("HallScene");
    }

    //自动切换场景;
    autoChangeScene() {
        cc.director.loadScene("HallScene");
    }

    stopUpdate(){
        this.isUpdate = false;
    }

    update(dt) {
        if (this.isUpdate) {
            this.countNum += dt;
            if (this.countNum >= 1) {
                this.countNum = 0;
                this.countTimeNum--;
                this.timeLabel.string = `Close in ${this.countTimeNum}S`;
                if (this.countTimeNum == 0) {
                    this.isUpdate = false;
                    this.autoChangeScene();
                }else if(this.countTimeNum == 1){
                    if(GlobalGameData.nowGameType != GlobalGameData.gameType.GodSoloMode &&
                        GlobalGameData.nowGameType != GlobalGameData.gameType.GodMultiplayerMode){
                         MessageForRoom.joinRoomGame(2,false);
                    }
                }
            }
        }
    }
}
