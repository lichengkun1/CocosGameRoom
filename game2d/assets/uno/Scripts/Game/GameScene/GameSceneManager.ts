
import { debugLog, getUrlParameterValue, usernameSlice } from "../../../../Script/common/utils/util";
import MessageData from "../../../../Script/CommonScripts/Utils/MessageData";
import MyEvent from "../../../../Script/CommonScripts/Utils/MyEvent";
import ResourcesManager from "../../../../Script/CommonScripts/Utils/ResourcesManager";
import FrameImageController from "../../../../Script/FrameImageComponent/FrameImageController";
import FrameImageManager from "../../../../Script/FrameImageComponent/FrameImageManager";
import { GameData } from "../../Common/Game/GameData";
import Pool from "../../Common/Pool/Pool";
import { PopupManager } from "../../Common/Popup/PopupManager";
import { GetServerData } from "../../Common/Server/GetServerData";
import SoundManager from "../../Common/Sound/SoundManager";
import GlobalGameData, { GamePlayerCount, PlayerInfo } from "../../GlobalGameData";
import Player from "../../Players/Player";
import PlayerManager from "../../Players/PlayerManager";
import Card from "../Card/Card";
import CardEffectManager from "../Card/CardEffectManager";
import CardManager, { CardColor, CardType } from "../Card/CardManager";
import Socket from "../Socket/Socket";
import GameSceneUIManager from "./GameSceneUIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSceneManager extends cc.Component {
    public static I: GameSceneManager;

    public static IsShowSettlement: boolean = false;

    public thisRoundPlayerUID: number;
    /** 出牌的数量 */
    public OutCardNumber: number;
    public isGameStart = true;

    @property(cc.SpriteFrame)
    centerImages: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    centerImage: cc.Sprite = null;
    @property(cc.Node)
    pointEffect: cc.Node = null;
    onLoad() {
        // this.adapterGame();
        const bgNode = cc.find("Canvas/bg");
        const vcode = getUrlParameterValue('vcode');
        if((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200)) {
            bgNode.active = true;
        } else {
            bgNode.active = false;
        }
        GameSceneManager.I = this.node.getComponent(GameSceneManager);
        this.isGameStart = true;
    }

    onEnable() {
        GetServerData.GameStart();
        this.InitHeadImageAndNamePlay();
        this.StartGame();

        MyEvent.I.on('replayMusic',this.replayMusic,this.node);
    }

    protected onDisable(): void {
        MyEvent.I.remove('replayMusic',this.replayMusic);
    }

    replayMusic() {
        console.log('replayMusic audioSourceVolume is ',SoundManager.isAudioOn);
        if(cc.sys.isBrowser && cc.sys.os == cc.sys.OS_IOS && SoundManager.isAudioOn) {
            console.log('重新播放音频');
            SoundManager.pauseMusic();
            SoundManager.resumeMusic();
        }
    }

    StartGame() {
        this.StartGameInCards();
        console.log('开始游戏的消息是：',GameData.message.data);
        this.StartRound(GameData.message.data.player_now);
        // 更新倒计时
        GameSceneUIManager.I.UpdateCountdown(GameData.message.data.countdown_duration);
        this.scheduleOnce(() => {
            this.StartGameFirstOutCard(GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1]);
        }, 2);
    }
    /**设置玩家的头像和名字 */
    private InitHeadImageAndNamePlay() {
        let frameImageUids = [];
        let idIndex = 0;
        let index = 0;
        if(!GlobalGameData.isGod) {
            let thisplayerindex = this.ThisPlayerIndex();
            debugLog('thisPlayerIndex is ',thisplayerindex);
            const thisPlayer = GameData.message.data.players[thisplayerindex];
            let thisplayer = PlayerManager.GetPlayer(thisPlayer.id);
            console.log("++++++++++++++++++++++++++++++++++++++++++\n", 0, thisplayer);
    
            // GameSceneUIManager.I.playerNode
            GameSceneUIManager.I.cards0.active = false;
            thisplayer.id = 0
            thisplayer.headImage = GameSceneUIManager.I.playerNode.headImage;
            thisplayer.userName = GameSceneUIManager.I.playerNode.nameNode;
            thisplayer.UNO = GameSceneUIManager.I.playerNode.UNO;
            thisplayer.rankNode = GameSceneUIManager.I.playerNode.rank;
            thisplayer.abandonNode = GameSceneUIManager.I.playerNode.abandon;
            thisplayer.challengeNode = GameSceneUIManager.I.playerNode.challenge;
            thisplayer.challengeLabel = thisplayer.challengeNode.getChildByName("label").getComponent(cc.Label);
            thisplayer.offlineNode = GameSceneUIManager.I.otherPlayerNode[0].offlineIcon;
            
            // thisplayer.headImage.node.off(cc.Node.EventType.TOUCH_START);
            // thisplayer.headImage.node.on(cc.Node.EventType.TOUCH_START, () => {
            //     FrameImageManager.ShowUserDataCard(GameSceneUIManager.I.canvas, thisplayer.user_id, PlayerManager.thisPlayer_user_id);
            // })
    
            frameImageUids.push(thisplayer.user_id);
            if (!thisplayer.user_headImage) {
                ResourcesManager.loadHeadImag(thisplayer.user_avatar, thisplayer.user_id, 3, (res: cc.Texture2D) => {
                    res.packable = false;
                    let HeadImage = new cc.SpriteFrame(res);
                    thisplayer.user_headImage = HeadImage;
                    thisplayer.headImage.spriteFrame = thisplayer.user_headImage;
                });
            } else {
                thisplayer.headImage.spriteFrame = thisplayer.user_headImage;
            }
            thisplayer.userName.string = usernameSlice(thisplayer.user_name,8);
            index = GlobalGameData.isGod ? 0 : thisplayerindex + 1;

            idIndex = GlobalGameData.isGod ? 0 : idIndex + 1;
        const playersData = GameData.message.data.players;

        let isTwo = playersData.filter(item => item.id).length == 2;
        let isThree = playersData.filter(item => item.id).length == 3;
        
        if(isTwo) {
            GlobalGameData.playerCount = GamePlayerCount.TWO;
            // 两人局过滤掉无效用户 位置排到对面
            let twoPlayers = playersData.filter(item => item.id);
            debugLog('自己用户的id: ',MessageData.userId);
            let otherPlayer = twoPlayers.find(item => item.id != MessageData.userId);

            let inx = 0;
            playersData.forEach((it,ix) => {
                if(it.id == otherPlayer.id) {
                    inx = ix;
                }
            });
            this.SetOtherPlayerData(inx,2,frameImageUids);
        } else if(isThree) {
            GlobalGameData.playerCount = GamePlayerCount.THREE;
            let threePlayers = playersData.filter(item => item.id);
            while (true) {
                if (index == thisplayerindex || idIndex > 2) {
                    break;
                }
                if (index > threePlayers.length - 1) {
                    index = 0;
                }
                this.SetOtherPlayerData(index, idIndex, frameImageUids);
                // } else {
                //     player.headImage.spriteFrame = player.user_headImage;
                //     player.userName.string = player.user_name;
                // }
                idIndex++;
                index++;
            }
        } else {
            GlobalGameData.playerCount = GamePlayerCount.FOUR;
            while (true) {
                if (index == thisplayerindex || idIndex > 3) {
                    break;
                }
                if (index > playersData.length - 1) {
                    index = 0;
                }
                this.SetOtherPlayerData(index, idIndex, frameImageUids);
                // } else {
                //     player.headImage.spriteFrame = player.user_headImage;
                //     player.userName.string = player.user_name;
                // }
                idIndex++;
                index++;
            }
        }
        } else {
            this.initPlayersWithGodMode(GameData.message.data.players as PlayerInfo[],frameImageUids);
        }
        
        // VoiceManager.voiceController.Init(frameImageUids);
        FrameImageController.I.SetAllUsersFrame(frameImageUids);
    }

    /** 上帝模式下初始化玩家信息 */
    private initPlayersWithGodMode(players: PlayerInfo[],frameUids: number[]) {
        GameSceneUIManager.I.cards0.active = true;
        if(GlobalGameData.playerCount == GamePlayerCount.TWO) {
            this.SetOtherPlayerData(0,0,frameUids);
            this.SetOtherPlayerData(1,2,frameUids);


        } else {
            for(let i = 0; i < players.length; i++) {
                this.SetOtherPlayerData(i,i,frameUids);
            }
        }
    }

    private SetOtherPlayerData(index: number, idIndex: number, frameImageUids: number[]) {
        const element = GameData.message.data.players[index];
        let player = PlayerManager.GetPlayer(element.id);
        if(!player) return;

        player.id = idIndex;
        player.headImage = GameSceneUIManager.I.otherPlayerNode[idIndex].headImage;
        player.userName = GameSceneUIManager.I.otherPlayerNode[idIndex].nameNode;
        player.cardStack = GameSceneUIManager.I.otherPlayerNode[idIndex].cards;
        player.cardNumberNode = GameSceneUIManager.I.otherPlayerNode[idIndex].number;
        player.UNO = GameSceneUIManager.I.otherPlayerNode[idIndex].UNO;
        player.rankNode = GameSceneUIManager.I.otherPlayerNode[idIndex].rank;
        player.abandonNode = GameSceneUIManager.I.otherPlayerNode[idIndex].abandon;
        player.challengeNode = GameSceneUIManager.I.otherPlayerNode[idIndex].challenge;
        player.challengeLabel = player.challengeNode.getChildByName("label").getComponent(cc.Label);
        player.headImage.node.off(cc.Node.EventType.TOUCH_START);
        player.headImage.node.on(cc.Node.EventType.TOUCH_START, () => {
            FrameImageManager.ShowUserDataCard(GameSceneUIManager.I.canvas, player.user_id, PlayerManager.thisPlayer_user_id);
        })
        player.offlineNode = GameSceneUIManager.I.otherPlayerNode[idIndex].offlineIcon;
        frameImageUids.push(player.user_id);
        console.log("frameImageUids++++++++", frameImageUids);

        // if (!player.user_headImage) {
        ResourcesManager.loadHeadImag(player.user_avatar, player.user_id, 3, (res: cc.Texture2D) => {
            console.log('请求到headImage',index,idIndex);
            res.packable = false;
            let HeadImage = new cc.SpriteFrame(res);
            PlayerManager.GetPlayer(player.user_id).user_headImage = HeadImage;
            PlayerManager.GetPlayer(player.user_id).headImage.spriteFrame = PlayerManager.GetPlayer(player.user_id).user_headImage;
        });
        player.userName.string = usernameSlice(player.user_name,8);

        console.log("++++++++++++++++++++++++++++++++++++++++++\n", index, player, GameSceneUIManager.I.otherPlayerNode[idIndex].headImage);

    }

    /**设置玩家座位编号 */
    private ThisPlayerIndex() {
        debugLog('thisPlayerId is ',PlayerManager.thisPlayer_user_id);
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if (element.id == PlayerManager.thisPlayer_user_id) {
                return i;
            }
        }
    }

    /**开始游戏第一次发牌 */
    public StartGameInCards() {
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if (element.id == PlayerManager.thisPlayer_user_id) {
                this.ThisPlayerInCards(element.poker_remain);
            }
            else {
                this.InCards(element.id, element.poker_remain_count);
            }
        }
    }

    /**开始游戏第一张出牌 */
    public StartGameFirstOutCard(cardid: number) {
        // let cardNode = cc.instantiate(GameSceneUIManager.I.faceCard);
        SoundManager.PlaySource("play")
        let cardNode = cc.instantiate(CardManager.I.CardPrefab);
        cardNode.getChildByName("cardBack").active = false;
        // let cardNode = Pool.GetNodeInstanceFromPool("AllCards", GameSceneUIManager.I.faceCard);
        let card = cardNode.getComponent(Card)
        card.CreateCard(cardid);
        cardNode.scale = 0.6;
        GameSceneUIManager.I.faceCardParent.addChild(cardNode);
        cardNode.position = new cc.Vec3(-500, 0, 0);
        cardNode.scale = GlobalGameData.RoomSigleScale.outCardStartScale[GlobalGameData.roomType];
        let pos = GameSceneUIManager.I.faceCardPos.position;
        let time = 0.5;
        let rot = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 20;
        cc.tween(cardNode)
            .to(time, { position: pos, scale: GlobalGameData.RoomSigleScale.outPockScale[GlobalGameData.roomType], angle: rot })
            // .parallel(cc.tween(cardNode)
            //     .to(time / 2, { scale: 1.2 })
            //     .start())
            // .parallel(cc.tween(cardNode)
            //     .to(time, { angle: rot })
            //     .start())
            .start()
            .call(() => {
                CardEffectManager.I.PlayAnimation(cardid);
            });
        if (GameSceneUIManager.I.faceCardParent.childrenCount >= 10) {
            GameSceneUIManager.I.faceCardParent.children[0].destroy();
        }
    }

    /**其他玩家摸牌 */
    public InCards(user_id: number, cardsNum: number) {
        console.log("其他玩家摸牌，生成了一张牌: 玩家id:",user_id);
        this.schedule(() => {
            SoundManager.PlaySource("draw")
            let player = PlayerManager.GetPlayer(user_id);
            let card = Pool.GetNodeInstanceFromPool("CardsStack", GameSceneUIManager.I.backCard);
            
            card.active = true;
            card.scale = 1;
            // let card = cc.instantiate(GameSceneUIManager.I.backCard);
            if (GameSceneUIManager.I.backCardParent.children.indexOf(card) < 0)
                GameSceneUIManager.I.backCardParent.addChild(card);
            card.position = GameSceneUIManager.I.backCardPos.position;
            let pos = new cc.Vec3(player.headImage.node.position.x, player.headImage.node.position.y, player.headImage.node.position.z);
            let time = 0.4;
            if (player.id == 0) time = 1;
            if (player.id == 1) time = 0.3;
            if (player.id == 2) time = 0.3;
            if (player.id == 3) time = 0.5;
            cc.tween(card)
                .to(time, { position: pos, scale: 0.4 })
                // .parallel(cc.tween(card)
                //     .delay(time / 2)
                //     .to(time / 2, { scale: 0.4 })
                //     .start())
                .start();
            this.scheduleOnce(() => {
                card.active = false;
            }, (time + 0.05));
            // card.getComponent(cc.Animation).play("ToOther" + player.id);
        }, 0.2, cardsNum - 1);
    }
    /**其他玩家出牌 */
    public OutCards(user_id: number, cardid: number, cardColor: CardColor) {
        SoundManager.PlaySource("play")
        let player = PlayerManager.GetPlayer(user_id);
        // let cardNode = cc.instantiate(GameSceneUIManager.I.faceCard);
        let cardNode = cc.instantiate(CardManager.I.CardPrefab);
        console.log("其他玩家出牌，生成了一张牌");
        cardNode.getChildByName("cardBack").active = false;
        // let cardNode = Pool.GetNodeInstanceFromPool("AllCards", GameSceneUIManager.I.faceCard);
        let card = cardNode.getComponent(Card)
        card.CreateCard(cardid);
        cardNode.scale = 0.6;
        GameSceneUIManager.I.faceCardParent.addChild(cardNode);
        cardNode.position = new cc.Vec3(player.headImage.node.position.x, player.headImage.node.position.y, player.headImage.node.position.z);
        cardNode.scale = GlobalGameData.RoomSigleScale.outCardStartScale[GlobalGameData.roomType];
        let pos = GameSceneUIManager.I.faceCardPos.position;
        let time = 0.5;
        if (player.id == 0) time = 1;
        if (player.id == 1) time = 0.5;
        if (player.id == 2) time = 0.5;
        if (player.id == 3) time = 0.75;
        let rot = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 20;
        cc.tween(cardNode)
            .to(time, { position: pos, scale: GlobalGameData.RoomSigleScale.outPockScale[GlobalGameData.roomType], angle: rot })
            // .parallel(cc.tween(cardNode)
            //     .to(time / 2, { scale: 1.2 })
            //     .start())
            // .parallel(cc.tween(cardNode)
            //     .to(time, { angle: rot })
            //     .start())
            .call(() => {
                CardEffectManager.I.OtherPlayAnimation(cardid, cardColor);
            })
            .start();
        if (GameSceneUIManager.I.faceCardParent.childrenCount >= 10) {
            GameSceneUIManager.I.faceCardParent.children[0].destroy();
        }
    }
    /**玩家摸牌 */
    public ThisPlayerInCards(cardId: number[]) {
        //= Math.floor(Math.random() * 108)
        let index: number = 0;
        let cardid: number = 0;
        this.schedule(() => {
            SoundManager.PlaySource("draw")
            let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
            for (let i = 0; i < player.cards.length; i++) {
                const element = player.cards[i];
                if (element.cardid == cardId[cardid]) {
                    debugLog("已经有了相同的牌");
                    return;
                }
            }
            let cardNode = cc.instantiate(CardManager.I.CardPrefab);
            console.log("玩家摸牌，生成了一张牌");
            // let cardNode = Pool.GetNodeInstanceFromPool("ThisPlayerCard", CardManager.I.CardPrefab);
            let card = cardNode.getComponent(Card);
            card.CreateCard(cardId[cardid]);
            cardNode.active = true;
            cardNode.scale = GlobalGameData.RoomSigleScale.selfPockScale[GlobalGameData.roomType];
            card.node.zIndex = 2;
            if (GameSceneUIManager.I.ThisPlayerCardsParent.children.indexOf(cardNode) < 0) {
                GameSceneUIManager.I.ThisPlayerCardsParent.addChild(cardNode);
            }
            cardNode.position = GameSceneUIManager.I.backCardPos.position;
            // 目的坐标
            let pos = GameSceneUIManager.I.ThisPlayerCardsPos1.position;
            let time = 0.5;
            cardid++;

            player.cards.push(card);
            card.FlopAnimation();
            cc.tween(cardNode)
                .to(time, { position: pos })
                .start();
            this.scheduleOnce(() => {
                index++;
                if (cardId.length <= index) {
                    if (GameSceneManager.I.isGameStart) {
                        GameSceneManager.I.isGameStart = false;
                        Socket.FirstSocket();
                    }
                    this.CreateTargetPos(player);
                }
            }, (time + 0.05));

        }, 0.2, cardId.length - 1);
    }

    outCard: Card;
    /**玩家出牌 */
    public ThisPlayerOutCards(card: Card) {
        if (card.isCardHightLight) {
            GameSceneManager.I.OutCardNumber = 1;
            GetServerData.PlayCard(card,
                () => {
                    // GameSceneManager.I.CleanHightLight();
                    console.log('得到玩家出牌的响应消息出牌成功,outCardNumber = 1');
                    GameSceneManager.I.OutCardNumber = 0;
                    SoundManager.PlaySource("play");
                },
                () => {
                    GameSceneManager.I.OutCardNumber = 0
                    GameSceneManager.I.CreateTargetPos(PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id));
                });
            return;
        } else {
            GameSceneManager.I.OutCardNumber = 0
            GameSceneManager.I.CreateTargetPos(PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id));
        }

    }

    /**当前玩家出牌的动画 根据卡牌ID来判定选择 */
    public ThiPlayerOutCardsForID(cardId: number) {
        console.log("当前玩家出牌,");
        let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
        let card = null;
        for (let i = 0; i < player.cards.length; i++) {
            const element = player.cards[i];
            if (element.cardid == cardId) {
                card = element;
                break;
            }
        }
        if (!card) {
            console.error("没有ID为：", cardId, " 的手牌");
            return;
        }
        this.CleanHightLight();
        let index = player.cards.indexOf(card);
        if (index < 0) {
            console.log('没有对应出的牌');
            return
        }
        player.cards.splice(index, 1);

        let pos = new cc.Vec3(GameSceneUIManager.I.faceCardPos.x, GameSceneUIManager.I.faceCardPos.y, 0);
        let rot = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 20;
        card.node.scale = GlobalGameData.RoomSigleScale.outCardStartScale[GlobalGameData.roomType];
        card.node.parent = GameSceneUIManager.I.faceCardParent;

        cc.tween(card.node)
            .stop()
            .to(0.5, { position: pos, scale: GlobalGameData.RoomSigleScale.outPockScale[GlobalGameData.roomType], angle: rot })
            .start();
        this.scheduleOnce(() => {
            card.node.zIndex = 0;
            this.CreateTargetPos(player);
            CardEffectManager.I.OtherPlayAnimation(card.cardid);
        }, 0.55);
        if (GameSceneUIManager.I.faceCardParent.childrenCount >= 10) {
            GameSceneUIManager.I.faceCardParent.children[0].destroy();
        }

    }

    /**玩家的手牌根据cardid高亮 */
    public CardHightLight(color?: CardColor, num?: number) {
        let type: CardType;
        let nowCardId = GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1];
        if (color && num) {

        } else {
            //最新的一张牌
            //当前牌的颜色
            color = CardManager.I.GetCardColor(GameData.message.data.color);
            //最后一张牌的号码
            num = CardManager.I.GetCardNumber(nowCardId);
        }
        console.log(`牌堆里最后一张牌是${num},颜色：${color}`);
        type = CardManager.I.GetCardType(nowCardId);
        let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
        for (let i = 0; i < player.cards.length; i++) {
            const ele = player.cards[i];
            let eleData = CardManager.I.GetCardData(ele.cardid);
            console.log(`手里牌的颜色：${eleData.color},类型：${eleData.type} 数字：${eleData.num}`);
            if (eleData.color == color || (eleData.type != CardType.number && eleData.type == type) || (eleData.num != -1 && eleData.num == num) || eleData.color == CardColor.black) {
                ele.ShowHighlight();
            } else {
                ele.CloseHighlight();
            }
        }
    }

    public DrawCard() {
        if(GlobalGameData.isGod) return;

        console.log('摸了一张牌');
        /** 发送摸牌请求，通过socket发送自己要做的事情是摸牌 */
        GetServerData.DrawCard();
        GameSceneUIManager.I.arr.active = false;
        GameSceneUIManager.I.DrawCard.active = false;
    }


    /**
     * 根据传入的userid 来开始回合 绘制对应的玩家时间 和 将光效移动到制定的位置
     * 某个玩家的回合开始 根据user_id来判定
     * @param  {number} userID
     */
    StartRound(userID: number) {
        /** 如果两个人的时候进行对面排列 */
        let player = PlayerManager.GetPlayer(userID);
        this.thisRoundPlayerUID = userID;
        console.log("StartRound", userID);
        if(!player) return;

        if (player.id == 1) {
            GameSceneUIManager.I.angleNumber = 1;
            let target = (GameSceneUIManager.I.otherPlayerNode[1].headImage.node as cc.Node).position
            cc.tween(this.pointEffect).to(1, { position: target }).start()
            this.schedule(GameSceneUIManager.I.DarwTime1, 0.1, cc.macro.REPEAT_FOREVER)
        } else if (player.id == 2) {
            GameSceneUIManager.I.angleNumber = 1;
            let target = (GameSceneUIManager.I.otherPlayerNode[2].headImage.node as cc.Node).position
            cc.tween(this.pointEffect).to(1, { position: target }).start()
            this.schedule(GameSceneUIManager.I.DarwTime2, 0.1, cc.macro.REPEAT_FOREVER)

        } else if (player.id == 3) {
            GameSceneUIManager.I.angleNumber = 1;
            let target = (GameSceneUIManager.I.otherPlayerNode[3].headImage.node as cc.Node).position
            cc.tween(this.pointEffect).to(1, { position: target }).start()
            this.schedule(GameSceneUIManager.I.DarwTime3, 0.1, cc.macro.REPEAT_FOREVER)
        } else if (player.id == 0) {
            console.log('$$$$$新的回合 玩家出牌的数量重置为0');
            GameSceneUIManager.I.angleNumber = 1;
            GameSceneManager.I.OutCardNumber = 0;
            let target = (GameSceneUIManager.I.playerNode.headImage.node as cc.Node).position
            cc.tween(this.pointEffect).to(1, { position: target }).start()
            this.schedule(GameSceneUIManager.I.DarwTime0, 0.1, cc.macro.REPEAT_FOREVER)
        }
    }

    /**
     * 回合结束
     * 回收计时器
     */
    EndRound() {
        this.unschedule(GameSceneUIManager.I.DarwTime1)
        this.unschedule(GameSceneUIManager.I.DarwTime2)
        this.unschedule(GameSceneUIManager.I.DarwTime3)
        this.unschedule(GameSceneUIManager.I.DarwTime0)
    }

    ChooseAdd4() {
        GetServerData.Draw4Card(GameSceneUIManager.I.CloseChooesAdd4Tip);
    }
    ChooseAdd6() {
        GetServerData.Draw6Card(GameSceneUIManager.I.CloseChooesAdd4Tip);
    }

    lastCenterImageColor: string = ""
    ChangeCenterImageColor() {
        if (GameData.message.data.color != this.lastCenterImageColor) {
            switch (GameData.message.data.color) {
                case 'red':
                    this.lastCenterImageColor = 'red';
                    this.centerImage.spriteFrame = this.centerImages[0];
                    break;
                case 'yellow':
                    this.lastCenterImageColor = 'yellow';
                    this.centerImage.spriteFrame = this.centerImages[1];
                    break;
                case 'blue':
                    this.lastCenterImageColor = 'blue';
                    this.centerImage.spriteFrame = this.centerImages[2];
                    break;
                case 'green':
                    this.lastCenterImageColor = 'green';
                    this.centerImage.spriteFrame = this.centerImages[3];
                    break;
                default:
                    break;
            }
        }
    }

    /**玩家的手牌清除高亮 */
    public CleanHightLight() {
        if(GlobalGameData.isGod) return;
        let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
        for (let i = 0; i < player.cards.length; i++) {
            const ele = player.cards[i];
            ele.CloseHighlight();
        }
    }

    /**旋转 是否是顺时针(正旋)true正旋 false反旋 */
    // public ChanageRotate(isClockwise: boolean = true) {
    //     this.isClockwise = isClockwise;
    // }
    //计算摸牌时卡牌的目标位置
    public CreateTargetPos(player: Player) {
        // this.scheduleOnce(() => {
        player.cards = CardManager.I.setIndex(player, player.cards);
        let cardsPos: cc.Vec3[] = CardManager.I.setCardPos(player, player.cards);
        for (let i = 0; i < cardsPos.length; i++) {
            this.CardMove(cardsPos, i, player);
        }
        // }, 0.2)
        if (GameData.message.data.player_now == PlayerManager.thisPlayer_user_id) {
            this.CardHightLight();
        }
    }
    //单个卡片的Tween动画
    private CardMove(cardsPos: cc.Vec3[], i: number, player: Player) {
        const lerp = cardsPos[i];
        const target = cc.v3(cardsPos[i].x,cardsPos[i].y,0);
        const element = player.cards[i];
        cc.tween(element.node).stop().to(0.3, { position: target , angle: cardsPos[i].z}).start();

    }

    private isClockwise = true;
    update() {
        const scaleNum = GlobalGameData.RoomSigleScale.centerRotate[GlobalGameData.roomType];
        GameSceneUIManager.I.CenterBG.scaleY = scaleNum;

        if (GameData.message.data.order == "asc") {
            // 顺时针旋转
            GameSceneUIManager.I.CenterBG.scaleX = -scaleNum;
            GameSceneUIManager.I.CenterBG.angle--;
        } else {
            GameSceneUIManager.I.CenterBG.scaleX = scaleNum;
            GameSceneUIManager.I.CenterBG.angle++;
        }

    }
    static UpdateTime = 0;
    /**
     * 更新游戏数据
     * @param  {} num=1 更新数据延迟的时间
     */
    public UpDateGameData(num = 1) {

        const updateOtherPlayerPokerNumber = () => {
            const gameInfo = GameData.gameInfo;
            
            const userfulPlayers = gameInfo.players.filter(item => item.id);

            for(let userItem of userfulPlayers) {
                if(userItem.id == PlayerManager.thisPlayer_user_id) continue;
                const poker_remain_count = userItem.poker_remain_count;
                // 找到对应的用户数据
                const targetPlayer = PlayerManager.GetPlayer(userItem.id);
                targetPlayer && (targetPlayer.cardNumberNode.string = poker_remain_count.toString());
            }
        }
        this.scheduleOnce(() => {
            GameSceneManager.UpdateTime = 1;
            console.log("更新游戏数据",GameData.gameInfo);
            if(!GlobalGameData.isGod) {
                let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
                let playerData = this.GetPlayerDataInGameInfo(PlayerManager.thisPlayer_user_id);
                if(!playerData) {
                    console.log('获取游戏信息失败');
                    return;
                }
                console.log("更新游戏数据2",GameData.gameInfo);
                console.log('new pokers -> ',playerData.poker_remain);
                console.log('player cards is ',player.cards.map(item => item.cardid));

                // 防止边移除数组中的元素边访问数组元素的情况发生
                let outPokerIds = [];
                
                for(let i = 0; i < player.cards.length; i++) {
                    const lastPoker = player.cards[i].cardid;
                    let index = playerData.poker_remain.indexOf(lastPoker);
                    if(index < 0) {
                        outPokerIds.indexOf(lastPoker) < 0 && outPokerIds.push(lastPoker);
                    }
                }
                console.log('打牌动画',outPokerIds);

                for(let i = 0; i < outPokerIds.length; i++) {
                    let pokerId = outPokerIds[i];
                    this.ThiPlayerOutCardsForID(pokerId);
                }
                    
                let cardArr: number[] = []
                for (let i = 0; i < playerData.poker_remain.length; i++) {
                    let hasCard = this.IsSameCardInPlayerCard(player, playerData.poker_remain[i]);
                    if (!hasCard) {
                        /** 玩家手里没有对应的牌 */
                        cardArr.push(playerData.poker_remain[i]);
                    }
                }
                console.log("摸牌动画",cardArr);

                if (cardArr.length > 0) {
                    this.ThisPlayerInCards(cardArr);
                }
                // todo 更新其他玩家的牌的个数
                updateOtherPlayerPokerNumber();
                // todo 更新牌堆里面的牌

            } else {
                // todo 更新牌场上所有玩家的牌的数量
                updateOtherPlayerPokerNumber();
            }

            // 更新时间
            GameData.gameInfo.status == 'playing' && GameSceneUIManager.I.UpdateCountdown(GameData.gameInfo.countdown_duration);

            if (!GameSceneManager.IsShowSettlement) {
                if (GameData.gameInfo.status == "completed") {
                    GameData.message.data = GameData.gameInfo as any;
                    if (GameData.gameInfo.stop_reason == "timeout") {
                        SoundManager.PlaySource("TimeOut");
                        GameSceneUIManager.I.TimeOutAnimation(() => {
                            CardEffectManager.I.PlayWin();
                        });
                    } else {
                        CardEffectManager.I.PlayWin();
                    }
                }
            }
        }, num);
    }
    
    /**
     * 玩家手里有没有对应的cardid的牌
     * @param  {Player} player 玩家对象
     * @param  {number} cardid
     */
    IsSameCardInPlayerCard(player: Player, cardid: number) {
        for (let i = 0; i < player.cards.length; i++) {
            const element = player.cards[i];
            if (element.cardid == cardid) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据传入的id获得玩家对象
     * @param  {number} user_id 用户id
     */
    GetPlayerDataInGameInfo(user_id) {
        if(!GameData.gameInfo.players) return;

        for (let i = 0; i < GameData.gameInfo.players.length; i++) {
            const element = GameData.gameInfo.players[i];
            if (element.id == user_id) {
                return element;
            }
        }
        return null;
    }

    Agent() {
        // 取消代理
        GetServerData.Agent(() => {
            GameSceneUIManager.I.iconRobot.active = false;
            GameSceneUIManager.I.iconRobotbg.active = false;
        }, () => {
            console.log("Agent___err");
        })
    }

    ShowRulePopup() {
        PopupManager.ShowPopup("RulePopup");
    }
}
