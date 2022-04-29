import { getUrlParameterValue } from "../../../Script/common/utils/util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    textlabel: cc.Label = null;

    @property(cc.Label)
    confirmlabel: cc.Label = null;


    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => { event.stopPropagation() }, this);
        let uiLang = getUrlParameterValue('ui_lang');

        const langJson = {
            en: "The seats are full and you cannot join the game. Please communicate with the owner.",
            ar: "لقد امتلئت المقاعد لذلك لايمكنك المشاركة في اللعبة ،يرجي التواصل مع المالك",
            hi: "सीटें भरी हुई हैं और आप गेम में शामिल नहीं हो सकते। कृपया मालिक से संपर्क करें।",
            te: "సీట్లు పూర్తి అయినవి మీరు గేమ్ లో  చేరడానికి వీలులేదు .దయచేసి యజమాని తో మాట్లాడండి.",
            ta: "இருக்கைகள் நிரம்பியுள்ளன, நீங்கள் விளையாட்டில் சேர முடியாது. உரிமையாளருடன் தொடர்பு கொள்ளவும்.",
            id: "Kursi-kursinya penuh dan Anda tidak dapat bergabung dalam permainan. Silakan berkomunikasi dengan pemiliknya.",
        }

        const okJson = {
            en: "OK",
            ar: "حسنا",
            hi: "ठीक है",
            te: "సరే",
            ta: "சரி",
            id: "OK",
        }
        if(!langJson[uiLang]){
            uiLang = 'en';
        }
        this.textlabel.string = langJson[uiLang];
        this.confirmlabel.string = okJson[uiLang];
    }

    close_callback() {
        this.node.destroy();
    }

    // update (dt) {}
}
