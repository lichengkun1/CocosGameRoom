import MessageData from '../../../../Common/CommonScripts/Utils/MessageData';
import MessageManager from '../../../../Common/CommonScripts/Utils/MessageManager';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_popLayer extends cc.Component {

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.JsonAsset)
    langJson: cc.JsonAsset = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;
    
    private _layerType: string = null;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => { event.stopPropagation() }, this);
        if (this._layerType === 'nomic') {
            // let uiLang = MessageManager.getUrlParameterValue('ui_lang');
            // const langJson = this.langJson.json;
            // if(!langJson[uiLang]){
            //     uiLang = 'en';
            // }
            this.textLabel.string = MessageData.lang.seat_is_full ? MessageData.lang.seat_is_full : MessageData.langEnglish.seat_is_full;
            this.btnLabel.string = MessageData.lang.ok ? MessageData.lang.ok : MessageData.langEnglish.ok;
        }
    }
    
    //设置页面类型;
    setLayerType(type: string) {
        this._layerType = type;
    }

    close_callback() {
        this.node.destroy();
    }
}
