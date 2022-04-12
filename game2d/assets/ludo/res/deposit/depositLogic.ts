
import MKMessageManager from'../../../../Common/CommonScripts/Utils/MessageManager';
import Ludo_GlobalGameData from '../../script/Global/Ludo_GlobalGameData';


const {ccclass, property} = cc._decorator;

@ccclass
export default class depositLogic extends cc.Component {

    @property(cc.JsonAsset)
    langJson:cc.JsonAsset = null;

    @property(cc.Label)
    showLabel:cc.Label = null;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
        let lang = MKMessageManager.getUrlParameterValue('ui_lang');
        let labelJson = 'Insufficient Game Coins,please recharge';
        const langJson = this.langJson.json;
        if(!langJson[lang]){
            lang = 'en'; 
        }
        if(Ludo_GlobalGameData.roomBetsType === 'coin'){
            labelJson = langJson[lang].yoyoCoin;
        }else{
            labelJson = langJson[lang].gameCoin;
        }
        this.showLabel.string = labelJson;
    }

    cancel_callback(){
        this.node.destroy();
    }

    deposit_callback(){
        MKMessageManager.buyGameCion();
        this.node.destroy();
    }
}
