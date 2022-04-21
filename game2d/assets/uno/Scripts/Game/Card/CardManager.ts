import Player from "../../../MatchingScene/Scripts/Players/Player";
import { MyComponent } from "../../Common/Game/MyComponent";
import Pool from "../../Common/Pool/Pool";
import { angleToRand, randToAngle } from "../../util";
import GameSceneUIManager from "../GameScene/GameSceneUIManager";
import Card from "./Card";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardManager extends MyComponent {
    static I: CardManager;
    onLoad() {
        CardManager.I = this.node.getComponent(CardManager);
    }
    @property(cc.Prefab)
    CardPrefab: cc.Prefab = null;
    @property(cc.Graphics)
    pen: cc.Graphics = null;

    private viewSize: cc.Size = cc.size(0);

    private cardsLen: number = 1;

    private R: number = 570;

    private debugRadius: number = 10;

    canvas: cc.Node;
    onEnable() {
        this.viewSize = cc.view.getVisibleSize();
        this.canvas = cc.find("Canvas/myCards");
    }

    setIndex(player: Player, cardArr: Array<Card>) {
        for (let i = 0; i < cardArr.length - 1; i++) {
            for (let j = i + 1; j < cardArr.length; j++) {
                if (cardArr[i].cardtypenumber > cardArr[j].cardtypenumber) {
                    let c = cardArr[i];
                    cardArr[i] = cardArr[j];
                    cardArr[j] = c;
                }
            }
        }
        for (let i = 0; i < GameSceneUIManager.I.ThisPlayerCardsParent.children.length; i++) {
            GameSceneUIManager.I.ThisPlayerCardsParent.children[i] = cardArr[i].node;
            GameSceneUIManager.I.ThisPlayerCardsParent.children[i].zIndex = i + 1;
        }
        return cardArr;
    }

    /**
     * 设置牌的位置
     * @param  {Player} player 玩家对象
     * @param  {Array<Card>} cardArr 牌数组
     */
    setCardPos(player: Player, cardArr: Array<Card>) {
        // let poses: Array<cc.Vec2> = new Array<cc.Vec2>();
        // let lerpx = 70;
        // let long = 140 + lerpx * cardArr.length - 1;
        // if (long >= 700) {
        //     lerpx = (600 - 140) / (cardArr.length - 1);
        // }
        // let num1, startx;
        // if (cardArr.length % 2 == 0) {
        //     num1 = cardArr.length / 2;
        //     startx = -(lerpx / 2 + (num1 - 1) * lerpx);
        // } else {
        //     num1 = (cardArr.length - 1) / 2;
        //     startx = -(num1 * lerpx);
        // }
        // // let cardpos: cc.Vec2 = new cc.Vec2(0, 0);
        // player.cardspos.length = 0;
        // for (let i = 0; i < cardArr.length; i++) {
        //     poses.push(new cc.Vec2(startx + lerpx * i, 0));
        //     player.cardspos.push(startx + lerpx * i);
        // }
        // console.log(poses);
        // return poses;
        console.log('设置牌的位置,牌数：',cardArr.length);
        let  vec3Arr = this.drawCircle(cardArr);
        player.cardspos = vec3Arr;
        return vec3Arr;
    }

    /**
     * 绘制弧形坐标点
     * @param  {number} cardsLen 牌的数量
     * @returns cc.Vec3[] 所有牌的坐标从左到右排列好的
     */
    drawCircle(cards: Card[]): cc.Vec3[] {
        let cardsLen = cards.length;
        let circleCenter = cc.v2(0,-this.viewSize.height / 2 - 300);

        // this.pen.clear();
        // this.pen.moveTo(circleCenter.x,circleCenter.y);
        // this.pen.lineTo(circleCenter.x,circleCenter.y);
        // this.pen.circle(circleCenter.x,circleCenter.y,5);
        // this.pen.fill();

        let startA = Math.PI / 2; 
        let posArr: cc.Vec3[] = [];
        let offseta = (Math.PI / 4) / (cardsLen - 1 <= 0 ? 1 : cardsLen - 1);
        if(cardsLen === 2) {
            offseta = (Math.PI / 16);
        }
        if(cardsLen === 3) {
            offseta = (Math.PI / 3) / 8;
        }
        if(cardsLen === 4) {
            offseta = (Math.PI / 2) / 10; 
        }

        if(cardsLen % 2 == 0) {
            const odd = cardsLen / 2;
            let startP = startA + offseta * ((cardsLen - 1) / 2);
            for(let i = 0; i < cardsLen; i++) {
                let p = startP - i * offseta;
                let posX = circleCenter.x + this.R * Math.cos(p);
                let posY = circleCenter.y + this.R * Math.sin(p);
                posArr.push(cc.v3(posX,posY,randToAngle(p - Math.PI / 2)));
                let cardItem = cards[i];
                // let a = angleToRand(p);
                cardItem.cardNormalPos = cc.v3(posX,posY,randToAngle(p - Math.PI / 2));
                cardItem.targetMovPos = cardItem.cardNormalPos.add(cc.v3(80 * Math.cos(p),80 * Math.sin(p),0));
                cardItem.closedPos = cardItem.cardNormalPos.add(cc.v3(40 * Math.cos(p),40 * Math.sin(p),0));
                this.pen.fillColor = cc.Color.RED;
                // this.pen.moveTo(posX,posY);
                // this.pen.lineTo(posX,posY);
                // this.pen.circle(posX,posY,this.debugRadius);

                // this.pen.moveTo(cardItem.targetMovPos.x,cardItem.targetMovPos.y);
                // this.pen.lineTo(cardItem.targetMovPos.x,cardItem.targetMovPos.y);
                // this.pen.circle(cardItem.targetMovPos.x,cardItem.targetMovPos.y,5);
            }
            // this.pen.fill();
        } else {
            startA = startA + Math.floor(cardsLen / 2) * offseta;
            // 奇数从startA角度开始
            for(let i = 0; i < cardsLen; i++) {
                let ta = startA - i * offseta;
                let posX = circleCenter.x + this.R * Math.cos(ta);
                let posY = circleCenter.y + this.R * Math.sin(ta);

                posArr.push(cc.v3(posX,posY,randToAngle(ta - Math.PI / 2)));
                let cardItem = cards[i];
                cardItem.cardNormalPos = cc.v3(posX,posY,0);
                // let a = angleToRand(ta);
                cardItem.targetMovPos = cardItem.cardNormalPos.add(cc.v3(80 * Math.cos(ta),80 * Math.sin(ta),0));
                cardItem.closedPos = cardItem.cardNormalPos.add(cc.v3(40 * Math.cos(ta),40 * Math.sin(ta),0));
                // this.pen.fillColor = cc.Color.RED;
                // this.pen.moveTo(cardItem.targetMovPos.x,cardItem.targetMovPos.y);
                // this.pen.lineTo(cardItem.targetMovPos.x,cardItem.targetMovPos.y);
                // this.pen.circle(cardItem.targetMovPos.x,cardItem.targetMovPos.y,5);

                // this.pen.moveTo(posX,posY);
                // this.pen.lineTo(posX,posY);
                // this.pen.circle(posX,posY,this.debugRadius);
            }
            // this.pen.fill();
        }
        posArr = posArr.sort((a,b) => a.x - b.x > 0 ? 1 : a.x - b.x == 0 ? 0 : -1);
        console.log('posArr is ',posArr);
        return posArr;
    }

    GetCardData(cardid: number): { type: CardType, color: CardColor, num: number } {
        let typeid = cardid % 25;
        let color: CardColor;
        let type: CardType;
        let num: number = -1;
        if (cardid <= 25) {
            color = CardColor.red;
        } else if (cardid <= 50) {
            color = CardColor.yellow;
        } else if (cardid <= 75) {
            color = CardColor.green;
        } else if (cardid <= 100) {
            color = CardColor.blue;
        }
        if (cardid >= 101) {
            color = CardColor.black;
            if (cardid <= 104) {
                type = CardType.changeColor;
            } else if (cardid <= 108) {
                type = CardType.add4;
            }
        } else {
            if (typeid == 0) {
                type = CardType.add2;
            } else if (typeid == 1) {
                type = CardType.number;
                num = 0;
            } else if (typeid <= 10) {
                type = CardType.number;
                num = typeid - 1;
            } else if (typeid <= 19) {
                type = CardType.number;
                num = typeid - 10;
            } else if (typeid <= 21) {
                type = CardType.ban;
            } else if (typeid <= 23) {
                type = CardType.changeRound;
            } else if (typeid <= 24) {
                type = CardType.add2;
            }
        }
        return { type, color, num };
    }
    /**卡牌颜色 string => CardColor */
    GetCardColor(colorstr: string) {
        let color: CardColor;
        switch (colorstr) {
            case "red":
                color = CardColor.red;
                break;
            case "yellow":
                color = CardColor.yellow;
                break;
            case "blue":
                color = CardColor.blue;
                break;
            case "green":
                color = CardColor.green;
                break;
        }
        return color;
    }
    /**卡牌号码 */
    GetCardNumber(lastCardId) {
        let typeid = lastCardId % 25;
        let num: number = -1;
        if (lastCardId < 101) {
            if (typeid == 0) {
                num = -1;
            } else if (typeid == 1) {
                num = 0;
            } else if (typeid <= 10) {
                num = typeid - 1;
            } else if (typeid <= 19) {
                num = typeid - 10;
            } else if (typeid <= 21) {
                num = -1;
            } else if (typeid <= 23) {
                num = -1;
            } else if (typeid <= 24) {
                num = -1;
            }
        } else {
            num = -1;
        }
        return num;
    }

    GetCardType(nowCardId) {
        switch (nowCardId) {
            case 20:
            case 21:
            case 45:
            case 46:
            case 70:
            case 71:
            case 95:
            case 96:
                return CardType.ban;
            case 22:
            case 23:
            case 47:
            case 48:
            case 72:
            case 73:
            case 97:
            case 98:
                return CardType.changeRound;
            case 24:
            case 25:
            case 49:
            case 50:
            case 74:
            case 75:
            case 99:
            case 100:
                return CardType.add2;
            case 101:
            case 102:
            case 103:
            case 104:
                return CardType.changeColor;
            case 105:
            case 106:
            case 107:
            case 108:
                return CardType.add4;
            default:
                break;
        }
        return CardType.number
    }
    arr: Array<cc.Node> = new Array<cc.Node>();
    index = 0;
    index2 = 0;
    posx = -280;
    posy = 600;


}

export enum CardType {
    ban,
    changeColor,
    add4,
    add2,
    changeRound,
    number,
}

export enum CardColor {
    red,
    yellow,
    blue,
    green,
    black
}



    // AddCard(cardid) {
    //     let card = this.create(cardid);
    //     if (card.node.parent) {
    //         card.node.active = true;
    //     } else {
    //         this.canvas.addChild(card.node);
    //     }
    //     let cardArr: Array<Card> = new Array<Card>();
    //     for (let i = 0; i < this.canvas.children.length; i++) {
    //         const element = this.canvas.children[i];
    //         if (element.active) {
    //             cardArr.push(element.getComponent(Card));
    //         }
    //     }
    //     this.setIndex(cardArr);
    //     this.setCardPos(cardArr);
    // }

    // button(cardid) {
    //     let card = this.create(cardid);
    //     if (this.posx < 280) {
    //         this.posx = this.posx + 100;
    //     } else {
    //         this.posx = -280;
    //         this.posy = this.posy - 150;
    //     }
    //     card.node.setPosition(this.posx, this.posy);
    //     card.node.active = true;
    //     if (!card.node.parent) {
    //         this.canvas.addChild(card.node);
    //         this.arr.push(card.node);
    //     }
    //     this.index++;
    //     if (this.index > 8) {
    //         this.arr[0].active = false;
    //         for (let i = 1; i < this.arr.length; i++) {
    //             let m = this.arr[i];
    //             this.arr[i] = this.arr[i - 1];
    //             this.arr[i - 1] = m;
    //         }
    //         for (let i = 1; i < this.arr.length; i++) {
    //             this.arr[i].zIndex = i;
    //         }
    //     }
    // }
/**创建卡牌 */
    // create(cardid: number) {
    //     let cardNode = Pool.GetNodeInstanceFromPool("MyCard", this.CardPrefab);
    //     let card = cardNode.getComponent(Card);
    //     card.CreateCard(cardid);
    //     return card;
    // }