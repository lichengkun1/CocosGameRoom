import { LanguageManager } from "../../Common/Language/LanguageManager";
import { Popup } from "../../Common/Popup/Popup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RulePopup extends Popup {

    isLevel2Popup = false;

    private content: cc.Node = null;

    private How: cc.RichText = null;
    private Card: cc.RichText = null;
    private Number: cc.RichText = null;
    private Add2: cc.RichText = null;
    private Add4: cc.RichText = null;


    private RuleTitle: cc.RichText = null;
    private Rule_add2: cc.RichText = null;
    private Rule_reverse: cc.RichText = null;
    private Rule_skip: cc.RichText = null;
    private Rule_add4: cc.RichText = null;
    private Rule_add2_explain: cc.RichText = null;
    private Rule_reverse_explain: cc.RichText = null;
    private Rule_skip_explain: cc.RichText = null;
    private Rule_add4_explain: cc.RichText = null;



    private Over: cc.Label = null;
    private The: cc.Label = null;
    private Time: cc.Label = null;
    private Players: cc.Label = null;
    private Top2: cc.Label = null;


    Init() {
        console.log('init');
        this.InitNode();
    }
    InitNode() {
        this.content = this.node.getChildByName("ScrollView").getChildByName("view").getChildByName("content");
        this.How = this.content.getChildByName("How").getComponent(cc.RichText);
        this.Card = this.content.getChildByName("Card").getComponent(cc.RichText);
        this.Number = this.content.getChildByName("Number").getComponent(cc.RichText);
        this.Add2 = this.content.getChildByName("Add2").getComponent(cc.RichText);
        this.Add4 = this.content.getChildByName("Add4").getComponent(cc.RichText);



        this.RuleTitle = this.content.getChildByName("RuleTitle").getComponent(cc.RichText);
        this.Rule_add2 = this.content.getChildByName("Rule_add2").getComponent(cc.RichText);
        this.Rule_reverse = this.content.getChildByName("Rule_reverse").getComponent(cc.RichText);
        this.Rule_skip = this.content.getChildByName("Rule_skip").getComponent(cc.RichText);
        this.Rule_add4 = this.content.getChildByName("Rule_add4").getComponent(cc.RichText);

        this.Rule_add2_explain = this.content.getChildByName("Rule_add2_explain").getComponent(cc.RichText);
        this.Rule_reverse_explain = this.content.getChildByName("Rule_reverse_explain").getComponent(cc.RichText);
        this.Rule_skip_explain = this.content.getChildByName("Rule_skip_explain").getComponent(cc.RichText);
        this.Rule_add4_explain = this.content.getChildByName("Rule_add4_explain").getComponent(cc.RichText);

        this.Over = this.content.getChildByName("Over").getComponent(cc.Label);
        this.The = this.content.getChildByName("The").getComponent(cc.Label);
        this.Time = this.content.getChildByName("Time").getComponent(cc.Label);
        this.Players = this.content.getChildByName("Players").getComponent(cc.Label);
        this.Top2 = this.content.getChildByName("Top2").getComponent(cc.Label);


        let lang = LanguageManager.GetType();
        let enJson = LanguageManager.enLangJson;

        this.How.string = lang.rule_how;
        this.Card.string = lang.rule_card;
        if (LanguageManager.lang == 'ar') {
            this.Number.string = "<color=#96FF6D>" + lang.rule_number_eg + "</color>" + lang.rule_number;
            this.Add2.string = "<color=#96FF6D>" + lang.rule_add2_eg + "</color>" + lang.rule_add2;
            this.Add4.string = "<color=#96FF6D>" + lang.rule_add4_eg  + "</color>" + lang.rule_add4;
        }
        else {
            this.Number.string = lang.rule_number ? lang.rule_number : enJson.rule_number + "<color=#96FF6D>" + lang.rule_number_eg ? lang.rule_number_eg : enJson.rule_number_eg + "</color>";
            this.Add2.string = lang.rule_add2 ? lang.rule_add2 : enJson.rule_add2 + "<color=#96FF6D>" + lang.rule_add2_eg ? lang.rule_add2_eg : enJson.rule_add2_eg + "</color>";
            this.Add4.string = lang.rule_add4 ? lang.rule_add4 : enJson.rule_add4 + "<color=#96FF6D>" + lang.rule_add4_eg ? lang.rule_add4_eg : enJson.rule_add4_eg + "</color>";
        }


        this.RuleTitle.string = lang.rule_title ? lang.rule_title : enJson.rule_title;
        this.Rule_add2.string = lang.rule_add2 ? lang.rule_add2 : enJson.rule_add2;
        this.Rule_reverse.string = lang.rule_reverse ? lang.rule_reverse : enJson.rule_reverse;
        this.Rule_skip.string = lang.rule_skip ? lang.rule_skip : enJson.rule_skip;
        this.Rule_add4.string = lang.rule_add4 ? lang.rule_add4 : enJson.rule_add4;

        this.Rule_add2_explain.string = lang.rule_add2_explain ? lang.rule_add2_explain : enJson.rule_add2_explain;
        this.Rule_reverse_explain.string = lang.rule_reverse_explain ? lang.rule_reverse_explain : enJson.rule_reverse_explain;
        this.Rule_skip_explain.string = lang.rule_skip_explain ? lang.rule_skip_explain : enJson.rule_skip_explain;
        this.Rule_add4_explain.string = lang.rule_add4_explain ? lang.rule_add4_explain : enJson.rule_add4_explain;


        this.Over.string = lang.rule_over ? lang.rule_over : enJson.rule_over;
        this.The.string = lang.rule_the ? lang.rule_the : enJson.rule_the;
        this.Time.string = lang.rule_time ? lang.rule_time : enJson.rule_time;
        this.Players.string = lang.rule_players ? lang.rule_players : enJson.rule_players;
        this.Top2.string = lang.rule_top2 ? lang.rule_top2 : enJson.rule_top2;
    }
    SetString() {
        // this.How=
        // this.Card=
        // this.Number=
        // this.Number_eg=
        // this.Add2=
        // this.Add2_eg=
        // this.Add4=
        // this.Add4_eg=
        // this.Over=
        // this.The=
        // this.Time=
        // this.Players=
        // this.Top2=
    }

}
