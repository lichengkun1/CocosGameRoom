import MessageData, { LudoLangType } from "../../../Script/CommonScripts/Utils/MessageData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_ruleLogic extends cc.Component {

    @property(cc.Node)
    scollviewNode: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Label)
    win2Label: cc.Label = null;

    @property(cc.Label)
    itemsLabel: cc.Label = null;

    @property(cc.Label)
    ufoTitleLabel: cc.Label = null;

    @property(cc.Label)
    ufoLabel: cc.Label = null;

    @property(cc.Label)
    diceTileLabel: cc.Label = null;

    @property(cc.Label)
    diceLabel: cc.Label = null;

    @property(cc.Label)
    invisiTitleLabel: cc.Label = null;

    @property(cc.Label)
    invisiLabel: cc.Label = null;

    @property(cc.Label)
    missTitleLabel: cc.Label = null;

    @property(cc.Label)
    missLabel: cc.Label = null;

    @property(cc.Label)
    regretLabel: cc.Label = null;

    @property(cc.Label)
    regretTitle: cc.Label = null;

    @property(cc.JsonAsset)
    langJson: cc.JsonAsset = null;

    @property(cc.Node)
    contenNode: cc.Node = null;

    @property(cc.Node)
    ruleAR: cc.Node = null;

    //是否是第一个打开;
    private isLocalStorageShow: boolean = false;


    onEnable() {
        if (this.isLocalStorageShow) {
            setTimeout(() => {
                if (this.node && this.node.active) {
                    this.hideScollviewNode();
                }
            }, 10000);
        }
        this.showScollviewNode();

        const labelJson: Partial<LudoLangType> = MessageData.lang ? MessageData.lang : MessageData.langEnglish;

        this.setLableShow(labelJson);

    }


    //显示view;
    showScollviewNode() {
        this.scollviewNode.active = true;
        this.scollviewNode.opacity = 0;
        let fin = cc.fadeTo(0.3, 255);
        this.scollviewNode.runAction(fin);

        this.scollviewNode.scale = 0;
        let s = cc.scaleTo(0.3, 1).easing(cc.easeBackInOut());
        this.scollviewNode.runAction(s);
    }

    //隐藏view；
    hideScollviewNode() {
        let fout = cc.fadeOut(0.3);
        this.scollviewNode.runAction(fout);
        let s = cc.scaleTo(0.3, 0).easing(cc.easeBackIn());
        let end_func = cc.callFunc(function () {
            this.node.active = false;
        }.bind(this));
        let seq = cc.sequence([s, end_func]);
        this.scollviewNode.runAction(seq);
    }

    //是否是缓存显示;
    setShowType(flag: boolean) {
        this.isLocalStorageShow = true;
    }

    setLableShow(labelJson: Partial<LudoLangType>) {
        this.titleLabel.string = labelJson.rules ? labelJson.rules : MessageData.langEnglish.rules;
        this.winLabel.string = labelJson.win_label ? labelJson.win_label : MessageData.langEnglish.win_label;
        this.win2Label.string = labelJson.win2_label ? labelJson.win2_label : MessageData.langEnglish.win2_label;
        this.itemsLabel.string = labelJson.items_label ? labelJson.items_label : MessageData.langEnglish.items_label;
        this.ufoTitleLabel.string = '1.' + (labelJson.ufo_title_label ? labelJson.ufo_title_label : MessageData.langEnglish.ufo_title_label);
        this.ufoLabel.string = labelJson.ufo_label ? labelJson.ufo_label : MessageData.langEnglish.ufo_label;
        this.diceTileLabel.string = '2.' + (labelJson.dice_title_label ? labelJson.dice_title_label : MessageData.langEnglish.dice_title_label);
        this.diceLabel.string = labelJson.dice_label ? labelJson.dice_label : MessageData.langEnglish.dice_label;
        this.invisiTitleLabel.string = '3.' + (labelJson.invisi_title_label ? labelJson.invisi_title_label : MessageData.langEnglish.invisi_title_label);
        this.invisiLabel.string = labelJson.invisi_label ? labelJson.invisi_label : MessageData.langEnglish.invisi_label;
        this.missTitleLabel.string = '4.' + (labelJson.miss_title_label ? labelJson.miss_title_label : MessageData.langEnglish.miss_title_label);
        this.missLabel.string = labelJson.miss_label ? labelJson.miss_label : MessageData.langEnglish.miss_label;
        // this.regretTitle.string = labelJson.regretTitle;
        // this.regretLabel.string = labelJson.regretLabel;
    }

    closeLayer() {
        this.hideScollviewNode();
    }
}
