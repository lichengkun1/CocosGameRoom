
import { GetServerData } from "../../Common/Server/GetServerData";
import CardEffectManager from "./CardEffectManager";
import { CardColor } from "./CardManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChooseColor extends cc.Component {

    ChooseRed() {
        GetServerData.PlayColor(CardColor.red, () => {
            // if (CardEffectManager.I.isCanChoose && GameData.message.data.player_now == PlayerManager.thisPlayer_user_id)
            CardEffectManager.I.PlayChangeColor(CardColor.red);
            // CardEffectManager.I.isCanChoose = false;
        }, () => {

        })
        // let cardNode = GameSceneUIManager.I.faceCardParent.children[GameSceneUIManager.I.faceCardParent.childrenCount - 1];
        // cardNode.getComponent(Card).changeColor(CardColor.red)
    }
    ChooseYellow() {
        GetServerData.PlayColor(CardColor.yellow, () => {
            // if (CardEffectManager.I.isCanChoose)
            CardEffectManager.I.PlayChangeColor(CardColor.yellow);
            // CardEffectManager.I.isCanChoose = false;
        }, () => {

        })
        // let cardNode = GameSceneUIManager.I.faceCardParent.children[GameSceneUIManager.I.faceCardParent.childrenCount - 1];
        // cardNode.getComponent(Card).changeColor(CardColor.yellow)
    }
    ChooseBlue() {
        GetServerData.PlayColor(CardColor.blue, () => {
            // if (CardEffectManager.I.isCanChoose)
            CardEffectManager.I.PlayChangeColor(CardColor.blue);
            // CardEffectManager.I.isCanChoose = false;
        }, () => {

        })
        // let cardNode = GameSceneUIManager.I.faceCardParent.children[GameSceneUIManager.I.faceCardParent.childrenCount - 1];
        // cardNode.getComponent(Card).changeColor(CardColor.blue)
    }
    ChooseGreen() {
        GetServerData.PlayColor(CardColor.green, () => {
            // if (CardEffectManager.I.isCanChoose)
            CardEffectManager.I.PlayChangeColor(CardColor.green);
            // CardEffectManager.I.isCanChoose = false;
        }, () => {

        })
        // let cardNode = GameSceneUIManager.I.faceCardParent.children[GameSceneUIManager.I.faceCardParent.childrenCount - 1];
        // cardNode.getComponent(Card).changeColor(CardColor.green)
    }
}
