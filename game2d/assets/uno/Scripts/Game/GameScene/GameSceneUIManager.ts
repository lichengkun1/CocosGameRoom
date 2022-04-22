import { GameData } from "../../Common/Game/GameData";
import { LanguageManager } from "../../Common/Language/LanguageManager";
import GlobalGameData, { GamePlayerCount } from "../../GlobalGameData";
import UNOMatching from "../../Match/uno_Matching";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSceneUIManager extends cc.Component {
    public static I: GameSceneUIManager;
    onLoad() {
        this.designResolution = cc.view.getDesignResolutionSize();
        this.viewResolution = cc.view.getVisibleSize();

        GameSceneUIManager.I = this.node.getComponent(GameSceneUIManager);
        this.InitNode();
    }
    @property(cc.Prefab)
    public backCard: cc.Prefab = null;
    @property(cc.Prefab)
    public faceCard: cc.Prefab = null;
    @property(cc.RichText)
    public add4TipRichText: cc.RichText = null;
    @property(cc.Label)
    public TimeOutLabel: cc.Label = null;
    @property(cc.Label)
    public GameOverLabel: cc.Label = null;

    @property(cc.JsonAsset)
    public emojiJson: cc.JsonAsset = null;

    public backCardPos: cc.Node;                //
    public backCardParent: cc.Node;             //
    public faceCardPos: cc.Node;                //
    public faceCardParent: cc.Node;             //
    public ThisPlayerCardsPos1: cc.Node;        //
    public ThisPlayerCardsParent: cc.Node;      //
    public CenterBG: cc.Node;                   //
    public arr: cc.Node;
    public DrawCard: cc.Node;

    public otherPlayerNode = {
        0: {
            /** 卡牌节点 */
            cards: null,
            /** 卡牌的数量 */
            number: null,
            /** 头像 */
            headImage: null,
            /** 用户名字 */
            nameNode: null,
            /** 用户显示的uno节点 */
            UNO: null,
            /** 用户的排行节点 */
            rank: null,
            /** 用户的被禁节点 */
            abandon: null,
            /** 用户的挑战节点 */
            challenge: null,
            offlineIcon: null
        },
        1: {
            
            /** 卡牌节点 */
            cards: null,
            /** 卡牌的数量 */
            number: null,
            /** 头像 */
            headImage: null,
            /** 用户名字 */
            nameNode: null,
            /** 用户显示的uno节点 */
            UNO: null,
            /** 用户的排行节点 */
            rank: null,
            /** 用户的被禁节点 */
            abandon: null,
            /** 用户的挑战节点 */
            challenge: null,
            offlineIcon: null
        },
        2: {
            /** 卡牌节点 */
            cards: null,
            /** 卡牌的数量 */
            number: null,
            /** 头像 */
            headImage: null,
            /** 用户名字 */
            nameNode: null,
            /** 用户显示的uno节点 */
            UNO: null,
            /** 用户的排行节点 */
            rank: null,
            /** 用户的被禁节点 */
            abandon: null,
            /** 用户的挑战节点 */
            challenge: null,
            offlineIcon: null
        },
        3: {
            /** 卡牌节点 */
            cards: null,
            /** 卡牌的数量 */
            number: null,
            /** 头像 */
            headImage: null,
            /** 用户名字 */
            nameNode: null,
            /** 用户显示的uno节点 */
            UNO: null,
            /** 用户的排行节点 */
            rank: null,
            /** 用户的被禁节点 */
            abandon: null,
            /** 用户的挑战节点 */
            challenge: null,
            offlineIcon: null
        }
    }
    public playerNode = {
        headImage: null,
        nameNode: null,
        UNO: null,
        rank: null,
        abandon: null,
        challenge: null,
    }



    public canvas: cc.Node;                    //场景的canvas
    private ruleBtn: cc.Node;                   //规则按钮
    private musicBtn: cc.Node;                  //音乐按钮
    private ExitBtn: cc.Node;                   //退出按钮
    private playerIcon: cc.Sprite;              //当前玩家的头像
    private playerName: cc.Label;               //当前玩家的姓名
    private otherPlayerIcon1: cc.Sprite;        //玩家1的头像
    private otherPlayerIcon2: cc.Sprite;        //玩家2的头像
    private otherPlayerIcon3: cc.Sprite;        //玩家3的头像
    private otherPlayerName1: cc.Label;         //玩家1的姓名
    private otherPlayerName2: cc.Label;         //玩家2的姓名
    private otherPlayerName3: cc.Label;         //玩家3的姓名
    private myCards: cc.Node;                   //
    public cards0: cc.Node;                    // 上帝模式下玩家0的牌堆
    private cards0Number: cc.Label;             // 上帝模式下玩家0的牌数
    private cards1: cc.Node;                    //玩家1的牌堆
    private cards1Number: cc.Label;             //玩家1的牌数
    private cards2: cc.Node;                    //玩家2的牌堆
    private cards2Number: cc.Label;             //玩家2的牌数
    private cards3: cc.Node;                    //玩家3的牌堆
    private cards3Number: cc.Label;             //玩家3的牌数

    public otherPlayerTime1: cc.Sprite;         //玩家1的倒计时
    public otherPlayerTime2: cc.Sprite;         //玩家2的倒计时
    public otherPlayerTime3: cc.Sprite;         //玩家3的倒计时
    public playerTime: cc.Sprite;               //当前玩家的倒计时

    public otherPlayerLight1: cc.Node;         //玩家1的高亮
    public otherPlayerLight2: cc.Node;         //玩家2的高亮
    public otherPlayerLight3: cc.Node;         //玩家3的高亮
    public playerLight: cc.Node;               //当前玩家的高亮

    public otherPlayerNameBG1: cc.Node;
    public otherPlayerNameBG2: cc.Node;
    public otherPlayerNameBG3: cc.Node;

    public otherPlayerIconBG1: cc.Node;
    public otherPlayerIconBG2: cc.Node;
    public otherPlayerIconBG3: cc.Node;


    public GameTime: cc.Label;                      //游戏总倒计时
    public GameTimeTop: cc.Label;                      //游戏总倒计时

    public TimeOut: cc.Node;                      //游戏超时           
    public GameOver: cc.Node;                      //游戏超时           

    public gameTimeRedBG: cc.Node;              //游戏总倒计时的红色背景
    public GameTimePos: cc.Node;                //游戏总倒计时的位置

    private Add4TipPopup: cc.Node;              //质疑的弹窗

    public rank0: cc.Node;                      //排名
    public rank1: cc.Node;                      //排名
    public rank2: cc.Node;                      //排名
    public rank3: cc.Node;                      //排名

    public abandon0: cc.Node;                   //离线
    public abandon1: cc.Node;                   //离线
    public abandon2: cc.Node;                   //离线
    public abandon3: cc.Node;                   //离线

    public challenge0: cc.Node;                   //质疑弹窗
    public challenge1: cc.Node;                   //质疑弹窗
    public challenge2: cc.Node;                   //质疑弹窗
    public challenge3: cc.Node;                   //质疑弹窗

    public iconRobot: cc.Node;
    public iconRobotbg: cc.Node;

    public UNO0: cc.Node = null;
    public UNO1: cc.Node = null;
    public UNO2: cc.Node = null;
    public UNO3: cc.Node = null;

    private designResolution: cc.Size = cc.size(0,0);
    private viewResolution: cc.Size = cc.size(0);

    private emojiBg: cc.Node = null;


    /**初始化结点 */
    InitNode() {
        this.canvas = cc.find("Canvas");
        this.emojiBg = this.canvas.getChildByName('emojiBG');
        this.emojiBg.zIndex = 6;
        this.canvas.getChildByName("Popup").zIndex = 22;
        this.backCardPos = this.canvas.getChildByName("backCardPos");
        this.backCardParent = this.canvas.getChildByName("backCardParent");
        this.faceCardPos = this.canvas.getChildByName("faceCardPos");
        this.faceCardParent = this.canvas.getChildByName("faceCardParent");
        this.ThisPlayerCardsPos1 = this.canvas.getChildByName("ThisPlayerCardsPos1");
        this.ThisPlayerCardsParent = this.canvas.getChildByName("ThisPlayerCardsParent");
        this.ThisPlayerCardsParent.zIndex = 2;

        this.arr = this.canvas.getChildByName('arr');
        this.DrawCard = this.canvas.getChildByName('DrawCard');
        this.arr.active = false;
        this.DrawCard.active = false;

        this.otherPlayerNameBG1 = this.canvas.getChildByName('otherPlayerNameBG1');
        this.otherPlayerNameBG2 = this.canvas.getChildByName('otherPlayerNameBG2');
        this.otherPlayerNameBG3 = this.canvas.getChildByName('otherPlayerNameBG3');

        this.otherPlayerIconBG1 = this.canvas.getChildByName('otherPlayerIconBG1');
        this.otherPlayerIconBG2 = this.canvas.getChildByName('otherPlayerIconBG2');
        this.otherPlayerIconBG3 = this.canvas.getChildByName('otherPlayerIconBG3');

        this.ruleBtn = this.canvas.getChildByName("ruleBtn");
        this.CenterBG = this.canvas.getChildByName("CenterBG");
        this.musicBtn = this.canvas.getChildByName("musicBtn");
        this.ExitBtn = this.canvas.getChildByName("exitBtn");
        this.playerIcon = this.canvas.getChildByName("playerIcon").getComponent(cc.Sprite);
        this.playerName = this.canvas.getChildByName("playerName").getComponent(cc.Label);
        this.otherPlayerIcon1 = this.canvas.getChildByName("otherPlayerIcon1").getComponent(cc.Sprite);
        this.otherPlayerIcon2 = this.canvas.getChildByName("otherPlayerIcon2").getComponent(cc.Sprite);
        this.otherPlayerIcon3 = this.canvas.getChildByName("otherPlayerIcon3").getComponent(cc.Sprite);
        this.otherPlayerName1 = this.canvas.getChildByName("otherPlayerName1").getComponent(cc.Label);
        this.otherPlayerName2 = this.canvas.getChildByName("otherPlayerName2").getComponent(cc.Label);
        this.otherPlayerName3 = this.canvas.getChildByName("otherPlayerName3").getComponent(cc.Label);
        this.myCards = this.canvas.getChildByName("myCards")
        this.cards0 = this.canvas.getChildByName('cards0');
        this.cards0Number = this.cards0.getChildByName("cardNumber").getChildByName("Label").getComponent(cc.Label);
        this.cards1 = this.canvas.getChildByName("cards1");
        this.cards1Number = this.cards1.getChildByName("cardNumber").getChildByName("Label").getComponent(cc.Label);
        this.cards2 = this.canvas.getChildByName("cards2");
        this.cards2Number = this.cards2.getChildByName("cardNumber").getChildByName("Label").getComponent(cc.Label);
        this.cards3 = this.canvas.getChildByName("cards3");
        this.cards3Number = this.cards3.getChildByName("cardNumber").getChildByName("Label").getComponent(cc.Label);

        this.otherPlayerTime1 = this.canvas.getChildByName("otherPlayerTime1").getComponent(cc.Sprite);
        this.otherPlayerTime2 = this.canvas.getChildByName("otherPlayerTime2").getComponent(cc.Sprite);
        this.otherPlayerTime3 = this.canvas.getChildByName("otherPlayerTime3").getComponent(cc.Sprite);
        this.playerTime = this.canvas.getChildByName("playerTime").getComponent(cc.Sprite);

        const offlineIcon0 = this.canvas.getChildByName('offline0');
        const offlineIcon1 = this.canvas.getChildByName('offline1');
        const offlineIcon2 = this.canvas.getChildByName('offline2');
        const offlineIcon3 = this.canvas.getChildByName('offline3');

        this.rank0 = this.canvas.getChildByName("rank0");
        this.rank1 = this.canvas.getChildByName("rank1");
        this.rank2 = this.canvas.getChildByName("rank2");
        this.rank3 = this.canvas.getChildByName("rank3");
        this.playerNode.rank = this.rank0;
        this.otherPlayerNode[0].rank = this.rank0;
        this.otherPlayerNode[1].rank = this.rank1;
        this.otherPlayerNode[2].rank = this.rank2;
        this.otherPlayerNode[3].rank = this.rank3;

        this.otherPlayerNode[0].offlineIcon = offlineIcon0;
        this.otherPlayerNode[1].offlineIcon = offlineIcon1;
        this.otherPlayerNode[2].offlineIcon = offlineIcon2;
        this.otherPlayerNode[3].offlineIcon = offlineIcon3;


        this.abandon0 = this.canvas.getChildByName("abandon0");
        this.abandon1 = this.canvas.getChildByName("abandon1");
        this.abandon2 = this.canvas.getChildByName("abandon2");
        this.abandon3 = this.canvas.getChildByName("abandon3");

        this.playerNode.abandon = this.abandon0;
        this.otherPlayerNode[0].abandon = this.abandon0;
        this.otherPlayerNode[1].abandon = this.abandon1;
        this.otherPlayerNode[2].abandon = this.abandon2;
        this.otherPlayerNode[3].abandon = this.abandon3;

        this.challenge0 = this.canvas.getChildByName("challenge0");
        this.challenge1 = this.canvas.getChildByName("challenge1");
        this.challenge2 = this.canvas.getChildByName("challenge2");
        this.challenge3 = this.canvas.getChildByName("challenge3");

        this.playerNode.challenge = this.challenge0;
        this.otherPlayerNode[0].challenge = this.challenge0;
        this.otherPlayerNode[1].challenge = this.challenge1;
        this.otherPlayerNode[2].challenge = this.challenge2;
        this.otherPlayerNode[3].challenge = this.challenge3;

        this.otherPlayerLight1 = this.canvas.getChildByName("otherPlayerLight1");
        this.otherPlayerLight2 = this.canvas.getChildByName("otherPlayerLight2");
        this.otherPlayerLight3 = this.canvas.getChildByName("otherPlayerLight3");
        this.playerLight = this.canvas.getChildByName("playerLight");

        console.log("===== ", this.otherPlayerTime1, this.otherPlayerTime2, this.otherPlayerTime3, this.playerTime);

        this.playerNode.headImage = this.playerIcon;
        this.playerNode.nameNode = this.playerName;
        this.playerNode.UNO = this.canvas.getChildByName("UNO0");
        this.UNO0 = this.playerNode.UNO;

        this.otherPlayerNode[0].cards = this.cards0;
        this.otherPlayerNode[0].number = this.cards0Number;
        this.otherPlayerNode[0].headImage = this.playerIcon;
        this.otherPlayerNode[0].nameNode = this.playerName;
        this.otherPlayerNode[0].UNO = this.UNO0;


        this.otherPlayerNode[1].cards = this.cards1;
        this.otherPlayerNode[1].number = this.cards1Number;
        this.otherPlayerNode[1].headImage = this.otherPlayerIcon1;
        this.otherPlayerNode[1].nameNode = this.otherPlayerName1;
        this.otherPlayerNode[1].UNO = this.canvas.getChildByName("UNO1");
        this.UNO1 = this.otherPlayerNode[1].UNO;

        this.otherPlayerNode[2].cards = this.cards2;
        this.otherPlayerNode[2].number = this.cards2Number;
        this.otherPlayerNode[2].headImage = this.otherPlayerIcon2;
        this.otherPlayerNode[2].nameNode = this.otherPlayerName2;
        this.otherPlayerNode[2].UNO = this.canvas.getChildByName("UNO2");
        this.UNO2 = this.otherPlayerNode[2].UNO;

        this.otherPlayerNode[3].cards = this.cards3;
        this.otherPlayerNode[3].number = this.cards3Number;
        this.otherPlayerNode[3].headImage = this.otherPlayerIcon3;
        this.otherPlayerNode[3].nameNode = this.otherPlayerName3;
        this.otherPlayerNode[3].UNO = this.canvas.getChildByName("UNO3");
        this.UNO3 = this.otherPlayerNode[3].UNO;

        this.showPlayerInfoByPlayerCount();

        this.Add4TipPopup = this.canvas.getChildByName('Add4TipPopup');
        this.Add4TipPopup.zIndex = 5;

        console.log("TimeStart");
        this.GameTime = this.canvas.getChildByName('GameTime').getComponent(cc.Label);
        this.GameTimeTop = this.GameTime.node.getChildByName('GameTimeTop').getComponent(cc.Label);
        this.gameTimeRedBG = this.canvas.getChildByName('gameTimeRedBG');
        this.GameTimePos = this.canvas.getChildByName('GameTimePos');
        this.gameTimeRedBG.active = false;
        this.TimeStart();
        // this.UpdateCountdown();
        this.scheduleOnce(this.GameTimeAnimation, 1);


        this.TimeOut = this.canvas.getChildByName('TimeOut');
        this.GameOver = this.canvas.getChildByName("GameOver");
        this.TimeOutLabel.string = LanguageManager.GetType().timeout ? LanguageManager.GetType().timeout : LanguageManager.enLangJson.timeout;
        this.GameOverLabel.string = LanguageManager.GetType().gameover ? LanguageManager.GetType().gameover : LanguageManager.enLangJson.gameover;

        this.iconRobot = this.canvas.getChildByName("iconRobot");
        this.iconRobotbg = this.canvas.getChildByName("iconRobotbg");
        this.iconRobotbg.zIndex = 3;

    }

    showPlayerInfoByPlayerCount() {
        console.log('-----two');
        const realUsers = GameData.message.data.players.filter(item => item.id);
        GlobalGameData.playerCount = realUsers.length == 2 ? GamePlayerCount.TWO : realUsers.length == 3 ? GamePlayerCount.THREE : GamePlayerCount.FOUR;
        switch(GlobalGameData.playerCount) {
            case GamePlayerCount.TWO:
                console.log('两个玩家隐藏 玩家一和玩家三');
                // 玩家一隐藏
                let player1Brands: cc.Node[] = [this.cards1,this.cards1Number.node,this.otherPlayerIcon1.node,
                    this.otherPlayerLight1,this.otherPlayerName1.node,this.otherPlayerTime1.node,this.UNO1,
                    this.otherPlayerNameBG1,this.rank1,this.abandon1,this.challenge1,this.otherPlayerIconBG1,
                    ];
                let player3Brands: cc.Node[] = [
                    this.cards3,this.cards3Number.node,this.otherPlayerIcon3.node,
                    this.otherPlayerLight3,this.otherPlayerName3.node,this.otherPlayerTime3.node,this.UNO3,
                    this.otherPlayerNameBG3,this.rank3,this.abandon3,this.challenge3,this.otherPlayerIconBG3,
                ]
                player1Brands.concat(player3Brands).forEach(item => item.active = false);
                
                break;
            case GamePlayerCount.THREE:
                // 玩家3隐藏
                let player3Infos: cc.Node[] = [
                    this.cards3,this.cards3Number.node,this.otherPlayerIcon3.node,
                    this.otherPlayerLight3,this.otherPlayerName3.node,this.otherPlayerTime3.node,this.UNO3,
                    this.otherPlayerNameBG3,this.rank3,this.abandon3,this.challenge3,this.otherPlayerIconBG3,
                ];
                player3Infos.forEach(item => item.active = false);
                break;
            case GamePlayerCount.FOUR:
                break;
        }
    }

    TimeOutAnimation(func?: Function) {
        this.TimeOut.active = true;
        this.TimeOut.zIndex = 3;
        cc.tween(this.TimeOut)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                if (func) {
                    func();
                }
            })
            .start();
    }
    GameOverAnimation(func?: Function) {
        this.GameOver.active = true;
        this.GameOver.zIndex = 3;
        cc.tween(this.GameOver)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .delay(1)
            .call(() => {
                if (func) {
                    func();
                }
            })
            .start();
    }

    GameTimeAnimation() {
        let target = this.GameTimePos.position;
        cc.tween(this.GameTime.node)
            .delay(1.5)
            .to(0.5, { position: target, scale: 0.3 })
            .start();
    }
    angleNumber = 1;
    /**绘制1号玩家的倒计时*/
    DarwTime1() {
        console.log();
        GameSceneUIManager.I.otherPlayerTime1.node.active = true;
        GameSceneUIManager.I.otherPlayerTime2.node.active = false;
        GameSceneUIManager.I.otherPlayerTime3.node.active = false;
        GameSceneUIManager.I.playerTime.node.active = false;

        GameSceneUIManager.I.otherPlayerLight1.active = true;
        GameSceneUIManager.I.otherPlayerLight2.active = false;
        GameSceneUIManager.I.otherPlayerLight3.active = false;
        GameSceneUIManager.I.playerLight.active = false;

        GameSceneUIManager.I.angleNumber -= 1 / (UNOMatching.GameConfig.turn_duration * 10)
        if (GameSceneUIManager.I.angleNumber <= 0.3) {
            GameSceneUIManager.I.otherPlayerTime1.node.color = new cc.Color(255, 52, 52, 127);
        } else {
            GameSceneUIManager.I.otherPlayerTime1.node.color = new cc.Color(58, 255, 52, 127);
        }
        if (GameSceneUIManager.I.angleNumber <= 0)
            GameSceneUIManager.I.angleNumber = 0;
        GameSceneUIManager.I.otherPlayerTime1.fillRange = GameSceneUIManager.I.angleNumber;
    }
    /**绘制2号玩家的倒计时*/
    DarwTime2() {
        GameSceneUIManager.I.otherPlayerTime1.node.active = false;
        GameSceneUIManager.I.otherPlayerTime2.node.active = true;
        GameSceneUIManager.I.otherPlayerTime3.node.active = false;
        GameSceneUIManager.I.playerTime.node.active = false;

        GameSceneUIManager.I.otherPlayerLight1.active = false;
        GameSceneUIManager.I.otherPlayerLight2.active = true;
        GameSceneUIManager.I.otherPlayerLight3.active = false;
        GameSceneUIManager.I.playerLight.active = false;

        GameSceneUIManager.I.angleNumber -= 1 / (UNOMatching.GameConfig.turn_duration * 10)
        if (GameSceneUIManager.I.angleNumber <= 0.3) {
            GameSceneUIManager.I.otherPlayerTime2.node.color = new cc.Color(255, 52, 52, 127);
        } else {
            GameSceneUIManager.I.otherPlayerTime2.node.color = new cc.Color(58, 255, 52, 127);
        }
        if (GameSceneUIManager.I.angleNumber <= 0)
            GameSceneUIManager.I.angleNumber = 0;
        GameSceneUIManager.I.otherPlayerTime2.fillRange = GameSceneUIManager.I.angleNumber;
    }
    /**绘制3号玩家的倒计时*/
    DarwTime3() {
        GameSceneUIManager.I.otherPlayerTime1.node.active = false;
        GameSceneUIManager.I.otherPlayerTime2.node.active = false;
        GameSceneUIManager.I.otherPlayerTime3.node.active = true;
        GameSceneUIManager.I.playerTime.node.active = false;

        GameSceneUIManager.I.otherPlayerLight1.active = false;
        GameSceneUIManager.I.otherPlayerLight2.active = false;
        GameSceneUIManager.I.otherPlayerLight3.active = true;
        GameSceneUIManager.I.playerLight.active = false;

        GameSceneUIManager.I.angleNumber -= 1 / (UNOMatching.GameConfig.turn_duration * 10)
        if (GameSceneUIManager.I.angleNumber <= 0.3) {
            GameSceneUIManager.I.otherPlayerTime3.node.color = new cc.Color(255, 52, 52, 127);
        } else {
            GameSceneUIManager.I.otherPlayerTime3.node.color = new cc.Color(58, 255, 52, 127);
        }
        if (GameSceneUIManager.I.angleNumber <= 0)
            GameSceneUIManager.I.angleNumber = 0;
        GameSceneUIManager.I.otherPlayerTime3.fillRange = GameSceneUIManager.I.angleNumber;
    }
    /**绘制0号玩家的倒计时*/
    DarwTime0() {
        GameSceneUIManager.I.otherPlayerTime1.node.active = false;
        GameSceneUIManager.I.otherPlayerTime2.node.active = false;
        GameSceneUIManager.I.otherPlayerTime3.node.active = false;
        GameSceneUIManager.I.playerTime.node.active = true;

        GameSceneUIManager.I.otherPlayerLight1.active = false;
        GameSceneUIManager.I.otherPlayerLight2.active = false;
        GameSceneUIManager.I.otherPlayerLight3.active = false;
        GameSceneUIManager.I.playerLight.active = true;

        GameSceneUIManager.I.angleNumber -= 1 / (UNOMatching.GameConfig.turn_duration * 10)
        if (GameSceneUIManager.I.angleNumber <= 0.3) {
            GameSceneUIManager.I.playerTime.node.color = new cc.Color(255, 52, 52, 127);
        } else {
            GameSceneUIManager.I.playerTime.node.color = new cc.Color(58, 255, 52, 127);
        }
        if (GameSceneUIManager.I.angleNumber <= 0)
            GameSceneUIManager.I.angleNumber = 0;
        GameSceneUIManager.I.playerTime.fillRange = GameSceneUIManager.I.angleNumber;
    }

    CloseAllChallenge() {
        this.challenge0.active = false;
        this.challenge1.active = false;
        this.challenge2.active = false;
        this.challenge3.active = false;
    }
    CloseChallenge(challenge: cc.Node, auto: boolean = false) {
        challenge.active = true;
        if (auto) {
            this.scheduleOnce(() => {
                challenge.active = false;
            }, 2.5);
        }
    }
    /**显示质疑的弹框*/
    ShowChooesAdd4Tip(color) {
        this.Add4TipPopup.position = new cc.Vec3(0, 0, 0);
        let c = ""
        let colorstr = ""
        switch (color) {
            case 'red':
                c = "#E30000"
                colorstr = LanguageManager.GetType().add4_tip_red ? LanguageManager.GetType().add4_tip_red : LanguageManager.enLangJson.add4_tip_red;
                break;
            case 'yellow':
                c = "#FFA100"
                colorstr = LanguageManager.GetType().add4_tip_yellow ? LanguageManager.GetType().add4_tip_yellow : LanguageManager.enLangJson.add4_tip_yellow;
                break;
            case 'blue':
                c = "#1671FF"
                colorstr = LanguageManager.GetType().add4_tip_blue ? LanguageManager.GetType().add4_tip_blue : LanguageManager.enLangJson.add4_tip_blue;
                break;
            case 'green':
                c = "#009B28"
                colorstr = LanguageManager.GetType().add4_tip_green ? LanguageManager.GetType().add4_tip_green : LanguageManager.enLangJson.add4_tip_green;
                break;
            default:
                break;
        }
        const add4Tip1 = LanguageManager.GetType().add4_tip1 ? LanguageManager.GetType().add4_tip1 : LanguageManager.enLangJson.add4_tip1;
        const add4Tip2 = LanguageManager.GetType().add4_tip2 ? LanguageManager.GetType().add4_tip2 : LanguageManager.enLangJson.add4_tip2;
        this.add4TipRichText.string = add4Tip1 + "<color=" + c + ">" + colorstr + " </color>" + add4Tip2;
        // let bg = this.Add4TipPopup.getChildByName("TipBG");
        // bg.position = new cc.Vec3(0, -1300, 0);
        // console.log("显示Draw4弹窗");
        this.Add4TipPopup.active = true;
        // let target = new cc.Vec3(0, 0, 0);
        // cc.tween(bg).to(0.35, { position: target }).start();
    }
    /**关闭质疑的弹框*/
    public CloseChooesAdd4Tip() {
        let bg = GameSceneUIManager.I.Add4TipPopup.getChildByName("TipBG");
        // let target = new cc.Vec3(0, -1300, 0);
        // cc.tween(bg).to(0.35, { position: target }).call(() => {
        // console.log("关闭Draw4弹窗");
        GameSceneUIManager.I.Add4TipPopup.active = false;
        // }).start();
    }
    timeIndex = 300;

    /** 展示抽牌动画 */
    playDrawAnimation() {
        const arrNode = this.arr;
        // cc.tween(this.arr).stop();

        const posStart: number = this.viewResolution.height / 2 - 32;
        const posCenter: number = this.viewResolution.height / 2 - 70;
        const posEnd: number = this.viewResolution.height / 2 - 107;
        cc.tween(this.arr).stop();
        this.arr.setPosition(cc.v2(this.arr.x,posStart));

        cc.tween(this.arr).to(0.3,{y: posCenter}).delay(0.1).to(0.2,{y: posEnd}).union().repeatForever().start();

    }

    TimeStart() {
        this.RestTime(UNOMatching.GameConfig.time_limit);
        this.SetTime();
        this.schedule(this.CreateTime, 1)
    }

    UpdateCountdown(time: number) {
        this.TimeEnd();
        this.RestTime(time);
        this.SetTime();

        this.schedule(this.CreateTime,1);
    }

    CreateTime() {
        if (this.timeIndex <= 30) {
            this.gameTimeRedBG.active = true;
        }
        if (this.timeIndex > 0)
            this.timeIndex--;
        else
            this.timeIndex = 0;
        this.SetTime();
        // this.GameTime.string = this.timeIndex + "";
    }
    TimeEnd() {
        this.unschedule(this.CreateTime);
    }
    RestTime(num) {
        this.timeIndex = num;
        this.SetTime();
    }
    SetTime() {
        if (this.timeIndex >= 0) {
            let m: number = 0;
            let mm: string = "";
            let s: number = 0;
            let ss: string = "";
            m = Math.floor(this.timeIndex / 60)
            s = this.timeIndex % 60;
            if (m < 10) {
                mm = "0" + m;
            } else {
                mm = m + "";
            }
            if (s < 10) {
                ss = "0" + s;
            } else {
                ss = s + "";
            }
            this.GameTime.string = mm + ":" + ss;
            this.GameTimeTop.string = mm + ":" + ss;
        } else {
            this.GameTime.string = "00:00";
            this.GameTimeTop.string = "00:00";
        }
    }


}