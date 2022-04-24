import { LanguageManager } from "../../Common/Language/LanguageManager";
import { PopupManager } from "../../Common/Popup/PopupManager";
import UNOMatching from "../../Match/uno_Matching";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CloseBtn extends cc.Component {
    ButtonClick() {
        let arg =
        {
            tipLabel: LanguageManager.GetType().exit_lang ? LanguageManager.GetType().exit_lang : LanguageManager.enLangJson.exit_lang,
            yesLabel: LanguageManager.GetType().yes_lang ? LanguageManager.GetType().yes_lang : LanguageManager.enLangJson.yes_lang,
            noLabel: LanguageManager.GetType().no_lang ? LanguageManager.GetType().no_lang : LanguageManager.enLangJson.no_lang,
            yesBtn: () => {
                // UNOMatching.ExitGame();
            },
            noBtn: () => {
                PopupManager.ClosePopup(true);
            },
        }
        PopupManager.ShowPopup('TipPopup', arg);
    }
}