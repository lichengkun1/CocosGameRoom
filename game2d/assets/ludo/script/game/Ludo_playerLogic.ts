

import Global from '../Global/Ludo_GlobalGameData';
import MessageSoundManager from '../../../../Common/CommonScripts/Utils/MessageSoundManager';
import MyEvent from '../../../../Common/CommonScripts/Utils/MyEvent';
import ResourcesManager from '../../../../Common/CommonScripts/Utils/ResourcesManager';
import MessageManager from '../../../../Common/CommonScripts/Utils/MessageManager';
import MessageData, { GameType } from '../../../../Common/CommonScripts/Utils/MessageData';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_playerLogic extends cc.Component {

    @property(cc.SpriteFrame)
    headIcon: cc.SpriteFrame = null;

    @property({ type: cc.AudioClip })
    countTimeAudio: cc.AudioClip = null;

    @property(cc.SpriteAtlas)
    diceAtlas: cc.SpriteAtlas = null;

    @property({ type: cc.AudioClip })
    diceClipAudio: cc.AudioClip = null;

    @property(cc.Node)
    speakNode: cc.Node = null;

    @property(cc.Prefab)
    gloadEffect: cc.Prefab = null;

    @property(cc.Prefab)
    Effect: cc.Prefab[] = [];

    private naozhong_ske: cc.Node = null;                    //闹钟；
    private playerHead: cc.Node = null;                      //用户头像；
    private countTimeRed: cc.Node = null;                    //倒计时进度;
    private nickNameDi: cc.Node = null;                      //昵称底色;
    private playerNameLabel: cc.Label = null;                //昵称;
    private diceNode: cc.Node = null;                        //骰子;
    private goAway: cc.Node = null;                          //掉线标识；
    private countTimeNumber: number = 0;                     //倒计时时间;
    private dtTime: number = 0;                              //倒计时基准; 
    public isUpdate: boolean = false;                       //是否开始倒计时;
    private isShowLock: boolean = false;                     //是否已经显示闹钟;
    private countTimeAudioClipNumber: number = -1;           //倒计时音效;
    private hint: cc.Node = null;                            //操作提示;
    private playerid: number = 0;
    private isGoldDice: boolean = false;                     //当前是否是金骰子模式;
    private nowPoint: number = 0;                            //当前骰子点数;
    private isYellow: boolean = false;                       //是否变成了黄色;
    private diceDragNode: cc.Node = null;                    //骰子动画节点;
    private glodDiceDragNode: cc.Node = null;                    //骰子动画节点;
    private playerHeadBG: cc.Node = null;                    //头像背景底色;
    private diceSkinName: string = '';                       //骰子皮肤;  
    private _playerName: string = '';                        //用户昵称; 
    private hintPlayName: string = 'newAnimation';
    private isSpeakType: boolean = false;                    //是否是说话状态;
    private iconRobot: cc.Node = null;                        //代码模式;
    private isShowDiceAni: boolean = false;                   //是否在显示骰子动画;

    onLoad() {
        this.init();
    }

    start() {
    }

    init() {
        this.naozhong_ske = this.node.getChildByName('naozhong_ske');
        this.playerHead = this.node.getChildByName('playerHead');
        this.countTimeRed = this.node.getChildByName('countTimeRed');
        this.nickNameDi = this.node.getChildByName('nickNameDi');
        this.playerNameLabel = this.node.getChildByName('playerNameLabel').getComponent(cc.Label);
        this.diceNode = this.node.getChildByName('diceNode');
        this.goAway = this.node.getChildByName('goAway');
        this.hint = this.node.getChildByName('hint');
        this.diceDragNode = this.node.getChildByName('diceAnimation');
        this.glodDiceDragNode = this.node.getChildByName('diceAnimation2');
        this.playerHeadBG = this.node.getChildByName('playerHeadBG');
        this.iconRobot = this.node.getChildByName('iconRobot');
    }

    //是否是自己操作的阶段;
    isSelfSkip(flag: boolean) {
        if (flag) {
            this.playerHead.x = -100;
            this.playerHead.y = 0;
            this.playerHeadBG.x = -100;
            this.playerHeadBG.y = 0;
            this.countTimeRed.x = -100;
            this.countTimeRed.y = 0;
            this.naozhong_ske.x = -100;
            this.naozhong_ske.y = 0;
            this.nickNameDi.active = false;
            this.playerNameLabel.node.active = false;
            this.diceNode.x = 0;
            this.diceNode.y = 0;
            this.hint.x = 0;
            this.hint.y = 0;
            this.diceDragNode.x = 0;
            this.diceDragNode.y = 0;
            this.glodDiceDragNode.x = 0;
            this.glodDiceDragNode.y = 0;
        } else {
            this.playerHead.x = -45;
            this.playerHead.y = 9;
            this.playerHeadBG.x = -45;
            this.playerHeadBG.y = 9;
            this.countTimeRed.x = -45;
            this.countTimeRed.y = 9;
            this.naozhong_ske.x = -45;
            this.naozhong_ske.y = 9;
            this.nickNameDi.active = true;
            this.playerNameLabel.node.active = true;
            this.diceNode.x = 58;
            this.diceNode.y = -3;
            this.hint.x = 58;
            this.hint.y = -3;
        }
    }

    /*
        设置页面显示；
        @param  data                用户数据
        @param  nameDiTexure        昵称底纹理
        @param  diceAniName         骰子动画
    */
    initPlayerInfo(data, nameDiTexure: cc.SpriteFrame, diceType: number) {
        this.init();
        this.setPlayerName(data.name);
        let avatar = data.avatar;
        let name = data.name;
        let playerid = data.id;
        this.playerid = playerid;
        this.playerHead.off(cc.Node.EventType.TOUCH_START);
        this.nickNameDi.getComponent(cc.Sprite).spriteFrame = nameDiTexure;
        // // 设置头像框
        // let frameNode = this.node.getChildByName("playerHeadFrame");
        // cc.find("Canvas/plyaerLayer").getComponent(FrameImageController).SetOneUserFrame(frameNode,this.playerid);
        //设置骰子;
        if (diceType) {
            let diceAniName = '';
            switch (diceType) {
                case 591:
                    diceAniName = 'knight_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('knight_dice_0');
                    break;
                case 592:
                    diceAniName = 'island_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('island_dice_0');
                    break;
                case 1415:
                    diceAniName = 'starry_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('starry_dice_0');
                    break;
                case 1416:
                    diceAniName = 'warrior_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('warrior_dice_0');
                    break;
                case 1417:
                    diceAniName = 'electronic_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('electronic_dice_0');
                    break;
                case 1418:
                    diceAniName = 'dragonball_';
                    this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame('dragonball_dice_0');
                    break;
            }
            this.diceSkinName = diceAniName;
            this.setDiceDragAsset(diceAniName);
        }
        //设置头像显示;
        this.playerHead.getComponent(cc.Sprite).spriteFrame = this.headIcon;
        this.playerHead.scaleX = 70 / this.playerHead.width;
        this.playerHead.scaleY = 70 / this.playerHead.height;
        ResourcesManager.loadHeadImag(avatar, playerid, 2, (res: cc.Texture2D) => {
            res.packable = false;
            this.playerHead.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            this.playerHead.scaleX = 70 / this.playerHead.width;
            this.playerHead.scaleY = 70 / this.playerHead.height;
        });
        this.playerHead.on(cc.Node.EventType.TOUCH_START, () => {
            MessageManager.showPlayerInfo(playerid);
        }, this);
        //设置昵称;
        this.playerNameLabel.string = String(Global.subNickName(name));

        let status = data.status;
        let is_agent = data.is_agent;
        if (is_agent && playerid == Global.userId) {
            this.iconRobot.active = true;
            this.SetGoAwayIcon(false);
            if (playerid == Global.userId) {
                MyEvent.I.emit('robot_model');
            }
        } else {
            this.iconRobot.active = false;
            if (status === 'online') {
                this.SetGoAwayIcon(false);
            } else {
                this.SetGoAwayIcon(true);
            }
        }
    }

    private SetGoAwayIcon(active) {
        if (MessageData.gameType == GameType.room)
            this.goAway.active = active;
    }

    setPlayerName(name: string) {
        this._playerName = name;
    }

    getPlayerName() {
        return this._playerName;
    }

    //设置骰子龙骨;
    setDiceDragAsset(diceAniName: string) {
        //骑士骰子;
        // this.diceDragNode.active = true;
        if (diceAniName == 'knight_') {
            ResourcesManager.loadDragonBonesRes('knightDice/knight_shaizi', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'knight';
            });
        } else if (diceAniName == 'island_') {
            ResourcesManager.loadDragonBonesRes('isLandice/island_shaizi', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'island';
            });
        } else if (diceAniName == 'dragonball_') {
            ResourcesManager.loadDragonBonesRes('dice_dragon_ball/shaizi_long', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'newAnimation';
            });
        } else if (diceAniName == 'starry_') {
            ResourcesManager.loadDragonBonesRes('dice_starry_sky/shaizi_xingxing', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'newAnimation';
            });
        } else if (diceAniName == 'electronic_') {
            ResourcesManager.loadDragonBonesRes('dice_electronic/shaizi_electronic', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'newAnimation';
            });
        }
        else if (diceAniName == 'warrior_') {
            ResourcesManager.loadDragonBonesRes('dice_warrior/shaizi_zhanzheng', (dragData) => {
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAsset = dragData.asset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).dragonAtlasAsset = dragData.atlasAsset;
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).armatureName = 'Armature';
                this.diceDragNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('shaizi', 0);
                this.hintPlayName = 'newAnimation';
            });
        }
    }

    //开启倒计时;
    playCountTime() {
        this.dtTime = 0;
        this.isYellow = false;
        this.countTimeNumber = 0;
        this.isUpdate = true;
        this.isShowLock = false;
        this.countTimeRed.active = true;
        this.countTimeRed.getComponent(cc.Sprite).fillRange = 0;
        this.countTimeRed.color = cc.color(2, 228, 0);
    }

    //根据状态设置头像;
    setHeadStatus(data) {
        let status = data.status;
        let is_agent = data.is_agent;
        if (is_agent && data.id == Global.userId) {
            this.iconRobot.active = true;
            this.SetGoAwayIcon(false);
            if (data.id == Global.userId) {
                MyEvent.I.emit('robot_model');
            }
        } else {
            this.iconRobot.active = false;
            if (status === 'online') {
                this.SetGoAwayIcon(false);
            } else {
                this.SetGoAwayIcon(true);
            }
        }
    }

    //设置机器人状态;
    setRobotModel(flag: boolean) {
        this.iconRobot.active = flag;
    }

    //设置倒计时进度，用于刷新倒计时;
    setDTTime() {
        this.dtTime = 0;
        this.countTimeRed.color = cc.color(2, 228, 0);
        this.naozhong_ske.active = false;
        if (this.countTimeAudioClipNumber >= 0) {
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
    }

    //停止倒计时；
    stopCountTime() {
        this.isUpdate = false;
        this.isShowLock = false;
        this.countTimeRed.active = false;
        this.naozhong_ske.active = false;
        if (this.countTimeAudioClipNumber >= 0) {
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
    }

    //显示闹钟;
    showAlarmclock() {
        this.countTimeRed.color = cc.color(255, 41, 41);
        this.isShowLock = true;
        this.naozhong_ske.active = true;
        this.playerCaountTimeAudio();
    }

    //播放倒计时音效;
    playerCaountTimeAudio() {
        if (this.countTimeAudioClipNumber >= 0) {
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
        if (MessageSoundManager.audioEngineOn) {
            this.countTimeAudioClipNumber = cc.audioEngine.playEffect(this.countTimeAudio, false);
        }
    }

    //轮到用户操作了;
    startAction() {
        this.playCountTime();
        this.hint.active = true;
        this.hint.getComponent(dragonBones.ArmatureDisplay).playAnimation(this.hintPlayName, 0);
    }

    //操作结束;
    passAction() {
        this.stopCountTime();
        //骰子设置为默认；
        this.hint.active = false;
        if (this.countTimeAudioClipNumber >= 0) {
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
    }

    //设置金骰子;
    setGoldDice() {
        this.isGoldDice = true;
        if (this.nowPoint == 6) {
            this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame(`dice_j_6`);
        } else {
            this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame(`dice_j_0`);
        }

    }

    getIsGoldDice() {
        return this.isGoldDice;
    }

    setIsGoldDice(flag: boolean) {
        this.isGoldDice = flag;
    }

    //隐藏背景光；
    hideDiceLight() {
        this.hint.active = false;
    }

    //获取骰子节点;
    getDiceNode() {
        return this.diceNode;
    }

    //设置骰子点数;
    setDicePoint(point: number) {
        let pointStr = `${this.diceSkinName}dice_${point}`;
        if (this.isGoldDice && point == 6) {
            pointStr = 'dice_j_6';
            let lizi = cc.instantiate(this.gloadEffect);
            lizi.setPosition(this.diceNode.position);
            this.node.addChild(lizi);
        }

        this.nowPoint = point;
        this.isGoldDice = false;
        if (point != 0) {
            switch (this.diceSkinName) {
                case 'knight_':
                    let effect1 = cc.instantiate(this.Effect[0]);
                    effect1.setPosition(this.diceNode.position);
                    this.node.addChild(effect1);
                    break;
                case 'island_':
                    let effect2 = cc.instantiate(this.Effect[0]);
                    effect2.setPosition(this.diceNode.position);
                    this.node.addChild(effect2);
                    break;
                case 'dragonball_':
                    let effect3_1 = cc.instantiate(this.Effect[1]);
                    let effect3_2 = cc.instantiate(this.Effect[2]);
                    effect3_1.setPosition(this.diceNode.position);
                    this.node.addChild(effect3_1);
                    effect3_2.setPosition(this.diceNode.position);
                    this.node.addChild(effect3_2);
                    break;
                case 'electronic_':
                    let effect4 = cc.instantiate(this.Effect[3]);
                    effect4.setPosition(this.diceNode.position);
                    this.node.addChild(effect4);
                    break;
                case 'starry_':
                    let effect5 = cc.instantiate(this.Effect[4]);
                    effect5.setPosition(this.diceNode.position);
                    this.node.addChild(effect5);
                    break;
                case 'warrior_':
                    let effect6 = cc.instantiate(this.Effect[5]);
                    effect6.setPosition(this.diceNode.position);
                    this.node.addChild(effect6);
                    break;

            }
        }
        this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame(pointStr);
    }

    //恢复骰子点数;
    resumeDicePoint(isGold: boolean) {
        let diceStr = `${this.diceSkinName}dice_0`;
        if (this.isGoldDice) {
            diceStr = 'dice_j_0';
        }
        this.diceNode.getComponent(cc.Sprite).spriteFrame = this.diceAtlas.getSpriteFrame(diceStr);
    }

    //隐藏闹钟,顺便停止倒计时；
    hideAlarmclock() {
        this.naozhong_ske.active = false;
    }

    //玩家离开，设置头像有离开标识;
    setleave() {
        this.SetGoAwayIcon(true);
        this.isGoldDice = false;
        this.setDicePoint(0);
        this.hideDiceLight();
        this.stopCountTime();
        this.hideAlarmclock();
    }

    //玩家重新加入;
    setJoin() {
        this.SetGoAwayIcon(false);

    }

    //骰子动画，这个地方其实已经知道骰子的点数了;
    dicePlayAnimation(dicePoint: number, callback) {
        if (MessageSoundManager.audioEngineOn) {
            cc.audioEngine.playEffect(this.diceClipAudio, false);
        }
        this.isShowDiceAni = true;
        this.diceNode.active = false;
        if (this.isGoldDice) {
            this.glodDiceDragNode.active = true;
        } else {
            this.diceDragNode.active = true;
        }
        let diceDrag = this.diceDragNode.getComponent(dragonBones.ArmatureDisplay);
        let glodDiceDrag = this.glodDiceDragNode.getComponent(dragonBones.ArmatureDisplay);

        if (this.isGoldDice) {
            glodDiceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                glodDiceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                this.setDicePoint(dicePoint);
                this.diceNode.active = true;
                this.isShowDiceAni = false;
                this.diceDragNode.active = false;
                this.glodDiceDragNode.active = false;
                callback && callback();
            }, this);
        } else {
            diceDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                diceDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
                this.setDicePoint(dicePoint);
                this.diceNode.active = true;
                this.isShowDiceAni = false;
                this.diceDragNode.active = false;
                this.glodDiceDragNode.active = false;
                callback && callback();
            }, this);
        }
        let aniName = 'shaizi';
        if (this.isGoldDice) {
            aniName = 'shaizi_gold';
        }
        if (aniName == 'shaizi')
            diceDrag.playAnimation(aniName, 1);
        else {
            glodDiceDrag.playAnimation(aniName, 1);
        }
    }

    //设置骰子隐藏;
    setDiceAniNodeHide() {
        if (this.isShowDiceAni) {
            this.diceDragNode.active = false;
            this.glodDiceDragNode.active = false;
            this.isShowDiceAni = false;
        }
    }

    //设置是否为说话状态;
    setPlayerSpeakType() {
        if (this.isSpeakType) {
            return;
        }
        this.isSpeakType = true;
        this.speakNode.active = true;
        let peadDrag = this.speakNode.getComponent(dragonBones.ArmatureDisplay);
        peadDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            peadDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.isSpeakType = false;
            this.speakNode.active = false;
        }, this);
        peadDrag.playAnimation('newAnimation', 1);
    }

    update(dt) {
        if (this.isUpdate) {
            this.countTimeRed.getComponent(cc.Sprite).fillRange = 1 - this.dtTime;
            if (!this.isYellow && this.countTimeNumber >= 5) {
                this.isYellow = true;
                this.countTimeRed.color = cc.color(255, 199, 0);
            } else if (this.countTimeNumber >= 10) {
                if (!this.isShowLock) {
                    this.showAlarmclock();
                }
            } else {
                this.countTimeNumber += dt;
            }
            this.dtTime += dt / 15;
            if (this.dtTime >= 1) {
                this.isUpdate = false;
            }
        }
    }
}
