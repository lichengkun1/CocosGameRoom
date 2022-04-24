
import Player from "../../Players/Player";
import PlayerManager from "../../Players/PlayerManager";
import Card from "../Card/Card";
import CardManager from "../Card/CardManager";
import GameSceneManager from "./GameSceneManager";
import GameSceneUIManager from "./GameSceneUIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {

    @property(cc.Graphics)
    pen: cc.Graphics = null;

    private minX: number = 0;
    private maxX: number = 0;
    private offsetX: number = 0;

    player: Player;
    onEnable() {
        this.player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
        this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
    }
    touchtime: number = 0;
    following: boolean = false;
    TouchStart(data) {
        if (!this.player) {
            this.player = PlayerManager.GetPlayer(PlayerManager.thisPlayer_user_id);
        }
        this.touchtime = 0;

        let xArr = this.player.cards.map(item => item.node.x);
        this.minX = Math.min.apply(null,xArr);
        this.maxX = Math.max.apply(null,xArr);
        let len = this.player.cards.length;
        this.offsetX = (this.maxX - this.minX) / (len);
        if(len == 1) {
            this.offsetX = 71;
        }
    }
    TouchEnd(data) {
        let touchX = data.touch._point.x - 375;
        let lerpX = data.touch._startPoint.x - data.touch._point.x;
        let lerpY = data.touch._startPoint.y - data.touch._point.y;
        console.log('thisRoundPlayerUId is ',GameSceneManager.I.thisRoundPlayerUID);
        if (GameSceneManager.I.thisRoundPlayerUID != PlayerManager.thisPlayer_user_id || GameSceneManager.I.OutCardNumber >= 1) {
            console.log("GameSceneManager.I.OutCardNumber++++++++++++  =  1");
            GameSceneManager.I.CreateTargetPos(this.player);
        } else {
            if (Math.abs(lerpY) < 80 && this.touchtime < 20) {
                let card: Card = this.ChooseCard(touchX);
                if (card)
                    GameSceneManager.I.ThisPlayerOutCards(card);
                else {
                    console.log('距离合适找不到牌');
                    GameSceneManager.I.CreateTargetPos(this.player);
                }
            } else if (this.dragCard) {
                if (this.dragCard.node.position.y > GameSceneUIManager.I.ThisPlayerCardsPos1.position.y) {
                    GameSceneManager.I.ThisPlayerOutCards(this.dragCard);
                } else {
                    console.log('拖拽牌的节点位置在 出牌位置的下面');
                    GameSceneManager.I.CreateTargetPos(this.player);
                }
            } else {
                console.log('--------------');
                GameSceneManager.I.CreateTargetPos(this.player);
            }
        }
        this.dragCard = null;

    }


    private ChooseCard(touchX: number) {
        let card = null;
        let len = this.player.cardspos.length;
        if(len == 1) {
            this.offsetX = 71;
        }
        console.log('offsetX is ',this.offsetX);
        for (let i = len - 1; i >= 0; i--) {
            const element = this.player.cardspos[i];
            if (element.x - this.offsetX < touchX && element.x + this.offsetX > touchX) {
                if (card) {
                    if (this.player.cards[i].node.zIndex > card.node.zIndex) {
                        card = this.player.cards[i];
                    }
                } else {
                    card = this.player.cards[i];
                }
            }
        }

        return card;
    }
    dragCard: Card;
    TouchMove(data) {
        let lerpX = data.touch._startPoint.x - data.touch._point.x;
        let lerpY = data.touch._startPoint.y - data.touch._point.y;

        if (Math.abs(lerpX) > 5) {
            // this.node.position = new cc.Vec3(this.node.position.x, CardManager.I.canvas.y + 20, 0);
            let touchX = data.touch._point.x - 375;
            let card: Card = this.ChooseCard(touchX);
            let index = this.player.cards.indexOf(card);
            if (index >= 0) {
                let targetCard = this.player.cards[index];
                let preCard = this.player.cards[index - 1];
                let nextCard = this.player.cards[index + 1];

                // 这里的targetCard.targetMovPos有可能出错
                // const targetMovePos = targetCard.node.position.add(cc.v3(80 * Math.cos()))
                this.player.cards[index].node.position = new cc.Vec3(targetCard.targetMovPos.x,targetCard.targetMovPos.y,0);
                if (index - 1 >= 0)
                    preCard.node.position = new cc.Vec3(preCard.closedPos.x,preCard.closedPos.y,0);
                if (index + 1 <= this.player.cards.length - 1)
                    nextCard.node.position = new cc.Vec3(nextCard.closedPos.x,nextCard.closedPos.y,0);
                for (let i = 0; i < this.player.cards.length; i++) {
                    const element = this.player.cards[i];
                    if (i != index - 1 && i != index + 1 && i != index) {
                        element.node.position = element.cardNormalPos;
                    }
                }
            }
            if (!this.dragCard) {
                if (lerpY < -80) {
                    // let touchX = data.touch._point.x - 375;
                    // this.dragCard = this.ChooseCard(touchX);
                    this.dragCard = card;
                }
            }
            if (this.dragCard) {
                this.dragCard.node.position = new cc.Vec3(touchX, CardManager.I.canvas.position.y + (-lerpY), 0);
            }
        }
    }
    update() {
        this.touchtime++;
    }
}