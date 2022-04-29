import { getUrlParameterValue } from "../../../Script/common/utils/util";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class updateLogic extends cc.Component {

    @property(cc.JsonAsset)
    langJson:cc.JsonAsset = null;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
        let updateBtn = this.node.getChildByName('updateBtn');
        updateBtn.on(cc.Node.EventType.TOUCH_START,()=>{
            MessageManager.updateGame();
        },this);


        let versionLabel = this.node.getChildByName('versionLabel').getComponent(cc.Label);
        let contentLabel = this.node.getChildByName('contentLabel').getComponent(cc.Label);

        let lang = getUrlParameterValue('ui_lang');
        let versionStr = 'New Version is Released!';
        let contentStr = 'Upgrade to the latest version and experience more new games!';
        switch(lang){
            case 'en':
                versionStr = this.langJson.json.verSion.en;
                contentStr = this.langJson.json.content.en;
                break;
            case 'ar':
                versionStr = this.langJson.json.verSion.ar;
                contentStr = this.langJson.json.content.ar;
                break;
            case 'hi':
                versionStr = this.langJson.json.verSion.hi;
                contentStr = this.langJson.json.content.hi;
                break;
            case 'te':
                versionStr = this.langJson.json.verSion.te;
                contentStr = this.langJson.json.content.te;
                break;
            case 'ta':
                versionStr = this.langJson.json.verSion.ta;
                contentStr = this.langJson.json.content.ta;
                break;
            case 'id':
                versionStr = this.langJson.json.verSion.id;
                contentStr = this.langJson.json.content.id;
                break;
        }
        versionLabel.string = versionStr;
        contentLabel.string = contentStr;
    }
}
