
import MessageData, { GameType } from '../../../Script/CommonScripts/Utils/MessageData';
import MessageManager from '../../../Script/CommonScripts/Utils/MessageManager';
import MessageSoundManager from '../../../Script/CommonScripts/Utils/MessageSoundManager';
import ResourcesManager from '../../../Script/CommonScripts/Utils/ResourcesManager';
import FrameImage from '../../../Script/FrameImageComponent/FrameImage';
import Global, { GameModeDominoe } from '../Utils/Dominoe_GlobalGameData';
import Dominoe_ExitPopup from './Dominoe_ExitPopup';
import Dominoe_gameLogic from './Dominoe_gameLogic';
import Dominoe_paiLogic from './Dominoe_paiLogic';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_playerLogic extends cc.Component {

    @property(cc.Node)
    headNode: cc.Node = null;                                //头像;

    @property(cc.Sprite)
    countDown: cc.Sprite = null;                               //闹钟背景;

    @property(cc.Node)
    paiSurplus: cc.Node = null;                              //背景牌；

    @property(cc.Label)
    nickNameLabel: cc.Label = null;                          //昵称；

    @property(cc.Label)
    countTimeLabel: cc.Label = null;                         //倒计时；

    @property(cc.Label)
    paiNumLabel: cc.Label = null;                            //牌的数量；

    @property(cc.Layout)
    pockerLayout: cc.Layout = null;                          //layout;

    @property(cc.Node)
    pockerPoint: cc.Node = null;                             //显示点数的红框;

    @property(cc.Label)
    pointLabel: cc.Label = null;                             //点数；

    @property(cc.Node)
    star: cc.Node = null;                                    //星星；

    @property(cc.Prefab)
    pockerPrefab: cc.Prefab = null;

    @property({ type: cc.AudioClip })
    countTimeClip: cc.AudioClip = null;

    @property(cc.Node)
    lewatBG: cc.Node = null;

    @property(cc.Node)
    quanNode: cc.Node = null;

    @property(cc.Node)
    speakNode: cc.Node = null;

    @property(cc.JsonAsset)
    langJson: cc.JsonAsset = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    scoreBg: cc.Node = null;

    @property(cc.Label)
    tapScreenLabel: cc.Label = null;


    private paiCount: number = 0;                            //剩余牌的数量;
    private isUpdate: boolean = false;                       //是否开启倒计时;
    private countDownNumber: number = 0;                     //倒计时时间;
    private countNum: number = 0;                            //时间值;
    private allCountNum: number = 0;                            //时间值;
    private goAway: cc.Node = null;                           //离线状态;
    private timeCount: number = -1;                           //timeOut值;
    private playerid: number = 0;                            //当前头像的用户id;   
    private isSpeakType: boolean = false;                    //是否是说话状态;

    public gameLogic: Dominoe_gameLogic = null;

    start() {
        this.initScoreNode();
    }

    private initScoreNode() {
         /** 分数相关的配置 */
        if(Global.gameMode === GameModeDominoe.SCORE100) {
            // this.scoreBg = this.node.getChildByName('scoreBG');
            // this.scoreLabel = this.node.getChildByName('score').getComponent(cc.Label);
            this.scoreBg.active = true;
            this.scoreLabel.node.active = true;
        } else {
            this.scoreBg.active = false;
            this.scoreLabel.node.active = false;
        }

        this.tapScreenLabel && (this.tapScreenLabel.string = MessageData.langDominoe.tap_screen ? MessageData.langDominoe.tap_screen : MessageData.langDominoeEnglish.tap_screen);
    }

    initPlayer(data) {
        let name = data.name;
        let avatar = data.avatar;
        let poker_remain_count = data.poker_remain_count;
        let status = data.status;
        let id = data.id;
        this.nickNameLabel.string = Global.subNickName(name);
        this.setPaiCount(poker_remain_count);
        this.setPlayerStatus(status);
        this.headNode.off(cc.Node.EventType.TOUCH_START,null,this);
        this.setPlayerHead(avatar, id);

        if (id != Global.userId) {
            this.paiSurplus.active = true;
            this.paiNumLabel.node.active = true;
        }
        // 更新分数
        this.updateScore();
    }

    /**
     * 更新玩家分数
     * @param  {number|string} targetScore 目标分数
     */
    public updateScore() {
        if(Global.gameMode === GameModeDominoe.ROUND) return;
        if(!this.scoreLabel) {
            this.initScoreNode();
        }
        const socre = this.gameLogic.playerScoreMap[this.playerid] ? this.gameLogic.playerScoreMap[this.playerid] : '0';
        
        this.scoreLabel.string = this.formatScoreLang() + '   ' + socre + '';
    }

    private formatScoreLang(): string {
        const scoreLang = MessageData.langDominoe.score ? MessageData.langDominoe.score : "SCORE";
        const lastScoreStr = scoreLang.slice(0,1) + scoreLang.slice(1);
        return lastScoreStr;
    }

    
    /**
     * 断线重连更新分数
     * @param  {number} score
     */
    public updateScoreWithUpdateStatus(score: number) {
        if(Global.gameMode === GameModeDominoe.ROUND) return;
        if(!this.scoreLabel) {
            this.initScoreNode();
        }
        this.scoreLabel.string = this.formatScoreLang() + '   ' + score + '';
    }

    setPlayerHead(avatar: string, playerid) {
        this.playerid = playerid;
        ResourcesManager.loadHeadImag(avatar, playerid, 2, (res: cc.Texture2D) => {
            res.packable = false;
            this.headNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            // this.headNode.scaleX = 64 / this.headNode.width;
            // this.headNode.scaleY = 64 / this.headNode.height;
        });
        // 设置头像框
        let frameNode = this.node.getChildByName("headNodeFrame");
        frameNode.getComponent(FrameImage).InitFrameImage(this.playerid);
        
        this.headNode.on(cc.Node.EventType.TOUCH_START, () => {
            MessageManager.showPlayerInfo(playerid);
        }, this);
    }

    //牌的数量;
    setPaiCount(num: number) {
        this.paiCount = num;
        if (num == 0) {
            this.paiNumLabel.node.active = false;
            this.paiSurplus.active = false;
        }
        this.paiNumLabel.string = String(num);

    }

    getPaiCount() {
        return this.paiCount;
    }

    //设置玩家状态;
    setPlayerStatus(statusType: string) {
        let goAway = this.node.getChildByName('goAway');
        if (statusType == 'online') {
            goAway.active = false;
        } else {
            if(MessageData.gameType === GameType.room && (statusType === 'abandoned' || statusType === 'kickoff')) {
                goAway.active = true;
            } else {
                goAway.active = false;
            }
        }
    }

    //开始倒计时;
    playCountDown(num: number) {
        this.countDown.node.active = true;
        this.countTimeLabel.node.active = true;
        this.countDownNumber = num;
        this.allCountNum = num;
        this.countNum = 0;
        this.countDown.fillRange = 1;
        this.countTime = 0;
        this.countTimeLabel.string = ""//String(this.countDownNumber);
        this.isUpdate = true;
        this.quanNode.active = true;
    }

    stopCountDown() {
        this.isUpdate = false;
        this.countDown.node.active = false;
        this.countTimeLabel.node.active = false;
        this.quanNode.active = false;
    }

    //显示结算数据;
    showSettintData(data) {
        //停止倒计时;
        this.stopCountDown();
        let id = data.id;
        let pointCount: number = 0;
        let poker_remain_list = data.poker_remain_list;
        let numsArr: number[][] = [];
        for (let i = 0, len = poker_remain_list.length; i < len; i++) {
            numsArr.push(poker_remain_list[i].nums);
            pointCount += poker_remain_list[i].nums[0] + poker_remain_list[i].nums[1];
        }
        this.pockerLayout.node.active = true;
        if (pointCount == 0) {
            this.star.active = true;
            this.pointLabel.string = '0';
        } else {
            let nLen = numsArr.length;
            let scaleNum = 0.45;
            if (nLen >= 10) {
                scaleNum = 0.35;
            }
            for (let i = 0, len = nLen; i < len; i++) {
                let p = cc.instantiate(this.pockerPrefab);
                p.getComponent(Dominoe_paiLogic).setPaiShow(numsArr[i]);
                p.getComponent(Dominoe_paiLogic).showMeng = false;
                this.pockerLayout.node.addChild(p);
                p.scale = scaleNum;
                p.y = -8
            }
            this.pointLabel.string = String(pointCount);
        }
        let name = this.pockerPoint.name;
        if (name == 'pockerPoint1') {
            setTimeout(() => {
                this.pockerPoint.active = true;
                this.pockerPoint.x = this.pockerLayout.node.x + this.pockerLayout.node.width - this.pockerPoint.width / 2 - 3;
                this.pockerPoint.y = this.pockerLayout.node.y + this.pockerLayout.node.height / 2 - this.pockerPoint.height / 2;
            }, 100);
        } else if (name == 'pockerPoint2') {
            this.pockerPoint.active = true;
        } else {
            setTimeout(() => {
                this.pockerPoint.active = true;
                this.pockerPoint.x = this.pockerLayout.node.x + this.pockerLayout.node.width - this.pockerPoint.width / 2 - 3;
                this.pockerPoint.y = this.pockerLayout.node.y + this.pockerLayout.node.height / 2 - this.pockerPoint.height / 2;
            }, 100);
        }

        // }
    }

    //显示lewat;
    showlewat(text: string) {
        let langText = this.getLangText();
        let showText = '';
        switch (text) {
            case 'turn':
                showText = langText.yTurn;
                break;
            case 'skip':
                showText = langText.skip;
                break;
            case 'draw':
                showText = langText.draw;
                break;
        }
        if (this.playerid == Global.userId) {
            this.lewatBG.x = 312;
        }
        if (this.timeCount >= 0) {
            clearTimeout(this.timeCount);
            this.timeCount = -1;
        }
        this.lewatBG.active = true;
        this.lewatBG.scale = 0;
        this.lewatBG.stopAllActions();
        let textLabel = this.lewatBG.getChildByName('textLabel').getComponent(cc.Label);
        textLabel.string = showText;
        setTimeout(() => {
            this.lewatBG.width = textLabel.node.width + 60;
            this.lewatBG.opacity = 0;
            let fin = cc.fadeTo(0.5, 255);
            this.lewatBG.runAction(fin);
            this.lewatBG.scale = 0;
            let s = cc.scaleTo(0.5, 1);
            this.lewatBG.runAction(s);
        }, 20);

        this.timeCount = setTimeout(() => {
            if (this.node && this.node.active) {
                this.lewatBG.active = false;
            }
        }, 3000);
    }

    //提示语言的国际化;
    getLangText() {
        let lang = MessageManager.getUrlParameterValue('ui_lang');
        const langJson = this.langJson.json;
        let yTurn = langJson.en.YourTurn;
        let skip = langJson.en.Pass;
        let draw = langJson.en.DrawCard;

        yTurn = MessageData.langDominoe.your_turn ? MessageData.langDominoe.your_turn : MessageData.langDominoeEnglish.your_turn;
        skip = MessageData.langDominoe.pass ? MessageData.langDominoe.pass : MessageData.langDominoeEnglish.pass;
        draw = MessageData.langDominoe.draw_card ? MessageData.langDominoe.draw_card : MessageData.langDominoeEnglish.draw_card;

        return { yTurn: yTurn, skip: skip, draw: draw };
    }

    setplayerStatus(exitPopup: Dominoe_ExitPopup, status: string) {
        if (status != 'online') {
            // this.node.getChildByName('goAway').active = true;
            // exitPopup.node.active = true;
            // exitPopup.show();
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
    countTime = 0;
    update(dt) {
        if (this.isUpdate) {
            this.countTime += dt;
            this.countNum += dt;
            if (this.countNum >= 1) {
                this.countDownNumber--;
                if (this.countDownNumber <= 5 && this.countDownNumber > 0) {
                    MessageSoundManager.playLoadEffect(this.countTimeClip);
                    this.countDown.node.color = new cc.Color(255, 71, 71, 255)
                } else {
                    this.countDown.node.color = new cc.Color(116, 255, 49, 255)
                }
                this.countTimeLabel.string = ""//String(this.countDownNumber);
                this.countNum = 0;
            }
            this.countDown.fillRange = (this.allCountNum - this.countTime) / this.allCountNum;
            if (this.countDownNumber <= 0) {
                this.isUpdate = false;

            }
        }
    }
}
