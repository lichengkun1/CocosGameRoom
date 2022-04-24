import { MyComponent } from "../../Common/Game/MyComponent";
import CardManager, { CardColor, CardType } from "./CardManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends MyComponent {

    public cardtypenumber: number = 0;
    public cardid: number = 0;
    public cardType: CardType;
    public cardColor: CardColor;
    public cardNumber: number = -1;
    public cardNormalPos: cc.Vec3 = cc.v3(0);
    /** 该牌到中心的单位方向向量 */
    public targetMovPos: cc.Vec3 = cc.v3(0);
    public closedPos: cc.Vec3 = cc.v3(0);

    @property(cc.SpriteFrame)
    private bg_red: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bg_yel: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bg_blu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bg_gre: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bg_bla: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private numSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    private add2_red: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private add2_yel: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private add2_blu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private add2_gre: cc.SpriteFrame = null;


    private bg: cc.Node;
    private cardback: cc.Node;
    private cardLight: cc.Node;
    private nodeban: cc.Node;
    private nodechangeColor: cc.Node;
    private nodeadd4: cc.Node;
    private nodeadd2: cc.Node;
    private nodechangeRound: cc.Node;
    private nodenumber: cc.Node;

    public isCardHightLight: boolean = false;

    /**翻牌动画 */
    FlopAnimation() {
        if (!this.cardback || !this.bg) return;
        this.cardback.setScale(1, 1);
        this.bg.setScale(0, 1);
        cc.tween(this.cardback)
            .to(0.15, { scaleX: 0 })
            .call(() => {
                cc.tween(this.bg)
                    .to(0.15, { scaleX: 1 })
                    .call(() => {

                    }).start();
            })
            .start();

    }

    ShowHighlight() {
        this.cardLight.active = true;
        this.isCardHightLight = true;
    }
    CloseHighlight() {
        this.cardLight.active = false;
        this.isCardHightLight = false;
    }
    CreateCard(cardid: number) {
        this.cardid = cardid;
        let data = CardManager.I.GetCardData(cardid);
        return this.InitCard(data.type, data.color, (data.num == -1 ? null : data.num));
    }


    private InitCard(type: CardType, color?: CardColor, num?: number) {
        this.InitNode();
        this.ShowCard(type);
        if (type == CardType.changeColor) {
            this.cardtypenumber = 10;
            this.SetBGColor(CardColor.black);
        } else if (type == CardType.add4) {
            this.cardtypenumber = 20;
            this.SetBGColor(CardColor.black);
        } else if (type == CardType.number) {
            this.cardtypenumber = 1000;
            this.SetBGColor(color);
            this.SetNumber(num);
            this.cardtypenumber += num;
        } else if (type == CardType.ban) {
            this.cardtypenumber = 1000;
            this.SetBGColor(color);
            this.cardtypenumber += 10;
        } else if (type == CardType.changeRound) {
            this.cardtypenumber = 1000;
            this.SetBGColor(color);
            this.cardtypenumber += 11;
        } else if (type == CardType.add2) {
            this.cardtypenumber = 1000;
            this.SetBGColor(color);
            this.SetAdd2Color(color);
            this.cardtypenumber += 12;
        }
    }
    private InitNode() {
        this.bg = this.node.getChildByName('bg');
        this.cardback = this.node.getChildByName('cardBack');
        this.cardLight = this.node.getChildByName('cardLight');
        this.nodeban = this.bg.getChildByName('ban');
        this.nodechangeColor = this.bg.getChildByName('changeColor');
        this.nodeadd4 = this.bg.getChildByName('add4');
        this.nodeadd2 = this.bg.getChildByName('add2');
        this.nodechangeRound = this.bg.getChildByName('changeRound');
        this.nodenumber = this.bg.getChildByName('number');
    }
    private SetBGColor(color: CardColor) {
        let bgframe = this.bg_bla;
        switch (color) {
            case CardColor.red:
                if (this.cardtypenumber >= 1000) {
                    this.cardtypenumber += 100
                }
                bgframe = this.bg_red;
                break;
            case CardColor.yellow:
                if (this.cardtypenumber >= 1000) {
                    this.cardtypenumber += 200
                }
                bgframe = this.bg_yel;
                break;
            case CardColor.blue:
                if (this.cardtypenumber >= 1000) {
                    this.cardtypenumber += 300
                }
                bgframe = this.bg_blu;
                break;
            case CardColor.green:
                if (this.cardtypenumber >= 1000) {
                    this.cardtypenumber += 400
                }
                bgframe = this.bg_gre;
                break;
            case CardColor.black:
                bgframe = this.bg_bla;
                break;
        }
        this.bg.getComponent(cc.Sprite).spriteFrame = bgframe;
    }
    private SetAdd2Color(color: CardColor) {
        let bgframe = this.bg_bla;
        switch (color) {
            case CardColor.red:
                bgframe = this.add2_red;
                break;
            case CardColor.yellow:
                bgframe = this.add2_yel;
                break;
            case CardColor.blue:
                bgframe = this.add2_blu;
                break;
            case CardColor.green:
                bgframe = this.add2_gre;
                break;
        }
        this.nodeadd2.getChildByName('center').getComponent(cc.Sprite).spriteFrame = bgframe;
    }
    private SetNumber(num: number) {
        this.nodenumber.getChildByName('center').getComponent(cc.Sprite).spriteFrame = this.numSpriteFrame[num];
        this.nodenumber.getChildByName('top').getComponent(cc.Sprite).spriteFrame = this.numSpriteFrame[num];
        this.nodenumber.getChildByName('bottom').getComponent(cc.Sprite).spriteFrame = this.numSpriteFrame[num];
    }
    private ShowCard(type: CardType) {
        switch (type) {
            case CardType.ban:
                this.nodeban.active = true;
                this.nodechangeColor.active = false;
                this.nodeadd4.active = false;
                this.nodeadd2.active = false;
                this.nodechangeRound.active = false;
                this.nodenumber.active = false;
                break;
            case CardType.changeColor:
                this.nodeban.active = false;
                this.nodechangeColor.active = true;
                this.nodeadd4.active = false;
                this.nodeadd2.active = false;
                this.nodechangeRound.active = false;
                this.nodenumber.active = false;
                break;
            case CardType.add4:
                this.nodeban.active = false;
                this.nodechangeColor.active = false;
                this.nodeadd4.active = true;
                this.nodeadd2.active = false;
                this.nodechangeRound.active = false;
                this.nodenumber.active = false;
                break;
            case CardType.add2:
                this.nodeban.active = false;
                this.nodechangeColor.active = false;
                this.nodeadd4.active = false;
                this.nodeadd2.active = true;
                this.nodechangeRound.active = false;
                this.nodenumber.active = false;
                break;
            case CardType.changeRound:
                this.nodeban.active = false;
                this.nodechangeColor.active = false;
                this.nodeadd4.active = false;
                this.nodeadd2.active = false;
                this.nodechangeRound.active = true;
                this.nodenumber.active = false;
                break;
            case CardType.number:
                this.nodeban.active = false;
                this.nodechangeColor.active = false;
                this.nodeadd4.active = false;
                this.nodeadd2.active = false;
                this.nodechangeRound.active = false;
                this.nodenumber.active = true;
                break;
        }
    }
    changeColor(color: CardColor) {
        // this.SetBGColor(color);
        let bgframe = this.bg_bla;
        switch (color) {
            case CardColor.red:
                bgframe = this.bg_red;
                break;
            case CardColor.yellow:
                bgframe = this.bg_yel;
                break;
            case CardColor.blue:
                bgframe = this.bg_blu;
                break;
            case CardColor.green:
                bgframe = this.bg_gre;
                break;
            case CardColor.black:
                bgframe = this.bg_bla;
                break;
        }
        this.bg.getComponent(cc.Sprite).spriteFrame = bgframe;
    }
}