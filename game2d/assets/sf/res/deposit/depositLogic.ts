import { getUrlParameterValue } from "../../../Script/common/utils/util";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class depositLogic extends cc.Component {

    @property(cc.JsonAsset)
    langJson:cc.JsonAsset = null;

    @property(cc.Label)
    showLabel:cc.Label = null;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);

        let lang = getUrlParameterValue('ui_lang');
        let labelJson = '100 game coins required';
        switch(lang){
            case 'ar':
                labelJson = this.langJson.json.ar;
                break;
            case 'hi':
                labelJson = this.langJson.json.hi;
                break;
            case 'te':
                labelJson = this.langJson.json.te;
                break;
            case 'ta':
                labelJson = this.langJson.json.ta;
                break;
            case 'id':
                labelJson = this.langJson.json.id;
                break;
        }
        this.showLabel.string = labelJson;
    }

    cancel_callback(){
        this.node.destroy();
    }

    deposit_callback(){
        MessageManager.buyGameCion();
        this.node.destroy();
    }
}
