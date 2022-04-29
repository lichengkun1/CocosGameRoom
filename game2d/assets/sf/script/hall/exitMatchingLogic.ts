import { getUrlParameterValue } from "../../../Script/common/utils/util";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class exitMatchingLogic extends cc.Component {

    @property(cc.Label)
    contentLabel:cc.Label = null;

    @property(cc.Label)
    noLabel:cc.Label = null;

    @property(cc.Label)
    yesLabel:cc.Label = null;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
        let lang = getUrlParameterValue('ui_lang');
        switch(lang){
            case 'ar':
                this.contentLabel.string = 'هل أنت متأكد من غلق اللعبة؟';
                this.yesLabel.string = 'نعم';
                this.noLabel.string = 'لا';
                break;
            case 'hi':
                this.contentLabel.string = 'क्या आप गेम छोड़ना सुनिश्चित करते हैं?';
                this.yesLabel.string = 'हाँ';
                this.noLabel.string = 'नहीं';
                break;
            case 'te':
                this.contentLabel.string = 'మీరు కచ్చితంగా గేమ్ ఆపాలి అనుకుంటున్నారా?';
                this.yesLabel.string = 'అవును';
                this.noLabel.string = 'కాదు';
                break;
            case 'ta':
                this.contentLabel.string = 'நீங்கள் விளையாட்டை விட்டு வெளியேறுவது உறுதியா?';
                this.yesLabel.string = 'ஆம்';
                this.noLabel.string = 'இல்லை';
                break;
            case 'id':
                this.contentLabel.string = 'Apakah Anda yakin keluar dari game?';
                this.yesLabel.string = 'Ya';
                this.noLabel.string = 'Bukan';
                break;
        }
    }

    yes_callback(){
        MyEvent.I.emit('exitMatching');
        this.close_layer();
    }

    no_callback(){
        this.close_layer();
    }

    close_layer(){
        this.node.destroy();
    }

}
