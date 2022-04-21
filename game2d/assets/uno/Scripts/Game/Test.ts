
import MatchingEvent from "../../../Script/CommonScripts/MatchSceneScripts/MatchingEvent";
import { GameData } from "../Common/Game/GameData";
import Pool from "../Common/Pool/Pool";
import { PopupManager } from "../Common/Popup/PopupManager";
import UNOMatching from "../Match/UNOMatching";
import CardManager from "./Card/CardManager";
import GameSceneManager from "./GameScene/GameSceneManager";
import Socket from "./Socket/Socket";

const { ccclass, property } = cc._decorator;

const testSettlementData = {
    "id": "116e179f-a300-43e5-8750-f74352b822af",
    "app": "funshare",
    "type": "custom",
    "method": "uno_play",
    "sender": 0,
    "channel": {
        "id": "6234290c0e7268007bf3e94a",
        "type": "uno"
    },
    "data": {
        "color": "yellow",
        "countdown": 0,
        "order": "desc",
        "player_last": 52988289,
        "player_last_action": "play",
        "player_now": 36366940,
        "player_now_should": [
            "play",
            "draw"
        ],
        "player_skipped": 0,
        "players": [
            {
                "user_id": 52988289,
                "user_name": "52988289_test",
                "user_avatar": "https://static2.funshareapp.com/icon/icon_male_160.png",
                "poker_remain": [],
                "poker_remain_count": 0,
                "status": "online",
                "rank": 1,
                "score": 0,
                "coin": 50,
                "is_agent": false,
                "country": "TW",
                "lang": "zh_Hant",
                "Did": "rGdyG2feCw/RBvAcRBo2bQ=="
            },
            {
                "user_id": 36366940,
                "user_name": "36366940_test",
                "user_avatar": "https://static2.funshareapp.com/icon/icon_male_160.png",
                "poker_remain": [
                    27,
                    9,
                    44,
                    32
                ],
                "poker_remain_count": 4,
                "status": "online",
                "rank": 2,
                "score": -24,
                "coin": -200,
                "is_agent": false,
                "country": "IN",
                "lang": "hi",
                "Did": "8b3ab736-340b-4382-b6bd-7185d84c5e93"
            },
            {
                "user_id": 0,
                "user_name": "",
                "user_avatar": "",
                "poker_remain": [],
                "poker_remain_count": 0,
                "status": "",
                "rank": 0,
                "score": 0,
                "coin": 0,
                "is_agent": false,
                "country": "",
                "lang": "",
                "Did": ""
            },
            {
                "user_id": 0,
                "user_name": "",
                "user_avatar": "",
                "poker_remain": [],
                "poker_remain_count": 0,
                "status": "",
                "rank": 0,
                "score": 0,
                "coin": 0,
                "is_agent": false,
                "country": "",
                "lang": "",
                "Did": ""
            }
        ],
        "poker_output": [
            69,
            68,
            70,
            65,
            56,
            51,
            54,
            55,
            80,
            84,
            93,
            88,
            38,
            40,
            45,
            46,
            39,
            29,
            26,
            50,
            75,
            25,
            24,
            22,
            20,
            10,
            21,
            7,
            18,
            16,
            12,
            14,
            11,
            15,
            1,
            5,
            19,
            17,
            67,
            59,
            53,
            78,
            97,
            100,
            98,
            83,
            92,
            79,
            77,
            76,
            81,
            89,
            87,
            95,
            71,
            64,
            30,
            35,
            33
        ],
        "poker_remain_count": 45,
        "source": "chatroom",
        "source_id": "604f285d871b760001ef6280",
        "status": "completed",
        "step_number": 123,
        "stop_reason": "play_out",
        "voice_platform": "zego"
    }
}
@ccclass
export default class Test extends cc.Component {

    cardManager: CardManager;
    onLoad() {
        this.cardManager = cc.find('CardManager').getComponent(CardManager);
    }

    index: number = 1;
    userid: number = 1001

    showRank() {
        GameData.completedMessage = testSettlementData;
        PopupManager.ShowPopup('SettlementPopup');
    }

    button() {
        // GameSceneManager.I.StartGameInCards();
        // PopupManager.ShowPopup("SettlementPopup")
        // let index = Math.floor(Math.random() * 108)
        // this.cardManager.AddCard(this.index);
        // GameSceneManager.I.OutCards('1001', this.index);
        // GameSceneManager.I.OutCards('2002', id);
        // GameSceneManager.I.OutCards('3003', 6);
        // GameSceneManager.I.OutCards('39052242', 6);
        // GameSceneManager.I.ThisPlayerInCards(10, this.index);
    }
    button2() {
        Socket.IsFirst = true;
        GameSceneManager.IsShowSettlement = false;
        PopupManager.CloseAllPopup();
        UNOMatching.PlayAgain = true;
        UNOMatching.JoinOK = false;
        cc.director.loadScene("MainScene");
        Pool.CleanPool();
        GameData.gameid = null;
    }

    button3() {
        let sorces = [
            {
                sorce: -210,
                num: 0
            }, {
                sorce: -11,
                num: 0
            }, {
                sorce: 0,
                num: 0
            }, {
                sorce: -11,
                num: 0
            }]
        for (let i = 0; i < sorces.length - 1; i++) {
            for (let j = i + 1; j < sorces.length; j++) {
                if (sorces[i].sorce < sorces[j].sorce) {
                    let s = sorces[j];
                    sorces[j] = sorces[i]
                    sorces[i] = s;
                }
            }
        }
        console.log(sorces);
        let index = 1;
        sorces[0].num = index;
        for (let i = 1; i < sorces.length; i++) {
            index++;
            if (sorces[i].sorce == sorces[i - 1].sorce) {
                sorces[i].num = sorces[i - 1].num;
            } else {
                sorces[i].num = index;
            }
        }
        console.log(sorces);
    }

    onEnable() {
        this.button3();
    }
    // onEnable() {
    //     this.player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
    //     this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
    //     this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    //     this.node.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMove, this);
    //     this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
    // }
    // player: Player;
    // touchtime: number = 0;
    // following: boolean = false;
    // TouchStart(data) {
    //     console.log('touchStart');
    //     // console.log(data);
    //     if (!this.player) {
    //         this.player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
    //     }
    //     this.touchtime = 0;
    // }
    // TouchEnd(data) {
    //     console.log('touchEnd');
    //     let touchX = data.touch._point.x - 375;
    //     let lerpX = data.touch._startPoint.x - data.touch._point.x;
    //     let lerpY = data.touch._startPoint.y - data.touch._point.y;

    //     if (Math.abs(lerpY) < 20 && this.touchtime < 20) {
    //         let card: Card = this.ChooseCard(touchX);
    //         if (card)
    //             GameSceneManager.I.ThisPlayerOutCards(card);
    //     } else if (this.dragCard) {
    //         if (this.dragCard.node.position.y > GameSceneUIManager.I.ThisPlayerCardsPos1.position.y) {
    //             GameSceneManager.I.ThisPlayerOutCards(this.dragCard);
    //         }
    //         // for (let i = this.player.cards.length - 1; i >= 0; i--) {
    //         //     this.player.cards[i].node.position = new cc.Vec3(this.player.cards[i].node.position.x, CardManager.I.canvas.position.y, 0);
    //         // }
    //     }

    //     GameSceneManager.I.CreateTargetPos(this.player);
    //     this.dragCard = null;

    // }


    // private ChooseCard(touchX: number) {
    //     let card = null;
    //     for (let i = this.player.cardspos.length - 1; i >= 0; i--) {
    //         const element = this.player.cardspos[i];
    //         if (element - 71 < touchX && element + 71 > touchX) {
    //             if (card) {
    //                 if (this.player.cards[i].node.zIndex > card.node.zIndex) {
    //                     card = this.player.cards[i];
    //                 }
    //             } else {
    //                 card = this.player.cards[i];
    //             }
    //         }
    //     }

    //     return card;
    // }
    // dragCard: Card;
    // TouchMove(data) {
    //     console.log('touchMove', data.touch._point.x, data.touch._point.y);
    //     let lerpX = data.touch._startPoint.x - data.touch._point.x;
    //     let lerpY = data.touch._startPoint.y - data.touch._point.y;

    //     if (Math.abs(lerpX) > 5) {
    //         // this.node.position = new cc.Vec3(this.node.position.x, CardManager.I.canvas.y + 20, 0);
    //         let touchX = data.touch._point.x - 375;
    //         let card: Card = this.ChooseCard(touchX);
    //         let index = this.player.cards.indexOf(card);
    //         if (index >= 0) {
    //             this.player.cards[index].node.position = new cc.Vec3(this.player.cards[index].node.position.x, CardManager.I.canvas.y + 50, 0)
    //             if (index - 1 >= 0)
    //                 this.player.cards[index - 1].node.position = new cc.Vec3(this.player.cards[index - 1].node.position.x, CardManager.I.canvas.y + 25, 0)
    //             if (index + 1 <= this.player.cards.length - 1)
    //                 this.player.cards[index + 1].node.position = new cc.Vec3(this.player.cards[index + 1].node.position.x, CardManager.I.canvas.y + 25, 0)
    //             for (let i = 0; i < this.player.cards.length; i++) {
    //                 const element = this.player.cards[i];
    //                 if (i != index - 1 && i != index + 1 && i != index) {
    //                     element.node.position = new cc.Vec3(element.node.position.x, CardManager.I.canvas.y, 0);
    //                 }

    //             }
    //         }
    //         if (!this.dragCard) {
    //             if (lerpY < -80) {
    //                 let touchX = data.touch._point.x - 375;
    //                 this.dragCard = this.ChooseCard(touchX);
    //             }
    //         }
    //         if (this.dragCard) {

    //             console.log(this.dragCard.node.position.y, (-lerpY));
    //             // this.dragCard.node.position.y
    //             this.dragCard.node.position = new cc.Vec3(touchX, this.cardManager.canvas.position.y + (-lerpY), 0);
    //         }


    //     }
    // }
    // update() {
    //     this.touchtime++;
    // }



}