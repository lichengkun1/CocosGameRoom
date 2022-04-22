import Message from "../../../../Script/CommonScripts/Utils/Message";
import MessageType from "../../../../Script/CommonScripts/Utils/MessageType";
import MyEvent from "../../../../Script/CommonScripts/Utils/MyEvent";
import FrameImageManager from "../../../../Script/FrameImageComponent/FrameImageManager";
import { GameData } from "../../Common/Game/GameData";
import { LanguageManager } from "../../Common/Language/LanguageManager";
import AndroidGoback from "../../Common/Server/AndroidGoback";
import { GetServerData } from "../../Common/Server/GetServerData";
import SoundManager from "../../Common/Sound/SoundManager";
import GlobalGameData, { GamePlayerCount, RoomType } from "../../GlobalGameData";
import UNOMatching from "../../Match/uno_Matching";
import PlayerManager from "../../Players/PlayerManager";
import CardEffectManager from "../Card/CardEffectManager";
import CardManager, { CardColor, CardType } from "../Card/CardManager";
import GameSceneManager from "../GameScene/GameSceneManager";
import GameSceneUIManager from "../GameScene/GameSceneUIManager";

export default class Socket {
    static IsFirst = true;
    static IsAddEvent = false;
    static IsRobot: boolean = false;
    static node: cc.Node = new cc.Node();
    /**初始化Socket 注册监听事件 */
    static Init() {
        // VoiceSocket.Init();
        if (!this.IsAddEvent) {
            MyEvent.I.on('emit_message', this.messageFunc.bind(this), this.node);
            MyEvent.I.on(MessageType.MESSAGE_REQUEST_WS_STATUS,this.responseFunc.bind(this),this.node);
            this.IsAddEvent = true;
        }
    }


    static responseFunc(data) {
        Socket.ResponseWsStatus(data);
    }

    static messageFunc(data) {
        if(data.data.method === 'emoji_on_mic') {
            this.dealEmojiSocket(data);
            return;
        }
        if (data.data.method != "uno_play") return;
        if(GlobalGameData.roomType === RoomType.SINGLE) {
            GlobalGameData.roomId = data.data.data.source_id;
        }

        let playerCount = GameData.message.data.players.filter(item => item.id != 0).length;
        GlobalGameData.playerCount = playerCount == 2 ? GamePlayerCount.TWO : playerCount == 3 ? GamePlayerCount.THREE : GamePlayerCount.FOUR;
        
        if (data.data.data.player_now == PlayerManager.thisPlayer_user_id) {
            GetServerData.isDrawCardHttp = false;
        } else {
            GetServerData.isDrawCardHttp = true;
        }
        // Socket.ResponseWsStatus(data);
        //判断是否为当前游戏
        if (!data && !this.IsTrueGame(data.data)) return;
        //保存上次的socket消息
        GameData.lastMessage = GameData.message;
        //保存本次的socket消息
        GameData.message = data.data;
        console.log('socket is ',GameData.message);
        if(GameData.message.data.status == "completed") {
            GameData.completedMessage = data.data;
            Socket.Completed();
            return;
        }
        //判断是否是开局第一个socket消息
        if (GameData.message.data.player_last_action == "") {

            
            UNOMatching.JoinIndex = 0;
            GameData.gameid = GameData.message.channel.id;
            console.log("data.data.data.source_id", data.data.data.source_id);

            // VoiceManager.JoinVoiceRoom(data.data.data.source_id, data.data.data.voice_platform);

            Socket.StartGame();
            // Matching.JoinOK = true;
            // Matching.StopJoin();
            let uids = [];
            for (let i = 0; i < GameData.message.data.players.length; i++) {
                const element = GameData.message.data.players[i];
                uids.push(element.id);
            }
            FrameImageManager.initWithUids(uids);

            Socket.SetOtherPlayerCardNumber();
            return;
        }
        Socket.IsFirst = false;
        //重置游戏数据，倒计时，卡牌数，转盘正逆等基本信息
        Socket.ResetGameData();
        //用的比较多的数据
        //最新的一张牌 
        let nowCardId = GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1];
        //当前牌的颜色
        let nowCardColor = CardManager.I.GetCardColor(GameData.message.data.color);
        //最后一张牌的号码
        let nowCardNumber = CardManager.I.GetCardNumber(nowCardId);
        Socket.PlayNextSound(nowCardId);
        if (GameData.message.data.status == "playing") {
            Socket.ProcessingGameData(nowCardId, nowCardColor, nowCardNumber);
        }
        if(GlobalGameData.roomType == RoomType.ROOM)
            this.updateUserStatus();
    }

    /**
     * 处理表情数据显示
     * @param  {any} mData
     */
    public static dealEmojiSocket(mData: any) {
        let displayId = mData.data.data.user.display_id;
        let msg = mData.data.data.msg;
        let name = mData.data.data.emoji_name;
        if(!msg) {
            const emojiObjs = Object.values(GameSceneUIManager.I.emojiJson.json) as {name: string,image: string,svga: string,svga_o: string}[];
            msg = emojiObjs.find(item => item.name === name).svga;

        }
        // if (this.settleLayer) {
        //     // this.settleLayer.getComponent(settingLayerLogic).setEmojiShow(displayId, msg);
        // } else {
        this.setEmojiShow(displayId, msg);
    }

    public static setEmojiShow(displayId, msg) {
        const player = PlayerManager.GetPlayer(displayId);
        if(!player) return;
        let headBg = player.headImage.node;
        
        let posX = headBg.x;
        let posY = headBg.y;
        console.log('emoji pos is ',[posX,posY]);
        Message.showEmoji([posX, posY], [110, 110], msg);
    }

    public static updateUserStatus() {
        console.log('更新用户状态信息');
        const players = GameData.message.data.players;
        for(let playerItem of players) {
            let player = PlayerManager.GetPlayer(playerItem.id);
            if(!player) {
                console.log('没有找到用户');
                continue;
            }

            if(playerItem.status === 'online') {
                // player
                // GameSceneUIManager.I
                player.offlineNode.active = false;
            } else {
                player.offlineNode.active = true;
            }   
        }
    }

    public static ResponseWsStatus(data: any) {
        console.log('data is ',data)
        if (data && data.data.method == "response_ws_status") {
            if (data.data.data.online) {
                // 断线重连
                if (GameData.gameid) {
                    GetServerData.SendMessage(GameData.gameid, (res) => {
                        GameData.gameInfo = res;
                        GameSceneManager.I.UpDateGameData(0);
                    });
                }
            }
        }
        if (AndroidGoback.IsOut2 && GameSceneManager.UpdateTime == 1) {
            AndroidGoback.IsOut2 = false;
            if (GameData.gameid) {
                GetServerData.SendMessage(GameData.gameid, (res) => {
                    GameData.gameInfo = res;
                    GameSceneManager.I.UpDateGameData(0);
                });
            }
        } else {
            GameSceneManager.UpdateTime = 0;
        }
    }

    private static Completed() {
        if (GameData.message.data.stop_reason == "timeout") {
            SoundManager.PlaySource("TimeOut");
            GameSceneUIManager.I.TimeOutAnimation(() => {
                CardEffectManager.I.PlayWin();
            });
        } else {
            console.log('--> completed 结算');
            CardEffectManager.I.PlayWin();
        }
    }

    private static PlayNextSound(nowCardId: any) {
        let cardtype = CardManager.I.GetCardType(nowCardId);
        if (cardtype == CardType.number) {
            SoundManager.SetSourceVolume(0.5);
        } else {
            SoundManager.SetSourceVolume(1);
        }
        if (GameData.message.data.player_last_action == "draw" || GameData.message.data.player_last_action == "choice_color") {

        } else {
            SoundManager.PlaySource("next");
        }
    }

    public static FirstSocket() {
        if (!Socket.IsFirst) return;
        Socket.ResetGameData();
        //用的比较多的数据
        //最新的一张牌
        let nowCardId = GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1];
        //当前牌的颜色
        let nowCardColor = CardManager.I.GetCardColor(GameData.message.data.color);
        //最后一张牌的号码
        let nowCardNumber = CardManager.I.GetCardNumber(nowCardId);

        // console.log(nowCardId, nowCardColor, nowCardNumber);
        //对不同消息类型该做的事进行区分
        Socket.ProcessingGameData(nowCardId, nowCardColor, nowCardNumber);
    }

    static ProcessingGameData(nowCardId, nowCardColor, nowCardNumber) {
        if(!GlobalGameData.isGod) {
            if (GameData.message.data.player_now == PlayerManager.thisPlayer_user_id) {
                // Socket.IsRobot = true;
                console.log('11111111111111自己处理出牌打牌流程');
                Socket.ThisPlayerNowShouldDoProcessing(nowCardId, nowCardColor, nowCardNumber);
            }
            if (GameData.message.data.player_last == PlayerManager.thisPlayer_user_id) {
                // 处理打牌和发牌行为
                // if (Socket.IsRobot) {
                    console.log('上一个操作的用户和当前用户相同');
                    Socket.ThisPlayer_PlayWithRobot(nowCardId, nowCardColor, nowCardNumber);
                // } else {
                // }
            } else {
                console.log("");
                Socket.OtherPlayerLastActionProcessing(nowCardId, nowCardColor, nowCardNumber);
            }
        } else {
            Socket.OtherPlayerLastActionProcessing(nowCardId,nowCardColor,nowCardNumber);
        }
        Socket.Draw2(nowCardId);
        Socket.SkipAnimation();
        Socket.Draw4roDraw6();
        Socket.ChooseColor();
        Socket.ShowUNO();

    }

    /**
     * 加两张牌的操作
     * @param  {any} nowCardId
     */
    private static Draw2(nowCardId: any) {
        if (CardManager.I.GetCardType(nowCardId) == CardType.add2) {
            if (GameData.message.data.player_skipped != 0) {
                let data = Socket.WhoAddCards();
                if (data.user_id != 0 && data.user_id != PlayerManager.thisPlayer_user_id) {
                    GameSceneManager.I.InCards(data.user_id, data.count);
                } else {
                    let cards = Socket.ChooseDifferentCards();
                    if (cards.length > 0) {
                        GameSceneManager.I.ThisPlayerInCards(cards);
                    }
                }
            }
        }
    }

    /**
     * 跳过动画，需要服务端提供跳过用户的id
     */
    private static SkipAnimation() {
        console.log('skip');
        if (GameData.message.data.player_skipped != 0) {
            console.log('跳过用户: ',GameData.message.data.player_skipped);
            let player = PlayerManager.GetPlayer(GameData.message.data.player_skipped);
            let color = CardManager.I.GetCardColor(GameData.message.data.color);
            CardEffectManager.I.Playskip(player, color);
        }
    }
    
    /**
     * 
     * 抽4张牌或者抽6张牌
     * 
     */
    private static Draw4roDraw6() {
        if (GameData.message.data.player_last_action === "draw4" || GameData.message.data.player_last_action === "draw6") {
            GameSceneUIManager.I.CloseChooesAdd4Tip();
            let cards = Socket.ChooseDifferentCards();
            console.log('draw4 or draw6 长度：',cards.length);
            if (cards.length > 0) {
                
                console.log('draw4', cards.length);
                GameSceneManager.I.ThisPlayerInCards(cards);
                let player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
                let color = CardManager.I.GetCardColor(GameData.message.data.color);
                CardEffectManager.I.Playskip(player, color);
            }
            let data = Socket.WhoAddCards();
            console.log(`draw4 or draw6 userid is `,data.user_id);

            if (data.user_id != PlayerManager.thisPlayer_user_id && data.user_id != 0) {
                console.log(`draw4 or draw6 userid is 非自己发牌`);

                GameSceneManager.I.InCards(data.user_id, data.count);
                let player = PlayerManager.GetPlayer(data.user_id);
                let color = CardManager.I.GetCardColor(GameData.message.data.color);
                CardEffectManager.I.Playskip(player, color);
            }

        }
    }

    private static ChooseColor() {
        if (GameData.message.data.player_last_action == "choice_color") {
            let color = CardManager.I.GetCardColor(GameData.message.data.color);
            CardEffectManager.I.PlayChangeColor(color);
        }
    }

    // 用户应该做的交互
    static ThisPlayerNowShouldDoProcessing(nowCardId, nowCardColor, nowCardNumber) {
        
        if (GameData.message.data.player_now_should.length <= 1 && GameData.message.data.player_now_should.indexOf("draw") >= 0) {
            console.log('显示摸牌动画');
            // 自己摸牌
            GameSceneUIManager.I.arr.active = true;
            GameSceneUIManager.I.DrawCard.active = true;
        }
        if (GameData.message.data.player_now_should.indexOf("play") >= 0) {
            GameSceneManager.I.CardHightLight(nowCardColor, nowCardNumber);
        }
        if (GameData.message.data.player_now_should.indexOf("skip") >= 0) {
            GetServerData.SkipCard();
        }
        if (GameData.message.data.player_now_should.indexOf("draw4") >= 0 || GameData.message.data.player_now_should.indexOf("draw6") >= 0) {
            GameSceneUIManager.I.ShowChooesAdd4Tip(GameData.lastMessage.data.color);
        }

    }

    /**通过自己打牌 */
    static ThisPlayer_PlayWithSelf() {

    }

    /**通过机器人打牌 */
    static ThisPlayer_PlayWithRobot(nowCardId, nowCardColor, nowCardNumber) {
        if (GameData.message.data.player_last_action == "play") {
            console.log(GameData.message.data.player_last + '打牌');
            // 机器人打牌
            GameSceneManager.I.ThiPlayerOutCardsForID(nowCardId);
        }
        if (GameData.message.data.player_last_action == "draw") {
            // 发牌
            let cards = Socket.ChooseDifferentCards();
            GameSceneManager.I.ThisPlayerInCards(cards);
        }

    }
    private static unoplayers: number[] = []
    
    /**
     * 玩家展示UNO,具体哪个玩家的UNO该方法进行判断
     */
    static ShowUNO() {
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.id) continue;
            if (element.poker_remain_count == 1) {
                let index = this.unoplayers.indexOf(element.id)
                if (index < 0) {
                    this.unoplayers.push(element.id);
                    CardEffectManager.I.PlayUNO();
                    PlayerManager.GetPlayer(element.id).UNO.active = true;
                }
            } else {
                let index = this.unoplayers.indexOf(element.id);
                if (index >= 0) {
                    this.unoplayers.splice(index, 1);
                }
                PlayerManager.GetPlayer(element.id).UNO.active = false;
            }
        }
    }

    /** 显示当前玩家的排名 */
    static ShowRank() {
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.id) continue;

            if (element.rank == 1) {
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('1').active = true;
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('2').active = false;
            } else if (element.rank == 2) {
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('1').active = false;
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('2').active = true;
            } else {
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('1').active = false;
                PlayerManager.GetPlayer(element.id).rankNode.getChildByName('2').active = false;
            }
        }
    }

    /** 显示被ban图标 */
    static ShowAbandon() {
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.id) continue;
            if (element.status == "abandon") {
                PlayerManager.GetPlayer(element.id).abandonNode.active = true;
            } else {
                PlayerManager.GetPlayer(element.id).abandonNode.active = false;
            }
        }
    }

    static ShowChallenge() {
        let enJson = LanguageManager.enLangJson;
        // console.error("Challenge", GameData.message.data.player_last_action, GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1]);
        GameSceneUIManager.I.CloseAllChallenge();
        if (GameData.message.data.player_last_action == "choice_color" && GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1] >= 105) {
            let player = PlayerManager.GetPlayer(GameData.message.data.player_now);
            player.challengeNode.active = true;
            player.challengeLabel.string = LanguageManager.GetType().challenge ? LanguageManager.GetType().challenge : enJson.challenge;
            player.challengeLabel.node.color = new cc.Color(255, 255, 255, 255);
        }

        if (GameData.message.data.player_last_action == "draw4") {
            let player = PlayerManager.GetPlayer(GameData.message.data.player_last);
            GameSceneUIManager.I.CloseChallenge(player.challengeNode, true);
            player.challengeLabel.string = LanguageManager.GetType().challenge_draw ? LanguageManager.GetType().challenge_draw : enJson.challenge_draw;
            player.challengeLabel.node.color = new cc.Color(255, 241, 118, 255);
        } else if (GameData.message.data.player_last_action == "draw6") {
            let data = Socket.WhoAddCards();
            let player = PlayerManager.GetPlayer(GameData.message.data.player_last);
            GameSceneUIManager.I.CloseChallenge(player.challengeNode, true);
            if (data.count == 6) {
                player.challengeLabel.string = LanguageManager.GetType().challenge_failed ? LanguageManager.GetType().challenge_failed : enJson.challenge_failed;
                player.challengeLabel.node.color = new cc.Color(255, 90, 90, 255);
            } else if (data.count == 4) {
                player.challengeLabel.string = LanguageManager.GetType().challenge_success ? LanguageManager.GetType().challenge_success : enJson.challenge_success;
                player.challengeLabel.node.color = new cc.Color(62, 255, 112, 255);
            }
        }

    }

    static OtherPlayerLastActionProcessing(nowCardId, nowCardColor, nowCardNumber) {
        console.log(GameData.message.data.player_last_action);
        if (GameData.message.data.player_last_action == "play") {
            GameSceneManager.I.OutCards(GameData.message.data.player_last, nowCardId, nowCardColor);
        }
        if (GameData.message.data.player_last_action == "draw") {
            GameSceneManager.I.InCards(GameData.message.data.player_last, 1);
        }
        if (GameData.message.data.player_last_action == "skip") {

        }
        if (GameData.message.data.player_last_action == "draw4" || GameData.message.data.player_last_action == "draw6") {
            let data = Socket.WhoAddCards();
            if (data.user_id != 0 && data.user_id != PlayerManager.thisPlayer_user_id)
                GameSceneManager.I.InCards(data.user_id, data.count);
        }
    }
    /**重置游戏数据，倒计时，卡牌数，转盘正逆等基本信息 */
    static ResetGameData() {
        CardEffectManager.I.ResetEffect();
        //结束上一回合倒计时显示
        GameSceneManager.I.EndRound();
        GameSceneUIManager.I.arr.active = false;
        GameSceneUIManager.I.DrawCard.active = false;
        //清除卡牌高亮效果
        GameSceneManager.I.CleanHightLight();
        GameSceneManager.I.ChangeCenterImageColor();
        //设置转盘的正逆旋转方式 
        // Socket.SetESC();
        //更新其他玩家的卡牌数
        Socket.SetOtherPlayerCardNumber();
        Socket.ShowRank();
        Socket.ShowAbandon();
        Socket.ShowChallenge();
        Socket.IsAgent();
        //开始当前回合的倒计时显示
        GameSceneManager.I.StartRound(GameData.message.data.player_now);
        GameSceneUIManager.I.RestTime(GameData.message.data.countdown_duration);



    }
    public static IsAgent() {
        const targetPlayer = this.FindPlayerData(GameData.message,PlayerManager.thisPlayer_user_id);
        if (targetPlayer && targetPlayer.is_agent) {
            GameSceneUIManager.I.iconRobot.active = true;
            GameSceneUIManager.I.iconRobotbg.active = true;
        } else {
            GameSceneUIManager.I.iconRobot.active = false;
            GameSceneUIManager.I.iconRobotbg.active = false;
        }
    }


    private static SetOtherPlayerCardNumber() {
        for (let i = 0; i < GameData.message.data.players.length; i++) {
            const element = GameData.message.data.players[i];
            if(!element.id) continue;
            if (element.id != PlayerManager.thisPlayer_user_id) {
                let player = PlayerManager.GetPlayer(element.id);
                if(!player) {
                    console.log('设置其他玩家的牌数时候 player is null');
                    continue;
                };
                player.cardNumberNode.string = element.poker_remain_count + "";
                if (element.poker_remain_count <= 0) {
                    player.cardStack.active = false;
                }
            }
        }
    }



    private static StartGame() {
        console.log('游戏开始');
        UNOMatching.I.InitGameData(GameData.message);
        UNOMatching.I.loadChangeScene();
    }

    /**
     * 根据用户的id找到目标的用户数据
     * @param  {} message socket消息
     * @param  {} uid 用户id
     */
    static FindPlayerData(message, uid) {
        for (let i = 0; i < message.data.players.length; i++) {
            const element = message.data.players[i];
            if(!element.user_id) continue;
            if (element.user_id == uid) {
                return element;
            }
        }
    }

    /**
     * 比对玩家手里的牌与现在socket消息里面玩家的牌有什么不同，返回不同牌的id数组,上帝模式下返回空数组
     * @returns number[] 不同牌id数组
     */
    static ChooseDifferentCards(isReconnect: boolean = false): number[] {
        if(GlobalGameData.isGod) return [];
        // let curUserPokers = 
        
        let lastdata = Socket.FindPlayerData(GameData.lastMessage, PlayerManager.thisPlayer_user_id);
        let nowdata = Socket.FindPlayerData(GameData.message, PlayerManager.thisPlayer_user_id);
        let last: number[] = lastdata.poker_remain;
        if(isReconnect) {
            const player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
            const pokers = player.cards;
            last = [];
            pokers.forEach(item => {
                last.push(item.cardid);
            });
        }
        let now: number[] = nowdata.poker_remain;
        let cards: number[] = [];
        console.log(last, now);
        for (let i = 0; i < now.length; i++) {
            const nowCard = now[i];
            // let newcard = this.ChooseDifferentCard(last, nowCard);
            let newcardid = last.indexOf(nowCard);
            if (newcardid < 0) {
                cards.push(nowCard);
            }
        }
        console.log('不同牌的数组：',cards);
        return cards;
    }
    static ChooseDifferentCard(last, nowCard): number {
        for (let j = 0; j < last.length; j++) {
            const lastCard = last[j];
            if (nowCard == lastCard) {
                return -1;
            } else {
                return nowCard;
            }
        }
    }

    /**
     * 轮到谁抽牌 
     * @returns {user_id: number,count: number}
     */
    static WhoAddCards() {
        for (let i = 0; i < GameData.lastMessage.data.players.length; i++) {
            const element = GameData.lastMessage.data.players[i];
            // if (element.user_id != PlayerManager.thisPlayer_user_id) {
            let playernowData = this.FindPlayerData(GameData.message, element.id);
            let num = playernowData.poker_remain_count - element.poker_remain_count;
            if (num > 0) {
                return { user_id: element.id, count: num };
            }
            // }
        }
        return { user_id: -1, count: 0 };
    }
    /**是否是本居游戏的消息 */
    static IsTrueGame(message) {
        if (!GameData.gameid && message.channel.type == 'uno') {
            console.log('收到的消息是本局的第一个消息');
            if (message.data.player_last_action == "") {
                console.log('收到本局的第一个开始游戏的消息');
                GameData.gameid = message.channel.id;
                return true
            }
        } else if (GameData.gameid == message.channel.id) {
            console.log('收到的消息是本局的消息');
            return true
        } else {
            console.error(GameData.gameid, '收到的消息不是本局的消息');
            return false;
        }
    }


}