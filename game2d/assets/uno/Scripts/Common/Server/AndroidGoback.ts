
import MyEvent from "../../../../Script/CommonScripts/Utils/MyEvent";
import GameSceneManager from "../../Game/GameScene/GameSceneManager";
import { GameData } from "../Game/GameData";
import { LanguageManager } from "../Language/LanguageManager";
import { PopupManager } from "../Popup/PopupManager";
import { GetServerData } from "./GetServerData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AndroidGoback extends cc.Component {
    onEnable() {
        MyEvent.I.on("androidGoback", this.androidGoback.bind(this), this.node);
        MyEvent.I.on("onAndroidResume", this.onAndroidResume.bind(this), this.node);
        MyEvent.I.on("onAndroidStop", this.onAndroidStop.bind(this), this.node);
    }

    //返回键
    androidGoback() {
        let arg =
        {
            tipLabel: LanguageManager.GetType().exit_lang ? LanguageManager.GetType().exit_lang : LanguageManager.enLangJson.exit_lang,
            yesLabel: LanguageManager.GetType().yes_lang ? LanguageManager.GetType().yes_lang : LanguageManager.enLangJson.yes_lang,
            noLabel: LanguageManager.GetType().no_lang ? LanguageManager.GetType().no_lang : LanguageManager.enLangJson.no_lang,
            yesBtn: () => {
                // Matching.ExitGame();
            },
            noBtn: () => {
                PopupManager.ClosePopup(true);
            },
        }
        PopupManager.ShowPopup('TipPopup', arg);
    }
    static IsOut = false;
    static IsOut2 = false;
    //切出去
    onAndroidStop() {
        AndroidGoback.IsOut = true;
    }

    //切回来
    onAndroidResume() {
        AndroidGoback.IsOut = false;
        AndroidGoback.IsOut2 = true;
        if (GameData.gameid) {
            GetServerData.SendMessage(GameData.gameid, (res) => {
                console.log("_++++++++", res);

                GameData.gameInfo = res;
                
                GameSceneManager.I.UpDateGameData();
            });
        }
    }
}