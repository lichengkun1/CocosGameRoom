import MessageData, { GameType } from "../../../Script/CommonScripts/Utils/MessageData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_ExitPopup extends cc.Component {

    private yesBtn: cc.Node
    private titleLabel: cc.Label
    // private noLabel: cc.Label
    private yesLabel: cc.Label

    
    lang = {
        en: "You have not made any action 3 times in a row,you hava been set to give up by the system.",
        ar: "لم تقم بأي إجراء 3 مرات متتالية ، لقد تم تعيينك للتخلي عن النظام.",
        hi: "आपने पंक्ति में 3 बार कोई कार्रवाई नहीं की है, आपको सिस्टम द्वारा छोड़ने के लिए सेट किया गया है।",
        te: "మీరు లాస్ట్ 3 రౌండ్స్ నుంచి ఎటువంటి స్పందన ఇవ్వని కారణముగా , మీరు ఓడినట్టు సిస్టం పరిగణిస్తుంది ",
        ta: "நீங்கள் தொடர்ச்சியாக 3 முறை எந்த நடவடிக்கையும் செய்யவில்லை, நீங்கள் கணினியால் கைவிடப்படுகிறீர்கள்.",
        id: "Anda belum melakukan tindakan apa pun 3 kali berturut-turut, Anda telah diatur untuk menyerah oleh sistem.",
    }
    lang2 = {
        en: "Network abnormality!",
        ar: "Network abnormality!",
        hi: "Network abnormality!",
        te: "Network abnormality!",
        ta: "Network abnormality!",
        id: "Network abnormality!",
    }
    onLoad() {
        this.yesBtn = this.node.getChildByName("yesBtn")
        this.titleLabel = this.node.getChildByName("titleLabel").getComponent(cc.Label);
        this.yesLabel = this.node.getChildByName("yesLabel").getComponent(cc.Label);

        this.titleLabel.string = MessageData.lang.give_up_tip ? MessageData.lang.give_up_tip : MessageData.langEnglish.give_up_tip;
        
    }

    show(isgameOver: boolean = true) {
        this.node.active = true;
        if (isgameOver) {
            this.titleLabel.string = MessageData.lang.give_up_tip ? MessageData.lang.give_up_tip : MessageData.langEnglish.give_up_tip;
        } else {
            this.titleLabel.string = MessageData.lang.network_abnormality ? MessageData.lang.network_abnormality : MessageData.langEnglish.network_abnormality;
        }
        if (MessageData.gameType == GameType.single) {
            this.yesLabel.string = MessageData.lang.play_again ? MessageData.lang.play_again : MessageData.langEnglish.play_again;
            this.yesBtn.off(cc.Node.EventType.TOUCH_END);
            this.yesBtn.on(cc.Node.EventType.TOUCH_END, () => {
                this.node.active = false;
                cc.director.loadScene("MatchScene");
            });
        } else {
            this.yesLabel.string = MessageData.lang.ok ? MessageData.lang.ok : MessageData.langEnglish.ok;
            this.yesBtn.off(cc.Node.EventType.TOUCH_END);
            this.yesBtn.on(cc.Node.EventType.TOUCH_END, () => {
                this.node.active = false;
            });
        }

    }
    close() {
        this.node.active = false;
    }
}
