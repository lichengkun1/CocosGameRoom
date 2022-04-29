import { getUrlParameterValue } from "../../../Script/common/utils/util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class storePopLogic extends cc.Component {


    private storePop: cc.Node = null;
    private showLabel: cc.Label = null
    private titleLabel: cc.Label = null

    start() {
        this.init();
    }

    init() {
        this.storePop = this.node.getChildByName('storePop');
        this.showLabel = this.node.getChildByName('showLabel').getComponent(cc.Label);
        this.titleLabel = this.node.getChildByName('titleLabel').getComponent(cc.Label);


        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            event.stopPropagation();
            this.close_callback();
        }, this);

        this.storePop.on(cc.Node.EventType.TOUCH_START, (event) => {
            event.stopPropagation();
        }, this.node);

        let lang = getUrlParameterValue('ui_lang');
        let langJson = {
            title: {
                "en": "Game Mall",
                "ar": "متجر الالعاب",
                "hi": "गेम मॉल",
                "te": "கேம் மால்",
                "ta": "గేమ్ మాల్",
                "id": "Game Mall"
            },
            content: {
                "en": "Coming Soon",
                "ar": "قريبا",
                "hi": "जल्द आ रहा है",
                "te": "விரைவில் வரும்",
                "ta": "త్వరలో వస్తుంది",
                "id": "Segera Akan Datang"
            }
        }

        let titleStr = 'Game Mall';
        let contentStr = 'Coming Soon';
        switch (lang) {
            case "en":
                titleStr = langJson.title.en;
                contentStr = langJson.content.en;
                break;
            case "ar":
                titleStr = langJson.title.ar;
                contentStr = langJson.content.ar;
                break;
            case "hi":
                titleStr = langJson.title.hi;
                contentStr = langJson.content.hi;
                break;
            case "te":
                titleStr = langJson.title.te;
                contentStr = langJson.content.te;
                break;
            case "ta":
                titleStr = langJson.title.ta;
                contentStr = langJson.content.ta;
                break;
            case "id":
                titleStr = langJson.title.id;
                contentStr = langJson.content.id;
                break;
        }



        this.showLabel.string = contentStr;
        this.titleLabel.string = titleStr;
    }

    close_callback() {
        this.node.destroy();
    }
}
