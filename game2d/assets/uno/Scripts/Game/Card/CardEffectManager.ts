// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../../../MatchingScene/Scripts/Players/Player";
import PlayerManager from "../../../MatchingScene/Scripts/Players/PlayerManager";
import GlobalGameData from "../../../MatchingScene/Scripts/Utils/GlobalGameData";
import { GameData } from "../../Common/Game/GameData";
import { PopupManager } from "../../Common/Popup/PopupManager";
import SoundManager from "../../Common/Sound/SoundManager";
import GameSceneManager from "../GameScene/GameSceneManager";
import GameSceneUIManager from "../GameScene/GameSceneUIManager";
import Socket from "../Socket/Socket";
import Card from "./Card";
import { CardColor, CardType } from "./CardManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardEffectManager extends cc.Component {
    /************** */
    r = true;
    /************** */

    static I: CardEffectManager;
    isCanChoose: boolean = true;
    onLoad() {
        CardEffectManager.I = this.node.getComponent(CardEffectManager);
    }
    static RED = "red";
    static YELLOW = "yellow";
    static BLUE = "blue";
    static GREEN = "green";
    @property(cc.Node)
    effectParent: cc.Node = null;
    @property(dragonBones.ArmatureDisplay)
    changeColor: dragonBones.ArmatureDisplay = null;
    @property(cc.Node)
    Add2: cc.Node = null;
    @property(dragonBones.ArmatureDisplay)
    Add4: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    ban: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    ChangeRound: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    UNO: dragonBones.ArmatureDisplay = null;


    @property(dragonBones.ArmatureDisplay)
    Win: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    skipAnimations: dragonBones.ArmatureDisplay[] = [];



    @property(cc.Node)
    effects: cc.Node = null;

    @property(cc.Prefab)
    effect_ordinary: cc.Prefab = null;
    @property(cc.Prefab)
    effect_special: cc.Prefab = null;
    ResetEffect() {
        if (GameData.message.data.poker_output[GameData.message.data.poker_output.length - 1] <= 100) {
            if (this.changeColor.node.activeInHierarchy) {
                this.changeColor.node.active = false;
            }
        }
    }

    /**播放改变颜色的开始动画 */
    PlayChangeColorStart(func?: Function) {
        console.log("播放改变颜色的开始动画");
        if (this.changeColor.node.active) return;
        this.changeColor.node.active = true;
        this.changeColor.playAnimation('chuxian', 1);
        this.changeColor.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.changeColor.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.changeColor.playAnimation('waiting', 0);
            func && func();
        }, this.changeColor)
    }
    /**播放切换颜色的动画并自动隐藏 */
    PlayChangeColor(color: CardColor) {
        console.log("播放切换颜色的动画并自动隐藏");
        SoundManager.PlaySource("change")
        this.changeColor.node.active = true;
        let colorstr = '';
        let card = GameSceneUIManager.I.faceCardParent.children[GameSceneUIManager.I.faceCardParent.childrenCount - 1].getComponent(Card);
        switch (color) {
            case CardColor.red:
                colorstr = CardEffectManager.RED;
                card.changeColor(CardColor.red);
                break;
            case CardColor.yellow:
                colorstr = CardEffectManager.YELLOW;
                card.changeColor(CardColor.yellow);
                break;
            case CardColor.blue:
                colorstr = CardEffectManager.BLUE;
                card.changeColor(CardColor.blue);
                break;
            case CardColor.green:
                colorstr = CardEffectManager.GREEN;
                card.changeColor(CardColor.green);
                break;
            default:
                break;
        }
        this.changeColor.playAnimation(colorstr, 1);
        this.changeColor.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.changeColor.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.changeColor.node.active = false;
            console.log("active");
        }, this.changeColor);
    }
    /**播放+2动画 */
    PlayAdd2(color: CardColor) {
        // if (color != 'red' && color != 'yellow' && color != 'blue' && color != 'green') {
        //     console.error("PlayAdd2的color参数有问题", color);
        // }
        SoundManager.PlaySource("skip")
        let colorstr = '';
        switch (color) {
            case CardColor.red:
                colorstr = CardEffectManager.RED;
                break;
            case CardColor.yellow:
                colorstr = CardEffectManager.YELLOW;
                break;
            case CardColor.blue:
                colorstr = CardEffectManager.BLUE;
                break;
            case CardColor.green:
                colorstr = CardEffectManager.GREEN;
                break;
            default:
                break;
        }
        let eff: dragonBones.ArmatureDisplay = this.Add2.getChildByName(colorstr).getComponent(dragonBones.ArmatureDisplay);
        this.Add2.active = true;
        eff.node.active = true;
        eff.playAnimation('blue', 1);
        eff.removeEventListener(dragonBones.EventObject.COMPLETE);
        eff.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            eff.node.active = false;
            this.Add2.active = false;
            console.log("active");
        }, eff);
    }
    /**播放+4动画 */
    PlayAdd4(func?: Function) {
        this.Add4.node.active = true;
        this.Add4.playAnimation('newAnimation', 1);
        this.Add4.node.active = true;
        this.Add4.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.Add4.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.Add4.node.active = false;
            console.log("active");
            this.PlayChangeColorStart(func);
        }, this.Add4);
    }

    PlayUNO(func?: Function) {
        // this.UNO.node.active = true;
        this.UNO.playAnimation('newAnimation', 1);
        SoundManager.PlaySource("UNO");
        this.UNO.node.active = true;
        this.UNO.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.UNO.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.UNO.node.active = false;
        }, this.UNO);
    }
    PlayWin(func?: Function) {
        // this.UNO.node.active = true;
        this.scheduleOnce(() => {
            console.log('是否是上帝模式：',GlobalGameData.isGod);
            if(GlobalGameData.isGod) {
                // 上帝模式直接显示结算弹窗
                PopupManager.ShowPopup("SettlementPopup");
            } else {
                const targetPlayer = Socket.FindPlayerData(GameData.message,PlayerManager.thisPlayer_user_id);
                if(!targetPlayer) {
                    PopupManager.ShowPopup("SettlementPopup");
                    return;
                }
                if (targetPlayer.coin > 0) {
                    SoundManager.PlaySource("win");
                    this.Win.playAnimation('kaishi', 1);
                    this.Win.node.active = true;
                    this.Win.removeEventListener(dragonBones.EventObject.COMPLETE);
                    this.Win.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                        this.Win.playAnimation('chixv', 1);
                        this.Win.removeEventListener(dragonBones.EventObject.COMPLETE);
                        this.Win.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                            // this.Win.playAnimation('chixv', 1);
                            PopupManager.ShowPopup("SettlementPopup");
                        }, this.Win);
                    }, this.Win);
                } else {
                    GameSceneUIManager.I.TimeOut.active = false;
                    GameSceneUIManager.I.GameOverAnimation(() => {
                        PopupManager.ShowPopup("SettlementPopup");
                    })
                }
            }

        }, 1.5)


    }



    PlayBan(color: CardColor) {
        SoundManager.PlaySource("skip")
        this.ban.node.active = true;
        let colorstr = '';
        switch (color) {
            case CardColor.red:
                colorstr = CardEffectManager.RED;
                break;
            case CardColor.yellow:
                colorstr = CardEffectManager.YELLOW;
                break;
            case CardColor.blue:
                colorstr = CardEffectManager.BLUE;
                break;
            case CardColor.green:
                colorstr = CardEffectManager.GREEN;
                break;
            default:
                break;
        }
        this.ban.playAnimation(colorstr, 1);
        this.ban.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.ban.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.ban.node.active = false;
            console.log("active");
        }, this.ban);
    }

    Playskip(player: Player, color: CardColor) {
        SoundManager.PlaySource("skip")
        let colorstr = '';
        switch (color) {
            case CardColor.red:
                colorstr = CardEffectManager.RED;
                break;
            case CardColor.yellow:
                colorstr = CardEffectManager.YELLOW;
                break;
            case CardColor.blue:
                colorstr = CardEffectManager.BLUE;
                break;
            case CardColor.green:
                colorstr = CardEffectManager.GREEN;
                break;
            default:
                break;
        }

        let skipAnimation = this.skipAnimations[player.id];
        skipAnimation.node.active = true;
        skipAnimation.playAnimation(colorstr, 1);
        skipAnimation.removeEventListener(dragonBones.EventObject.COMPLETE);
        skipAnimation.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            skipAnimation.node.active = false;
        }, skipAnimation.node);
    }

    PlayChangeRound(color: CardColor) {
        SoundManager.PlaySource("change")
        this.ChangeRound.node.active = true;
        let colorstr = '';
        switch (color) {
            case CardColor.red:
                colorstr = CardEffectManager.RED;
                break;
            case CardColor.yellow:
                colorstr = CardEffectManager.YELLOW;
                break;
            case CardColor.blue:
                colorstr = CardEffectManager.BLUE;
                break;
            case CardColor.green:
                colorstr = CardEffectManager.GREEN;
                break;
            default:
                break;
        }
        this.ChangeRound.playAnimation(colorstr, 1);
        this.ChangeRound.removeEventListener(dragonBones.EventObject.COMPLETE);
        this.ChangeRound.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.ChangeRound.node.active = false;
            console.log("active");

        }, this.ChangeRound);
    }
    OtherPlayAnimation(cardid: number, ChooseColor: CardColor = CardColor.black) {
        let typeid = cardid % 25;
        let type: CardType;
        let color: CardColor;
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
            type = CardType.changeColor;
            if (cardid <= 104) {
                // if (GameData.message.data.player_last_action == "play") {
                this.PlayChangeColorStart();
                // } else if (GameData.message.data.player_last_action == "choice_color") {
                //     if (ChooseColor == CardColor.black)
                //         ChooseColor = CardColor.red;
                //     this.PlayChangeColor(ChooseColor);
                // }

            } else if (cardid <= 108) {
                type = CardType.add4;
                // if (GameData.message.data.player_last_action == "play") {
                this.PlayAdd4();
                // } 
                // else if (GameData.message.data.player_last_action == "choice_color") {
                //     if (ChooseColor == CardColor.black)
                //         ChooseColor = CardColor.red;
                //     this.PlayChangeColor(ChooseColor);
                // }
            }
        } else {
            if (typeid == 0) {
                type = CardType.add2;
                this.PlayAdd2(color);
                this.createSpecialEffect();
            } else if (typeid == 1) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 10) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 19) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 21) {
                type = CardType.ban;
                this.PlayBan(color)
                this.createSpecialEffect();
            } else if (typeid <= 23) {
                type = CardType.changeRound;
                this.PlayChangeRound(color);
                this.createSpecialEffect();
            } else if (typeid <= 24) {
                // type = CardType.add2;
                this.PlayAdd2(color);
                this.createSpecialEffect();
            }
        }

    }
    PlayAnimation(cardid: number) {
        let typeid = cardid % 25;
        let type: CardType;
        let color: CardColor;
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
                this.PlayChangeColorStart();
            } else if (cardid <= 108) {
                type = CardType.add4;
                this.PlayAdd4();
            }
        } else {
            if (typeid == 0) {
                type = CardType.add2;
                this.PlayAdd2(color);
                this.createSpecialEffect();
            } else if (typeid == 1) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 10) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 19) {
                type = CardType.number;
                this.createOrdinaryEffect();
            } else if (typeid <= 21) {
                type = CardType.ban;
                this.PlayBan(color)
                this.createSpecialEffect();
            } else if (typeid <= 23) {
                type = CardType.changeRound;
                this.PlayChangeRound(color);
                this.createSpecialEffect();
            } else if (typeid <= 24) {
                // type = CardType.add2;
                this.PlayAdd2(color);
                this.createSpecialEffect();
            }
        }

    }
    createOrdinaryEffect() {
        let effect = cc.instantiate(this.effect_ordinary);
        this.effects.addChild(effect);
    }
    createSpecialEffect() {
        let effect = cc.instantiate(this.effect_special);
        this.effects.addChild(effect);
    }
    // testBtn() {
    //     this.PlayAdd4();
    // }
    // testBtn2() {
    //     let color = 'red';
    //     let index = Math.random();
    //     if (index < 0.25)
    //         color = CardEffectManager.RED;
    //     else if (index < 0.5)
    //         color = CardEffectManager.YELLOW;
    //     else if (index < 0.75)
    //         color = CardEffectManager.BLUE;
    //     else if (index < 1)
    //         color = CardEffectManager.GREEN;

    //     console.log(color);
    //     this.PlayAdd2(color);
    // }
}
