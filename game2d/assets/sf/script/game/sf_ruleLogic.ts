import { getUrlParameterValue } from "../../../Script/common/utils/util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SFRuleLogic extends cc.Component {

    @property(cc.Node)
    scollviewNode:cc.Node = null;

    @property(cc.JsonAsset)
    langJson:cc.JsonAsset = null;

    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.Label)
    rule1Label:cc.Label = null;

    @property(cc.Label)
    rule2Label:cc.Label = null;

    @property(cc.Label)
    rule3Label:cc.Label = null;
    
    @property(cc.Label)
    animalsLabel:cc.Label = null;

    @property(cc.Label)
    attack1Label:cc.Label = null;

    @property(cc.Label)
    attack2Label:cc.Label = null;

    @property(cc.Label)
    attack3Label:cc.Label = null;

    @property(cc.Label)
    attack4Label:cc.Label = null;

    private isLocalStorageShow:boolean = false;


    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{event.stopPropagation()},this);
        if(this.isLocalStorageShow){
            setTimeout(() => {
                if(this.node && this.node.active) {
                    this.hideScollviewNode();
                }
            },10000);
        }
        this.showScollviewNode();

        let lang = getUrlParameterValue('ui_lang');
        let labelJson = this.langJson.json.en;
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
        this.setLableShow(labelJson);
    }

    setLableShow(labelJson){
        console.log(labelJson);
        this.titleLabel.string = labelJson.title;
        this.rule1Label.string = labelJson.rule1;
        this.rule2Label.string = labelJson.rule2;
        this.rule3Label.string = labelJson.rule3;
        this.animalsLabel.string = labelJson.animals;
        this.attack1Label.string = '10KG, ' + labelJson.attack1;
        this.attack2Label.string = '30KG, ' + labelJson.attack2;
        this.attack3Label.string = '60KG, ' + labelJson.attack3;
        this.attack4Label.string = '80KG, ' + labelJson.attack4;
    }

    //显示view;
    showScollviewNode(){
        this.scollviewNode.active = true;
        this.scollviewNode.opacity = 0;
        let fin = cc.fadeTo(0.3, 255);
        this.scollviewNode.runAction(fin);

        this.scollviewNode.scale = 0;
        let s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
        this.scollviewNode.runAction(s);
    }

    //隐藏view；
    hideScollviewNode(){
        let fout = cc.fadeOut(0.3);
        this.scollviewNode.runAction(fout);
        let s = cc.scaleTo(0.3, 0).easing(cc.easeBackIn());
        let end_func = cc.callFunc(function() {
            this.node.destroy();
        }.bind(this));

        let seq = cc.sequence([s, end_func]);
        this.scollviewNode.runAction(seq);
    }

    //是否是缓存显示;
    setShowType(flag:boolean){
        this.isLocalStorageShow = true;
    }

    closeLayer(){
        this.hideScollviewNode();
    }
}
