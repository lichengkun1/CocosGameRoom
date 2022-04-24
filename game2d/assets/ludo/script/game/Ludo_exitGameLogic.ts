
import { getUrlParameterValue } from "../../../Script/common/utils/util";
import MessageData from "../../../Script/CommonScripts/Utils/MessageData";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_exitGameLogic extends cc.Component {

    @property(cc.Label)
    contentLabel:cc.Label = null;

    @property(cc.Label)
    noLabel:cc.Label = null;

    @property(cc.Label)
    yesLabel:cc.Label = null;
    
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
        let lang = getUrlParameterValue('ui_lang');

        this.contentLabel.string = MessageData.lang.quit_ask_popup ? MessageData.lang.quit_ask_popup : MessageData.langEnglish.quit_ask_popup;
        this.yesLabel.string = MessageData.lang.yes ? MessageData.lang.yes : MessageData.langEnglish.yes;
        this.noLabel.string = MessageData.lang.no ? MessageData.lang.no : MessageData.langEnglish.no;
        
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
